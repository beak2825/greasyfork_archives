// ==UserScript==
// @name         yama
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Display 
// @author       alex
// @license      MIT
// @match        https://www.amazon.com/gp/css/order-history*
// @match        https://www.amazon.com/your-orders/orders*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521472/yama.user.js
// @updateURL https://update.greasyfork.org/scripts/521472/yama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchTrackingId(url) {
        try {
            const response = await fetch(url, { credentials: 'include' });
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const trackingIdElement = doc.querySelector('.pt-delivery-card-trackingId');
            const trackingId = trackingIdElement ? trackingIdElement.textContent.trim().split(':')[1] : 'Unknown tracking id';
            const quantityElement = doc.querySelector('.images-quantity-label');
            const quantity = quantityElement ? quantityElement.textContent.trim() : '1';
            const trackingIdWithQuantity = `${trackingId} - ${quantity}`;
            const returnResult = trackingId === 'Unknown tracking id'? trackingId : trackingIdWithQuantity

            return returnResult;
        } catch (error) {
            console.error('Error fetching tracking ID:', error);
            return 'Error';
        }
    }

        function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }


    async function processOrders() {
        const orderCards = document.querySelectorAll('div.a-box-group');

        for (const orderCard of orderCards) {
            const allTrackingNumbers = [];

            const orderNumberElement = orderCard.querySelector('.yohtmlc-order-id span[dir="ltr"]');
            const orderNumber = orderNumberElement ? orderNumberElement.textContent.trim() : 'Unknown tracking number';

            const trackPackageButtons = orderCard.querySelectorAll('a[href*="track_package"]');
            const trackPackageLinks = Array.from(trackPackageButtons).map(button => button.href);

            console.log('Order Number:', orderNumber);
            console.log('Track Package Links:', trackPackageLinks);

            const orderHeader = orderCard.querySelector('div.a-box');

            const trackingInfoContainer = document.createElement('div');
            trackingInfoContainer.style.marginLeft = '1em';
            trackingInfoContainer.textContent = 'Tracking numbers:';

            const copyAllButton = document.createElement('button');
            copyAllButton.textContent = 'Copy All';
            copyAllButton.style.marginLeft = '10px';
            copyAllButton.addEventListener('click', () => copyToClipboard(allTrackingNumbers.join("\n")));
            orderHeader.appendChild(trackingInfoContainer);
            trackingInfoContainer.appendChild(copyAllButton);



            for (const trackPackageLink of trackPackageLinks) {
                const trackingId = await fetchTrackingId(trackPackageLink);
                const trackingIdElement = document.createElement('div');
                trackingIdElement.style.display = 'flex';
                trackingIdElement.style.alignItems = 'center';
                trackingIdElement.textContent = trackingId;

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.style.marginLeft = '10px';
                copyButton.addEventListener('click', () => copyToClipboard(trackingId));
                allTrackingNumbers.push(trackingId);

                trackingIdElement.appendChild(copyButton);
                trackingInfoContainer.appendChild(trackingIdElement);
            }

        }
    }

    function waitForOrdersSection() {
        const targetNode = document.getElementById('yourOrderHistorySection');

        if (!targetNode) {
            processOrders();
            return;
        }

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!targetNode.classList.contains('aok-hidden')) {
                        // Section is now visible, process orders
                        observer.disconnect();
                        processOrders();
                    }
                }
            }
        });

        observer.observe(targetNode, { attributes: true });
    }

    waitForOrdersSection();
})();

