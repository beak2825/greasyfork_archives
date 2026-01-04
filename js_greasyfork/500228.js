// ==UserScript==
// @name            SendCloudImprover
// @name:it         SendCloudImprover
// @description     iFrame customization products
// @description:it  iFrame customization products
// @match           https://app.sendcloud.com/v2/shipping/list/orders
// @match           https://app.sendcloud.com/v2/shipping/list/orders*
// @match           https://app.sendcloud.com/v2/shipping/list/labels
// @match           https://app.sendcloud.com/v2/shipping/list/labels*
// @match           https://app.sendcloud.com/v2/returns/list
// @match           https://app.sendcloud.com/v2/returns/list*
// @version         1.4.0
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @author          Riccardo Piras
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @connect         app.sendcloud.com
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @namespace https://greasyfork.org/users/1257674
// @downloadURL https://update.greasyfork.org/scripts/500228/SendCloudImprover.user.js
// @updateURL https://update.greasyfork.org/scripts/500228/SendCloudImprover.meta.js
// ==/UserScript==

GM_addStyle (`
    a.btn--injected {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 0;
        width: 120px;
        height: 25px;
        font-size: 14px;
    }
    #orders-queued-list {
       padding: 0px 10px;
       font-size: 16px;
    }
    #orders-queued-list b {
        line-height: 44px;
    }
    #orders-queued-list button {
       margin-left: 10px;
    }
    .-added {
    display: flex;
    flex-direction: column;
    }

    .ui-table__cell[aria-label='Prezzo indicativo'],
    .ui-table__cell[aria-label="Prezzo (stima)"],
    .ui-table__cell[aria-label="Data di consegna al corriere"],
    .ui-table__row-wrapper > .ui-table__cell:nth-child(8) {
        display: none !important;
    }
    [data-test="carrier-icon"] {
    height: auto !important;
    }
`);

function extractValues(obj) {
    let values = [];

    function recursiveExtract(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    values.push(key+": ");
                    recursiveExtract(obj[key]);
                } else {
                    values.push(obj[key]);
                }
            }
        }
    }

    recursiveExtract(obj);
    return values;
}

function checkErrors(response) {

    response = JSON.parse(response);
    $(".ui-table__cell[aria-label='Stato del negozio']").find(".ui-table__cell-title").text("Errori");
    for (let i=0;i<response.results.length;i++) {

        let single_order = response.results[i];
        let barcode = single_order.order_extra.barcode;
        if (single_order.errors != undefined) {

            let errors = extractValues(single_order.errors);

            $(`[data-barcode='${barcode}'] .ui-table__row-wrapper`).find(".ui-table__cell").eq(2).html(errors.join('<br />'));

        } else {
            $(`[data-barcode='${barcode}'] .ui-table__row-wrapper`).find(".ui-table__cell").eq(2).html("");
        }

    }

}

function setUrlOrder(order_number) {

    if (order_number.startsWith('WATA')) {
        order_number = order_number.replace('WATA','');
       return "https://admin-atalanta.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WBOL')) {
        order_number = order_number.replace('WBOL','');
       return "https://admin-bologna.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WFIG')) {
        order_number = order_number.replace('WFIG','');
       return "https://admin-figc.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WFIO')) {
        order_number = order_number.replace('WFIO','');
       return "https://admin-fiorentina.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WJUV')) {
        order_number = order_number.replace('WJUV','');
       return "https://admin-juventus.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WLAZ')) {
        order_number = order_number.replace('WLAZ','');
       return "https://admin-lazio.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WOLI')) {
        order_number = order_number.replace('WOLI','');
       return "https://admin-olimpia.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WVIR')) {
        order_number = order_number.replace('WVIR','');
       return "https://admin-virtus.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    return "";
}

(function() {
    'use strict';

    $(document).ready(function(){

        const open = window.XMLHttpRequest.prototype.open;
        const send = window.XMLHttpRequest.prototype.send;

        // Intercettiamo la chiamata open
        window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;  // Salviamo l'URL per l'uso successivo
            open.call(this, method, url, async, user, password);
        };

        // Intercettiamo il momento in cui la richiesta viene inviata
        window.XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('load', function() {
                if (this._url.startsWith("https://eu-central-1-0.app.sendcloud.com/orders/xhr/importer/all?")) {
                    setTimeout(function() {
                        checkErrors(this.responseText);
                    }.bind(this), 1500);
                }
            });

            this.addEventListener('error', function() {
                console.log('Errore durante la chiamata AJAX.');
            });

            send.call(this, body);
        };

        var intervalCheck = setInterval(function() {

            if ($(".shipping-action-bar").length > 0) {

                if ($(".created-labels__actions-left").length > 0) {

                    if ($("#orders-queued-list").length == 0) {
                        $(".shipping-action-bar").find(".created-labels__actions-left").append(`<small id="orders-queued-list"><b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda</small>`);
                    } else {
                        $("#orders-queued-list").html(`<b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda`);
                    }

                } else {

                    if ($("#orders-queued-list").length == 0) {

                        $(".shipping-action-bar").find(".action-bar__left").find(".action-buttons").append(`<small id="orders-queued-list"><b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda</small>`);

                    } else {

                        $("#orders-queued-list").html(`<b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda`);
                        $("#orders-queued-list").append(`<button class="ui-button ui-button--primary btn-export-orders">Estrai lista</button>`);
                    }

                }

            } else {

                if ($("#orders-queued-list").length == 0) {
                    $(".return-action-bar").find(".action-bar__left").find(".action-buttons").append(`<small id="orders-queued-list"><b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda</small>`);
                } else {
                    $("#orders-queued-list").html(`<b>${$(".ui-table__body .ui-table__row").length}</b> Ordini in coda`);
                }
            }

            for (let i=0;i<$(".order-column-title__order-number:not(.-added)").length;i++) {
                let order_number = $(".order-column-title__order-number:not(.-added)").eq(i).text();
                let url_order = setUrlOrder(order_number);
                $(".order-column-title__order-number:not(.-added)").eq(i).addClass('-added').html(`<a href="${url_order}" target="_blank" class="ui-button ui-button--small ui-button--primary btn--injected">${order_number}</a>`);
            }
            for (let i=0;i<$("[data-test='returns-table-order-number']:not(.-added)").length;i++) {
                let order_number = $("[data-test='returns-table-order-number']:not(.-added)").eq(i).find('.ui-table__cell-title').text();
                let url_order = setUrlOrder(order_number);
                $("[data-test='returns-table-order-number']:not(.-added)").eq(i).addClass('-added').find('.ui-table__cell-title').append(`<a href="${url_order}" target="_blank" class="ui-button ui-button--small ui-button--primary btn--injected">Vedi su admin</a>`);
            }
        }, 1000);

        $("body").on("click", ".btn-export-orders", function () {

            var orders = [[
                "Numero ordine",
                "Data ordine",
                "Destinatario",
                "Paese",
                "Corriere",
                "Numero pezzi",
                "Errori"
            ]];

            for (let i=0;i<$(".ui-table__body .ui-table__row").length;i++) {

                let country = $(".iov-table__col-customer").eq(i).find(".ui-table__cell-content").find("span").last().text().trim();
                country = country.slice(-2);

                let customer = $(".iov-table__col-customer").eq(i).find(".ui-table__cell-title");
                $(customer).find("span").remove();
                customer = $(customer).text();

                let items = $(".ui-table__body").find(".ui-table__row").eq(i).find(".ui-table__row-wrapper").find(".ui-table__cell").eq(5).find('.ui-table__cell-title').find("span").text().trim()
                items = items.replace('Items','');
                items = items.replace('Item','');

                orders.push([
                    $(".order-column-title__order-number").eq(i).text().trim(),
                    $(".ui-table__body").find(".ui-table__row").eq(i).find("[data-test='order-date']").text().trim(),
                    customer,
                    country,
                    $(".iov-table__col-shipping-method").eq(i).find(".ui-table__cell-title").text().trim(),
                    items,
                    $(".ui-table__body").find(".ui-table__row").eq(i).find(".ui-table__row-wrapper").find(".ui-table__cell").eq(2).text().trim()
                ]);

            }

            // Convertiamo i dati in formato CSV
            const csvContent = orders.map(row => row.join(",")).join("\n");

            // Creiamo un Blob con i dati CSV
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);

            // Creiamo un link per il download
            const a = document.createElement("a");
            a.href = url;
            a.download = "ordini.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Rilasciamo l'URL
            URL.revokeObjectURL(url);

        });

    });
})();