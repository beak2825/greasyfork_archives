// ==UserScript==
// @name         Amazon Keepa Show on Hover
// @namespace    zys52712
// @version      1.0
// @description  Show Keepa price chart on hover
// @author       zys52712
// @match        *://*.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518428/Amazon%20Keepa%20Show%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/518428/Amazon%20Keepa%20Show%20on%20Hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the Keepa chart image element
    const chartImg = document.createElement('img');
    chartImg.id = 'keepa-chart';
    chartImg.style.position = 'fixed';
    chartImg.style.bottom = '10px';
    chartImg.style.right = '10px';
    chartImg.style.border = '1px solid #ddd';
    chartImg.style.zIndex = '1000';
    chartImg.style.display = 'none';
    chartImg.style.padding = '15px';
    chartImg.style.background = 'white';
    chartImg.style.borderRadius = '10px';
    chartImg.style.boxShadow = '1px 1px 5px 2px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(chartImg);

    function extractASINFromURL(url) {
        const asinPattern = /\/([A-Z0-9]{10})(?:[/?]|$)/i;
        const match = url.match(asinPattern);
        return match ? match[1] : null;
    }

    function showKeepaChart(asin) {
        chartImg.src = `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=com&width=600&height=300&amazon=1&new=1&used=1&range=365&salesrank=1&salesrank=1`;
        chartImg.style.display = 'block';
    }

    function hideKeepaChart() {
        chartImg.style.display = 'none';
    }

    function monitorLinks() {
        function addHoverEvent(link) {
            const asin = extractASINFromURL(link.href);
            if (asin) {
                link.addEventListener('mouseenter', () => showKeepaChart(asin));
                link.addEventListener('mouseleave', hideKeepaChart);
            }
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'A') {
                        addHoverEvent(node);
                    }

                    if (node.nodeType === 1) {
                        const links = node.querySelectorAll('a');
                        links.forEach(addHoverEvent);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll('a').forEach(addHoverEvent);
    }

    monitorLinks();
})();