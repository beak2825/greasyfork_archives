// ==UserScript==
// @name         Audiences 屏蔽首页海报图
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  通过JQuery 完成屏蔽首页海报图
// @author       eveloki
// @supportURL   https://audiences.me/contactstaff.php
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @include      *://audiences.me/*
// @include      *://*.audiences.me/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.6.2/base64.js
// @run-at       ddocument-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444798/Audiences%20%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E6%B5%B7%E6%8A%A5%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444798/Audiences%20%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E6%B5%B7%E6%8A%A5%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var jq3v= jQuery.noConflict();
    console.info(jQuery.fn.jquery);
    jq3v(".logo_img").hide();
})();