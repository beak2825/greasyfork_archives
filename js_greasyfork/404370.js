// ==UserScript==
// @name         自动关闭bilibili弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       luofo
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404370/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADbilibili%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/404370/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADbilibili%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let selector_native = {
        'on':"input[class='bui-switch-input']:checked"
    }
    function switch_danmaku() {
        tim()
    }
    function tim() {
        if(document.querySelector(selector_native.on)){
            document.querySelector(selector_native.on).click();
        }
        else {
            setTimeout(tim, 1000)
        }
    }
    switch_danmaku()
    // Your code here...
})();