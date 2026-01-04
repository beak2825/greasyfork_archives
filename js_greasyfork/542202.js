// ==UserScript==
// @name         xxyy 推文翻译
// @namespace    https://x.com/pollowinworld
// @version      1.0
// @author       https://x.com/pollowinworld
// @description  自动翻译 xxyy.io 全站推文内容
// @match        https://www.xxyy.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542202/xxyy%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/542202/xxyy%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 使用 Google Translate 接口翻译文本
    async function translateToChinese(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const res = await fetch(url);
            const json = await res.json();
            return json[0].map(item => item[0]).join('');
        } catch (err) {
            console.error("翻译失败：", err);
            return '[翻译失败]';
        }
    }

    function isChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    const processed = new WeakSet();

    // ✅ 翻译推文正文
    async function processTweetArticle(article) {
        if (processed.has(article)) return;

        const p = article.querySelector("p[class*='_root_']");
        if (!p || p.getAttribute('data-translated')) return;

        const text = p.innerText.trim();
        if (!text || isChinese(text)) return;

        const translated = await translateToChinese(text);

        const translatedP = document.createElement("p");
        translatedP.style.color = "rgb(154, 167, 176)";
        translatedP.style.fontSize = "13px";
        translatedP.style.marginTop = "4px";
        translatedP.textContent = "🈯️ " + translated;

        p.parentElement.insertBefore(translatedP, p.nextSibling);
        p.setAttribute("data-translated", "true");
        processed.add(article);
    }

    // ✅ 翻译用户简介（通用处理 .break-words 和 .desc）
    async function processUserDescription(container) {
        const bio = container.querySelector("p.break-words, div.desc");
        if (!bio || bio.getAttribute("data-translated")) return;

        const text = bio.innerText.trim();
        if (!text || isChinese(text)) return;

        const translated = await translateToChinese(text);

        const translatedP = document.createElement("p");
        translatedP.style.color = "rgb(154, 167, 176)";
        translatedP.style.fontSize = "13px";
        translatedP.style.marginTop = "4px";
        translatedP.textContent = "🈯️ " + translated;

        bio.insertAdjacentElement("afterend", translatedP);
        bio.setAttribute("data-translated", "true");

        // 可选：解除截断样式
        const wrapper = bio.closest("div[style], div.relative, div.info");
        if (wrapper) {
            wrapper.style.maxHeight = "none";
            wrapper.style.overflow = "visible";
            const gradient = wrapper.querySelector("div[class*='bg-gradient-to-b']");
            if (gradient) gradient.style.display = "none";
        }
    }

    // ✅ 监听页面内容变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1 || !node.querySelector) continue;

                // 推文
                node.querySelectorAll("article").forEach(processTweetArticle);

                // 简介
                if (node.querySelector("p.break-words, div.desc")) {
                    processUserDescription(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ✅ 初始加载翻译
    function init() {
        document.querySelectorAll("article").forEach(processTweetArticle);

        document.querySelectorAll("p.break-words, div.desc").forEach(el => {
            const container = el.closest("div");
            if (container) processUserDescription(container);
        });
    }

    setTimeout(init, 1000); // 确保初始 DOM 加载完
})();
