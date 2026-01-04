// ==UserScript==
// @name         Realtime Domain Scanner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Сканирует домены на сайте в реальном времени и выводит их в текстовое поле с сортировкой в столбик.
// @author       https://github.com/lReDragol/Tampermonkey
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524769/Realtime%20Domain%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/524769/Realtime%20Domain%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '300px';
    container.style.height = '400px';
    container.style.overflowY = 'scroll';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.zIndex = '10000';
    container.style.padding = '10px';
    container.style.fontSize = '12px';
    container.style.fontFamily = 'monospace';
    container.style.color = 'black';
    container.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(container);

    const domainSet = new Set();

    function addDomain(domain) {
        if (!domainSet.has(domain)) {
            domainSet.add(domain);
            const domainList = Array.from(domainSet).sort().join('\n');
            container.textContent = domainList;
        }
    }

    function scanPerformanceEntries() {
        const entries = performance.getEntriesByType('resource');
        entries.forEach(entry => {
            try {
                const urlObj = new URL(entry.name);
                addDomain(urlObj.hostname);
            } catch (e) {
                console.error('Error parsing URL from performance entry:', entry.name);
            }
        });
    }

    setInterval(scanPerformanceEntries, 1000);

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            const urlObj = new URL(url);
            addDomain(urlObj.hostname);
        } catch (e) {
            console.error('Error parsing URL:', url);
        }
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        try {
            const url = typeof input === 'string' ? input : input.url;
            const urlObj = new URL(url);
            addDomain(urlObj.hostname);
        } catch (e) {
            console.error('Error parsing fetch URL:', input);
        }
        return originalFetch.apply(this, arguments);
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName) {
                        const src = node.src || node.href;
                        if (src) {
                            try {
                                const urlObj = new URL(src);
                                addDomain(urlObj.hostname);
                            } catch (e) {
                                console.error('Error parsing tag URL:', src);
                            }
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();