// ==UserScript==
// @name         Block Amazon Sponsored Ads
// @description  Blocks sponsored product results from showing up in Amazon searches
// @version      1.0.3
// @author       heavyLobster2
// @namespace    github.com/heavyLobster2
// @match        *://www.amazon.com/s/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388468/Block%20Amazon%20Sponsored%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/388468/Block%20Amazon%20Sponsored%20Ads.meta.js
// ==/UserScript==
(function () {
    "use strict";
    
    var removeAds = function () {
        var resultList = document.getElementById("s-results-list-atf");
        if (resultList) {
            var sponsorBadges = resultList.querySelectorAll("img.s-sponsored-info-icon");
            for (var i = 0; i < sponsorBadges.length; i++) {
                var resultItem = sponsorBadges[i].closest("li.s-result-item");
                if (resultItem) resultItem.remove();
            }
        }
    };
    removeAds();
    
    var mainDiv = document.getElementById("main");
    if (mainDiv) (new MutationObserver(removeAds)).observe(mainDiv, { childList: true, subtree: true });
})();