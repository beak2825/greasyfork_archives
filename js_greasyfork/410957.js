// ==UserScript==
// @name         RemoveAds(移除DuckDuckGo宣传广告)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove banner on the main page
// @author       StarDust
// @match        https://duckduckgo.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410957/RemoveAds%28%E7%A7%BB%E9%99%A4DuckDuckGo%E5%AE%A3%E4%BC%A0%E5%B9%BF%E5%91%8A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410957/RemoveAds%28%E7%A7%BB%E9%99%A4DuckDuckGo%E5%AE%A3%E4%BC%A0%E5%B9%BF%E5%91%8A%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    deleteMainPageAds();

    function deleteMainPageAds() {
        const bannerAdElement = document.getElementsByClassName("tag-home__wrapper")[0];
        if (bannerAdElement.parentNode) {
            const parentNode = bannerAdElement.parentNode;
            parentNode.removeChild(bannerAdElement);
        }
    }
})();