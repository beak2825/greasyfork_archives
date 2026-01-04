// ==UserScript==
// @name         B站视频 Markdown 链接复制（Alt+C + 点击标题）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  按 Alt+C 或点击标题复制 Markdown 链接格式的视频地址和标题，自动弹出提示信息。
// @author       diudiu
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537743/B%E7%AB%99%E8%A7%86%E9%A2%91%20Markdown%20%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%EF%BC%88Alt%2BC%20%2B%20%E7%82%B9%E5%87%BB%E6%A0%87%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537743/B%E7%AB%99%E8%A7%86%E9%A2%91%20Markdown%20%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%EF%BC%88Alt%2BC%20%2B%20%E7%82%B9%E5%87%BB%E6%A0%87%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getMarkdownLink() {
        const titleElement = document.querySelector("#viewbox_report > div.video-info-title > div > h1");
        if (!titleElement) {
            alert("未找到标题元素！");
            return null;
        }
        const title = titleElement.innerText.trim();
        const url = window.location.href.split('?')[0]; // 去除参数部分
        return `[${title}](${url})`;
    }

    function showCopiedMessage(msg) {
        const div = document.createElement("div");
        div.textContent = msg;
        div.style.position = "fixed";
        div.style.top = "20px";
        div.style.right = "20px";
        div.style.padding = "10px 15px";
        div.style.background = "#00AEEC";
        div.style.color = "white";
        div.style.zIndex = 99999;
        div.style.borderRadius = "8px";
        div.style.fontSize = "16px";
        div.style.boxShadow = "0 0 8px rgba(0,0,0,0.3)";
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2000);
    }

    function copyMarkdown() {
        const md = getMarkdownLink();
        if (md) {
            navigator.clipboard.writeText(md).then(() => {
                showCopiedMessage("✅ 已复制 Markdown 链接");
            }).catch(err => {
                showCopiedMessage("❌ 复制失败：" + err);
            });
        }
    }

    // 快捷键监听：Alt + C
    document.addEventListener("keydown", function (e) {
        if (e.altKey && e.code === "KeyC") {
            copyMarkdown();
        }
    });

    // 添加点击标题复制功能
    function addClickListenerToTitle() {
        const titleElement = document.querySelector("#viewbox_report > div.video-info-title > div > h1");
        if (titleElement) {
            titleElement.style.cursor = "pointer";
            titleElement.title = "点击复制 Markdown 链接";
            titleElement.addEventListener("click", copyMarkdown);
        }
    }

    // 页面加载完成后添加监听
    window.addEventListener("load", () => {
        setTimeout(addClickListenerToTitle, 1000); // 延迟一点以确保元素加载
    });
})();
