// ==UserScript==
// @name         解锁CSDN
// @namespace    https://blog.alljc.cc
// @version      1.1
// @description  解锁CSDN未登录各种限制!
// @author       沁雨
// @run-at       document-idle
// @match        https://blog.csdn.net/*/article/details/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447587/%E8%A7%A3%E9%94%81CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/447587/%E8%A7%A3%E9%94%81CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.hide-article-box, .signin').remove();
    $('#article_content').css({height: 'auto'});
    $('#content_views pre code').css({'user-select': 'text'});
    $('#content_views pre').css({'user-select': 'text'});
})();