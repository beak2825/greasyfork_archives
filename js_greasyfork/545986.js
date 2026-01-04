// ==UserScript==
// @name         斗鱼自动Beta路径注入（优化版）
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.1
// @description  自动在斗鱼专题页URL中添加/beta路径，并智能隐藏按钮
// @author       YourName
// @match        https://www.douyu.com/topic/*
// @match        https://www.douyu.com/beta/topic/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545986/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8Beta%E8%B7%AF%E5%BE%84%E6%B3%A8%E5%85%A5%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545986/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8Beta%E8%B7%AF%E5%BE%84%E6%B3%A8%E5%85%A5%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心功能：检测并重定向到beta路径
    const redirectToBeta = () => {
        const currentUrl = window.location.href;
        const isBetaUrl = currentUrl.includes('/beta/'); // 关键判断[3](@ref)

        // 非beta路径时执行重定向
        if (!isBetaUrl) {
            const betaUrl = currentUrl.replace(
                'https://www.douyu.com/topic/',
                'https://www.douyu.com/beta/topic/'
            );
            console.log('[油猴脚本] 重定向到Beta路径:', betaUrl);
            window.location.href = betaUrl;
            return true; // 表示已触发重定向
        }
        return false; // 已是beta路径
    };

    // 动态创建/隐藏按钮（根据URL状态）
    const toggleControlButton = () => {
        const isBetaUrl = window.location.href.includes('/beta/');
        const existingBtn = document.getElementById('force-redirect-btn');

        // 已存在按钮且当前是beta路径 → 移除按钮
        if (existingBtn && isBetaUrl) {
            existingBtn.remove();
            return;
        }

        // 非beta路径且无按钮 → 创建按钮
        if (!existingBtn && !isBetaUrl) {
            const btn = document.createElement('button');
            btn.id = 'force-redirect-btn';
            btn.innerHTML = '强制跳转Beta';
            btn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 10px;
                background: #ff6b00;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            btn.addEventListener('click', redirectToBeta);
            document.body.appendChild(btn);
        }
    };

    // 主逻辑流程
    const initScript = () => {
        const isRedirected = redirectToBeta(); // 尝试重定向

        // 若未触发重定向（即已在beta页），则无需添加按钮
        if (!isRedirected) return;

        // 页面加载后动态管理按钮[6](@ref)
        window.addEventListener('load', () => {
            toggleControlButton();
            // 监听URL变化（应对单页应用）
            const observer = new MutationObserver(toggleControlButton);
            observer.observe(document, { childList: true, subtree: true });
        });
    };

    // 安全启动
    try {
        initScript();
    } catch (e) {
        console.error('[油猴脚本] 初始化失败:', e);
    }
})();