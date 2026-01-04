// ==UserScript==
// @name         Elsevier阅读模式优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏Elsevier文献阅读页面两侧无关内容，提供切换按钮
// @author       YourName
// @match        *://*.sciencedirect.com/science/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencedirect.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527289/Elsevier%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527289/Elsevier%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'width-controls';
    controls.innerHTML = `
        <button class="btn-preset" data-width="100%">全屏</button>
        <button class="btn-preset" data-width="80%">宽版</button>
        <button class="btn-preset" data-width="60%">标准</button>
        <button id="toggleSidebars" class="btn-preset">显示侧边栏</button>
    `;
    document.body.insertAdjacentElement('afterbegin', controls);

    // 核心样式设置
    GM_addStyle(`
        /* 隐藏两侧内容 */
        .TableOfContents, .RelatedContent,
        .ArticleIdentifierLinks, .Banner,
        .ExportCitation, .Social, .toc-button-wrap,
        .publication-brand, .publication-cover,
        .PageDivider, .publication-volume,
        .AuthorGroups, .article-identifier-links,
        .author-group, .publication-title-link,
        .publication-title, .text-xs.u-margin-s-top,
        .easyScholar-ranking {
            display: none !important;
        }

        /* 主内容区样式 */
        article[lang="en"] {
            max-width: 100% !important;
            width: var(--content-width, 100%);
            margin: 0 auto !important;
            padding: 0 20px !important;
            transition: width 0.3s ease;
        }

        /* 控制按钮样式 */
        .width-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(255,255,255,0.9);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .btn-preset {
            display: block;
            width: 80px;
            margin: 5px 0;
            padding: 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-preset:hover {
            background: #0056b3;
            transform: scale(1.05);
        }

        /* 侧边栏显示状态 */
        body.show-sidebars .TableOfContents,
        body.show-sidebars .RelatedContent,
        body.show-sidebars .ArticleIdentifierLinks,
        body.show-sidebars .Banner {
            display: block !important;
        }

        /* 调整主内容区样式 */
        article[lang="en"] {
            width: var(--content-width, 100%) !important;
        }
    `);

    // 宽度调整功能
    const adjustWidth = (width) => {
        const mainContent = document.querySelector('article[lang="en"]');
        if (mainContent) {
            mainContent.style.width = width;
            mainContent.style.setProperty('--content-width', width);
            localStorage.setItem('elsevierContentWidth', width);
        }
    };

    // 事件绑定
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => adjustWidth(btn.dataset.width));
    });

    // 初始化设置
    let sidebarsVisible = false;

    function toggleSidebars() {
        sidebarsVisible = !sidebarsVisible;
        document.body.classList.toggle('show-sidebars', sidebarsVisible);
        localStorage.setItem('elsevierSidebarsVisible', sidebarsVisible);
        document.getElementById('toggleSidebars').textContent =
            sidebarsVisible ? '隐藏侧边栏' : '显示侧边栏';
    }

    const init = () => {
        const savedWidth = localStorage.getItem('elsevierContentWidth') || '100%';
        adjustWidth(savedWidth);

        // 初始化侧边栏状态
        sidebarsVisible = localStorage.getItem('elsevierSidebarsVisible') === 'true';
        document.body.classList.toggle('show-sidebars', sidebarsVisible);
        document.getElementById('toggleSidebars').textContent =
            sidebarsVisible ? '隐藏侧边栏' : '显示侧边栏';

        // 确保动态加载内容应用样式
        new MutationObserver(() => {
            adjustWidth(savedWidth);
            if(!sidebarsVisible) {
                document.querySelectorAll('.TableOfContents, .RelatedContent')
                    .forEach(el => el.style.display = 'none');
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    document.getElementById('toggleSidebars').addEventListener('click', toggleSidebars);

    window.addEventListener('DOMContentLoaded', init);
})();
