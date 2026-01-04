// ==UserScript==
// @name         DeepSeek Safe React Fill
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  安全填充React受控组件（防点击清空）
// @author       You
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530991/DeepSeek%20Safe%20React%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/530991/DeepSeek%20Safe%20React%20Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // React合成事件生成器
    function createReactInputEvent(value) {
        return {
            target: { value },
            currentTarget: { value },
            nativeEvent: { isTrusted: true },
            persist: () => {}
        };
    }

    // 安全填充方法
    function safeReactFill() {
        const hash = window.location.hash;
        if (!hash.startsWith('#ds=')) return;

        const input = document.getElementById('chat-input');
        if (!input || input.value) return;

        const text = decodeURIComponent(hash.slice(4));

        // 步骤1：更新DOM值
        input.value = text;

        // 步骤2：触发React事件系统
        const reactHandlers = Object.keys(input).find(k =>
            k.startsWith('__reactProps') || k.startsWith('__reactEventHandlers')
        );

        if (reactHandlers && input[reactHandlers].onChange) {
            // 正确方式：通过React的onChange处理器
            input[reactHandlers].onChange(
                createReactInputEvent(text)
            );
        } else {
            // 备用方案：完整事件流
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 步骤3：同步内部值跟踪器
        if (input._valueTracker) {
            input._valueTracker.setValue(text);
        }
    }

    // 智能初始化
    function init() {
        // 立即尝试填充
        safeReactFill();

        // 动态加载处理
        if (!document.getElementById('chat-input')) {
            new MutationObserver((_, observer) => {
                const input = document.getElementById('chat-input');
                if (input) {
                    safeReactFill();
                    observer.disconnect();
                }
            }).observe(document, {
                subtree: true,
                childList: true
            });
        }
    }

    // 执行策略
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
