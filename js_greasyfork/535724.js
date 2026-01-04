// ==UserScript==
// @name         Neopets Item Price Tooltip (ItemDB + Jellyneo Link)
// @namespace    https://itemdb.com.br
// @version      1.4.2
// @description  Shows the market price for items on the Inventory, Quick Stock, and your Shop pages using ItemDB, with a Jellyneo link and price warning indicator.
// @author       FatalFlaw
// @match        *://www.neopets.com/quickstock.phtml*
// @match        *://www.neopets.com/inventory.phtml*
// @match        *://www.neopets.com/market.phtml*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      itemdb.com.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/535724/Neopets%20Item%20Price%20Tooltip%20%28ItemDB%20%2B%20Jellyneo%20Link%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535724/Neopets%20Item%20Price%20Tooltip%20%28ItemDB%20%2B%20Jellyneo%20Link%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const intl = new Intl.NumberFormat();

    // Function to fetch item price and calculate median from last 20 prices
    function fetchItemPrice(itemName, callback) {
        const itemSlug = itemName.toLowerCase().replace(/\s+/g, '-');
        const itemPageUrl = `https://itemdb.com.br/item/${itemSlug}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: itemPageUrl,
            onload: function (res) {
                if (res.status !== 200) {
                    return callback('Error Fetching Price');
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(res.responseText, 'text/html');

                const rows = Array.from(doc.querySelectorAll('table tbody tr'));

                const priceCells = [];
                let hasWarning = false;

                for (const row of rows) {
                    const firstTd = row.querySelector('td:first-child');
                    if (!firstTd || !firstTd.textContent) continue;

                    const text = firstTd.textContent.trim().replace(/,/g, '').replace(/[^\d]/g, '');
                    const price = parseInt(text, 10);
                    if (!isNaN(price)) {
                        priceCells.push(price);
                    }

                    const rowText = row.textContent.toLowerCase();
                    const containsKeyword = /(added|unavailable|quest|daily|pool)/.test(rowText);
                    const containsLink = row.querySelector('a') !== null;

                    if (containsKeyword || containsLink) {
                        hasWarning = true;
                    }

                    if (priceCells.length >= 20) break; // Only take the first 20 valid prices
                }

                if (priceCells.length === 0) {
                    return callback('No Price Data');
                }

                priceCells.sort((a, b) => a - b);
                const mid = Math.floor(priceCells.length / 2);
                const median = priceCells.length % 2 === 0
                    ? Math.round((priceCells[mid - 1] + priceCells[mid]) / 2)
                    : priceCells[mid];

                const warningMark = hasWarning ? '!' : '';
                const asteriskMark = priceCells.length < 20 ? '*' : '';
                const priceText = `${intl.format(median)} NP${asteriskMark}${warningMark}`;
                callback(priceText);
            },
            onerror: function () {
                callback('Error Fetching Price');
            }
        });
    }

    // Tooltip with Jellyneo link and red ! if suspicious
    function showTooltip(e, priceText, itemName) {
        const jellyNeoUrl = `https://items.jellyneo.net/search/?name=${encodeURIComponent(itemName)}`;
        const hasWarning = priceText.endsWith('!');
        const hasAsterisk = priceText.includes('*');

        let cleanText = priceText.replace('*', '').replace('!', '');
        let indicators = '';

        if (hasAsterisk) cleanText += '*';
        if (hasWarning) indicators += '<span style="color:red;">!</span>';

        const explanation = `
            <div style="color:gray; font-size:10px; margin-top:2px;">
                ${hasAsterisk ? '* Fewer than 20 prices<br>' : ''}
                ${hasWarning ? '<span style="color:red;">! Suspicious entry detected</span>' : ''}
            </div>
        `;

        const tooltip = $('<div class="price-tooltip"></div>')
            .html(`<a href="${jellyNeoUrl}" target="_blank" style="color:white; text-decoration:underline;">
                      ${cleanText} ${indicators} 🔍
                   </a>${explanation}`)
            .css({
                position: 'absolute',
                top: e.pageY + 10 + 'px',
                left: e.pageX + 10 + 'px',
                padding: '5px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 9999,
                cursor: 'pointer'
            });

        $('body').append(tooltip);

        $(document).one('click', function () {
            tooltip.remove();
        });
    }

    // Highlight text and trigger price fetch
    let timeout;
    $(document).on('mouseup', function (e) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fetchItemPrice(selectedText, function (priceText) {
                    showTooltip(e, priceText, selectedText);
                });
            }, 300); // Delay lookup by 300ms
        }
    });
})();
