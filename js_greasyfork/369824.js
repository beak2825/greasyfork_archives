// ==UserScript==
// @name         Remove Facebook UP NEXT Popup
// @description  Removes the annoying UP NEXT popup from Facebook videos and cancels the next video play automatically.
// @version      0.1.5.2
// @author       Ariel Jannai
// @namespace    https://github.com/arieljannai/tampermonkey-scripts
// @supportURL   https://github.com/arieljannai/tampermonkey-scripts/issues
// @match        https://www.facebook.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/369824/Remove%20Facebook%20UP%20NEXT%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/369824/Remove%20Facebook%20UP%20NEXT%20Popup.meta.js
// ==/UserScript==

'use strict';

var videoPageIntervalID = 0;
var waitingForPopup = false;
var currLocation = '';

(function() {
    videoPageIntervalID = window.setInterval(onVideoPage, 1000);
})();

function waitForUpNextToDisaply() {
    var selector = $("div:contains('UP NEXT')").eq(-8)
    if(selector.length === 1) {
        // remove the popup and cancel the play next
        selector.remove();
        console.log('popup removed!');
        waitingForPopup = false;
        return;
    }
    else {
        setTimeout(function() {
            // console.log('waiting..');
            waitingForPopup = true;
            if (location.href.indexOf("/videos/") != -1) {
                waitForUpNextToDisaply();
            } else {
                waitingForPopup = false;
            }
        }, 500);
    }
}

function onVideoPage() {
    if (location.href.indexOf("/videos/") != -1 && !waitingForPopup && location.href != currLocation ) {
        console.log('arrived to video page: ', location.href);
        currLocation = location.href;
        waitForUpNextToDisaply();
    }
}
