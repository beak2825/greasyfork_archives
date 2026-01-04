// ==UserScript==
// @name         登登单词辨析辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  一键把当前页面的单词复制到剪贴板
// @author       月亮
// @match        https://det.91ddedu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91ddedu.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472474/%E7%99%BB%E7%99%BB%E5%8D%95%E8%AF%8D%E8%BE%A8%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/472474/%E7%99%BB%E7%99%BB%E5%8D%95%E8%AF%8D%E8%BE%A8%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement("button");
    button.id = "floatingButton";
    button.textContent = "一键复制";

    // 添加按钮样式
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.left = "90%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999"; // 设置按钮在最上层显示

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 绑定按钮点击事件
    button.addEventListener("click", function() {
        var elements = document.getElementsByClassName("font-size-18 text-grey-darken-3 font-weight-bold");
        var textContents = [];
        for (var i = 0; i < elements.length; i++) {
            textContents.push(elements[i].textContent);
        }

        // 创建包含文字内容的字符串
        var message = textContents.join("\n");

        // 使用 Clipboard API 复制到剪贴板
        navigator.clipboard.writeText(message)
            .then(function() {
                alert("已复制以下内容到剪贴板：\n\n" + message);
            })
            .catch(function(error) {
                console.error("复制到剪贴板失败：", error);
            });
    });

})();
