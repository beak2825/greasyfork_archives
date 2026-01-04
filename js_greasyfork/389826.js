// ==UserScript==
// @name         22tu.cc关闭广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       mumumii
// @match        *://22tu.cc/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389826/22tucc%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/389826/22tucc%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("<style id='x_ad'></style>").text("body>div:not(:first-child){display:none;}").appendTo($("head"));
})();