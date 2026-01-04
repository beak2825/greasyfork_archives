// ==UserScript==
// @name         修改小红书 PWA 标题栏颜色
// @version      0.1
// @description  修改小红书 PWA 标题栏颜色为 #0A0A0A
// @author       hiisme
// @match        https://www.xiaohongshu.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/504563/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%BA%A2%E4%B9%A6%20PWA%20%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/504563/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%BA%A2%E4%B9%A6%20PWA%20%E6%A0%87%E9%A2%98%E6%A0%8F%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改标题栏颜色的 CSS 样式
    const style = `
        /* 修改标题栏颜色为 #0A0A0A */
        @media (display-mode: standalone) {
            /* 修改 PWA 独立显示模式下的标题栏颜色 */
            header {
                background-color: #0A0A0A !important;
            }
        }
    `;

    // 将样式添加到页面
    GM_addStyle(style);

    // 监听页面变化
    const observer = new MutationObserver(() => {
        // 重新设置标题栏颜色
        const changePwaTitleBarColor = () => {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#0A0A0A');
            } else {
                const newMetaTag = document.createElement('meta');
                newMetaTag.setAttribute('name', 'theme-color');
                newMetaTag.setAttribute('content', '#0A0A0A');
                document.head.appendChild(newMetaTag);
            }
        };

        // 重新调用修改标题栏颜色的函数
        changePwaTitleBarColor();
    });

    // 配置并启动 MutationObserver
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);
})();
