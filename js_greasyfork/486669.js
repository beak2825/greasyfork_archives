// ==UserScript==
// @name         trakt.tv ads removal script
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trakt.tv
// @namespace    adtitas
// @version      1.1.0
// @description  remove the annoying sticky ads from trakt.tv
// @include      *://trakt.tv/*
// @grant        none
// @author       adtitas
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486669/trakttv%20ads%20removal%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/486669/trakttv%20ads%20removal%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove dynamically generated ads with IDs starting with "om1gYCfRiN"
    function removeDynamicAds() {
        var dynamicAds = document.querySelectorAll('div[id^="om1gYCfRiN"]');
        dynamicAds.forEach(function(el) {
            el.remove();
        });
    }

    // Run immediately and re-check every few seconds
    removeDynamicAds();
    setInterval(removeDynamicAds, 3000);

})();