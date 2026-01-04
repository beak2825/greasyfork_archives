// ==UserScript==
// @name         Steam Workshop Disable Adult Content CSS
// @name:zh      Steam工坊无模糊预览
// @namespace    http://tampermonkey.net/
// @version      2024-06-04
// @description  steam创意工坊
// @author       You
// @match        https://steamcommunity.com/workshop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497042/Steam%20Workshop%20Disable%20Adult%20Content%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/497042/Steam%20Workshop%20Disable%20Adult%20Content%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var matches = document.body.querySelectorAll(".has_adult_content");
    matches.forEach(function (item) {
        item.classList.remove("has_adult_content");
    });

    var styleTag = document.createElement("style");
    styleTag.innerHTML = `.ugc.has_adult_content img,
    .ugc.has_adult_content div.imgWallItem
    {
        filter: none!important;
    }`;
    document.head.appendChild(styleTag);
})();