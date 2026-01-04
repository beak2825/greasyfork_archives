// ==UserScript==
// @name         cs论文跳转
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 CVPR Open Access 和 OpenReview PDF 页面添加跳转按钮，跳转至论文介绍页面
// @author       ChrisRaynor with ChatGPT4o
// @license      MIT
// @match        https://openaccess.thecvf.com/content/*/*_paper.pdf
// @match        https://openreview.net/pdf?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527493/cs%E8%AE%BA%E6%96%87%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527493/cs%E8%AE%BA%E6%96%87%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL
    let currentURL = window.location.href;
    let htmlURL = "";

    if (currentURL.includes("openaccess.thecvf.com")) {
        // CVPR Open Access 处理方式
        htmlURL = currentURL.replace("/papers/", "/html/").replace("_paper.pdf", "_paper.html");
    } else if (currentURL.includes("openreview.net")) {
        // OpenReview 处理方式
        let paperId = currentURL.split("=").pop();
        htmlURL = `https://openreview.net/forum?id=${paperId}`;
    }

    if (htmlURL) {
        // 创建悬浮按钮
        let button = document.createElement("button");
        button.innerText = "跳转到介绍页面";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "1000";
        button.style.backgroundColor = "#f39c12";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "12px 16px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.borderRadius = "10px";
        button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        button.style.opacity = "0.9";
        button.style.transition = "opacity 0.3s";

        // 鼠标悬停时增强可见度
        button.addEventListener("mouseover", function() {
            button.style.opacity = "1";
        });
        button.addEventListener("mouseout", function() {
            button.style.opacity = "0.9";
        });

        // 按钮点击事件
        button.addEventListener("click", function() {
            window.location.href = htmlURL;
        });

        // 将按钮添加到页面
        document.body.appendChild(button);
    }
})();
