// ==UserScript==
// @name         Remove Ads Outlook Web
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes ads on Outlook Web inbox
// @author       esperiano
// @match        https://outlook.live.com/*
// @icon         https://outlook.live.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525630/Remove%20Ads%20Outlook%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/525630/Remove%20Ads%20Outlook%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adLabels = [
        'Annuncio', 'Ad', 'Anzeige', 'Anuncio', 'Anúncio', 'Reklama', 'Publicité', '広告', '广告', 'Реклама', 'İlan'
    ];

    function removeAds() {
        document.querySelectorAll('div').forEach(div => {
            if (adLabels.includes(div.textContent.trim())) {
                let parent = div.closest('div[data-animatable="true"]');
                if (parent) {
                    parent.remove();
                    console.log('Ad removed:', parent);
                }
            }
        });
    }

    // Run the function initially and then observe changes in the page
    removeAds();
    
    const observer = new MutationObserver(() => removeAds());
    observer.observe(document.body, { childList: true, subtree: true });
})();
