// ==UserScript==
// @name	标注后自动保存和关闭
// @namespace	http://tampermonkey.net/
// @version	0.1
// @description	当选中“标注”选项后，自动点击保存和关闭按钮。
// @author	WeakET
// @match	*://*.*.*.*:*/*
// @grant	none
// @license	MIT
// @downloadURL https://update.greasyfork.org/scripts/517835/%E6%A0%87%E6%B3%A8%E5%90%8E%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%92%8C%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/517835/%E6%A0%87%E6%B3%A8%E5%90%8E%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%92%8C%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有的input type="radio"元素
    var radios = document.querySelectorAll('input[type="radio"]');

    // 遍历所有的input type="radio"元素
    radios.forEach(function (radio) {
        // 创建一个按钮元素
        var button = document.createElement("button");
        button.innerHTML = radio.nextSibling.textContent; // 设置按钮的文本内容为radio后面的文本
        button.style.marginBottom = "15px"; // 设置按钮的下边距，使其与radio对齐

        // 将按钮添加到radio上方
        radio.parentNode.insertBefore(button, radio);

        // 为按钮添加点击事件监听器
        button.addEventListener("click", function () {
            radio.click(); // 当按钮被点击时，模拟点击对应的radio

            // 点击"保存结果"按钮
            document.querySelector('a.l-btn[onclick="saveresult()"]').click();

            // 等待半秒后点击"关闭此页"按钮
            setTimeout(function () {
                document.querySelector('a.l-btn[onclick="closepage()"]').click();
            }, 500);
        });
    });
})();
