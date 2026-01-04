// ==UserScript==
// @name         cnBeta: Disable bottom tips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable bottom tips.
// @author       Al Cheung @cangzhang
// @run-at document-end
// @match        *://*.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38261/cnBeta%3A%20Disable%20bottom%20tips.user.js
// @updateURL https://update.greasyfork.org/scripts/38261/cnBeta%3A%20Disable%20bottom%20tips.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(function(mutations) {
        removeAds();
    }).observe(document, {childList: true, subtree: true});

    function removeAds() {
        $('body').children().filter(function() {
            var shouldHide = $(this).css('z-index') > 10;
            if (shouldHide) {
                $(this).remove();
            }
        });}
})();