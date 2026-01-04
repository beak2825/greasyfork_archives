// ==UserScript==
// @name         看漫画去除顶栏
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  删除漫画界面左右的悬浮图标，获得极致的全屏漫画体验
// @author       Sakura-ushio
// @license      MIT
// @match        https://www.manhuagui.com/comic/*/*.html
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493143/%E7%9C%8B%E6%BC%AB%E7%94%BB%E5%8E%BB%E9%99%A4%E9%A1%B6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493143/%E7%9C%8B%E6%BC%AB%E7%94%BB%E5%8E%BB%E9%99%A4%E9%A1%B6%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideElements() {
        console.log("Run function");

        // var ele1 = document.evaluate("/html/body/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // var ele2 = document.evaluate("/html/body/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        var ele1 = document.getElementsByClassName('header')[0];
        var ele2 = document.getElementsByClassName('w980 clearfix sub-btn')[0];

        if (ele1 != null || ele2 != null) {
            if (ele1 != null) {
                if (ele1.style.display != 'none') {
                    ele1.style.display = 'none';
                    console.log("HideElements ele1");
                }
            }
            if (ele2 != null) {
                if (ele2.style.display != 'none') {
                    ele2.style.display = 'none';
                    console.log("HideElements ele2");
                }
            }
        }

        var button = document.getElementsByClassName('pb-btn pb-ok')[0];
        if (button != null) {
            console.log("Click");
            button.click();
        }
    }

    // 定义一个循环执行函数
    function runRepeatedly() {
        hideElements(); // 第一次执行
        setInterval(hideElements, 300); // 每隔 300 毫秒执行一次
    }

    // 等待网页完成加载
    window.addEventListener('load', runRepeatedly, false);
})();
