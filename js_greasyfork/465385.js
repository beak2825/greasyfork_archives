// ==UserScript==
// @name                知乎免登录
// @namespace           https://robyn.net.cn/
// @description         去除知乎登陆弹窗
// @author              Rix
// @run-at              document-start
// @match               http://*.zhihu.com/*
// @match               https://*.zhihu.com/*
// @date                02/05/2023
// @version             0.1.2
// @license             AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/465385/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465385/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 主要关闭函数
    const closeLoginModal = () => {
        // 寻找关闭按钮
        const closeButton = document.querySelector('.Modal-closeButton.Button--plain');

        if (closeButton) {
            // 模拟点击关闭按钮
            closeButton.click();
            console.log('[知乎免登录] 已点击关闭按钮');
            return true;
        }

        // 如果关闭按钮未找到，尝试移除整个弹窗
        const modals = document.querySelectorAll('.Modal-wrapper, .signFlowModal');
        if (modals.length) {
            modals.forEach(modal => {
                modal.style.display = 'none';
                modal.remove();
            });
            console.log('[知乎免登录] 已直接移除弹窗');
            return true;
        }

        // 尝试移除遮罩层
        const backdrops = document.querySelectorAll('.Modal-backdrop, .GlobalBackDrop');
        if (backdrops.length) {
            backdrops.forEach(el => el.remove());
        }

        return false;
    };

    // 恢复页面滚动
    const restorePageScroll = () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('Modal-open', 'Modal--hidden');
    };

    // 1. 使用MutationObserver监控DOM变化
    const observer = new MutationObserver(() => {
        if (closeLoginModal()) {
            restorePageScroll();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 2. 初始页面加载后立即尝试关闭
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            closeLoginModal();
            restorePageScroll();
        }, 1000);
    });

    // 3. 定时检查机制（确保可靠性）
    setInterval(() => {
        closeLoginModal();
        restorePageScroll();
    }, 3000);

    // 4. 阻止弹窗重新出现
    document.addEventListener('click', e => {
        const target = e.target;
        // 拦截可能触发登录弹窗的元素
        if (target.closest('.Modal-closeButton') ||
            target.closest('.signFlowModal') ||
            target.closest('.Modal-backdrop')) {
            e.stopImmediatePropagation();
        }
    });
})();
