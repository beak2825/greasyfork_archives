// ==UserScript==
// @name         WBW Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download button for WhatBoysWant
// @author       ReaperUnreal
// @match        https://*.whatboyswant.com/babes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatboyswant.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442170/WBW%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/442170/WBW%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // get the image link
    var images = document.getElementsByClassName('img-fluid');
    if (images.length !== 1) {
        return;
    }
    var src = images[0].src;

    // get the button row
    var cards = document.getElementsByClassName('card-tools');
    if (cards.length !== 1) {
        return;
    }
    var buttonRow = cards[0];
    if (buttonRow.children.length < 2) {
        return;
    }

    // positively identify download button
    var downloadA = buttonRow.children[1];
    if (downloadA.tagName.toLowerCase() !== 'a') {
        return;
    }
    if (downloadA.children.length !== 1) {
        return;
    }
    if (!downloadA.children[0].classList.contains('fa-download')) {
        return;
    }
    downloadA.href = src;
    downloadA.setAttribute('download', '');
})();