// ==UserScript==
// @name         Youtube Livestream Progress Bar Elapsed Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Youtube livestream progress bar displays time only relative to current live time. This script will add time at mouse position on progress bar displayed in elapsed time.
// @author       MrQianHuZi
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446800/Youtube%20Livestream%20Progress%20Bar%20Elapsed%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/446800/Youtube%20Livestream%20Progress%20Bar%20Elapsed%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
    // Example: runWhenReady('.search-result', augmentSearchResults);
    // Gives up after 1 minute.
    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }
    // Your code here...

    runWhenReady(".ytp-tooltip-text.ytp-tooltip-text-no-title", () => {
        console.log("testing");
        const player = document.getElementById("ytd-player").player_;
        const timetext = document.getElementsByClassName("ytp-tooltip-text ytp-tooltip-text-no-title")[0];
        const newtime = document.createElement("span");
        newtime.setAttribute("class", "ytp-tooltip-text ytp-tooltip-text-no-title");
        timetext.parentElement.appendChild(newtime);
        const progressBar = document.getElementsByClassName("ytp-progress-bar")[0];
        progressBar.addEventListener("mousemove", () => {
            const timevalues = timetext.innerText.substring(1).split(":");
            let timeFromLiveTime = 0;
            for (let i = 0; i < timevalues.length; i++) {
                const multiplier = Math.pow(60, timevalues.length - 1 - i);
                timeFromLiveTime += multiplier * timevalues[i];
            }
            const timeElapsed = player.getProgressState().seekableEnd - timeFromLiveTime;
            newtime.innerText = new Date(1000 * timeElapsed).toISOString().substr(11, 8);
        });
    });
})();