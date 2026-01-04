// ==UserScript==
// @name         Youtube自动加载字幕
// @namespace    Youtube automatically loads subtitles
// @version      0.1
// @description  Youtube自动加载字幕;Youtube automatically loads subtitles
// @author       栗凹嗄
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399824/Youtube%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/399824/Youtube%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var subtitle = document.querySelector(".ytp-subtitles-button");
    if(subtitle.getAttribute("aria-pressed") == 'false') subtitle.click();

})();