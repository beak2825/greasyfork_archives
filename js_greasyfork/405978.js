// ==UserScript==
// @name         Google去广告
// @namespace    all-round
// @version      1.0.2 更新简介
// @description  谷歌去广告插件。
// @author       You
// @match        https://www.google.com/*
// @includ       https://www.google.com/*
// @grant        none
// @author       BennieNiu: ibaeniu@gmail.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/405978/Google%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405978/Google%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function deleteGoogleAds() {
        document.getElementById("tads").remove();
    }
    deleteGoogleAds();
})();