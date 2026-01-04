// ==UserScript==
// @name         Refresh Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在所有网页右侧增加一个刷新按钮，点击后 2~3 秒刷新页面
// @author       YourName
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526342/Refresh%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526342/Refresh%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    let button = document.createElement("button");
    button.innerText = "刷新";
    button.style.position = "fixed";
    button.style.right = "10px";
    button.style.top = "50%";
    button.style.transform = "translateY(-50%)";
    button.style.padding = "10px 20px";
    button.style.background = "#ff5722";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";
    button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";

    // 绑定点击事件
    button.addEventListener("click", function() {
        let delay = 2000 + Math.random() * 1000; // 2~3秒随机延迟
        button.innerText = "即将刷新...";
        setTimeout(() => {
            location.reload();
        }, delay);
    });

    // 添加到页面
    document.body.appendChild(button);
})();
