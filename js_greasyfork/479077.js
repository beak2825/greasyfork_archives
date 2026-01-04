// ==UserScript==
// @name        Bing stop now
// @namespace   Bing页面锁定
// @description 锁定Bing，不自动到顶端
// @author      girl
// @icon        https://favicon.yandex.net/favicon/v2/bing.com
// @include     *://cn.bing.com/*
// @version     0.0.1
// @license     GPL-3.0-only
// @home-url    https://greasyfork.org/zh-CN/scripts/430997
// @downloadURL https://update.greasyfork.org/scripts/479077/Bing%20stop%20now.user.js
// @updateURL https://update.greasyfork.org/scripts/479077/Bing%20stop%20now.meta.js
// ==/UserScript==
//
 
(function() {
    'use strict';
     //====================================================================================
    // 禁止Bing烦人的自动返回页面顶部
    // https://greasyfork.org/zh-CN/scripts/461790-fix-for-bing-search-returns-to-the-top
    // Disable the scroll to top functionality
    function disableScrollToTop() {
        let originalFunc = window.scrollTo;
        window.scrollTo = function(x, y) {
            if (y !== 0) {
                originalFunc(x, y);
            }
        };
    }
 
    // Listen for 'focus' events on the window
    window.addEventListener('focus', disableScrollToTop);
    //====================================================================================
})();





