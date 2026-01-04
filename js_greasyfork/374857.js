// ==UserScript==
// @name         简书自动适配屏幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简书文章页按屏幕比例放大
// @author       lzdbh
// @match        https://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374857/%E7%AE%80%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%E5%B1%8F%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374857/%E7%AE%80%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%80%82%E9%85%8D%E5%B1%8F%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.note .post').css({'width':'90%'});
    $('#note-fixed-ad-container,#web-note-ad-1').remove();
})();