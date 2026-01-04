// ==UserScript==
// @name         Youtube Music Auto confirmer
// @namespace    Youtube Music Auto confirmer
// @version      1
// @description  Automatically clicks 'Ok' when the 'Video paused. Continue watching?' dialog pops up.
// @author       JStyle21, AngusWR
// @match        https://music.youtube.com/*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/395507/Youtube%20Music%20Auto%20confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/395507/Youtube%20Music%20Auto%20confirmer.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    if (document.getElementsByClassName('text style-scope ytmusic-you-there-renderer').length >= 1) {
        for (let i = 0; i < document.getElementsByClassName('text style-scope ytmusic-you-there-renderer').length; i++) {
            if (document.getElementsByClassName('text style-scope ytmusic-you-there-renderer')[i].innerText == "Video paused. Continue watching?") {
                document.getElementsByClassName('text style-scope ytmusic-you-there-renderer')[i].parentNode.parentNode.parentNode.querySelector('#button').click();
            }
        }
    }
}, 1);