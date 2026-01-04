// ==UserScript==
// @name         (新商盟)一键显示可用量
// @namespace    none
// @version      0.1
// @description  none
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468074/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA%E5%8F%AF%E7%94%A8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468074/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA%E5%8F%AF%E7%94%A8%E9%87%8F.meta.js
// ==/UserScript==

//一键显示可用量
var inputElements = document.querySelectorAll("input[name='req_qty']");
for (var i = 0; i < inputElements.length; i++) {
    inputElements[i].value = 1;
    inputElements[i].dispatchEvent(new Event('blur'));
}

// 每隔100毫秒检测一次页面上所有id以qty_lmt_开头的元素的文本内容
var intervalId = setInterval(function() {
    var elements = document.querySelectorAll('#xsm-order-jydh-list-content [id^="qty_lmt_"]');
    var allNotDash = true;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent === '--') {
            allNotDash = false;
            break;
        }
    }

    if (allNotDash) {
        // 页面中所有id以qty_lmt_开头的元素的文本都不为"--"，立即执行点击排序按钮的代码
        for (let i = 0; i < 2; i++) {
            document.querySelectorAll("span#qty-lmt-h, span#kyl-btn").forEach(el => el.click());
        }
        // 停止定时器
        clearInterval(intervalId);
    }
}, 100);