// ==UserScript==
// @name         AdBlock Blocker Virtupets Pop-Up Remover
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically selects the "Continue without disabling" button on Neopets Virtupets adblock popup when it appears and dismisses it. With added support for video ad popups.
// @author       Amanda Bynes and AI-Manda Binary (ChatGPT Robot Friend)
// @match        *://www.neopets.com/*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541403/AdBlock%20Blocker%20Virtupets%20Pop-Up%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541403/AdBlock%20Blocker%20Virtupets%20Pop-Up%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COUNTER_KEY = 'neopets_popup_dismiss_count';
    let dismissCount = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
    let iframe = null;
    let hideTimeout = null;

    function createOrUpdateIframe() {
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('sandbox', 'allow-same-origin');
            iframe.style.position = 'fixed';
            iframe.style.bottom = '10px';
            iframe.style.right = '10px';
            iframe.style.width = '140px';
            iframe.style.height = '24px';
            iframe.style.zIndex = '2147483647';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '6px';
            iframe.style.pointerEvents = 'none';
            iframe.style.background = 'transparent';
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 0.3s ease';

            document.body.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <html><body style="
                    margin: 0;
                    font-family: sans-serif;
                    font-size: 11px;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    border-radius: 6px;
                ">
                    <div id="popupCounter">Popups dismissed: ${dismissCount}</div>
                </body></html>
            `);
            doc.close();
        } else {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const counterEl = doc.getElementById('popupCounter');
            if (counterEl) {
                counterEl.textContent = `Popups dismissed: ${dismissCount}`;
            }
        }
    }

    function showAndFadeCounter() {
        createOrUpdateIframe();
        iframe.style.opacity = '1';
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (iframe) iframe.style.opacity = '0';
        }, 1800); // show for 1.8s
    }

    function incrementCounter() {
        dismissCount += 1;
        localStorage.setItem(COUNTER_KEY, dismissCount.toString());
        showAndFadeCounter();
    }

    function clickContinueWithoutDisabling() {
        const btn = [...document.querySelectorAll('button')].find(
            b => b.textContent.trim().toLowerCase() === 'continue without disabling'
        );
        if (btn) {
            btn.click();
            incrementCounter();
        }
    }

    function removePoweredBy() {
        const target = document.querySelector('.dgEhJe6g .aJVLc6uP');
        if (target && target.parentNode) {
            target.parentNode.removeChild(target);
            incrementCounter();
        }
    }

    function closeVideoAd() {
        const btn = document.querySelector('#nl-instream-video .nl-instream-video-close');
        if (btn) {
            btn.click();
            incrementCounter();
        }
    }

    function hideBottomAdBar() {
        const checkbox = document.querySelector('#pb-slot-d-uc-la-bottom-728x90-hide');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            incrementCounter();
        }
    }

    function observerHandler() {
        clickContinueWithoutDisabling();
        removePoweredBy();
        closeVideoAd();
        hideBottomAdBar();
    }

    const observer = new MutationObserver(observerHandler);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(observerHandler, 500);
    setInterval(observerHandler, 1500);

    window.addEventListener('load', () => {
        createOrUpdateIframe();
    });
})();
