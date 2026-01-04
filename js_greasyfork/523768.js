// ==UserScript==
// @name         抖音清爽版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除抖音中的特定元素
// @author       Your name
// @match        https://*.douyin.com/*
// @match        https://www.douyin.com/*
// @match        https://douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523768/%E6%8A%96%E9%9F%B3%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523768/%E6%8A%96%E9%9F%B3%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('抖音清理器已启动');

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .niTxyqq5.aRHD2qhc.jDMe3V8N {
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }
        .niTxyqq5.aRHD2qhc.jDMe3V8N:hover {
            opacity: 1 !important;
        }
        /* 直接隐藏商务合作元素 */
        .pop2P7gf.pon8LXvt {
            display: none !important;
        }
        /* 隐藏右下角问号按钮 */
        #douyin-sidebar {
            display: none !important;
        }
        /* 隐藏特定顶部按钮 */
        .dYcWlUlB:has(.jenVD1aU:contains('充钻石')),
        .dYcWlUlB:has(.jenVD1aU:contains('客户端')),
        .dYcWlUlB:has(.jenVD1aU:contains('快捷访问')),
        .dYcWlUlB:has(.jenVD1aU:contains('壁纸')),
        /* 额外的选择器用于快捷访问按钮 */
        .cbBVPXaz:has(.quick-access-nav-icon),
        div[data-e2e="something-button"]:has(.jenVD1aU:contains('快捷访问')),
        div[data-e2e="something-button"]:has(.jenVD1aU:contains('壁纸')),
        /* 新增壁纸按钮选择器 */
        div:has(.iQdAxsPk:contains('壁纸')),
        .xFzvM6nY:has(.iQdAxsPk:contains('壁纸')),
        div[tabindex="0"]:has(.iQdAxsPk:contains('壁纸')) {
            display: none !important;
        }
        /* 强制侧边栏保持最窄模式 */
        .q06xF672.Jo9KVamQ,
        .q06xF672.Jo9KVamQ.Pm3Zfyal,
        .q06xF672,
        [class*="q06xF672"],
        [class*="Jo9KVamQ"],
        [class*="Pm3Zfyal"] {
            width: 72px !important;
        }
        .q06xF672.Jo9KVamQ.Pm3Zfyal {
            width: 72px !important;
        }
        /* 隐藏侧边栏文字，保持图标 */
        .q06xF672.Jo9KVamQ .text_name {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 创建一个观察器来处理动态加载的内容
    const observer = new MutationObserver(() => {
        // 处理原有的目标元素
        const targetElement = document.querySelector('.W6LFhPEq');
        if (targetElement) {
            console.log('找到目标元素:', targetElement);
            const parentElement = targetElement.parentElement;
            if (parentElement) {
                const siblings = Array.from(parentElement.children);
                const targetIndex = siblings.indexOf(targetElement);
                siblings.forEach((sibling, index) => {
                    if (index >= targetIndex) {
                        console.log('正在删除元素:', sibling);
                        sibling.remove();
                    }
                });
            }
        }

        // 删除商务合作元素
        const businessElement = document.querySelector('.pop2P7gf.pon8LXvt');
        if (businessElement) {
            console.log('删除商务合作元素');
            businessElement.remove();
        }

        // 删除侧边栏
        const sidebarElement = document.getElementById('douyin-sidebar');
        if (sidebarElement) {
            console.log('删除侧边栏');
            sidebarElement.remove();
        }

        // 处理顶部按钮（更新选择器）
        const buttons = document.querySelectorAll('.dYcWlUlB, .cbBVPXaz, div[data-e2e="something-button"], .xFzvM6nY, div[tabindex="0"]');
        buttons.forEach(button => {
            const text = button.querySelector('.jenVD1aU, .iQdAxsPk')?.textContent;
            if (text && ['充钻石', '客户端', '快捷访问', '壁纸'].includes(text)) {
                console.log('删除顶部按钮:', text);
                button.style.display = 'none';
                // 同时隐藏父元素
                button.closest('.cbBVPXaz, div[tabindex="0"]')?.style.setProperty('display', 'none', 'important');
            }
        });
    });

    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
