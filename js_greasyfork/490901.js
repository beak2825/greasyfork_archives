// ==UserScript==
// @name         AliExpress Parse Orders Information to CSV
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Parse AliExpress order page into a CSV file suitable for spreadsheet use.
// @author       Hegy
// @match        https://www.aliexpress.com/p/order/index.html*
// @icon         https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490901/AliExpress%20Parse%20Orders%20Information%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/490901/AliExpress%20Parse%20Orders%20Information%20to%20CSV.meta.js
// ==/UserScript==
// 2024-03-26

(function() {
    'use strict';

    // All previous functions remain the same until addOrderListText
    function convertToCSV(data) {
        const header = ['1','2','3','4','Date', 'Order ID', 'Image Formula', 'Name', 'SKU', 'Order URL', 'Product URL', 'Price', 'Quantity', 'Total Price'];
        const csv = [header.join('\t')];
        data.forEach(row => {
            csv.push(row.join('\t'));
        });
        return csv.join('\n');
    }

    function extractOrderData(orderItem) {
        const orderHeader = orderItem.querySelector('.order-item-header-right-info');
        const dateText = orderHeader.querySelector('div:first-child').innerText.trim();
        const date = dateText.replace('Order date: ', '');

        const orderIdText = orderHeader.querySelector('div:last-child').innerText.trim();
        const orderId = orderIdText.replace("Order ID: ", "'").replace('\nCopy', '');
        const orderUrl = 'https://www.aliexpress.com/p/order/detail.html?orderId=' + orderId.replace("'", "");
        const contentBody = orderItem.querySelector('.order-item-content-body');
        const url = contentBody.querySelector('a').getAttribute('href').replace('//', 'https://');
        const imageStyle = orderItem.querySelector('.order-item-content-img').getAttribute('style');
        const imageUrl = imageStyle.match(/url\("([^"]+)"/)[1];
        const imageUrlFormula = '=IMAGE("'+ imageUrl + '")';
        const name = orderItem.querySelector('.order-item-content-info-name span[title]') ? orderItem.querySelector('.order-item-content-info-name span[title]').getAttribute('title') : null;
        const sku = orderItem.querySelector('.order-item-content-info-sku') ? orderItem.querySelector('.order-item-content-info-sku').innerText.trim() : null;

        const numberParent = orderItem.querySelector('.order-item-content-info-number');
        const numberFull = numberParent ? numberParent.querySelector('div:first-child').innerText.trim() : null;
        const price = numberFull ? numberFull.replace('US $', '').replace('.', ',') : null;

        const quantityFull = orderItem.querySelector('.order-item-content-info-number-quantity') ? orderItem.querySelector('.order-item-content-info-number-quantity').innerText.trim() : null;
        const quantity = quantityFull ? quantityFull.replace('x', '') : null;

        const priceSpans = orderItem.querySelectorAll('.order-item-content-opt-price-total span');
        let totalPrice = '';
        priceSpans.forEach(span => {
            totalPrice += span.innerText.trim();
        });
        totalPrice = totalPrice.replace('US $', '').replace('.', ',');

        return [date, orderId, imageUrlFormula, name, sku, orderUrl, url, price, quantity, totalPrice];
    }

    function createTable(data) {
        let table = document.createElement('table');
        table.id = 'tableContent';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.style.tableLayout = 'fixed';

        data.forEach((rowData) => {
            let row = document.createElement('tr');

            rowData.forEach((cellData) => {
                let cell = document.createElement('td');
                Object.assign(cell.style, {
                    border: '1px solid #ddd',
                    padding: '8px',
                    maxWidth: '20px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.2em',
                    height: '1.2em',
                    fontSize: '14px'
                });

                cell.title = cellData;
                cell.textContent = cellData;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        return table;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
            () => {
                // Show success message
                const notification = document.createElement('div');
                notification.textContent = 'Content copied to clipboard!';
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.right = '20px';
                notification.style.padding = '10px';
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '9999';

                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 2000);
            },
            (err) => {
                console.error('Failed to copy text: ', err);
            }
        );
    }

    function addOrderListText(data) {
        const orderHeader = document.querySelector('.order-header');

        if (orderHeader) {
            const container = document.createElement('div');
            container.className = 'order-list-text';
            container.style.position = 'relative';

            const textField = document.createElement('div');
            textField.contentEditable = true;
            textField.style.width = '100%';
            textField.style.minHeight = '100px';
            textField.style.border = '1px solid #ccc';
            textField.style.padding = '10px';
            textField.style.marginTop = '10px';
            textField.style.marginBottom = '10px';

            const table = createTable(data);
            textField.appendChild(table);

            textField.addEventListener('input', () => {
                textField.dataset.currentContent = textField.innerText;
            });

            container.appendChild(textField);
            orderHeader.insertAdjacentElement('afterend', container);

            // Transform the extract button into copy button
            const extractButton = document.querySelector('#extractButton');
            if (extractButton) {
                // Change button appearance
                extractButton.textContent = 'Copy to Clipboard';
                extractButton.style.backgroundColor = '#4CAF50';

                // Remove old click listener and add new one
                extractButton.replaceWith(extractButton.cloneNode(true));
                const newButton = document.querySelector('#extractButton');

                // Add hover effects
                newButton.addEventListener('mouseover', () => {
                    newButton.style.backgroundColor = '#45a049';
                });
                newButton.addEventListener('mouseout', () => {
                    newButton.style.backgroundColor = '#4CAF50';
                });

                // Add copy functionality
                newButton.addEventListener('click', () => {
                    copyToClipboard(textField.innerText);
                });
            }
        }
    }

    function runScript() {
        const orderItems = document.querySelectorAll('.order-item');
        const dataStraight = [];
        orderItems.forEach(orderItem => {
            dataStraight.push(extractOrderData(orderItem));
        });
        const data = dataStraight.reverse();
        addOrderListText(data);
    }

    // Create and style the initial button
    const button = document.createElement('button');
    button.textContent = 'Extract Order Data';
    button.id = 'extractButton';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.background = '#007bff';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    // Add initial click handler
    button.addEventListener('click', function onFirstClick() {
        runScript();
        // Remove this listener after first click
        button.removeEventListener('click', onFirstClick);
    });

    // Add the button to the page
    document.body.appendChild(button);
})();