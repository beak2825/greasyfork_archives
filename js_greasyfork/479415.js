// ==UserScript==
// @name         YouTube Title Duration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  puts the duration in the title, works with sponsorblock
// @author       EntranceJew
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479415/YouTube%20Title%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/479415/YouTube%20Title%20Duration.meta.js
// ==/UserScript==
//debugger;


(function() {
    'use strict';

    var wait = 500
    var observer = new MutationObserver(resetTimer);
    var timer = setTimeout(action, wait, observer); // wait for the page to stay still for 3 seconds
    observer.observe(document, {childList: true, attributes: true, characterData: true, subtree: true});

    function isEmpty(string) {
        return typeof string === 'string' && string.length === 0;
    }

    // reset timer every time something changes
    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, wait, observer);
    }

    function bashIt(selector) {
        let target = document.querySelector(selector);
        if(target && !isEmpty(target.textContent)) {
            var title = document.querySelector("title").textContent;
            var x = target.textContent.replace(/[\( \)]+/g, '');
            document.querySelector("title").textContent = "[" + x + "] " + title;
            return true;
        }
        return false;
    }

    function action(observer) {
        if(bashIt("#sponsorBlockDurationAfterSkips")) {
            observer.disconnect();
            return;
        }
        if(bashIt("ytd-player .ytp-time-duration")) {
            observer.disconnect();
            return;
        }
    }
})();