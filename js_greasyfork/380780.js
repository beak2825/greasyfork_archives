// ==UserScript==
// @name         护眼模式
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  百度百科护眼模式
// @author       xfh
// @match        *://baike.baidu.com/item/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/380780/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/380780/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').css('background-color', '#C7EDCC');
})();