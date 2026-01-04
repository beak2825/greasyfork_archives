// ==UserScript==
// @name         Dislikes Reborn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces the dislike button text to views / likes
// @author       Tok1
// @license MIT
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435462/Dislikes%20Reborn.user.js
// @updateURL https://update.greasyfork.org/scripts/435462/Dislikes%20Reborn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = (s, x = document) => x.querySelector(s)
    setInterval(() => {
        const views = parseInt($('.view-count').textContent.split(" ")[0].replaceAll(String.fromCharCode(160), "")) // not a space
        const likes = parseInt($('.ytd-video-primary-info-renderer').children[5].children[2].children[0].children[0].children[0].children[0].children[0].children[1].innerText.replace(String.fromCharCode(160), ""))
        const ratio = Math.round(10*views/likes)/10
        $('.ytd-video-primary-info-renderer').children[5].children[2].children[0].children[0].children[0].children[1].children[0].children[1].innerText = ratio
    }, 100)

    // Your code here...
})();