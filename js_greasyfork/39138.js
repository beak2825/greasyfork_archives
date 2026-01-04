// ==UserScript==
// @name         清爽里nyaa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除广告
// @author       You
// @match        *://sukebei.nyaa.si/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39138/%E6%B8%85%E7%88%BD%E9%87%8Cnyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/39138/%E6%B8%85%E7%88%BD%E9%87%8Cnyaa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".servers-cost-money").remove();
    //$("a[title='Real Life - Videos']").text("   Vedio    ");
    // Your code here...
})();