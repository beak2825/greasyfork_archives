// ==UserScript==
// @name         洛谷报名按钮解锁器 (Luogu Contest Button Unlocker)
// @namespace    https://github.com/your-username/luogu-unlocker
// @version      1.1.1
// @description  当洛谷比赛报名按钮出现时，会有 5s 倒计时，很烦人，本脚本可立即解除其禁用状态，方便报名。
// @author       Gemini
// @match        https://www.luogu.com.cn/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547567/%E6%B4%9B%E8%B0%B7%E6%8A%A5%E5%90%8D%E6%8C%89%E9%92%AE%E8%A7%A3%E9%94%81%E5%99%A8%20%28Luogu%20Contest%20Button%20Unlocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547567/%E6%B4%9B%E8%B0%B7%E6%8A%A5%E5%90%8D%E6%8C%89%E9%92%AE%E8%A7%A3%E9%94%81%E5%99%A8%20%28Luogu%20Contest%20Button%20Unlocker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // 用于定位目标按钮的 CSS 选择器
        buttonSelector: 'button.swal2-confirm.swal2-styled[disabled]',
        // 用于识别倒计时文本的正则表达式
        textRegex: /报名 \(\d+s\)/,
        // 解锁后按钮应显示的最终文本
        unlockedText: '报名',
        // 用于标记已处理按钮的自定义属性，防止重复操作
        processedMark: 'data-luogu-unlocker-processed'
    };

    /**
     * 启用按钮并使用 MutationObserver "锁定" 其状态，防止被其他脚本修改。
     * @param {HTMLElement} button - 需要锁定的按钮元素。
     */
    const protectButton = (button) => {
        console.log('[洛谷解锁器] 检测到目标按钮，开始处理...');

        // 1. 立即修改按钮状态
        button.disabled = false;
        button.innerText = config.unlockedText;

        // 2. 创建一个 "守护" Observer 来防止按钮被修改
        const protector = new MutationObserver(() => {
            // 当检测到按钮被修改时，立即将其恢复
            // 先断开观察，避免我们自己的修改触发无限循环
            protector.disconnect();

            button.disabled = false;
            button.innerText = config.unlockedText;

            // 恢复原状后，重新开始观察
            observe();
        });

        const observe = () => {
            protector.observe(button, {
                attributes: true,       // 监视属性变化 (如 'disabled')
                childList: true,        // 监视子节点变化 (用于文本内容)
                characterData: true,    // 监视文本内容变化
                subtree: true
            });
        };

        observe();
        console.log('[洛谷解锁器] 按钮保护已启动。');

        // 3. (可选但推荐) 清理工作：当按钮从页面上消失时（例如弹窗关闭），停止观察以节省资源
        const parent = button.parentNode;
        if (parent) {
            const removalObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.removedNodes.forEach(removedNode => {
                        if (removedNode === button) {
                            protector.disconnect();
                            removalObserver.disconnect();
                            console.log('[洛谷解锁器] 按钮已移除，保护程序停止。');
                        }
                    });
                });
            });
            removalObserver.observe(parent, { childList: true });
        }
    };

    /**
     * 创建一个主 Observer，监视整个页面的 DOM 变化，以发现目标按钮的出现。
     */
    const bodyObserver = new MutationObserver(() => {
        const button = document.querySelector(config.buttonSelector);

        // 检查按钮是否存在、是否包含倒计时文本、以及是否尚未被我们处理过
        if (button && config.textRegex.test(button.innerText) && !button.hasAttribute(config.processedMark)) {
            // 给按钮打上标记，防止重复执行
            button.setAttribute(config.processedMark, 'true');
            protectButton(button);
        }
    });

    // 启动主 Observer，开始监视整个文档
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[洛谷解锁器] 脚本已激活，正在等待报名按钮出现...');
})();