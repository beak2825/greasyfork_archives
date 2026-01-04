// ==UserScript==
// @name         Youtube 'Video paused. Continue watching?' Auto confirmer
// @namespace    Youtube 'Video paused. Continue watching?' Auto confirmer
// @version      1
// @description  Automatically clicks 'Ok' when the 'Video paused. Continue watching?' dialog pops up and pauses your videos.
// @author       AngusWR
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377506/Youtube%20%27Video%20paused%20Continue%20watching%27%20Auto%20confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/377506/Youtube%20%27Video%20paused%20Continue%20watching%27%20Auto%20confirmer.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    if (document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer').length >= 1) {
        for (let i = 0; i < document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer').length; i++) {
            if (document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer')[i].innerText == "Video paused. Continue watching?") {
                document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer')[i].parentNode.parentNode.parentNode.querySelector('#confirm-button').click()
            }
        }
    }
}, 10)();