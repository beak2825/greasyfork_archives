// ==UserScript==
// @name         Chatwork Ads Killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can remove chatwork ads.
// @author       tyou kouyou
// @match        https://www.chatwork.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatwork.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467932/Chatwork%20Ads%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/467932/Chatwork%20Ads%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pageLoaded() {

        var adContainer = document.querySelector('.promotionArea');

        if (adContainer) {

            adContainer.style.display = 'none';
        }

        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {

                    var newAdContainer = mutation.target.querySelector('.promotionArea');

                    if (newAdContainer) {

                        newAdContainer.remove();
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    window.addEventListener('load', pageLoaded);
})();
