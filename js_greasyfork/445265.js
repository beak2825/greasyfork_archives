// ==UserScript==
// @name         readAll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  it1352需要关注公众号获取验证码，很难受，所以搞了下
// @author       You
// @match        https://www.it1352.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/445265/readAll.user.js
// @updateURL https://update.greasyfork.org/scripts/445265/readAll.meta.js
// ==/UserScript==
// 阅读全文
(function() {
    'use strict';
    $.cookie('olduser', '1', { domain: 'it1352.com', expires: 15 });
    // Your code here...
})();