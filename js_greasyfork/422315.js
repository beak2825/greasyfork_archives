// ==UserScript==
// @name         CMCT隐藏图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏图片等无用信息
// @author       feiyu0123
// @match        https://springsunday.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422315/CMCT%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/422315/CMCT%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.banner-header,.avatar').hide();
    $('img').hide();
    $($('#outer').children().get(0)).remove();
    $('#ad_belowsearchbox').remove();
    $('#info_block').hide();
    $('body').css('fontSize', '9px');
    $('ul.menu').css({background: '#ccc', color: '#AAA' });
    $('ul.menu a').css({background: '#ccc', color: '#AAA' });
    // Your code here...
})();