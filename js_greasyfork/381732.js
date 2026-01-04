// ==UserScript==
// @name          Blogger Content Warning Bypass
// @namespace     Blogger Content Warning Bypass
// @description   A user script to bypass Blogspot's Content Warning
// @version       2.0
// @icon          https://www.google.com/s2/favicons?sz=64&domain=blogger.com
// @author        kylyte
// @license       GPL-3.0
// @match         https://www.blogger.com/post-interstitial.g?blogspotURL=*
// @match         https://*.blogspot.com/*
// @downloadURL https://update.greasyfork.org/scripts/381732/Blogger%20Content%20Warning%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/381732/Blogger%20Content%20Warning%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    if (currentUrl.includes('post-interstitial.g?blogspotURL=')) {
        function clickButton() {
            const button = document.querySelector('a.maia-button');
            if (button) {
                button.click();
            }
        }
        const observer = new MutationObserver((mutations, obs) => {
            const button = document.querySelector('a.maia-button');
            if (button) {
                button.click();
                obs.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        document.body.style.display = 'none';
        window.addEventListener('click', clickButton);
    }

    if (currentUrl.match(/^https:\/\/.*\.blogspot\.com\/.*$/)) {
        const style = document.createElement('style');
        style.textContent = `
            @namespace url(http://www.w3.org/1999/xhtml);
            iframe#injected-iframe[src*='blogin.g'] {
                display: none !important;
            }
            body * {
                visibility: inherit !important;
            }
        `;
        document.head.appendChild(style);
    }
})();