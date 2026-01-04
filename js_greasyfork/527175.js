// ==UserScript==
// @name         TipidPC User Items To Sortable Table
// @description  Transforms the User's Items for Sale list to sortable and searchable table
// @namespace    https://github.com/rainniel/tampermonkey-scripts
// @supportURL   https://github.com/rainniel/tampermonkey-scripts/issues
// @version      1.0
// @author       Rainniel
// @license      MIT
// @match        https://tipidpc.com/useritems.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tipidpc.com
// @require      https://unpkg.com/datatables.net@2.2.2/js/dataTables.min.js
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527175/TipidPC%20User%20Items%20To%20Sortable%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/527175/TipidPC%20User%20Items%20To%20Sortable%20Table.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .item-manager {
            display: none !important;
        }
    `);

    var $ = unsafeWindow.jQuery;

    $(document).ready(function () {
        var dataTablesCss = document.createElement('link');
        dataTablesCss.rel = 'stylesheet';
        dataTablesCss.href = 'https://cdn.datatables.net/2.2.2/css/dataTables.dataTables.min.css';
        document.head.appendChild(dataTablesCss);

        var pad10Div = $('.pad10');

        if (pad10Div.length > 0) {
            var window2div = pad10Div.find('.window').eq(1);
            var userIfs = window2div.find('#user-ifs');

            if (userIfs.length > 0) {
                var data = [];

                userIfs.find('li').each(function () {
                    var $li = $(this);
                    var nameLink = $li.find('h4 a');
                    var name = nameLink.text();
                    var nameUrl = nameLink.attr('href');
                    var priceText = $li.find('.meta strong').text();
                    var price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
                    var catalogLink = $li.find('.meta a');
                    var catalog = catalogLink.text();
                    var catalogUrl = catalogLink.attr('href');

                    data.push([
                        `<a href="${nameUrl}" target="_blank">${name}</a>`,
                        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price),
                        `<a href="${catalogUrl}" target="_blank">${catalog}</a>`
                    ]);
                });

                window2div.find('.winbody').prepend('<div style="padding: 0 12px;"><table id="userItems" class="display"></table></div>');

                $('#userItems').DataTable({
                    columns: [
                        { title: "Name" },
                        { title: "Price" },
                        { title: "Catalog" }
                    ],
                    data: data,
                    pageLength: 20,
                    lengthMenu: [10, 20, 30, 40, 50]
                });

                $('.dt-container').css('clear', 'none');
            }
        }
    });
})();