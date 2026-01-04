// ==UserScript==
// @name         FastPic Full Image Redirect
// @namespace    https://violentmonkey.org/
// @author       SPXX
// @license      MIT
// @version      1.0
// @description  Redirects to the full image on fastpic.org
// @match        https://fastpic.org/view/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541024/FastPic%20Full%20Image%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/541024/FastPic%20Full%20Image%20Redirect.meta.js
// ==/UserScript==


(function () {
    'use strict';

    console.info('[FastPic Script] Starting with overlay…');

    // Inject overlay and spinner CSS
    GM_addStyle(`
        #fp-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: white;
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }
        @media (prefers-color-scheme: dark) {
            #fp-overlay {
                background-color: black;
            }
        }
        #fp-spinner {
            width: 48px;
            height: 48px;
            border: 5px solid rgba(128, 128, 128, 0.2);
            border-top: 5px solid rgba(128, 128, 128, 0.8);
            border-radius: 50%;
            animation: fp-spin 1s linear infinite;
        }
        @keyframes fp-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // Create and add the overlay with spinner
    const overlay = document.createElement('div');
    overlay.id = 'fp-overlay';
    overlay.innerHTML = `<div id="fp-spinner"></div>`;
    document.documentElement.appendChild(overlay);

    let timedOut = false;
    const timeout = 5000;

    // Start everything only after body is ready
    function startObserverWhenReady() {
        if (!document.body) {
            requestAnimationFrame(startObserverWhenReady);
            return;
        }

        const timeoutHandle = setTimeout(() => {
            timedOut = true;
            overlay.remove();
            console.warn('[FastPic Script] Timeout: image not found. Showing original site.');
        }, timeout);

        const observer = new MutationObserver(() => {
            if (timedOut) return;
            const img = document.querySelector('img[src*="/big/"][src*="?md5="]');
            if (img) {
                console.info('[FastPic Script] Full image found:', img.src);
                clearTimeout(timeoutHandle);
                observer.disconnect();
                window.location.href = img.src;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    startObserverWhenReady();
})();
