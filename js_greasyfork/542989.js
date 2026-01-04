// ==UserScript==
// @name         axiom 推文翻译
// @namespace    https://x.com/Crawford886
// @version      2.3
// @author       https://x.com/Crawford886
// @description  自动翻译 axiom.trade 全站推文内容、用户简介，含主贴+预览+引用推文
// @match        https://axiom.trade/pulse*
// @match        https://axiom.trade/meme/*
// @match        https://axiom.trade/discover*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542989/axiom%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/542989/axiom%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ Google Translate 非官方接口
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

    const processedSet = new WeakSet(); // 避免重复翻译的容器

    // ✅ 1. 翻译预览推文区域（首页、discover、meme）
    async function processPreviewTweet(tweetElement) {
        const tweetTextP = tweetElement.querySelector("p.tweet-body_root__ChzUj");
        if (!tweetTextP || tweetTextP.getAttribute('data-translated')) return;

        const originalText = tweetTextP.innerText.trim();
        if (!originalText) return;

        const translated = await translateToChinese(originalText);

        const translatedP = document.createElement("p");
        translatedP.style.color = "rgb(154, 167, 176)";
        translatedP.style.fontSize = "13px";
        translatedP.style.marginTop = "4px";
        translatedP.textContent = "🈯️ " + translated;

        tweetTextP.parentElement.insertBefore(translatedP, tweetTextP.nextSibling);
        tweetTextP.setAttribute('data-translated', 'true');
    }

    // ✅ 2. 翻译主贴/引用推文正文
    async function processInlineTweet(p) {
        if (processedSet.has(p)) return;
        const text = p.innerText.trim();
        if (!text || isChinese(text)) return;
        if (p.querySelector('.translated-inline')) return;

        const translated = await translateToChinese(text);
        const span = document.createElement('span');
        span.className = 'translated-inline';
        span.innerText = `🈯️ ${translated}`;
        span.style.display = 'block';
        span.style.color = 'rgb(154, 167, 176)';
        span.style.fontSize = '13px';
        span.style.marginTop = '3px';

        p.insertAdjacentElement('afterend', span);
        processedSet.add(p);
    }

    // ✅ 3. 翻译用户简介（支持 <p> 和 <span> 标签，改进文本提取，保留滚动功能）
    async function processUserBio(container) {
        const bioElement = container.querySelector("p.break-words, span.break-words");
        if (!bioElement || bioElement.getAttribute("data-translated")) return;

        // 使用 innerText 保留换行符，处理多段文本
        const text = bioElement.innerText.trim();
        if (!text) return;

        const translated = await translateToChinese(text);

        const translatedP = document.createElement("p");
        translatedP.style.color = "rgb(154, 167, 176)";
        translatedP.style.fontSize = "13px";
        translatedP.style.marginTop = "4px";
        translatedP.style.whiteSpace = "pre-wrap"; // 保留换行格式
        translatedP.textContent = "🈯️ " + translated;

        // 插入到父容器，确保在滚动区域内
        bioElement.parentElement.appendChild(translatedP);
        bioElement.setAttribute("data-translated", "true");

        // 仅移除渐变遮罩，保留 max-height 和 overflow-y-auto
        const wrapper = bioElement.closest("div[style], div.relative");
        if (wrapper) {
            const gradient = wrapper.querySelector("div[class*='bg-gradient-to-b']");
            if (gradient) gradient.style.display = "none";
        }
    }

    // ✅ 统一 MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1 || !node.querySelector) continue;

                // 1. 推文预览区
                node.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);

                // 2. 主文推文、引用推文
                node.querySelectorAll("p.text-textSecondary.mt-1").forEach(processInlineTweet);

                // 3. 用户卡片 bio
                const bioElement = node.querySelector("p.break-words, span.break-words");
                if (bioElement) processUserBio(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ✅ 初始扫描（避免首次加载未翻译）
    function init() {
        document.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);
        document.querySelectorAll("p.text-textSecondary.mt-1").forEach(processInlineTweet);
        document.querySelectorAll("p.break-words, span.break-words").forEach(element => {
            const container = element.closest("div");
            if (container) processUserBio(container);
        });
    }

    setTimeout(init, 1000); // 延迟初始加载
})();