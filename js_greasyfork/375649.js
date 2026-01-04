// ==UserScript==
// @name         百科自用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让百度不再装逼
// @author       You
// @match        *://baike.baidu.com/item/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375649/%E7%99%BE%E7%A7%91%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/375649/%E7%99%BE%E7%A7%91%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('div.side-content').remove();
    $('div.main-content').css('width', 'auto');
})();