// ==UserScript==
// @name         FSM 图片链接提取
// @namespace    https://fsm.name/
// @version      1.1
// @description  提取 FSM 页面上的所有图片链接并转换为 BBCode 格式（从第四张开始）
// @author       diaobaole
// @match        https://fsm.name/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531660/FSM%20%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/531660/FSM%20%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractImageLinks() {
        let images = document.querySelectorAll('img'); // 获取所有图片
        let links = [];

        images.forEach((img, index) => {
            if (index >= 3 && img.src) { // 从第四张图片开始
                links.push(`[img]${img.src}[/img]`);
            }
        });

        if (links.length === 0) {
            alert("未找到任何符合条件的图片链接。");
            return;
        }

        let bbcode = links.join('\n');
        GM_setClipboard(bbcode);
        alert("BBCode 链接已复制到剪贴板！\n\n" + bbcode);
    }

    // 创建一个按钮
    let btn = document.createElement("button");
    btn.textContent = "提取图片 BBCode";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.padding = "10px";
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "9999";
    btn.onclick = extractImageLinks;

    document.body.appendChild(btn);
})();
