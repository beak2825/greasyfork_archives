// ==UserScript==
// @name         block autoplay
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  block autoplay from bilibili.com and youtube.com
// @author       Rickjoe
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/*
// @match        https://www.twitch.tv/*

// @defaulticon
// @grant        none
// @license MIT
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/486640/block%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/486640/block%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("#video").autoplay = false;
})();