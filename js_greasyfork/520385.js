// ==UserScript==
// @name         微信读书小狐自用-修复版
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  调整背景护眼颜色、调整文字宽度，双击显示/隐藏顶栏和侧边栏，修改滚动条样式
// @author       XiaoHu & Gemini
// @match        https://weread.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520385/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%B0%8F%E7%8B%90%E8%87%AA%E7%94%A8-%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520385/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%B0%8F%E7%8B%90%E8%87%AA%E7%94%A8-%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

/*顺便云存档自用的脚本，防止丢失*/
/*CSDNGreener*/
/*骚扰拦截*/
/*怠惰小说下载器*/
/*知乎增强*//* X.I.U */
/*知乎美化*//* AN drew */

(function() {
    'use strict';

    // 定义护眼色变量，方便后续修改
    const eyeCareColor = "rgba(231, 224, 198, 1)";
    const scrollThumbColor = "rgba(240, 235, 220, 1)";

    // 1. 核心修复：通过注入 CSS 强制修改背景颜色
    // 相比 JS 遍历，CSS 注入能防止页面刷新或翻页后样式失效
    function injectCustomStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* 强制覆盖 body 和 html */
            html, body {
                background-color: ${eyeCareColor} !important;
            }

            /* 核心阅读区域、应用容器、顶部栏、侧边栏 */
            .app_content,
            .readerContent,
            .readerChapterContent,
            .readerTopBar,
            .readerControls,
            .wr_whiteTheme {
                background-color: ${eyeCareColor} !important;
                background-image: none !important; /* 关键：移除可能存在的纸张纹理背景图 */
            }

            /* 滚动条样式整合在这里 */
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            ::-webkit-scrollbar-thumb {
                background-color: ${scrollThumbColor};
                border-radius: 5px;
            }
            ::-webkit-scrollbar-track {
                background-color: ${eyeCareColor};
            }
        `;
        document.head.appendChild(style);
    }

    // 2. 调整文字宽度 (保留原有逻辑，增加触发频率以适应动态加载)
    function adjustWidth() {
        const content = document.querySelector(".readerContent .app_content");
        if (content) {
            content.style.width = "95%"; // 宽度调整
            content.style.maxWidth = "none";
            content.style.margin = "0 auto";

            // 处理段落宽度
            const paragraphs = content.querySelectorAll("p");
            paragraphs.forEach(paragraph => {
                paragraph.style.maxWidth = "none";
            });
        }
    }

    // 3. 隐藏/显示顶栏和侧边栏
    function toggleVisibility() {
        const header = document.querySelector('.readerTopBar');
        const sidebar = document.querySelector('.readerControls');

        if (header && sidebar) {
            const isHidden = header.style.display === 'none';
            header.style.display = isHidden ? '' : 'none';
            sidebar.style.display = isHidden ? '' : 'none';
        }
    }

    // 4. 事件监听
    function initEvents() {
        // 双击切换
        document.addEventListener('dblclick', toggleVisibility);

        // 监听窗口大小变化重新调整宽度
        window.addEventListener('resize', adjustWidth);

        // 针对单页应用(SPA)的动态加载，使用 MutationObserver 监听 DOM 变化
        // 这样翻页时，宽度调整依然生效
        const observer = new MutationObserver(() => {
            adjustWidth();
        });

        // 观察 body 的子节点变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 5. 初始化
    function init() {
        injectCustomStyle(); // 注入 CSS (解决背景色问题)
        adjustWidth();       // 调整宽度
        initEvents();        // 绑定事件
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();