// ==UserScript==
// @name         推特url复制器1.0
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  懒人不想复制图片的时候也复制url，下版本考虑双击图片也直接复制了
// @author       Grok和deepseek喵
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531850/%E6%8E%A8%E7%89%B9url%E5%A4%8D%E5%88%B6%E5%99%A810.user.js
// @updateURL https://update.greasyfork.org/scripts/531850/%E6%8E%A8%E7%89%B9url%E5%A4%8D%E5%88%B6%E5%99%A810.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 智能右键拦截策略
    document.addEventListener('contextmenu', function(e) {
        const img = e.target.closest('img:not([src*="/profile_images"])');
        if (img) {
           // 仅在图片右键时阻止默认菜单
            handleImageCopy(img);
        }
    }, { capture: true });

    // 核心复制逻辑
    async function handleImageCopy(imgElement) {
        try {
            const url = await getOriginalStyleUrl(imgElement);
            await navigator.clipboard.writeText(url);
            showFeedback(`✓ 复制成功！: ${url}`);
        } catch (err) {
            showFeedback(`⚠️ 失败的man！: ${err.message}`, true);
        }
    }

    // 经典模态框检测方法
    const getOriginalStyleUrl = (imgElement) => {
        return new Promise((resolve) => {
            // 优先使用原始模态框检测
            const modalLink = document.querySelector('div[aria-modal="true"] a[href*="/status/"][href*="/photo/"]');
            if (modalLink) {
                return resolve(modalLink.href);
            }

            // 首页备用方案（保留原有智能提取）
            const container = imgElement.closest('article[data-testid="tweet"]');
            const statusLink = container?.querySelector('a[href*="/status/"][aria-label]');
            const tweetId = statusLink?.href.match(/\/status\/(\d+)/)?.[1];
            const username = container?.querySelector('a[href^="/"][role="link"]')?.pathname.split('/')[1];

            if (tweetId && username) {
                resolve(`https://${location.host}/${username}/status/${tweetId}/photo/1`);
            } else {
                resolve(window.location.href);
            }
        });
    };

    // 可视化反馈（优化版）
    const showFeedback = (() => {
        const style = document.createElement('style');
        style.textContent = `
            .url-copy-feedback {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15,20,25,0.95);
                color: rgb(255,255,255);
                padding: 12px 20px;
                border-radius: 8px;
                font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 99999;
                backdrop-filter: blur(4px);
                animation: feedbackSlide 0.3s ease-out, feedbackFade 2.5s forwards;
                white-space: nowrap;
            }

            @keyframes feedbackSlide {
                from { top: -50px; opacity: 0; }
                to { top: 20px; opacity: 1; }
            }

            @keyframes feedbackFade {
                0%, 70% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        return (text, isError = false) => {
            const existing = document.querySelector('.url-copy-feedback');
            if (existing) existing.remove();

            const div = document.createElement('div');
            div.className = 'url-copy-feedback';
            div.style.color = isError ? '#ff6b6b' : '#1da1f2';
            div.textContent = text;

            document.body.appendChild(div);
            setTimeout(() => div.remove(), 2500);
        };
    })();

    console.log('[精准复制器] 已激活');
})();