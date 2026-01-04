// ==UserScript==
// @name           i春秋屏蔽干扰元素
// @author         wusuluren
// @description    i春秋网站屏蔽干扰元素
// @namespace    http://tampermonkey.net/
// @supportURL     https://github.com/Wusuluren
// @version      0.1.1
// @match        *://www.ichunqiu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400456/i%E6%98%A5%E7%A7%8B%E5%B1%8F%E8%94%BD%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/400456/i%E6%98%A5%E7%A7%8B%E5%B1%8F%E8%94%BD%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.footer').remove()
    $('.banner').remove()
    $('.csidebar').remove()
    $('.robotWrap').remove()
})();