// ==UserScript==
// @name         axiom 推文翻译
// @namespace    https://x.com/pollowinworld
// @version      2.3
// @author       https://x.com/pollowinworld
// @description  自动翻译 axiom.trade 全站推文内容、用户简介，含主贴+预览+引用推文
// @match        https://axiom.trade/pulse*
// @match        https://axiom.trade/meme/*
// @match        https://axiom.trade/discover*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541844/axiom%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/541844/axiom%20%E6%8E%A8%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
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

    // ✅ 1. 翻译新版推文预览弹窗（优化防重复机制）
    async function processPreviewPopup(popupElement) {
        // 检查弹窗是否已经被处理过
        if (popupElement.getAttribute('data-popup-processed')) return;

        // 延迟处理，等待内容完全加载
        const processWithRetry = async (retryCount = 0) => {
            const maxRetries = 5; // 减少重试次数
            const delay = 150; // 增加延迟时间

            // 查找主推文文本 (text-[18px])
            const mainTweetSpans = popupElement.querySelectorAll('span.text-\\[18px\\].text-wrap.break-words.break-all.text-white.w-full:not([data-translated])');
            // 查找引用推文文本 (text-[16px])
            const quoteTweetSpans = popupElement.querySelectorAll('span.text-\\[16px\\].text-wrap.break-words.break-all.text-white.w-full:not([data-translated])');

            const totalSpans = mainTweetSpans.length + quoteTweetSpans.length;

            // 如果找到了未翻译的文本元素，开始翻译
            if (totalSpans > 0) {
                // 标记弹窗为已处理
                popupElement.setAttribute('data-popup-processed', 'true');

                for (const span of mainTweetSpans) {
                    await processTextSpan(span, '18px');
                }
                for (const span of quoteTweetSpans) {
                    await processTextSpan(span, '16px');
                }
                return true;
            }

            // 如果没找到且还有重试次数，则继续重试
            if (retryCount < maxRetries) {
                setTimeout(() => processWithRetry(retryCount + 1), delay);
                return false;
            }

            // 即使没找到文本也标记为已处理，避免无限重试
            popupElement.setAttribute('data-popup-processed', 'true');
            return false;
        };

        // 立即执行一次，然后设置重试
        await processWithRetry();
    }

    // 处理文本span的翻译（增强防重复机制）
    async function processTextSpan(span, fontSize) {
        if (span.getAttribute('data-translated') || processedSet.has(span)) return;

        const originalText = span.innerText.trim();
        if (!originalText || isChinese(originalText)) return;

        // 检查是否已经有翻译元素
        const nextSibling = span.nextSibling;
        if (nextSibling && nextSibling.nodeType === 1 &&
            nextSibling.textContent && nextSibling.textContent.includes('🈯️')) {
            span.setAttribute('data-translated', 'true');
            processedSet.add(span);
            return;
        }

        // 标记为正在处理，防止重复翻译
        span.setAttribute('data-translated', 'true');
        processedSet.add(span);

        const translated = await translateToChinese(originalText);

        const translatedSpan = document.createElement("div");
        translatedSpan.style.color = "rgb(154, 167, 176)";
        translatedSpan.style.fontSize = "13px";
        translatedSpan.style.marginTop = "6px";
        translatedSpan.style.wordBreak = "break-word";
        translatedSpan.style.overflowWrap = "anywhere";
        translatedSpan.textContent = "🈯️ " + translated;
        translatedSpan.setAttribute('data-translation', 'true');

        span.parentElement.insertBefore(translatedSpan, span.nextSibling);
    }

    // ✅ 2. 翻译旧版推文预览区域（保持向下兼容）
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

    // ✅ 3. 翻译主贴/引用推文正文（优化推文监控支持）
    async function processInlineTweet(p) {
        if (processedSet.has(p) || p.getAttribute('data-translated')) return;

        const text = p.innerText.trim();
        if (!text || isChinese(text)) return;

        // 检查是否已经有翻译元素
        if (p.querySelector('.translated-inline') || p.nextElementSibling?.classList?.contains('translated-inline')) {
            processedSet.add(p);
            p.setAttribute('data-translated', 'true');
            return;
        }

        // 标记为正在处理
        processedSet.add(p);
        p.setAttribute('data-translated', 'true');

        const translated = await translateToChinese(text);
        const span = document.createElement('span');
        span.className = 'translated-inline';
        span.innerText = `🈯️ ${translated}`;
        span.style.display = 'block';
        span.style.color = 'rgb(154, 167, 176)';
        span.style.fontSize = '13px';
        span.style.marginTop = '3px';

        p.insertAdjacentElement('afterend', span);
    }

    // ✅ 新增：专门处理推文监控界面
    async function processTwitterAlert(alertElement) {
        // 查找主推文文本（带 whitespace-pre-wrap 的）
        const mainTweetPs = alertElement.querySelectorAll('p.text-textSecondary.mt-1.whitespace-pre-wrap:not([data-translated])');
        for (const p of mainTweetPs) {
            await processInlineTweet(p);
        }

        // 查找引用推文文本（在引用框内的）
        const quoteTweetPs = alertElement.querySelectorAll('div.border.border-secondaryStroke p.text-textSecondary.mt-1:not([data-translated])');
        for (const p of quoteTweetPs) {
            await processInlineTweet(p);
        }
    }

    // ✅ 4. 翻译用户简介
    async function processUserBio(container) {
        const bioP = container.querySelector("p.break-words");
        if (!bioP || bioP.getAttribute("data-translated")) return;

        const spans = Array.from(bioP.querySelectorAll("span"));
        const text = spans.map(s => s.textContent).join('').trim();
        if (!text) return;

        const translated = await translateToChinese(text);

        const translatedP = document.createElement("p");
        translatedP.style.color = "rgb(154, 167, 176)";
        translatedP.style.fontSize = "13px";
        translatedP.style.marginTop = "4px";
        translatedP.textContent = "🈯️ " + translated;

        bioP.parentElement.appendChild(translatedP);
        bioP.setAttribute("data-translated", "true");

        const wrapper = bioP.closest("div[style], div.relative");
        if (wrapper) {
            wrapper.style.maxHeight = "none";
            wrapper.style.overflow = "visible";
            const gradient = wrapper.querySelector("div[class*='bg-gradient-to-b']");
            if (gradient) gradient.style.display = "none";
        }
    }

    // ✅ 统一 MutationObserver（添加推文监控支持）
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1 || !node.querySelector) continue;

                // 1. 新版推文预览弹窗 - 单次触发
                if (node.classList && node.classList.contains('fixed') && node.classList.contains('z-[9999]')) {
                    setTimeout(() => processPreviewPopup(node), 100);
                }

                // 查找新版推文预览弹窗（如果是在子节点中）
                const popups = node.querySelectorAll('div.fixed.z-\\[9999\\].pointer-events-auto');
                popups.forEach(popup => {
                    setTimeout(() => processPreviewPopup(popup), 100);
                });

                // 2. 推文监控界面
                if (node.classList && (node.classList.contains('cursor-pointer') || node.querySelector('p.text-textSecondary.mt-1'))) {
                    processTwitterAlert(node);
                }

                // 查找推文监控元素
                const alertElements = node.querySelectorAll('div[role="button"].cursor-pointer');
                alertElements.forEach(processTwitterAlert);

                // 3. 旧版推文预览区（保持兼容）
                node.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);

                // 4. 传统主文推文、引用推文（非监控界面）
                const traditionalTweets = node.querySelectorAll("p.text-textSecondary.mt-1:not(.whitespace-pre-wrap)");
                traditionalTweets.forEach(p => {
                    // 确保不是在推文监控界面中
                    if (!p.closest('div[role="button"].cursor-pointer')) {
                        processInlineTweet(p);
                    }
                });

                // 5. 用户卡片 bio
                const bioP = node.querySelector("p.break-words");
                if (bioP) processUserBio(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ✅ 初始扫描（添加推文监控支持）
    function init() {
        // 新版推文预览弹窗
        document.querySelectorAll('div.fixed.z-\\[9999\\].pointer-events-auto').forEach(processPreviewPopup);

        // 推文监控界面
        document.querySelectorAll('div[role="button"].cursor-pointer').forEach(processTwitterAlert);

        // 旧版推文预览（保持兼容）
        document.querySelectorAll("article.tweet-container_article__0ERPK").forEach(processPreviewTweet);

        // 传统主文推文（非监控界面）
        document.querySelectorAll("p.text-textSecondary.mt-1:not(.whitespace-pre-wrap)").forEach(p => {
            if (!p.closest('div[role="button"].cursor-pointer')) {
                processInlineTweet(p);
            }
        });

        // 用户简介
        document.querySelectorAll("p.break-words").forEach(p => {
            const container = p.closest("div");
            if (container) processUserBio(container);
        });
    }

    setTimeout(init, 1000); // 延迟初始加载
})();