// ==UserScript==
// @name         Softarchive - AVIF to PNG via imgproxy
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @license MIT
// @author       JRem
// @version      1.0
// @description  AVIF to PNG via imgproxy
// @run-at       document-end
// @match        *://softarchive.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540465/Softarchive%20-%20AVIF%20to%20PNG%20via%20imgproxy.user.js
// @updateURL https://update.greasyfork.org/scripts/540465/Softarchive%20-%20AVIF%20to%20PNG%20via%20imgproxy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let processed = false;

    function log(...args) {
        console.log('[AVIF→PNG]', ...args);
    }

    function randomString(length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    function convertAndInsert(img) {
        if (processed) return;
        processed = true;

        const encodedURL = encodeURIComponent(img.src);
        const proxyURL = `https://imgproxy.jrem.org/${randomString()}/f:png/plain/${encodedURL}`;

        log('Original:', img.src);
        log('Proxy:', proxyURL);

        const pngImg = document.createElement('img');
        pngImg.src = proxyURL;
        pngImg.alt = 'Converted PNG';
        pngImg.style.border = '2px dashed #4caf50';
        pngImg.style.marginTop = '12px';
        pngImg.title = 'PNG converted via imgproxy';

        img.insertAdjacentElement('afterend', pngImg);
    }

    function tryFindAndConvert() {
        const img = document.querySelector('img[src$=".avif"]');
        if (img) {
            log('AVIF image found, attempting conversion...');
            convertAndInsert(img);
        } else {
            log('No AVIF image found (yet)');
        }
    }

    // Initial check (with slight delay for slow loads)
    setTimeout(tryFindAndConvert, 1000);

    // Watch for new images dynamically inserted
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'IMG' && node.src.endsWith('.avif')) {
                    log('Dynamically added AVIF image detected');
                    convertAndInsert(node);
                    return;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();