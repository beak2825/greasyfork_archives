// ==UserScript==
// @name         Yahoo Sponsored Ad Block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes sponsored ads from Yahoo news feeds
// @author       John P. Smith
// @match        *://*.yahoo.com/*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372015/Yahoo%20Sponsored%20Ad%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/372015/Yahoo%20Sponsored%20Ad%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bannersRemoved = false; //Only need to remove the banner ads once

    window.onload = function () {removeSponsoredAds();};

    var MutationObserver = window.MutationObserver;
    var myObserver = new MutationObserver (mutationHandler);
    var observerConfig = {childList: true, attributes: false, subtree: true};
    myObserver.observe(document, observerConfig);

    function mutationHandler (mutationRecords) {
        if (mutationRecords.findIndex(function(element) {return element.addedNodes != null && element.addedNodes.length > 0;}) >= 0) {
            removeAds();
        }
    }

    function removeAds()
    {
        const adClassName = "js-stream-ad";

        if (bannersRemoved == false) {
            var bannerAds = $('[id*="Lead-2-Ad"]');
            for (var i = 0; i < bannerAds.length; i++) {
                console.log("in bannerAds");
                bannerAds[i].style.display = "none";
                //bannerAds[i].remove();
                bannersRemoved = true;
            }
        }

        var sponsoredItems = $("li:contains('Sponsored')");
        // var sponsoredItems = document.getElementsByClassName(adClassName);
        for (var j = 0; j < sponsoredItems.length; j++) {
            sponsoredItems[j].style.display = "none";
            //sponsoredItems[j].remove();
        }
    }

})();





