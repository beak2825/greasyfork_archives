// ==UserScript==
// @name         Webpage Element Hider
// @namespace    https://zachsaucier.com/
// @version      0.1
// @description  To show how one can hide elements like an ad blocker using userscripts. Modified for my own sites.
// @author       Zach Saucier
// @match        *://*/*
// @license	 no license
// @downloadURL https://update.greasyfork.org/scripts/450259/Webpage%20Element%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/450259/Webpage%20Element%20Hider.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Set our list of sites and elements to block
    var blockList = [
        "www.bbc.co.uk##.wr-c-map__map--loaded.wr-c-map__map--in-page.wr-c-map__map",
        "www.bbc.co.uk##.wr-c-map",
        "www.bbc.co.uk##.wr-c-weather-watchers",
        "www.bbc.co.uk###navp-orb-footer-promo",
        "www.facebook.com##._2t-e > ._4kny:nth-of-type(1)",
        "www.facebook.com##._1uh-:nth-of-type(1)",
        "www.facebook.com##._50tj._2t-a",
        "www.facebook.com##._50ti._2s1y._5rmj._26aw._2t-a",
        "www.facebook.com###u_0_0",
        "www.facebook.com###fbDockChatBuddylistNub > .fbNubButton"
    ];
 
    // Get the window's hostname
    var windowHostname = window.location.hostname;
 
    // Iterate through the blocklist, hiding elements as needed
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');
 
        // Compare the hostnames; Only remove elements if they match
        if(windowHostname === entryParts[0]) {
            // Find the elements if they exists
            var matchedElements = document.querySelectorAll(entryParts[1]);
 
            // Actually remove the element(s) that match
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];
 
                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }
})();