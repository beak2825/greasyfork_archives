// ==UserScript==
// @name         Photopea No Ads
// @version      0.0.3
// @description  Hide Photopea Ads
// @icon         https://www.photopea.com/promo/thumb256.png

// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://www.photopea.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439640/Photopea%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/439640/Photopea%20No%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resize() {
        const adWidth = document.querySelector('.app').offsetWidth -
              document.querySelector('.app > div').offsetWidth;
        Object.defineProperty(unsafeWindow, 'innerWidth', {
            get() {
                return parseInt(visualViewport.width) + adWidth;
            }
        });
        unsafeWindow.dispatchEvent(new Event('resize'));
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for(const node of mutation.addedNodes) {
                if(node.nodeType === 1 && node.matches('.app *')) {
                    observer.disconnect();
                    resize();
                    return;
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

