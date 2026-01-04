// ==UserScript==
// @name         锋云智慧教辅平台自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  实现自动签到功能
// @author       code by hezongdnf
// @match        https://pt.1000phone.net/livingRoom*
// @grant        none
// @note         2020/7/6 添加自动签到功能
// @downloadURL https://update.greasyfork.org/scripts/406580/%E9%94%8B%E4%BA%91%E6%99%BA%E6%85%A7%E6%95%99%E8%BE%85%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406580/%E9%94%8B%E4%BA%91%E6%99%BA%E6%85%A7%E6%95%99%E8%BE%85%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var btn = document.getElementsByClassName('player-signed')[0];
    var sign = document.getElementsByClassName('btn-signed');

    var autoSign = function() {
        if (btn == null) { return; }
        var param = window.getComputedStyle(btn, null).display;
        if (param == 'block') {
            sign.click();
        } else if (param == 'none') {
            console.log('none');
        }
    }

    var f = setInterval(autoSign, 5000);
})()