// ==UserScript==
// @name         PT-Bonus-Purchase
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  青蛙魔力商店/大转盘自动
// @author       7ommy
// @match        *://*.qingwa.pro/*
// @icon         https://new.qingwa.pro/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489444/PT-Bonus-Purchase.user.js
// @updateURL https://update.greasyfork.org/scripts/489444/PT-Bonus-Purchase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var purchase_interval = 1*1000; //购买间隔

    var qingwa_upload_100G = 0; // 青蛙自动购买100G上传
    var qingwa_dazhuanpan = 1;  // 青蛙自动大转盘

    if (qingwa_upload_100G) {
        setInterval(function() {
            // 获取你要点击的按钮元素
            var button = document.querySelector('#outer > table:nth-child(1) > tbody > tr:nth-child(8) > td:nth-child(5) > input[type=submit]');

            // 检查按钮是否存在
            if (button) {
                // 如果存在，则模拟点击该按钮
                button.click();
                console.warn('购买成功!');
            } else {
                console.warn('未找到按钮，请检查选择器是否正确。');
            }
        }, purchase_interval); // 10000毫秒等于10秒
    }

    if (qingwa_dazhuanpan) {
        setInterval(function() {
            // 获取你要点击的按钮元素
            var button = document.querySelector('body > div.btn');

            // 检查按钮是否存在
            if (button) {
                // 如果存在，则模拟点击该按钮
                button.click();
                console.warn('购买成功!');
            } else {
                console.warn('未找到按钮，请检查选择器是否正确。');
            }
        }, purchase_interval); // 10000毫秒等于10秒
    }
})();