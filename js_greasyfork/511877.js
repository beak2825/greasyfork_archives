// ==UserScript==
// @name         【学习通】批量点击批阅
// @namespace    https://mooc2-ans.chaoxing.com/
// @version      1.0
// @description  自动化点击页面中的批阅按钮
// @author       你的名字
// @match        https://mooc2-ans.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511877/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E6%89%B9%E9%87%8F%E7%82%B9%E5%87%BB%E6%89%B9%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/511877/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%91%E6%89%B9%E9%87%8F%E7%82%B9%E5%87%BB%E6%89%B9%E9%98%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的按钮
    var button = document.createElement("button");
    button.innerHTML = "批阅全部";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener("click", function() {
        // 获取所有的批阅按钮
        var markButtons = document.querySelectorAll("a.cz_py");
        markButtons.forEach(function(btn) {
            btn.click();
        });
    });
})();