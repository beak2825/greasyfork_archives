// ==UserScript==
// @name         Kimi / DeepSeek / ChatGPT 极速自动删除历史记录
// @namespace    Violentmonkey Scripts
// @match        https://kimi.moonshot.cn/*
// @match        https://www.kimi.com/*
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @license      MIT
// @grant        none
// @version      1.11
// @author       -
// @description  优化后的极速删除版本，支持Kimi/DeepSeek/ChatGPT，第一次手动点「删除」后自动确认；按 Option/Alt 键可直接删除第一条记录
// @downloadURL https://update.greasyfork.org/scripts/501811/Kimi%20%20DeepSeek%20%20ChatGPT%20%E6%9E%81%E9%80%9F%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501811/Kimi%20%20DeepSeek%20%20ChatGPT%20%E6%9E%81%E9%80%9F%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 1. 兼容 Option/Alt 键 ---------- */
    window.addEventListener('load', () => {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {               // Option 键在 Mac 上 = e.altKey，Windows 的 Alt 键也是 e.altKey
                e.preventDefault();
                const btn = findDeleteButton();   // 优先找对话框里的
                if (btn) {
                    btn.click();
                } else {
                    // 如果对话框没出现，直接点第一条记录的「删除」
                    const firstDel = findFirstRecordDelete();
                    if (firstDel) firstDel.click();
                }
            }
        });
    });

    /* ---------- 2. 极速自动连点逻辑 ---------- */
    let waitingForDelete = false;
    const fastObserver = new MutationObserver((mutations) => {
        if (!waitingForDelete) return;

        // 只检查新增的节点
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // 只处理元素节点
                    const btn = findDeleteButtonInNode(node);
                    if (btn) {
                        waitingForDelete = false;
                        btn.click();
                        return; // 找到按钮后立即返回
                    }
                }
            }
        }
    });
    fastObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    document.addEventListener('click', (e) => {
        const isTrigger =
              e.target.matches('button.kimi-button.danger, .ds-button--error') ||
              e.target.closest('[class*="more"], [class*="dropdown"], [class*="menu"]') ||
              e.target.closest('.opt-name, .ds-dropdown-menu-option__label') || // 直接点击删除文字也能触发
              e.target.closest('[data-testid="delete-chat-menu-item"]'); // ChatGPT的删除菜单项

        if (isTrigger && !waitingForDelete) {
            waitingForDelete = true;
            // 立即尝试查找一次，避免等待观察者触发
            setTimeout(() => {
                const btn = findDeleteButton();
                if (btn) {
                    waitingForDelete = false;
                    btn.click();
                }
            }, 50); // 短延时确保DOM更新
        }
    }, true);

    /* ---------- 优化后的工具函数 ---------- */
    function findDeleteButtonInNode(node) {
        // 1) Kimi 对话框里的「删除」按钮
        let btn = node.querySelector('button.kimi-button.danger');
        if (!btn) {
            btn = [...node.querySelectorAll('button')]
                .find(b => b.textContent.trim() === '删除' && b.offsetParent !== null);
        }

        // 2) DeepSeek 对话框里的「删除」按钮
        if (!btn) {
            btn = node.querySelector('div[role="button"].ds-button--error');
        }

        // 3) ChatGPT 对话框里的「删除」按钮
        if (!btn) {
            btn = [...node.querySelectorAll('div.flex.items-center.justify-center')]
                .find(el => el.textContent.trim() === '删除' && el.offsetParent !== null);
        }

        return btn || null;
    }

    function findDeleteButton() {
        return findDeleteButtonInNode(document);
    }

    // 优化后的第一条记录删除查找
    function findFirstRecordDelete() {
        // Kimi 的新版界面
        const kimiBtn = [...document.querySelectorAll('.opt-name')]
            .find(span => span.textContent.trim() === '删除' && span.offsetParent !== null);

        // DeepSeek 的删除按钮
        const deepSeekBtn = [...document.querySelectorAll('.ds-dropdown-menu-option__label')]
            .find(span => span.textContent.trim() === '删除' && span.offsetParent !== null);

        // ChatGPT 的删除按钮
        const chatGPTBtn = [...document.querySelectorAll('[data-testid="delete-chat-menu-item"]')]
            .find(el => el.textContent.includes('删除') && el.offsetParent !== null);

        return kimiBtn || deepSeekBtn || chatGPTBtn;
    }
})();