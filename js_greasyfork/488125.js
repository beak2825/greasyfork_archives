// ==UserScript==
// @name         YouTube Adblock warning Remover
// @namespace    http://samuelaraujo.pt
// @version      1.3
// @description  Removes Adblock warning for a better viewing experience.
// @author       Samuel Araújo
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/488125/YouTube%20Adblock%20warning%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/488125/YouTube%20Adblock%20warning%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeVideoAds() {
        const ads = document.querySelectorAll('.ad-showing');
        ads.forEach(ad => ad.remove());
    }

    function removePopups() {
        const popups = document.querySelectorAll('.style-scope ytd-enforcement-message-view-model');
        popups.forEach(popup => popup.remove());
    }

    function removePageAds() {
        const pageAds = document.querySelectorAll('.style-scope.ytd-display-ad-renderer');
        pageAds.forEach(ad => ad.remove());
    }

    if (window.location.hostname === 'www.youtube.com') {
        // Remove ads and pop-ups when the DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            removeVideoAds();
            removePopups();
            removePageAds();
        });
    }
})();
