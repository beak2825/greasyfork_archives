// ==UserScript==
// @name         自动转单1.0
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  聚水潭内部订单号异常转正，第21行为速度，如果转正常过程中出现并发提示，可以设置更高延迟以保证稳定性（电脑环境不同数值也不同，自行调试）
// @author       RakuRai
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488432/%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8D%9510.user.js
// @updateURL https://update.greasyfork.org/scripts/488432/%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8D%9510.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有符合条件的元素
    const elements = document.querySelectorAll('[onclick="ReverseOuterStatus(this)"]');

    // 循环点击元素
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.click(); // 点击元素
        }, (index + 1) * 250); // 每隔0.2秒点击一个元素
    });
})();
