// ==UserScript==
// @name         JD Mobile Web Redirector
// @namespace    http://userjs.upchan.org/
// @version      1.0
// @description  自动重定向京东移动版商品页面到PC版
// @author       Up
// @match        https://item.m.jd.com/product/*.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445596/JD%20Mobile%20Web%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/445596/JD%20Mobile%20Web%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    var re_id = /product\/(\d+)\.html/;
    var id = url.match(re_id)[1];
    var new_url = '//item.jd.com/' + id + '.html';
    window.location.href = new_url;
})();