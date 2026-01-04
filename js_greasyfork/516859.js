// ==UserScript==
// @name        1069Pornvideodownloader
// @name:en        1069Pornvideodownloader
// @namespace    undefined
// @version      2024-11-11
// @description  1069Pornvideo download
// @author       Untaxed3078
// @match        https://www.javboys.tv/*
// @match        https://www.gaypornhot.com/*
// @match        https://www.netfuck.net/*
// @match        https://www.boyfuck.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javboys.tv
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516859/1069Pornvideodownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516859/1069Pornvideodownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    let button = document.createElement("button");
    button.innerHTML = "下载";
    button.style.position = "fixed";
    button.style.top = "20px";
    button.style.left = "200px";
    button.style.zIndex = "2147483647"; // 设置非常高的 z-index 确保在最上层
    button.style.padding = "10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // 将按钮添加到根元素上
    document.documentElement.appendChild(button);

    // 按钮点击事件
    button.addEventListener("click", function() {
        // 匹配两个路径的 iframe
        let iframes = document.querySelectorAll("#player > p > iframe, #main > div.box-item > div:nth-child(1) > div > div.content.detail.col-xs-12.col-sm-12.col-md-9 > article > div.videohere > p > div:nth-child(1) > iframe");

        if (iframes.length > 0) {
            // 遍历所有匹配的 iframe
            iframes.forEach((iframe) => {
                let srcContent = iframe.getAttribute("src");
                if (srcContent) {
                    window.open("https://9xbuddy.com/process?url=" + srcContent, "_blank");
                } else {
                    console.warn("iframe 中没有找到 src 内容！");
                }
            });
        } else {
            alert("未找到指定路径的 iframe 元素！");
        }
    });
})();

