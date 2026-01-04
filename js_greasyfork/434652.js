// ==UserScript==
// @name         去除2dfan背景广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以去除2dfan背景广告
// @author       Tester
// @match        https://www.2dfan.com/*
// @icon         https://www.google.com/s2/favicons?domain=2dfan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434652/%E5%8E%BB%E9%99%A42dfan%E8%83%8C%E6%99%AF%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/434652/%E5%8E%BB%E9%99%A42dfan%E8%83%8C%E6%99%AF%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var bg=document.getElementsByClassName("index_bg_box")[0];
    bg.getAttributeNode("style").value="width: 100%; height: 100%; position: fixed; left: 0px; top: 45px; center 41px no-repeat rgb(53, 53, 53);";
    for (var i = 0; i < 2; i++) {
        bg.removeChild(bg.childNodes[0]);
    }
})();