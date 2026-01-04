// ==UserScript==
// @name         CSDN自用极致净化 v5.2.0
// @description  带按钮开关控制，支持返回顶部/黑暗模式/广告去除
// @version      5.2.0
// @namespace    https://github.com/
// @homepage     https://github.com/
// @run-at       document-start
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540445/CSDN%E8%87%AA%E7%94%A8%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20v520.user.js
// @updateURL https://update.greasyfork.org/scripts/540445/CSDN%E8%87%AA%E7%94%A8%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20v520.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用户默认配置
    const defaultSettings = {
        darkMode: false,
        asidePin: false,
        debugMode: false,
        finnWidth: 1150,
        showButtons: false // 新增：控制按钮是否显示
    };

    // 获取用户配置
    let FinnData = new Proxy({...defaultSettings, ...GM_getValue('FinnData', {})}, {
        set(target, key, val) {
            const B = Reflect.set(target, key, val);
            GM_setValue('FinnData', target);
            return B;
        }
    });

    // 创建调试面板
    const debugPanel = document.createElement('div');
    debugPanel.id = 'finn-debug';
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(30,30,46,0.85);
        color: white;
        padding: 12px 18px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.4);
        font-family: 'Fira Code', 'Consolas', monospace;
        z-index: 99999;
        font-size: 13px;
        max-width: 400px;
        max-height: 380px;
        overflow-y: auto;
        line-height: 1.5;
        border: 1px solid rgba(255,255,255,0.12);
        transform: ${FinnData.debugMode ? 'translateX(0)' : 'translateX(120%)'};
        opacity: ${FinnData.debugMode ? '1' : '0'};
        transition: transform 0.3s ease, opacity 0.2s ease;
    `;

    debugPanel.innerHTML = `
        <div style="position: sticky; top: 0; background: rgba(30,30,46,0.9); padding: 8px 0; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.15);">
            <strong>CSDN 增强调试面板 [v2.5.0]</strong>
            <button id="closeDebug" style="float:right; background: #ff4d4d; border: none; color: white; padding: 2px 10px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
        <div id="debugLog"></div>
    `;
    document.documentElement.appendChild(debugPanel);

    // 日志函数
    function logDebug(message, forceLog = false) {
        if (!FinnData.debugMode && !forceLog) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.innerHTML = `<span style="color: #4ecca3">[${timestamp}]</span> ${message}`;

        const logBox = debugPanel.querySelector('#debugLog');
        logBox.appendChild(logEntry);

        // 自动滚动到底部
        logBox.scrollTop = logBox.scrollHeight;
    }

    // 调试模式切换
    function toggleDebugMode(forceState = null) {
        FinnData.debugMode = forceState !== null ? forceState : !FinnData.debugMode;

        debugPanel.style.transform = FinnData.debugMode
            ? 'translateX(0)'
        : 'translateX(120%)';
        debugPanel.style.opacity = FinnData.debugMode ? '1' : '0';

        logDebug(`调试模式 ${FinnData.debugMode ? '开启' : '关闭'}`, true);
    }

    // 初始日志
    logDebug('脚本初始化完成', true);
    logDebug(`当前设置: 黑暗模式=${FinnData.darkMode} 侧边栏固定=${FinnData.asidePin} 调试模式=${FinnData.debugMode} 宽度=${FinnData.finnWidth}px 按钮显示=${FinnData.showButtons}`, true);

    // 添加菜单命令
    GM_registerMenuCommand('⇧ + 🅱  显示神秘按钮');
    GM_registerMenuCommand('⇧ + 🅳  显示调试面板');
    GM_registerMenuCommand('⇧ + ⬆️ 或 ⬇️  调整文章宽度');

    //GM_registerMenuCommand('⭐ 切换调试面板', toggleDebugMode);
    /*GM_registerMenuCommand('🔘 切换按钮显示', () => {
              FinnData.showButtons = !FinnData.showButtons;
              updateButtonsVisibility();
              logDebug(`按钮显示状态: ${FinnData.showButtons ? '显示' : '隐藏'}`, true);
          });
          GM_registerMenuCommand('⚙️ 重置用户设置', () => {
              FinnData = {...defaultSettings};
              updateButtonsVisibility();
              logDebug('已恢复默认设置', true);
          });*/

    // 平滑滚动函数
    function smoothScrollToTop(duration = 400) {
        const start = window.scrollY;
        const startTime = performance.now();

        function scrollStep(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            window.scrollTo(0, start * (1 - cubicEase(progress)));

            if (progress < 1) {
                window.requestAnimationFrame(scrollStep);
            } else {
                logDebug('滚动完成');
            }
        }

        function cubicEase(t) {
            return t < 0.5
                ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        window.requestAnimationFrame(scrollStep);
    }

    // 样式模板
    const getStyle = (finnWidth) => `
        :root {
            --finn-width: ${finnWidth}px;
        }

        [data-finn] body {
            --debug-color: #4ecca3;
        }

        #content_views,#content_views * {
            user-select: auto !important;
        }

        [darkMode],[darkMode] #darkBtn,[darkMode] code.hljs,[darkMode] img,[darkMode] pre.prettyprint {
            filter: invert(1) hue-rotate(180deg);
            transition: all .5s;
        }

        [darkMode] .markdown_views.prism-github-gist .prettyprint,
        [darkMode] .markdown_views.prism-github-gist .prettyprint .pre-numbering,
        [darkMode] .markdown_views.prism-github-gist pre code,
        [darkMode] .markdown_views.prism-github-gist pre.prettyprint {
            background-color: #0d1117 !important;
            transition: all 0.1s;
        }

        [darkMode] body {
            background: #ebebeb !important;
            transition:background .7s;
        }

        #darkBtn {
            position: fixed;
            top: 8px;
            left: 50px;
            width: 32px;
            height: 32px;
            z-index: 9999;
            background: gold;
            cursor: pointer;
            border-radius: 50%;
            transition: all .5s;
            display: ${FinnData.showButtons ? 'block' : 'none'};
        }

        [darkMode] #darkBtn {
            background: transparent;
            box-shadow: -.5em .3em 0 0 gold;
            left: 60px;
            top: 4px;
        }

        #darkBtn:after {
            content: "打开夜间模式";
            width: 100px;
            position: absolute;
            right: -120px;
            top: 4px;
            font-size: 14px;
            font-weight: 600;
            transition: all .5s;
            display: none;
        }

        [darkMode] #darkBtn:after {
            content: "关闭夜间模式";
            right: -110px;
            top: 8px;
            filter: invert(1) hue-rotate(180deg);
            font-weight: 600;
        }

        #darkBtn:hover:after {
            display: block;
        }

        /* 返回顶部按钮样式 */
        #FinnTop {
            position: fixed;
            right: 40px;
            bottom: 80px;
            width: 45px;
            height: 45px;
            background: #2e7d32;
            color: white;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 9999;
        }

        #FinnTop.show {
            display: flex;
        }

        #FinnTop:hover {
            transform: translateY(-5px);
            background: #1b5e20;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        #FinnTop::before {
            content: "↑";
            font-size: 24px;
            font-weight: bold;
        }

        /* 侧边栏固定按钮 */
        #pinBtn {
            color: #ccc;
            position: fixed;
            height: 26px;
            width: 19px;
            top: 12px;
            left: 18px;
            z-index: 9999;
            cursor: pointer;
            display: ${FinnData.showButtons ? 'block' : 'none'};
        }

        #pinBtn::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid;
            border-right: none;
        }

        #pinBtn::after {
            content: "";
            position: absolute;
            left: -2px;
            height: 23px;
            border: 1px solid;
            transition: left 0.3s ease;
        }

        [asidePin] #pinBtn::after {
            left: 3px;
        }

        /* 隐藏不需要的元素 */
        #asideArchive, .aside-box-footer, #asideCategory,
        #asideHotArticle, #asideNewComments, #asideNewNps,
        #asideSearchArticle+.box-shadow.mb8, #blogColumnPayAdvert,
        #csdn-toolbar .toolbar-advert, #csdn-toolbar .toolbar-container-left,
        #csdn-toolbar .toolbar-container-right, #dmp_ad_58, #footerRightAds,
        #passportbox, #placeholder, #rightAside, #recommendNps,
        .blog-footer-bottom, .csdn-shop-window-common,
        .csdn-side-toolbar, .hide-article-box.hide-article-pos.text-center,
        .leftPop, .login-mark, .opt-box.text-center, .template-box,
        .toolbar-search-drop-menu.toolbar-search-half,
        ::-webkit-input-placeholder, .passport-login-mark,
        .passport-login-container, .hide-preCode-box, #marketingBox,
        .icon-fire, #toolBarBox .tool-hover-tip+.tool-active-list,
        .passport-login-tip-container, #remuneration, #asideWriteGuide,
        #asideSearchArticle, #tool-share, #treeSkill,
        #swiper-remuneration-container, .swiper-slide-box-remuneration,
        #toolbar-c-box-button,.c-box, .recommend-item-box, .blog_container_aside,
        .more-toolbox-new more-toolbar, .article-info-box,#blogHuaweiyunAdvert,
        .blog-extension-box, .more-toolbar,.more-toolbox-new, .toolbar-container,
        #toolbarBox,.article-resource-info-box, #blogVoteBox,
        .ai-abstract-box, .btn-code-notes.ckeditor {
            display: none !important;
            margin: 0;
            color: transparent;
            visibility: hidden;
            height: 0
        }

        .toolbar-search.onlySearch {
            transition: all .3s ease
        }

        body #csdn-toolbar {
            box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1993;
        }

        .toolbar-search.onlySearch:focus-within {
            max-width: var(--finn-width) !important;
            width: var(--finn-width) !important;
        }

        #asidedirectory, .d-flex {
            display: block !important;
        }

        .main_father, pre.set-code-hide {
            height: auto !important;
        }

        main {
            cursor: auto;
            width: 100% !important;
            box-shadow: 0 0 30px rgb(0 0 0 / 25%);
            margin-bottom: 0 !important;
        }

        #mainBox {
            position: relative;
            margin: 10px auto 30px;
            width: var(--finn-width) !important;
            padding: 0 10px;
            box-sizing: content-box;
            cursor: e-resize;
        }

        .comment-list-box {
            max-height: none !important;
        }

        #commentPage, .toolbar-container-middle {
            display: block !important;
        }

        .toolbar-container {
            min-width: 100% !important;
        }

        #article_content {
            height: auto !important;
        }

        .comment-list-container {
            padding: 4px 0 !important;
        }

        .article-header-box {
            padding-top: 18px !important;
        }

        main .comment-box {
            padding: 0;
            box-shadow: 0 0 10px rgba(0,0,0,.05);
            margin: 8px 0;
        }

        .blog_container_aside {
            width: 300px !important;
            height: calc(100% - 100px);
            overflow-y: auto;
            overflow-x: hidden;
            border: solid #fff;
            border-width: 20px 4px 0 4px;
            background: #fff;
            box-sizing: content-box;
            position: fixed;
            top: initial !important;
            left: -307px !important;
            transition: all .35s;
            box-shadow: 2px 0 10px 0 rgba(0,0,0,.15);
            z-index: 1111 !important;
            cursor: auto;
        }

        .blog_container_aside:hover {
            left: 0 !important;
        }

        [asidePin] aside.blog_container_aside {
            left: 0 !important;
        }

        aside.blog_container_aside:hover:before,
        [asidePin] aside.blog_container_aside:before {
            width: 308px;
            height: 18px;
            padding: 4px 2px;
            writing-mode: rl-tb;
            font-size: 14px;
            top: 66px;
            border-radius: 0
        }

        html body {
            min-width: 100%;
            background: #eee;
        }

        /* 简单博客样式 */
        @media screen and (max-width: 768px) {
            #mainBox {
                width: 95% !important;
                max-width: calc(100% - 20px);
            }
            #FinnTop {
                right: 15px;
                bottom: 60px;
            }
        }

        .no-select {
            user-select: none;
        }
    `;

    // 插入样式的函数
    const insertStylesAndHTML = () => {
        // 应用初始设置
        if (FinnData.darkMode) {
            document.documentElement.toggleAttribute('darkMode', true);
        }
        if (FinnData.asidePin) {
            document.documentElement.toggleAttribute('asidePin', true);
        }

        // 创建样式和DOM元素
        const styleTag = document.createElement('style');
        styleTag.textContent = getStyle(FinnData.finnWidth);
        document.head.appendChild(styleTag);

        const markup = `
            <div data-finn id="darkBtn" title="切换黑暗模式"></div>
            <div data-finn id="pinBtn" title="固定侧边栏"></div>
            <div data-finn id="FinnTop" title="返回顶部"></div>
        `;
        document.body.insertAdjacentHTML('afterbegin', markup);

        logDebug('样式和按钮已注入');
    };

    // 更新按钮可见性
    function updateButtonsVisibility() {
        const darkBtn = document.getElementById('darkBtn');
        const pinBtn = document.getElementById('pinBtn');

        if (darkBtn) darkBtn.style.display = FinnData.showButtons ? 'block' : 'none';
        if (pinBtn) pinBtn.style.display = FinnData.showButtons ? 'block' : 'none';

        logDebug(`按钮可见性更新: ${FinnData.showButtons ? '显示' : '隐藏'}`);
    }

    // 初始化按钮事件
    function initButtonEvents() {
        logDebug('绑定按钮事件');

        const darkBtn = document.getElementById('darkBtn');
        const pinBtn = document.getElementById('pinBtn');
        const topBtn = document.getElementById('FinnTop');

        if (darkBtn) {
            darkBtn.addEventListener('click', () => {
                FinnData.darkMode = !FinnData.darkMode;
                document.documentElement.toggleAttribute('darkMode', FinnData.darkMode);
                logDebug(`黑暗模式: ${FinnData.darkMode}`);
            });
        }

        if (pinBtn) {
            pinBtn.addEventListener('click', () => {
                FinnData.asidePin = !FinnData.asidePin;
                document.documentElement.toggleAttribute('asidePin', FinnData.asidePin);
                logDebug(`固定侧边栏: ${FinnData.asidePin}`);
            });
        }

        if (topBtn) {
            topBtn.addEventListener('click', smoothScrollToTop);

            // 滚动事件处理
            window.addEventListener('scroll', () => {
                topBtn.className = window.scrollY > 500 ? 'show' : '';
            });
        }

        // 宽度调整
        const mainBox = document.getElementById('mainBox');
        if (mainBox) {
            mainBox.addEventListener('mousedown', startResize);
        }

        // 调试面板关闭按钮
        const closeDebugBtn = debugPanel.querySelector('#closeDebug');
        if (closeDebugBtn) {
            closeDebugBtn.addEventListener('click', () => {
                toggleDebugMode(false);
            });
        }
    }

    // 宽度调整函数
    function startResize(e) {
        const mainBox = document.getElementById('mainBox');
        if (!mainBox || e.target !== mainBox) return;

        const startX = e.clientX;
        const startWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--finn-width'));
        const maxWidth = window.innerWidth * 0.95;

        document.body.classList.add('no-select');

        function resize(e) {
            const newWidth = Math.max(850, Math.min(startWidth + (e.clientX - startX) * 1.5, maxWidth));
            document.documentElement.style.setProperty('--finn-width', `${newWidth}px`);
            logDebug(`内容宽度调整: ${newWidth}px`);
        }

        function stopResize() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            FinnData.finnWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--finn-width'));
            document.body.classList.remove('no-select');
            logDebug(`最终宽度设置: ${FinnData.finnWidth}px`);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Shift+D 切换调试面板
        if (e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDebugMode();
        }

        // Shift+B 切换按钮显示
        if (e.shiftKey && e.key === 'B') {
            e.preventDefault();
            FinnData.showButtons = !FinnData.showButtons;
            updateButtonsVisibility();
            logDebug(`按钮显示状态: ${FinnData.showButtons ? '显示' : '隐藏'}`, true);
        }

        // Shift+↑/↓ 调整宽度
        if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault();
            const step = e.key === 'ArrowUp' ? 50 : -50;
            const curWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--finn-width'));
            const newWidth = Math.max(850, Math.min(curWidth + step, window.innerWidth * 0.95));

            document.documentElement.style.setProperty('--finn-width', `${newWidth}px`);
            FinnData.finnWidth = newWidth;
            logDebug(`宽度快速调整: ${newWidth}px`);
        }
    });

    // 主初始化流程
    function initAll() {
        try {
            insertStylesAndHTML();
            initButtonEvents();
            updateButtonsVisibility();

            // 初始滚动位置检查
            window.dispatchEvent(new Event('scroll'));

            logDebug('脚本功能已加载。按 Shift+D 切换调试面板，Shift+B 切换按钮显示', true);
        } catch (err) {
            console.error('[CSDN-Focus-TRACE]', err);
            if (err.stack) {
                logDebug(`初始化错误: ${err.message}
${err.stack.split('\n').slice(0,3).join('\n')}`, true);
            } else {
                logDebug(`初始化错误: ${err.message}`, true);
            }
        }
    }

    // 监控DOM准备状态
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
