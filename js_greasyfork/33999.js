// ==UserScript==
// @name         Shopify Extension
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       Clancy
// @match        https://netpharmacy.myshopify.com/admin/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.10.1/sweetalert2.min.js
// @resource     sweetalert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.10.1/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33999/Shopify%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/33999/Shopify%20Extension.meta.js
// ==/UserScript==

/* global window, document, location, MutationObserver, $ */

const has = Object.hasOwnProperty;
const request = async (url = '', callback) => {
    if (url.length > 0) {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Basic ZGMyMGI2YjMyNmE0Y2FjNWNkMDhkM2FkNzE4ODQ2MDk6NTc4OTI2NTY5MTZlY2EwZDk2MDJiNTFhZDk5NDAzM2U=',
            }
        });
        const data = await res.json();

        if (res.ok) {
            if (typeof callback === 'function') callback(data);
            else swal('Error', 'Callback not found', 'error');
        } else {
            console.log(data);
            swal('Error', 'Server returned an error, check developer tool (F12) for details', 'error');
        }
    } else swal('ERROR', 'Empty url provided', 'error');
};
const handlers = {
    orders() {
        // insert payment method to order dashboard
        const orderHandler = () => {
            const orders = [];

            $('[href^="/admin/orders/"]').each((index, a) => {
                const orderID = parseInt(a.href.split('/').pop());

                if (orderID > 0) orders.push(orderID);
            });

            const orderURL = `/admin/orders.json?ids=${orders.join(',')}&limit=250`;

            request(orderURL, (data) => {
                // append payment method header
                $('#orders-results th:nth-child(4)').eq(0).after('<th><span>Payment Method</span></th>');
                $('#orders-results td:nth-child(4)').after('<td class="no-wrap"><span class="paymentMethod"></span></td>');

                data.orders.forEach((order) => {
                    $(`#order_ids_${order.id}`).closest('tr').find('.paymentMethod').text(order.gateway);
                });
            });
        };

        orderHandler();

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.tagName === 'BODY') orderHandler();
                });
            });
        }).observe($('html')[0], { childList: true });
    },
};
const init = () => {
    // inject css
    GM_addStyle(
        GM_getResourceText('sweetalert2CSS'),
    );

    const page = location.pathname.split('/').pop();
    if (has.call(handlers, page)) handlers[page]();
};

document.addEventListener('DOMContentLoaded', init);
