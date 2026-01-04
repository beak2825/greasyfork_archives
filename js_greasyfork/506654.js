// ==UserScript==
// @name         SkyWatchFree
// @namespace    https://explore.skywatch.com/
// @version      2024-09-03
// @description  Filter out paid images
// @author       Geromet
// @match        https://explore.skywatch.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506654/SkyWatchFree.user.js
// @updateURL https://update.greasyfork.org/scripts/506654/SkyWatchFree.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeNonFreeProducts() {
        const products = document.querySelectorAll('.panel-content.MuiBox-root.mui-0 .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.product-card.existing-product-card.mui-vlgagv');
        products.forEach(product => {
            const cardInfo = product.querySelector('.card-info.align-items-end.text-right.MuiBox-root.mui-0');
            if (cardInfo) {
                const priceSpan = cardInfo.querySelector('.MuiTypography-root.MuiTypography-caption.mui-rwsqkt');
                if (priceSpan) {
                    const priceText = priceSpan.textContent.trim();
                    if (!/Total:\s*\$0\b/.test(priceText)) {
                        product.remove();
                    }
                }
            }
        });
    }
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerText = 'Show Free Products';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '15px';
        button.style.zIndex = '10000';
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.fontSize = '14px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.2)';

        button.addEventListener('click', function(event) {
            event.preventDefault();
            removeNonFreeProducts();
        });
        document.body.appendChild(button);
    }
    window.addEventListener('load', function() {
        createFloatingButton();
    });

})();