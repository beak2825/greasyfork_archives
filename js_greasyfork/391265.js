// ==UserScript==
// @name         Youtube Miniplayer Autocloser
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  it just blows my mind that they're so insistent on making us use this that they've literally removed the option to disable it
// @author       MisterMan
// @match        http*://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391265/Youtube%20Miniplayer%20Autocloser.user.js
// @updateURL https://update.greasyfork.org/scripts/391265/Youtube%20Miniplayer%20Autocloser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var counter = 0;
    
    var checkExist = setInterval(function() {
        if (counter < 10) {
            if (document.querySelector('.ytp-miniplayer-close-button')) {
                var targetNode = document.querySelector('.ytp-miniplayer-close-button');
                triggerMouseEvent (targetNode, "click");
                clearInterval(checkExist);
            } else {
                counter++;
            } 
        }
        else {
            clearInterval(checkExist); //timeout after 1 second
        }
        
    }, 100); // check every 100ms

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

})();