// ==UserScript==
// @name        BZUCO Order NFC
// @namespace   https://jiraskuvhronov.bzuco.cloud/
// @description Podpora exportu vstupenek na NFC čipy.
// @license     MIT; https://opensource.org/licenses/MIT
// @match       https://jiraskuvhronov.bzuco.cloud/admin/cs/orders/*
// @match       https://test-9.bzuco.cloud/admin/cs/orders/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/544262/BZUCO%20Order%20NFC.user.js
// @updateURL https://update.greasyfork.org/scripts/544262/BZUCO%20Order%20NFC.meta.js
// ==/UserScript==

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line

const DATA_URL = "https://cip.jiraskuvhronov.eu/v35/storeData.php";

const THIS_YEAR = new Date().getFullYear();

// ID akce s permanentkami diváckých řad A, B, C, D
const PERM_ABCD_EVENT_ID = window.location.host === 'test-9.bzuco.cloud'? -1: 187;

// ID akce s ubytováním
const UBYT_EVENT_ID = window.location.host === 'test-9.bzuco.cloud'? -1: 189;

let myIP = '90.181.35.133'; // TODO zatím natvrdo

class AjaxException extends Error {
    status;
    nestedErrors;

    constructor(message, status, nestedErrors = []) {
        super(message);

        this.status = status;
        this.nestedErrors = nestedErrors;
    }
}

class BzucoAjax {
    #timeout = 3000;

    #handleError(message, jqXHR) {
        let response;

        try {
            // odpovědí z Bzuco serveru je pole chybových hlášek
            response = JSON.parse(jqXHR.responseText);
        } catch (e) {
            response = jqXHR.responseText && jqXHR.responseText.length > 0? [jqXHR.responseText]: [];
        }

        if (jqXHR.status >= 299) {
            throw new AjaxException(message, jqXHR.status, response);
        }

        throw new AjaxException('Neočekávaná chyba při AJAX volání', jqXHR.status, response);
    }

    async get(url) {
        try {
            return await $.ajax({
                url: url,
                type: 'GET',
                timeout: this.#timeout,
                cache: false
            });
        } catch (jqXHR) {
            this.#handleError('Chyba při volání Bzuco API (GET)', jqXHR);
        }
    }
}

const ajax = new BzucoAjax();

function sendData(data) {
    data.ip = myIP;

    console.log('Odesílám NFC data: ' + JSON.stringify(data));

    GM.xmlHttpRequest({
        method: "POST",
        url: DATA_URL,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function (response) {
            if (!response || !response.responseText) {
                return alert('Chyba při načítání odpovědi');
            }

            let json = JSON.parse(response.responseText);

            if (!json || !json.result)
                return alert('Chybný JSON formát odpovědi');

            if (json.result !== true)
                return alert(json.result);

            alert('Data byla úspěšně odeslána.');
        }, onerror: function () {
            alert('Chyba při odesílání dat!')
        }
    });
}

function sendToChip() {
    const codes = $('#tickets').val().trim();

    console.log('codes', codes);

    const data = {
        mail: $('#mailNfc').val().trim(),
        barcodes: codes.split("\n")
    };

    console.log('Odesílám data:', data);

    sendData(data);
}

$(function() {
    const body = $('body');

    const mo = new MutationObserver(async () => {
        const td = body.find('td:contains("Číslo objednávky")').next();

        if (td.length === 0) return;

        const orderId = td.text();
        const modalBody = td.parents('.modal-body');
        const orderDetails = modalBody.find('#order-details')

        mo.disconnect();

        if (orderDetails.find('#tickets').length === 0) {
            orderDetails.append(
                '<p><input id="mailNfc" size="30" readonly></p>' +
                '<table><tr>' +
                '<td><textarea id="tickets" rows="10" cols="15"></textarea></td>' +
                '<td><textarea id="priceNames" rows="10" cols="55"></textarea></td>' +
                '</tr></table>' +
                '<p><button id="sendToChipBtn" class="btn btn-primary" style="background-color: dodgerblue">Odeslat na čip</button></p>'
            );

            $('#sendToChipBtn').on('click', sendToChip);
        }

        $('#mailNfc').val(modalBody.find('td:contains("Email")').next().text());

        const order = await ajax.get(`/api/1.0/orders/order/${orderId}?view=admin`);
        console.log(`Obj.č ${orderId}`, order);

        if (order && order.status === 'paid') {
            const codes = [];
            const tsNames = [];

            for (const ticket of order.tickets)
                for (const item of ticket.items) {
                    codes.push(item.code);
                    tsNames.push(ticket.ticketset_name);
                }

            $('#tickets').val(codes.join("\n"));
            $('#priceNames').val(tsNames.join("\n"));
        } else {
            $('#tickets').val('Nezaplaceno.');
            $('#priceNames').val('');
        }

        mo.observe(body[0], {childList: true, subtree: true});
    });

    mo.observe(body[0], {childList: true, subtree: true});
});