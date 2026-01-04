// ==UserScript==
// @name         交换 Ctrl+Enter 和 Enter
// @name:en      Swap Ctrl+Enter and Enter
// @version      1.1
// @description  交换输入的Ctrl+Enter和Enter，对于某些使用回车发送的网站很有用。默认配置DeepSeek、飞书。可以自己增加额外的网站。
// @description:en  Swapping the input of Ctrl+Enter and Enter is particularly useful for websites that use the Enter key to send messages.
// @author       DeepSeek / SnDream
// @match        https://chat.deepseek.com/*
// @match        https://*.feishu.cn/next/messenger*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/466574
// @downloadURL https://update.greasyfork.org/scripts/541360/%E4%BA%A4%E6%8D%A2%20Ctrl%2BEnter%20%E5%92%8C%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/541360/%E4%BA%A4%E6%8D%A2%20Ctrl%2BEnter%20%E5%92%8C%20Enter.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let isSimulated = false; // 标记是否在模拟事件中

    function handleEnterKey(e) {
        // 如果是模拟事件则跳过
        if (isSimulated) return;

        // 仅处理Enter键
        if (e.key !== 'Enter') return;

        // 阻止默认行为和事件传播
        e.preventDefault();
        e.stopImmediatePropagation();

        // 设置标记防止递归
        isSimulated = true;

        // 创建模拟事件（反转Ctrl状态）
        const simulatedEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            ctrlKey: !(e.ctrlKey || e.metaKey), // 反转Ctrl状态
            bubbles: true,
            cancelable: true,
            composed: true
        });

        // 分派模拟事件
        e.target.dispatchEvent(simulatedEvent);

        // 重置标记
        isSimulated = false;
    }

    document.addEventListener('keydown', handleEnterKey, true);
})();
