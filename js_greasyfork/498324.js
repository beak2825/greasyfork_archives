// ==UserScript==
// @name         Twitter Without Statistics
// @version      20240725
// @description  Remove all statistics on Twitter
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       documnet-idle
// @license       MIT
// @namespace https://greasyfork.org/users/1309250
// @downloadURL https://update.greasyfork.org/scripts/498324/Twitter%20Without%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/498324/Twitter%20Without%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(removeStatistics,300); //i coudln't get MutationObserver or waitForKeyElements to work so while(true) it is

    function removeStatistics(){
        const statisticsText = document.getElementsByClassName('css-1jxf684 r-1ttztb7 r-qvutc0 r-poiln3 r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd')
        if (statisticsText){
            for (let i=0; i<statisticsText.length; i++){
                statisticsText[i].remove(); //removes statistics text element itself
            }
        }
    }

})();