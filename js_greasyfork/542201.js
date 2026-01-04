// ==UserScript==
// @name         gmgn 推文翻译
// @namespace    https://x.com/pollowinworld
// @version      1.0
// @author       https://x.com/pollowinworld
// @description  自动翻译 gmgn 全站推文内容
// @match        https://gmgn.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542201/gmgn%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/542201/gmgn%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 非官方 Google Translate API
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

    function applyTranslatedStyle(elem) {
        elem.style.color = "rgb(154, 167, 176)";
        elem.style.fontSize = "13px";
        elem.style.marginTop = "4px";
    }

    // ✅ 翻译推文预览文本
    async function processPreviewTweet(tweetElement) {
        const tweetTextP = tweetElement.querySelector("p.tweet-body_root__ChzUj");
        if (!tweetTextP || tweetTextP.getAttribute('data-translated')) return;

        const originalText = tweetTextP.innerText.trim();
        if (!originalText || isChinese(originalText)) return;

        const translated = await translateToChinese(originalText);

        const translatedP = document.createElement("p");
        applyTranslatedStyle(translatedP);
        translatedP.textContent = "🈯️ " + translated;

        tweetTextP.parentElement.insertBefore(translatedP, tweetTextP.nextSibling);
        tweetTextP.setAttribute('data-translated', 'true');
    }

    // ✅ 翻译 tooltip bio
    async function processUserBio(container) {
        const bioDiv = container.querySelector("div.break-words.whitespace-pre-line");
        if (!bioDiv) return;

        // ✅ 防止重复插入翻译（检查是否已插入）
        const next = bioDiv.nextElementSibling;
        if (next && next.textContent.startsWith("🈯️")) return;

        const text = bioDiv.textContent.trim();
        if (!text || isChinese(text)) return;

        const translated = await translateToChinese(text);

        const translatedDiv = document.createElement("div");
        applyTranslatedStyle(translatedDiv);
        translatedDiv.textContent = "🈯️ " + translated;

        bioDiv.insertAdjacentElement("afterend", translatedDiv);

        const wrapper = bioDiv.closest("div[style], div.relative");
        if (wrapper) {
            wrapper.style.maxHeight = "none";
            wrapper.style.overflow = "visible";
            const gradient = wrapper.querySelector("div[class*='bg-gradient-to-b']");
            if (gradient) gradient.style.display = "none";
        }
    }

    // ✅ Mutation Observer 监听新 DOM
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1 || !node.querySelector) continue;

                node.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);

                const bioDiv = node.querySelector("div.break-words.whitespace-pre-line");
                if (bioDiv) processUserBio(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ✅ 初始加载翻译
    function init() {
        document.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);
        document.querySelectorAll("div.break-words.whitespace-pre-line").forEach(div => {
            const container = div.closest("div");
            if (container) processUserBio(container);
        });
    }

    setTimeout(init, 1000);
})();
