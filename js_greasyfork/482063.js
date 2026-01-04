// ==UserScript==
// @name         YNU一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击九分
// @author       唐无诗
// @match        http://ehall.ynu.edu.cn/*
// @match        https://ehall.ynu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482063/YNU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482063/YNU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 创建一个按钮
    var button = document.createElement("button");
    button.innerHTML = "一键评教";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = "10000"; // 设置足够高的z-index确保按钮在最上层
    button.style.backgroundColor = "#4CAF50"; // 可选：设置按钮颜色
    button.style.color = "white"; // 可选：设置文字颜色
    button.style.border = "none"; // 可选：去掉边框
    button.style.padding = "10px"; // 可选：添加一些内边距
    button.style.borderRadius = "5px"; // 可选：设置边角为圆角


    // 将按钮添加到页面上
    document.body.appendChild(button);

    // 为按钮添加点击事件监听器
    button.addEventListener("click", function() {
        // 选择并点击页面上所有特定的元素
        document.querySelectorAll('.fzItem.bh-pull-left[data-x-fz="9"]').forEach(elem => {
            elem.click();
        });
    });
})();
