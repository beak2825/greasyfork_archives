// ==UserScript==
// @name         Crowdin链接自动转中文界面
// @name:en_US   Crowdin URL Auto Change to Chinese
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动将Crowdin URL更改为中文版本，避免重复点击
// @description:en_US  Automatically change Crowdin URL to Chinese version to avoid repeated clicks击
// @match        https://crowdin.com/*
// @grant        none
// @license MPL
// @downloadURL https://update.greasyfork.org/scripts/478286/Crowdin%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E4%B8%AD%E6%96%87%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/478286/Crowdin%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E4%B8%AD%E6%96%87%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var url = window.location.href;

    // Check if the URL is from Crowdin
    if (url.startsWith("https://crowdin.com/")) {

        // Check if the URL already has "zh." prefix
        if (!url.startsWith("https://zh.crowdin.com/")) {

            // Replace "https://crowdin.com/" with "https://zh.crowdin.com/"
            var newUrl = url.replace("https://crowdin.com/", "https://zh.crowdin.com/");

            // Redirect to the new URL
            window.location.href = newUrl;
        }
    }
})();
