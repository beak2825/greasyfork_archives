// ==UserScript==
// @name         屏蔽CSDN广告和登录弹窗
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动屏蔽CSDN工具栏广告横幅和登录弹窗
// @author       louis
// @match        https://*.csdn.net/*
// @match        http://*.csdn.net/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544260/%E5%B1%8F%E8%94%BDCSDN%E5%B9%BF%E5%91%8A%E5%92%8C%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/544260/%E5%B1%8F%E8%94%BDCSDN%E5%B9%BF%E5%91%8A%E5%92%8C%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加CSS样式来隐藏广告和弹窗
    const style = document.createElement('style');
    style.textContent = `
        /* 屏蔽工具栏广告 */
        .toolbar-advert,
        .toolbar-advert-default,
        div[class*="toolbar-advert"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }
        
        /* 屏蔽登录弹窗 */
        #passportbox,
        .passport-login-box,
        div[id="passportbox"],
        iframe[name="passport_iframe"],
        iframe[src*="passport.csdn.net"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }
        
        /* 移除弹窗时可能产生的遮罩层 */
        .modal-backdrop,
        .modal-overlay,
        .passport-overlay,
        div[style*="position: fixed"][style*="z-index"] {
            display: none !important;
        }
        
        /* 恢复页面滚动（防止弹窗锁定滚动） */
        body {
            overflow: auto !important;
        }
    `;

    // 尽早插入样式
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            document.head.appendChild(style);
        });
    }

    // 函数：移除广告和弹窗元素
    function removeAdsAndPopups() {
        // 工具栏广告选择器
        const adSelectors = [
            '.toolbar-advert',
            '.toolbar-advert-default',
            'div[class*="toolbar-advert"]',
            'a[href*="kunyu.csdn.net"]',
            'div[style*="background-image"][style*="csdnimg.cn"]'
        ];

        // 登录弹窗选择器
        const popupSelectors = [
            '#passportbox',
            '.passport-login-box',
            'div[id="passportbox"]',
            'iframe[name="passport_iframe"]',
            'iframe[src*="passport.csdn.net"]'
        ];

        // 移除所有匹配的元素
        [...adSelectors, ...popupSelectors].forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });

        // 查找包含特定链接的广告元素
        const links = document.querySelectorAll('a[href*="kunyu.csdn.net"]');
        links.forEach(link => {
            const parent = link.closest('.toolbar-advert') || link.parentElement;
            if (parent) {
                parent.remove();
            }
        });

        // 移除可能的遮罩层
        const overlays = document.querySelectorAll('.modal-backdrop, .modal-overlay, .passport-overlay');
        overlays.forEach(overlay => overlay.remove());

        // 恢复页面滚动
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdsAndPopups);
    } else {
        removeAdsAndPopups();
    }

    // 监听DOM变化，处理动态加载的广告和弹窗
    const observer = new MutationObserver(function (mutations) {
        let shouldCheck = false;
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        if (node.className && (
                                node.className.includes('toolbar-advert') ||
                                node.className.includes('passport-login') ||
                                node.id === 'passportbox')) {
                            shouldCheck = true;
                            break;
                        }
                    }
                }
            }
        });

        if (shouldCheck) {
            setTimeout(removeAdsAndPopups, 100);
        }
    });

    // 开始监听
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定期检查（防止遗漏）
    setInterval(removeAdsAndPopups, 2000);

    // 阻止可能的弹窗事件
    document.addEventListener('click', function (e) {
        // 如果点击触发了登录弹窗，延迟移除
        setTimeout(removeAdsAndPopups, 500);
    });

})();
