// ==UserScript==
// @name         Bing TopScroll Blocker
// @namespace    https://tampermonkey.net/
// @version      0.4.0
// @description  防止Bing自动滚动到顶部
// @author       FakerJMS
// @match        http*://*.bing.com/*
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499571/Bing%20TopScroll%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/499571/Bing%20TopScroll%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //
    let fk_timer_id = 0;
    //
    let fk_origin_scrollTo = window.scrollTo;
    //
    let fk_new_scrollTo = function(x, y) {
        // TODO
    };

    // 禁用"滚动到顶部"
    function disable_scrollToTop() {
        if (fk_timer_id > 0) {
            clearTimeout(fk_timer_id);
            fk_timer_id = 0;
        }
        
        window.scrollTo = fk_new_scrollTo;
    }

    // 使能"滚动到顶部"
    function _enable_scrollToTop() {
        window.scrollTo = fk_origin_scrollTo;
    }

    // 延时使能"滚动到顶部"
    function enable_scrollToTop() {
        fk_timer_id = setTimeout(_enable_scrollToTop, 1000);
    }

    // 监听"窗口获取焦点"事件, 使能"滚动到顶部"
    window.addEventListener('focus', enable_scrollToTop);
    // 监听"鼠标进入窗口"事件, 使能"滚动到顶部"
    document.addEventListener('mouseenter', enable_scrollToTop);
    // 监听"窗口失去焦点"事件, 禁用"滚动到顶部"
    window.addEventListener('blur', disable_scrollToTop);
})();