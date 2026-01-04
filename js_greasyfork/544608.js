// ==UserScript==
// @name         B站展开所有评论（Ctrl + Alt + E）
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  按 Ctrl+Alt+E 展开所有B站评论（运行中持续提示）
// @author       You
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544608/B%E7%AB%99%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA%EF%BC%88Ctrl%20%2B%20Alt%20%2B%20E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544608/B%E7%AB%99%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA%EF%BC%88Ctrl%20%2B%20Alt%20%2B%20E%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    //持久 Toast（返回DOM元素）
    function showToastPersistent(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "0px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "rgba(0, 0, 0, 0.75)";
        toast.style.color = "#fff";
        toast.style.padding = "10px 16px";
        toast.style.borderRadius = "8px";
        toast.style.fontSize = "18px";
        toast.style.zIndex = 9999;
        toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = "1");

        return toast;
    }

    // ✅ 替换内容 & 自动消失
    function replaceToast(toastEl, newMsg, delay = 3000) {
        toastEl.textContent = newMsg;
        setTimeout(() => {
            toastEl.style.opacity = "0";
            setTimeout(() => toastEl.remove(), 300);
        }, delay);
    }

    function getLoadedCommentCount() {
        try {
            const shadowHost = document.querySelector("#commentapp > bili-comments");
            if (!shadowHost || !shadowHost.shadowRoot) return 0;
            const shadowRoot = shadowHost.shadowRoot;
            const items = shadowRoot.querySelectorAll("#feed > bili-comment-thread-renderer");
            return items.length;
        } catch (e) {
            console.warn('获取评论数失败', e);
            return 0;
        }
    }

    async function scrollAndWaitForMoreComments(lastCount) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await sleep(1200);
        const newCount = getLoadedCommentCount();
        console.log(`滚动后评论数：${newCount}，上次：${lastCount}`);
        return newCount > lastCount ? newCount : lastCount;
    }

    async function loadAllComments(maxScrolls = 30) {
        for (let i = 0; i < 20; i++) {
            if (document.querySelector("#commentapp > bili-comments")) break;
            await sleep(500);
        }

        let lastCount = 0;
        for (let i = 0; i < maxScrolls; i++) {
            const newCount = await scrollAndWaitForMoreComments(lastCount);
            if (newCount === lastCount) {
                console.log('评论数未增加，可能加载完毕，停止滚动');
                break;
            }
            lastCount = newCount;
        }
        console.log(`最终加载评论数: ${lastCount}`);
    }

    async function expandAllClickToView() {
        const mainHost = document.querySelector("#commentapp > bili-comments");
        if (!mainHost || !mainHost.shadowRoot) {
            console.warn('找不到评论组件');
            return;
        }
        const mainRoot = mainHost.shadowRoot;
        const threads = mainRoot.querySelectorAll("#feed > bili-comment-thread-renderer");

        let count = 0;

        for (const thread of threads) {
            const threadRoot = thread.shadowRoot;
            if (!threadRoot) continue;

            const replies = threadRoot.querySelector("#replies > bili-comment-replies-renderer");
            if (!replies || !replies.shadowRoot) continue;

            const viewMore = replies.shadowRoot.querySelector("#view-more > bili-text-button");
            if (viewMore) {
                try {
                    viewMore.click();
                    count++;
                    await sleep(300);
                } catch (e) {
                    console.warn("点击失败", e);
                }
            }
        }

        console.log(`展开“点击查看”按钮数量：${count}`);
    }

    async function main() {
        const toast = showToastPersistent("正在展开评论...");
        await loadAllComments();
        await expandAllClickToView();
        replaceToast(toast, "所有评论已展开", 3000);
    }

    // 快捷键监听：Ctrl + Alt + E
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'e') {
            main();
        }
    });
})();
