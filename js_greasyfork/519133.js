// ==UserScript==
// @name         Walmart Tracking Numbers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Show tracking numbers for all walmart orders on the page
// @author       Jackie099
// @match        https://www.walmart.com/orders
// @icon         https://www.google.com/s2/favicons?sz=64&domain=walmart.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519133/Walmart%20Tracking%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/519133/Walmart%20Tracking%20Numbers.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';
    table.style.border = '1px solid #ccc';

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Order ID</th>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Tracking Numbers</th>
    `;
    table.appendChild(headerRow);

    const processedOrderIds = new Set();

    const orderElements = document.querySelectorAll('div[data-testid^="orderGroup-"]');
    orderElements.forEach(orderElement => {
        const orderIdElement = orderElement.querySelector('span.w_TErl');
        const orderIdText = orderIdElement ? orderIdElement.textContent.split(' ')[1] : '';

        if (processedOrderIds.has(orderIdText)) {
            return;
        }

        processedOrderIds.add(orderIdText);

        const trackingNumbers = [];
        const scriptTags = document.querySelectorAll('script[type="application/json"]');
        scriptTags.forEach(scriptTag => {
            try {
                const jsonData = JSON.parse(scriptTag.textContent);
                if (jsonData && jsonData.props && jsonData.props.pageProps && jsonData.props.pageProps.phV2InitialData) {
                    const orderGroups = jsonData.props.pageProps.phV2InitialData.data.orderHistoryV2.orderGroups;
                    orderGroups.forEach(order => {
                        if (order.orderId === orderIdText) {
                            if (order.shipment && order.shipment.trackingNumber) {
                                trackingNumbers.push(order.shipment.trackingNumber);
                            }
                        }
                    });
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid #ccc; padding: 8px;">${orderIdText}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${trackingNumbers.join(', ') || 'N/A'}</td>
        `;
        table.appendChild(row);
    });

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(table, mainContent.firstChild);
    }
})();
