// ==UserScript==
// @name         删除飞书播放页面字幕
// @namespace    http://localhost
// @version      0.1
// @description  删除飞书播放页面的字幕
// @match      *://qqjwmlwomq.feishu.cn/minutes/*
// @grant        none
// @author       Hiraly
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/470888/%E5%88%A0%E9%99%A4%E9%A3%9E%E4%B9%A6%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470888/%E5%88%A0%E9%99%A4%E9%A3%9E%E4%B9%A6%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    function removeElement() {
        var element = document.getElementById('paragraphParentEl');
        if (element) {
            var parent = element.parentNode;
            parent.removeChild(element);
        } else {
            console.log('未找到要删除的元素');
        }
    }

    waitForLoad(removeElement);
})();