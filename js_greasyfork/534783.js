// ==UserScript==
// @name         象视自动同步助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  象视平台综合辅助工具：包含多款皮肤切换（Dracula/Cyberpunk/Glass风格）、UI 炫酷特效、iframe 样式同步、以及自动化同步操作功能。
// @author       Jhih he
// @license      MIT
// @match        https://vr.xhj.com/houseadmin/*
// @match        *://vr.xhj.com/*
// @match        *://*.xhj.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534783/%E8%B1%A1%E8%A7%86%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534783/%E8%B1%A1%E8%A7%86%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ==========================================================================
       模块 1: 皮肤与 UI 优化 (Skin & UI)
       ========================================================================== */

    const SKIN_STORAGE_KEY = 'xhj_skin_theme';
    const STYLE_ID = 'xhj-custom-skin-style';

    // 定义主题配置
    const themes = {
        'default': {
            name: '默认 (Default)',
            vars: {} // 空对象表示移除样式
        },
        'dracula': {
            name: 'Dracula',
            vars: {
                '--xhj-bg': '#282a36',
                '--xhj-fg': '#f8f8f2',
                '--xhj-header-bg': '#44475a',
                '--xhj-side-bg': '#21222c',
                '--xhj-active-bg': '#bd93f9',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#6272a4',
                '--xhj-hover-bg': '#6272a4',
                '--xhj-input-bg': '#44475a',
                '--xhj-table-head': '#44475a',
                '--xhj-glow-color': 'rgba(189, 147, 249, 0.6)'
            }
        },
        'solarized-dark': {
            name: 'Solarized Dark',
            vars: {
                '--xhj-bg': '#002b36',
                '--xhj-fg': '#839496',
                '--xhj-header-bg': '#073642',
                '--xhj-side-bg': '#00212b',
                '--xhj-active-bg': '#268bd2',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#586e75',
                '--xhj-hover-bg': '#586e75',
                '--xhj-input-bg': '#073642',
                '--xhj-table-head': '#073642',
                '--xhj-glow-color': 'rgba(38, 139, 210, 0.6)'
            }
        },
        'monokai': {
            name: 'Monokai',
            vars: {
                '--xhj-bg': '#272822',
                '--xhj-fg': '#f8f8f2',
                '--xhj-header-bg': '#3e3d32',
                '--xhj-side-bg': '#1e1f1c',
                '--xhj-active-bg': '#a6e22e',
                '--xhj-active-fg': '#272822',
                '--xhj-border': '#75715e',
                '--xhj-hover-bg': '#49483e',
                '--xhj-input-bg': '#3e3d32',
                '--xhj-table-head': '#3e3d32',
                '--xhj-glow-color': 'rgba(166, 226, 46, 0.6)'
            }
        },
        'github-dark': {
            name: 'GitHub Dark',
            vars: {
                '--xhj-bg': '#0d1117',
                '--xhj-fg': '#c9d1d9',
                '--xhj-header-bg': '#161b22',
                '--xhj-side-bg': '#010409',
                '--xhj-active-bg': '#1f6feb',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#30363d',
                '--xhj-hover-bg': '#21262d',
                '--xhj-input-bg': '#0d1117',
                '--xhj-table-head': '#161b22',
                '--xhj-glow-color': 'rgba(31, 111, 235, 0.6)'
            }
        },
        'cyberpunk': {
            name: 'Cyberpunk 2077',
            vars: {
                '--xhj-bg': '#020205',
                '--xhj-fg': '#00f3ff',
                '--xhj-header-bg': '#090a0f',
                '--xhj-side-bg': '#000000',
                '--xhj-active-bg': '#fcee0a',
                '--xhj-active-fg': '#000000',
                '--xhj-border': '#00f3ff',
                '--xhj-hover-bg': '#ff003c',
                '--xhj-input-bg': '#050505',
                '--xhj-table-head': '#121212',
                '--xhj-glow-color': '#00f3ff',
                '--xhj-special-font': 'Courier New, monospace'
            }
        },
        'glass-morphism': {
            name: 'Glass Morphism',
            vars: {
                '--xhj-bg': '#1a1c2c',
                '--xhj-fg': '#e0e6ed',
                '--xhj-header-bg': 'rgba(255, 255, 255, 0.05)',
                '--xhj-side-bg': 'rgba(0, 0, 0, 0.2)',
                '--xhj-active-bg': '#7aa2f7',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': 'rgba(255, 255, 255, 0.1)',
                '--xhj-hover-bg': 'rgba(255, 255, 255, 0.1)',
                '--xhj-input-bg': 'rgba(0, 0, 0, 0.2)',
                '--xhj-table-head': 'rgba(0, 0, 0, 0.3)',
                '--xhj-glow-color': '#7aa2f7'
            }
        },
        'future-tech': {
            name: 'Future Tech (Neon)',
            vars: {
                '--xhj-bg': '#050a14',
                '--xhj-fg': '#00f2ff',
                '--xhj-header-bg': 'rgba(5, 10, 20, 0.9)',
                '--xhj-side-bg': 'rgba(0, 0, 0, 0.8)',
                '--xhj-active-bg': '#d900ff',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#00f2ff',
                '--xhj-hover-bg': 'rgba(217, 0, 255, 0.2)',
                '--xhj-input-bg': 'rgba(0, 0, 0, 0.5)',
                '--xhj-table-head': 'rgba(0, 242, 255, 0.1)',
                '--xhj-glow-color': '#d900ff'
            }
        }
    };

    // 通用 CSS 模板 (Layui 覆盖)
    const getCssTemplate = (vars) => {
        if (Object.keys(vars).length === 0) return '';

        const varDeclarations = Object.entries(vars)
            .map(([k, v]) => `${k}: ${v};`)
            .join('\n');
            
        // Future Tech 专属网格背景
        let extraCss = '';
        if (vars['--xhj-bg'] === '#050a14') {
             extraCss = `
                body::before {
                    content: "";
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    z-index: -1;
                    pointer-events: none;
                }
             `;
        }

        return `
            ${extraCss}
            :root {
                ${varDeclarations}
                --xhj-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                --xhj-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.5);
                --xhj-radius: 8px;
                --xhj-btn-gradient: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0));
                --xhj-sidebar-bg: rgba(33, 34, 44, 0.95);
                --xhj-glow: 0 0 15px var(--xhj-glow-color, rgba(189, 147, 249, 0.4));
                --xhj-glass-border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
            }

            @keyframes neon-pulse {
                0% { box-shadow: 0 0 5px var(--xhj-active-bg), 0 0 10px var(--xhj-active-bg); }
                50% { box-shadow: 0 0 10px var(--xhj-active-bg), 0 0 20px var(--xhj-active-bg); }
                100% { box-shadow: 0 0 5px var(--xhj-active-bg), 0 0 10px var(--xhj-active-bg); }
            }

            @keyframes ripple-effect {
                0% { transform: scale(0); opacity: 0.8; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            /* --- 视觉净化与去噪 (Cleanup) --- */
            
            /* 1. 暴力隐藏购物插件注入的垃圾元素 */
            [class*="gwd-"], [id*="gwd"], [class*="bjg-"] {
                display: none !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
            }

            /* 2. 移除左侧生硬的绿色边框 */
            #admin-body {
                border-left: none !important;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1) !important; /* 用柔和阴影代替 */
            }

            /* 3. Logo 区域现代化 */
            .admin-login-box .logo span {
                /* 科技感霓虹渐变 (极光青 -> 霓虹紫) */
                background: linear-gradient(135deg, #00dbde 0%, #fc00ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800;
                letter-spacing: 2px;
                filter: drop-shadow(0 0 8px rgba(252, 0, 255, 0.4));
            }
            
            /* 4. 顶部导航栏毛玻璃悬浮感 */
            .layui-header {
                background-color: rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.85) !important;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            }

            /* 5. 滚动条美化 (全局) */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 4px;
                border: 1px solid transparent;
                background-clip: content-box;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--xhj-active-bg);
                border: 0;
            }

            /* --- 核心修复：强制应用背景色 --- */
            html, body {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                -webkit-font-smoothing: antialiased;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            
            /* 修复 iframe 内可能存在的白色背景类 */
            .layui-bg-white, .admin-main, .layui-fluid {
                background-color: transparent !important;
            }
            
            /* 修复 iframe 内部增加底部内边距，防止底部按钮被遮挡 */
            body.xhj-iframe-body {
                padding-bottom: 0px !important;
            }

            /* --- 修复 Loading 等待框白色背景 --- */
            .layui-table-init, .layui-layer-loading .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-table-init .layui-icon {
                color: var(--xhj-active-bg) !important;
            }
            /* 针对 .layui-layer-shade (遮罩层) 保持透明度但适配深色 */
            .layui-layer-shade {
                opacity: 0.6 !important;
                background-color: #000 !important;
            }
            /* 通用白色背景类覆盖 */
            .layui-bg-white {
                background-color: transparent !important;
            }

            /* --- 炫酷交互特效 --- */

            /* 选中文字效果 */
            ::selection {
                background: var(--xhj-active-bg);
                color: var(--xhj-active-fg);
                text-shadow: 0 0 5px var(--xhj-glow-color);
            }

            /* 鼠标点击波纹元素 */
            .xhj-click-ripple {
                position: fixed;
                border-radius: 50%;
                background: var(--xhj-active-bg);
                transform: scale(0);
                animation: ripple-effect 0.6s linear;
                pointer-events: none;
                z-index: 99999999;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
                box-shadow: 0 0 10px var(--xhj-active-bg);
            }

            /* --- 全局组件优化 --- */
            
            /* 过渡动画 */
            .layui-btn, .layui-input, .layui-nav-item a, .layui-table-cell, .layui-tab-title li {
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }

            /* 侧边栏 macOS 风格 */
            .layui-side, .layui-side-scroll, .layui-bg-black {
                background-color: var(--xhj-side-bg) !important;
                border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
            }
            .layui-nav-tree .layui-nav-item a {
                color: var(--xhj-fg) !important;
                margin: 4px 8px !important;
                border-radius: 6px !important;
                width: auto !important;
            }
            .layui-nav-tree .layui-nav-item a:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                transform: translateX(4px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .layui-nav-tree .layui-this {
                background-color: transparent !important;
            }
            .layui-nav-tree .layui-this > a {
                background-color: var(--xhj-active-bg) !important;
                background-image: linear-gradient(135deg, var(--xhj-active-bg), rgba(189, 147, 249, 0.8)) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: var(--xhj-glow) !important;
                border-radius: 10px !important;
                margin: 0 10px !important;
                width: auto !important;
                transform: translateY(-1px) scale(1.02) !important;
                text-shadow: none !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
            }
            .layui-nav-tree .layui-this > a::after { display: none !important; }

            /* 顶部 Header & Tabs */
            .layui-layout-admin .layui-header {
                background-color: var(--xhj-header-bg) !important;
                border-bottom: 1px solid var(--xhj-border);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                z-index: 1000;
            }
            .layui-tab { background-color: transparent !important; }
            .layui-tab-title {
                border-bottom-color: var(--xhj-border) !important;
                background-color: transparent !important;
            }
            .layui-tab-title li {
                color: var(--xhj-fg) !important;
                background-color: rgba(255, 255, 255, 0.05) !important;
                border-color: transparent !important;
                margin-right: 2px;
                border-radius: 4px 4px 0 0;
            }
            .layui-tab-title .layui-this {
                color: var(--xhj-active-bg) !important;
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
                border-bottom-color: var(--xhj-header-bg) !important;
                text-shadow: 0 0 8px var(--xhj-glow-color) !important;
            }
            .layui-tab-title .layui-this:after { border: none !important; }

            /* 分页栏 */
            .layui-table-page {
                background-color: transparent !important;
                border-top: 1px solid var(--xhj-border) !important;
            }
            .layui-laypage a, .layui-laypage span {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
            }
            .layui-laypage a:hover {
                color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color) !important;
            }
            .layui-laypage .layui-laypage-curr .layui-laypage-em {
                background-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 8px var(--xhj-glow-color) !important;
            }
            .layui-laypage input, .layui-laypage button, .layui-laypage select {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }

            /* 表单元素 */
            .layui-form-label {
                background-color: transparent !important;
                color: var(--xhj-fg) !important;
                border: none !important;
            }
            .layui-input-block, .layui-form-item { background-color: transparent !important; }
            .layui-form-pane .layui-form-label {
                background-color: rgba(255,255,255,0.05) !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
            }

            /* 卡片与容器 */
            .layui-card {
                background-color: rgba(68, 71, 90, 0.95) !important;
                color: var(--xhj-fg) !important;
                border: var(--xhj-glass-border) !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
                backdrop-filter: blur(8px);
                transition: transform 0.3s !important;
            }
            .layui-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
                border-color: var(--xhj-active-bg) !important;
            }
            .layui-card-header {
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                color: var(--xhj-fg) !important;
            }

            /* 按钮 */
            .layui-btn {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border-radius: 6px !important;
                border: none !important;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2) !important;
                background-image: var(--xhj-btn-gradient) !important;
            }
            .layui-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 15px var(--xhj-active-bg), 0 0 5px var(--xhj-active-bg) !important;
                opacity: 1;
            }
            .layui-btn-primary {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                box-shadow: none !important;
            }
            .layui-btn-primary:hover {
                border-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 8px var(--xhj-active-bg) !important;
            }

            /* 输入框 */
            .layui-input, .layui-select, .layui-textarea, input[type="text"] {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-radius: 6px !important;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.1) !important;
            }
            .layui-input:focus, .layui-select:focus, .layui-textarea:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 0 3px var(--xhj-glow-color) !important;
            }

            /* 表格 */
            .layui-table, .layui-table-view {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                border-radius: 8px;
                border: none !important;
            }
            .layui-table-hover, .layui-table-click, .layui-table tbody tr:hover, 
            .layui-table-hover > td, .layui-table-click > td, .layui-table tbody tr:hover > td {
                background-color: rgba(98, 114, 164, 0.2) !important;
                backdrop-filter: blur(4px);
            }
            /* 表格行悬浮 3D 效果 */
            .layui-table tbody tr {
                transition: transform 0.2s, background-color 0.2s !important;
            }
            .layui-table tbody tr:hover {
                transform: scale(1.002) translateY(-1px);
                z-index: 10;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                background-color: rgba(255,255,255,0.03) !important;
            }

            .layui-table thead tr, .layui-table-header {
                background-color: var(--xhj-table-head) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-table td {
                padding: 0 !important;
                border: none !important;
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            }
            .layui-table-cell {
                font-family: 'SF Mono', 'Consolas', 'Monaco', monospace !important;
                background-color: var(--xhj-input-bg) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-radius: 4px !important;
                margin: 3px 2px !important;
                padding: 6px 8px !important;
                height: auto !important;
                white-space: nowrap !important;
                min-width: 160px !important;
                text-align: center !important;
                line-height: 24px !important;
                display: block !important;
            }

            /* 列表表头对齐修正 */
            .layui-table th .layui-table-cell {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 8px 11px !important;
                min-width: 160px !important;
            }

            /* 列宽适配 (默认) */
            .layui-table tr td:nth-child(1) .layui-table-cell, .layui-table th:nth-child(1) .layui-table-cell { min-width: 90px !important; }
            .layui-table tr td:nth-child(3) .layui-table-cell, .layui-table th:nth-child(3) .layui-table-cell { min-width: 220px !important; }
            .layui-table tr td:nth-child(5) .layui-table-cell, .layui-table th:nth-child(5) .layui-table-cell { min-width: 260px !important; }
            .layui-table tr td:nth-child(6) .layui-table-cell, .layui-table th:nth-child(6) .layui-table-cell,
            .layui-table tr td:nth-child(7) .layui-table-cell, .layui-table th:nth-child(7) .layui-table-cell { min-width: 200px !important; }
            .layui-table tr td:nth-child(8) .layui-table-cell, .layui-table th:nth-child(8) .layui-table-cell { min-width: 70px !important; }
            
            /* 售房全景专用列宽 */
            body.xhj-table-sales .layui-table tr td:nth-child(2) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(2) .layui-table-cell { min-width: 200px !important; }
            body.xhj-table-sales .layui-table tr td:nth-child(3) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(3) .layui-table-cell { min-width: 140px !important; }
            
            /* 售房全景 - 缩窄特定列 (设计师/摄影师、上传人、全景状态、时间) */
            /* 第5列: 摄影师/设计师 -> 原80px，现40px */
            body.xhj-table-sales .layui-table tr td:nth-child(5) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(5) .layui-table-cell { 
                min-width: 40px !important; width: 40px !important; 
            }
            /* 第6列: 上传人 -> 保持80px或也缩窄 */
            body.xhj-table-sales .layui-table tr td:nth-child(6) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(6) .layui-table-cell { 
                min-width: 60px !important; width: 60px !important; 
            }
            /* 第9列: 全景状态 (如果是这一列) -> 原60px，现30px */
            body.xhj-table-sales .layui-table tr td:nth-child(9) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(9) .layui-table-cell { 
                min-width: 30px !important; width: 30px !important; 
            }

            /* 房堪列表 - 缩窄特定列 (楼盘名称、申请人、摄影师、上传人、状态) */
            body.xhj-table-survey .layui-table tr td:nth-child(3) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(3) .layui-table-cell { 
                min-width: 160px !important; width: 160px !important; /* 楼盘名称略宽 */
            }
            body.xhj-table-survey .layui-table tr td:nth-child(4) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(4) .layui-table-cell,
            body.xhj-table-survey .layui-table tr td:nth-child(9) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(9) .layui-table-cell,
            body.xhj-table-survey .layui-table tr td:nth-child(10) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(10) .layui-table-cell { 
                min-width: 80px !important; width: 80px !important; 
            }
            body.xhj-table-survey .layui-table tr td:nth-child(12) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(12) .layui-table-cell { 
                min-width: 90px !important; width: 90px !important; 
            }

            /* 修复双重文字框 (售房全景) - 针对图片和状态列的特殊处理 */
            body.xhj-table-sales .layui-table tr td:nth-child(7) .layui-table-cell,
            body.xhj-table-sales .layui-table tr td:nth-child(8) .layui-table-cell {
                background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important;
            }

            /* 列颜色 (Dracula/Cyberpunk 适配) */
            .layui-table tr td:nth-child(1) .layui-table-cell { color: #ff79c6 !important; box-shadow: inset 3px 0 0 #ff79c6, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(2) .layui-table-cell { color: #8be9fd !important; box-shadow: inset 3px 0 0 #8be9fd, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(3) .layui-table-cell { color: #50fa7b !important; box-shadow: inset 3px 0 0 #50fa7b, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(4) .layui-table-cell { color: #bd93f9 !important; box-shadow: inset 3px 0 0 #bd93f9, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(5) .layui-table-cell { color: #ffb86c !important; box-shadow: inset 3px 0 0 #ffb86c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(6) .layui-table-cell { color: #f1fa8c !important; box-shadow: inset 3px 0 0 #f1fa8c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            
            /* --- Element UI 适配 (Vue/房堪上传) --- */
            
            /* 基础弹窗与背景 */
            .el-dialog, .el-dialog__header, .el-dialog__body, .el-dialog__footer {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            .el-dialog__title {
                color: var(--xhj-fg) !important;
            }
            .el-dialog__close {
                color: var(--xhj-comment) !important;
            }
            .el-dialog__close:hover {
                color: var(--xhj-active-bg) !important;
            }
            
            /* 输入框与选择器 */
            .el-input__inner, .el-textarea__inner {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
            .el-input__inner:focus, .el-textarea__inner:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color) !important;
            }
            .el-input.is-disabled .el-input__inner {
                background-color: rgba(255, 255, 255, 0.05) !important;
                color: var(--xhj-comment) !important;
                border-color: var(--xhj-border) !important;
            }
            
            /* 下拉菜单 */
            .el-select-dropdown {
                background-color: var(--xhj-bg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
            .el-select-dropdown__item {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
            }
            .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
                background-color: var(--xhj-selection) !important;
            }
            .el-select-dropdown__item.selected {
                color: var(--xhj-active-bg) !important;
                font-weight: bold !important;
            }
            
            /* 表单标签与单选 */
            .el-form-item__label {
                color: var(--xhj-fg) !important;
            }
            .el-radio {
                color: var(--xhj-fg) !important;
            }
            .el-radio__inner {
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: var(--xhj-active-bg) !important;
                background: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color);
            }
            .el-radio__label {
                color: var(--xhj-fg) !important;
            }
            
            /* 按钮 (Element UI) */
            .el-button {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
            }
            .el-button:hover, .el-button:focus {
                color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(98, 114, 164, 0.2) !important;
            }
            .el-button--primary {
                background-color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                color: #fff !important;
            }
            .el-button--primary:hover, .el-button--primary:focus {
                background-color: #bd93f9 !important; /* Dracula Pink/Purple lighter */
                border-color: #bd93f9 !important;
                box-shadow: 0 0 8px var(--xhj-glow-color);
            }

            /* 消除白色背景 */
            .bg-purple, .bg-purple-light, .grid-content {
                background-color: transparent !important;
            }

            /* --- 弹窗与上传适配 (重点修复) --- */
            
            /* 弹窗层 - 强制背景色 */
            .layui-layer, .layui-layer-page, .layui-layer-iframe, .layui-layer-dialog {
                background-color: var(--xhj-bg) !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.6) !important;
            }
            
            /* 弹窗标题 */
            .layui-layer-title {
                background-color: var(--xhj-header-bg) !important;
                color: var(--xhj-fg) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
            }
            
            /* 弹窗内容区域 - 深度覆盖 */
            .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            
            /* 修复房堪上传等表单模态框的白色背景 - 强力覆盖 */
            .layui-layer-content .layui-form, 
            .layui-layer-content .layui-card-body,
            .layui-layer-content > div,
            .layui-layer-content iframe {
                background-color: transparent !important;
            }
            
            /* 如果是 iframe 内部，可能需要这一行 */
            body[class*="layui-layer"] { background: var(--xhj-bg) !important; }

            /* 模态框内的表单项 */
            .layui-layer .layui-form-item,
            .layui-layer .layui-input-block,
            .layui-layer .layui-inline {
                background-color: transparent !important;
            }

            /* 模态框内的标签 */
            .layui-layer .layui-form-label {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
            }

            /* 上传区域 (加号框等) */
            .layui-upload-drag, .layui-upload-list, .pic-add {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border: 1px dashed var(--xhj-border) !important;
            }
            .layui-upload-drag:hover, .pic-add:hover {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(255, 255, 255, 0.1) !important;
                box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
            }
            .layui-upload-drag p, .layui-upload-drag i {
                color: var(--xhj-fg) !important;
            }

            /* 底部说明文字 */
            .layui-layer-content .layui-word-aux, 
            .layui-layer-content p, 
            .layui-layer-content span {
                color: var(--xhj-fg) !important;
            }
            
            /* 模态框按钮栏 */
            .layui-layer-btn {
                background-color: var(--xhj-header-bg) !important;
                border-top: 1px solid var(--xhj-border) !important;
                padding-top: 10px !important;
                padding-bottom: 10px !important;
            }
            .layui-layer-btn a {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-layer-btn .layui-layer-btn0 {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 10px var(--xhj-glow-color);
            }

            /* 上传组件 (Upload Drag / Box) */
            .layui-upload-drag, .pic-add, .upload-box {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border: 2px dashed var(--xhj-border) !important;
                border-radius: 8px !important;
            }
            .layui-upload-drag:hover, .pic-add:hover, .upload-box:hover {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(255, 255, 255, 0.08) !important;
            }
            .layui-upload-drag .layui-icon, .pic-add:after {
                color: var(--xhj-active-bg) !important;
            }
            .layui-upload-drag p {
                color: var(--xhj-fg) !important;
            }
            
            /* 下拉框与选项 */
            .layui-form-select dl {
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
            }
            .layui-form-select dl dd { color: var(--xhj-fg) !important; }
            .layui-form-select dl dd.layui-this {
                background-color: var(--xhj-active-bg) !important;
                color: #fff !important;
            }
            .layui-form-select dl dd:hover { background-color: var(--xhj-hover-bg) !important; }
            
            /* 自动同步按钮样式 (通过 ID 覆盖) */
            #auto-sync-button-v3 {
                background: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
            }
            #auto-sync-settings-v3 {
                background: var(--xhj-header-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
        `;
    };

    /* ==========================================================================
       模块 2: 核心逻辑 (Theme Logic)
       ========================================================================== */

    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes['default'];
        const css = getCssTemplate(theme.vars);
        
        const oldStyle = document.getElementById(STYLE_ID);
        if (oldStyle) oldStyle.remove();

        if (!css) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        
        // 强制给 body 加背景，防止闪烁
        const setBodyBg = () => {
             if (document.body) {
                 document.body.style.backgroundColor = theme.vars['--xhj-bg'] || '';
                 document.body.style.setProperty('background-color', theme.vars['--xhj-bg'] || '', 'important');
             }
        };
        setBodyBg();
        // 如果 DOM 还没准备好，等待加载完再设一次
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setBodyBg);
        }
    };

    const switchTheme = (themeName) => {
        localStorage.setItem(SKIN_STORAGE_KEY, themeName);
        applyTheme(themeName);
    };

    // 全局点击波纹特效逻辑
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('xhj-click-ripple');
        document.body.appendChild(ripple);
        
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });

    const createUI = () => {
        if (window.top !== window.self) return;

        const container = document.createElement('div');
        container.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;`;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🎨';
        toggleBtn.style.cssText = `
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(135deg, #00dbde, #fc00ff);
            color: white; border: 2px solid rgba(255,255,255,0.5);
            font-size: 24px; cursor: pointer; box-shadow: 0 0 20px rgba(252, 0, 255, 0.6);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            z-index: 100000;
            backdrop-filter: blur(5px);
        `;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute; bottom: 80px; right: 0;
            background: rgba(10, 10, 20, 0.85); backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
            padding: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05);
            display: none; width: 200px; transform-origin: bottom right;
            opacity: 0; transform: scale(0.8) translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        Object.keys(themes).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = themes[key].name;
            btn.style.cssText = `
                display: block; width: 100%; padding: 12px 16px; margin-bottom: 8px;
                border: 1px solid rgba(255,255,255,0.05); background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
                cursor: pointer; text-align: left; border-radius: 8px; color: #eee;
                transition: all 0.3s; font-size: 14px; font-weight: 500;
                position: relative; overflow: hidden;
            `;
            
            // 按钮悬停特效
            btn.onmouseenter = () => {
                btn.style.background = 'linear-gradient(90deg, var(--xhj-active-bg, #00dbde), transparent)';
                btn.style.color = '#fff';
                btn.style.transform = 'translateX(5px)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                btn.style.borderColor = 'rgba(255,255,255,0.3)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)';
                btn.style.color = '#eee';
                btn.style.transform = 'translateX(0)';
                btn.style.boxShadow = 'none';
                btn.style.borderColor = 'rgba(255,255,255,0.05)';
            };

            btn.onclick = () => { switchTheme(key); toggleMenu(false); };
            menu.appendChild(btn);
        });

        const toggleMenu = (show) => {
            if (show) {
                menu.style.display = 'block';
                // 强制重绘
                menu.offsetHeight;
                menu.style.opacity = '1';
                menu.style.transform = 'scale(1) translateY(0)';
            } else {
                menu.style.opacity = '0';
                menu.style.transform = 'scale(0.8) translateY(20px)';
                setTimeout(() => {
                    if (menu.style.opacity === '0') menu.style.display = 'none';
                }, 300);
            }
        };

        toggleBtn.onclick = () => {
            const isVisible = menu.style.display === 'block' && menu.style.opacity !== '0';
            toggleMenu(!isVisible);
        };
        
        // 鼠标悬停旋转特效
        toggleBtn.onmouseenter = () => {
            toggleBtn.style.transform = 'rotate(180deg) scale(1.1)';
            toggleBtn.style.boxShadow = '0 0 30px rgba(252, 0, 255, 0.8)';
        };
        toggleBtn.onmouseleave = () => {
            toggleBtn.style.transform = 'rotate(0deg) scale(1)';
            toggleBtn.style.boxShadow = '0 0 20px rgba(252, 0, 255, 0.6)';
        };

        container.appendChild(menu);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
    };

    /* ==========================================================================
       模块 3: 自动同步功能 (Auto Sync)
       ========================================================================== */

    const TARGET_FRAME_URLS = [
        'https://vr.xhj.com/houseadmin/house/index.html',
        'houseadmin/house/index.html' // 宽松匹配
    ];
    const BUTTON_ID = 'auto-sync-button-v3';
    const SETTINGS_BUTTON_ID = 'auto-sync-settings-v3';
    let isSyncRunning = false;

    function isInTargetFrame() {
        const frameUrl = window.location.href;
        return TARGET_FRAME_URLS.some(urlPattern => frameUrl.includes(urlPattern));
    }

    function initSyncButtons() {
        if (!isInTargetFrame()) return;
        
        // 清理旧按钮
        document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}`).forEach(btn => btn.remove());
        
        // 创建主按钮
        const triggerButton = document.createElement('button');
        triggerButton.id = BUTTON_ID;
        triggerButton.textContent = '开始自动同步';
        triggerButton.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 999999;
            padding: 8px 16px; border: none; border-radius: 4px;
            cursor: pointer; font-size: 14px; min-width: 140px;
            transition: all 0.3s;
            /* 默认样式，会被 CSS 变量覆盖 */
            background: #4CAF50; color: white;
        `;
        triggerButton.addEventListener('click', clickSyncButtons);
        document.body.appendChild(triggerButton);
        
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = SETTINGS_BUTTON_ID;
        settingsButton.textContent = '跳转并指定90';
        settingsButton.style.cssText = `
            position: fixed; top: 50px; right: 10px; z-index: 999999;
            padding: 8px 16px; border: none; border-radius: 4px;
            cursor: pointer; font-size: 14px; min-width: 60px;
            transition: all 0.3s;
            background: #2196F3; color: white;
        `;
        settingsButton.addEventListener('click', openSettings);
        document.body.appendChild(settingsButton);
    }

    function findSyncButtons() {
        const buttons = new Set();
        const xpath = "//*[contains(text(),'同步') or contains(@value,'同步')]";
        const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            if (!element.id?.startsWith('auto-sync-button') && isClickable(element) && isVisible(element)) {
                buttons.add(element);
            }
        }
        return Array.from(buttons);
    }

    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
            window.getComputedStyle(element).visibility !== 'hidden' &&
            window.getComputedStyle(element).display !== 'none';
    }

    function isClickable(element) {
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT'];
        return clickableTags.includes(element.tagName) ||
            element.onclick != null ||
            element.getAttribute('role') === 'button' ||
            window.getComputedStyle(element).cursor === 'pointer';
    }

    function updateButtonStatus(text, isProcessing = false) {
        const button = document.getElementById(BUTTON_ID);
        if (!button) return;
        button.textContent = text;
        // 样式由 CSS 控制，这里仅更新文字
        if (isProcessing) button.style.opacity = '0.8';
        else button.style.opacity = '1';
    }

    async function clickSyncButtons(e) {
        e.preventDefault();
        if (isSyncRunning) return;
        isSyncRunning = true;

        const buttons = findSyncButtons();
        let currentCount = 0;

        if (buttons.length === 0) {
            updateButtonStatus('未找到同步按钮');
            setTimeout(() => updateButtonStatus('开始自动同步'), 2000);
            isSyncRunning = false;
            return;
        }

        for (const button of buttons) {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                button.click();
                currentCount++;
                updateButtonStatus(`正在同步(${currentCount}/${buttons.length})`, true);
            } catch (error) {
                console.error('点击按钮时发生错误:', error);
            }
        }

        updateButtonStatus(`完成同步 ${currentCount} 个`, true);
        setTimeout(() => {
            updateButtonStatus('开始自动同步');
            isSyncRunning = false;
        }, 2000);
    }

    async function openSettings() {
        // ... (保持原有的设置逻辑) ...
        try {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const waitForElement = async (selector, timeout = 5000) => {
                const start = Date.now();
                while (Date.now() - start < timeout) {
                    const el = document.querySelector(selector);
                    if (el) return el;
                    await delay(100);
                }
                throw new Error(`Element not found: ${selector}`);
            };

            const tabIcon = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > div > i");
            tabIcon.click();
            await delay(200);
            
            const orderTab = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > dl > dd:nth-child(5)");
            orderTab.click();
            await delay(300);
            
            const searchButton = await waitForElement("#search");
            searchButton.click();
            await delay(4000);

            const select = await waitForElement("[id^='layui-laypage'] > span > select");
            select.value = "90";
            select.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (error) {
            console.error("自动化操作失败:", error);
        }
    }

    /* ==========================================================================
       初始化 (Initialization)
       ========================================================================== */

    const init = () => {
        // 1. 加载主题
        const currentTheme = localStorage.getItem(SKIN_STORAGE_KEY) || 'dracula';
        applyTheme(currentTheme);

        // 识别 iframe 并添加标识类 (用于 CSS 底部填充)
        if (window.top !== window.self) {
            document.body.classList.add('xhj-iframe-body');
        }
        
        // 注册全局点击特效事件
        document.addEventListener('click', (e) => {
            // 简单防抖或限制，避免过于频繁
            const ripple = document.createElement('div');
            ripple.className = 'xhj-click-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            
            // 动画结束后移除
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // 2. 识别表格类型 & 强力去白底
        setInterval(() => {
            const headers = document.querySelectorAll('.layui-table-header th');
            if (headers.length > 0) {
                const headerTexts = Array.from(headers).map(th => th.textContent.trim());
                const body = document.body;
                
                if (headerTexts.some(t => t.includes('申请门店')) && (headerTexts.some(t => t.includes('房勘状态')) || headerTexts.some(t => t.includes('房堪状态')))) {
                    if (!body.classList.contains('xhj-table-survey')) {
                        body.classList.add('xhj-table-survey');
                        body.classList.remove('xhj-table-sales');
                    }
                } else if (headerTexts.some(t => t.includes('全景状态')) && headerTexts.some(t => t.includes('户型图'))) {
                    if (!body.classList.contains('xhj-table-sales')) {
                        body.classList.add('xhj-table-sales');
                        body.classList.remove('xhj-table-survey');
                    }
                    // 动态查找“操作”列并注入样式
                    const updateColumnWidth = (headerName, newWidth, styleIdSuffix, whiteSpace = 'normal') => {
                         const idx = headerTexts.findIndex(t => t.trim().includes(headerName));
                         if (idx !== -1) {
                             const cssIdx = idx + 1;
                             const styleId = `xhj-sales-${styleIdSuffix}-col`;
                             if (!document.getElementById(styleId)) {
                                 const style = document.createElement('style');
                                 style.id = styleId;
                                 style.textContent = `
                                     body.xhj-table-sales .layui-table tr td:nth-child(${cssIdx}) .layui-table-cell,
                                     body.xhj-table-sales .layui-table th:nth-child(${cssIdx}) .layui-table-cell {
                                         min-width: ${newWidth}px !important; width: ${newWidth}px !important;
                                         white-space: ${whiteSpace} !important;
                                         text-align: center !important;
                                     }
                                 `;
                                 document.head.appendChild(style);
                             }
                         }
                    };

                    // 1. 操作列 (原125px * 1.4 * 1.3 ≈ 228px)
                    const actionIndex = headerTexts.findIndex(t => t.trim() === '操作');
                    if (actionIndex !== -1) {
                        const cssIndex = actionIndex + 1; 
                        const styleId = 'xhj-sales-action-col';
                        if (!document.getElementById(styleId)) {
                             const style = document.createElement('style');
                             style.id = styleId;
                             style.textContent = `
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-table-cell,
                                 body.xhj-table-sales .layui-table th:nth-child(${cssIndex}) .layui-table-cell {
                                     min-width: 228px !important; width: 228px !important;
                                     padding: 0 4px !important;
                                     text-align: center !important;
                                 }
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-btn {
                                     padding: 0 5px !important;
                                     height: 22px !important;
                                     line-height: 22px !important;
                                     font-size: 12px !important;
                                     margin: 2px !important;
                                     min-width: unset !important;
                                 }
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-btn i {
                                     margin-right: 0 !important;
                                     font-size: 14px !important;
                                 }
                             `;
                             document.head.appendChild(style);
                        }
                    }

                    // 2. 全景状态 (原60px * 1.4 ≈ 84px)
                    updateColumnWidth('全景状态', 84, 'status');

                    // 3. 设计师 (原40px * 2 = 80px)
                    updateColumnWidth('设计师', 80, 'designer');

                    // 4. 上传人 (原60px * 1.2 = 72px)
                    updateColumnWidth('上传人', 72, 'uploader');

                    // 5. 户型图 (原估100px * 0.8 = 80px)
                    updateColumnWidth('户型图', 80, 'floorplan');

                    // 6. 城市 (原估100px * 0.7 = 70px)
                    updateColumnWidth('城市', 70, 'city');
                    
                    // 7. 朝向 (增加宽度)
                    updateColumnWidth('朝向', 60, 'orientation');

                    // 8. 卧室 (原60px * 1.4 ≈ 84px)
                    updateColumnWidth('卧室', 84, 'bedroom');

                    // 9. 全景时间 (90px, 单行)
                    updateColumnWidth('全景时间', 90, 'pano-time', 'nowrap');

                    // 10. 同步时间 (90px, 单行)
                    updateColumnWidth('同步时间', 90, 'sync-time', 'nowrap');
                }
            }
            
            // 修复“新增房堪图”弹窗高度不足导致按钮被遮挡的问题
            const layerTitles = document.querySelectorAll('.layui-layer-title');
            layerTitles.forEach(title => {
                if (title.textContent.trim().includes('新增房堪图') || title.textContent.trim().includes('房堪上传')) {
                    const layer = title.closest('.layui-layer');
                    if (layer && !layer.dataset.xhjResized) {
                        const increase = 60; // 增加 60px 高度 (大幅减少，防止底部留黑)
                        const increaseWidth = 100; // 增加 100px 宽度

                        // 1. 调整外层高度
                        if (layer.style.height) {
                            const h = parseInt(layer.style.height);
                            layer.style.height = (h + increase) + 'px';
                        }
                        
                        // 2. 调整 Top (保持居中)
                        if (layer.style.top) {
                            const t = parseInt(layer.style.top);
                            // 简单的居中调整，防止溢出顶部
                            let newTop = t - increase / 2;
                            if (newTop < 5) newTop = 5;
                            layer.style.top = newTop + 'px';
                        }

                        // 3. 调整宽度 (防止左右贴边)
                        if (layer.style.width) {
                             const w = parseInt(layer.style.width);
                             layer.style.width = (w + increaseWidth) + 'px';
                             if (layer.style.left) {
                                 const l = parseInt(layer.style.left);
                                 layer.style.left = (l - increaseWidth / 2) + 'px';
                             }
                        }

                        // 4. 调整 content 区域
                        const content = layer.querySelector('.layui-layer-content');
                        if (content) {
                             if (content.style.height) {
                                const ch = parseInt(content.style.height);
                                content.style.height = (ch + increase) + 'px';
                             }
                        }

                        // 5. 调整 iframe 高度
                        const iframe = layer.querySelector('iframe');
                        if (iframe) {
                            if (iframe.style.height) {
                                const ih = parseInt(iframe.style.height);
                                iframe.style.height = (ih + increase) + 'px';
                            }
                        }

                        layer.dataset.xhjResized = 'true';
                    }
                }
            });
            
            // 强力去白底 (针对 iframe 或 动态加载的模态框内容)
            const whiteElements = document.querySelectorAll('.layui-bg-white, [style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: rgb(255, 255, 255)"]');
            whiteElements.forEach(el => {
                 // 排除某些可能需要保留的元素，但模态框内容一般都要去白
                 if (el.closest('.layui-layer-content')) {
                     el.style.setProperty('background-color', 'transparent', 'important');
                 }
            });
            
            // 确保 iframe 内部也应用透明背景
             const iframes = document.querySelectorAll('iframe');
             iframes.forEach(iframe => {
                 try {
                     const doc = iframe.contentDocument || iframe.contentWindow.document;
                     if (doc && doc.body) {
                          doc.body.style.backgroundColor = 'var(--xhj-bg)';
                          // 递归去白
                          const innerWhite = doc.querySelectorAll('.layui-bg-white, .admin-main, .layui-fluid');
                          innerWhite.forEach(el => el.style.setProperty('background-color', 'transparent', 'important'));
                     }
                 } catch(e) {
                     // 跨域无法操作，忽略
                 }
             });
             
             // 如果当前是 iframe 环境，强制自身背景
             if (window.top !== window.self) {
                 if (document.body) {
                      document.body.style.backgroundColor = 'var(--xhj-bg)';
                      document.body.style.setProperty('background-color', 'var(--xhj-bg)', 'important');
                 }
                 // 针对可能的容器 div
                 const containers = document.querySelectorAll('.layui-fluid, .admin-main, #app');
                 containers.forEach(c => c.style.setProperty('background-color', 'transparent', 'important'));
             }
             
         }, 500);

        // 3. 监听跨窗口同步
        window.addEventListener('storage', (e) => {
            if (e.key === SKIN_STORAGE_KEY) applyTheme(e.newValue);
        });

        // 4. 初始化 UI 和 自动同步按钮
        const initDOM = () => {
            createUI();
            initSyncButtons();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOM);
        } else {
            initDOM();
        }
    };

    init();

})();
