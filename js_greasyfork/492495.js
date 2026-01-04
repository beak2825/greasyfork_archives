// ==UserScript==
// @name         伪装大陆地区YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  替换YouTube首页的Logo和地区文字为“CN”
// @author       信标bate
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492495/%E4%BC%AA%E8%A3%85%E5%A4%A7%E9%99%86%E5%9C%B0%E5%8C%BAYouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/492495/%E4%BC%AA%E8%A3%85%E5%A4%A7%E9%99%86%E5%9C%B0%E5%8C%BAYouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var locationText = document.querySelector("#country-code");
    if (locationText) {
        locationText.innerText = "CN";
    }
})();