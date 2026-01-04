// ==UserScript==
// @name         知乎收藏夹 Pro
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  (1) 使用 AI 为知乎收藏夹一键生成描述。(2) 使用 AI 整理与重分类收藏夹。(3) [todo]替换知乎收藏按钮，直接用AI辅助分类
// @author       https://github.com/ienone
// @match        https://www.zhihu.com/collection/*
// @match        https://www.zhihu.com/collections/mine*
// @match        https://www.zhihu.com/people/*/collections*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @connect      api.deepseek.com
// @connect      zhuanlan.zhihu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     CHART_JS https://cdn.jsdelivr.net/npm/chart.js
// @downloadURL https://update.greasyfork.org/scripts/540407/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/540407/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E5%A4%B9%20Pro.meta.js
// ==/UserScript==



/* jshint esversion: 11 */

(function() {
    'use strict';

    const ZHIHU_BLUE = '#056DE8';
    let moveHistory = []; // 用于存储所有成功的移动操作
    let progressDashboardState = {}; // 存储仪表盘的所有状态
    let chartInstances = {}; // 存储Chart.js实例

    /**
     * 生成一系列颜色用于图表
     */
    function generateColors(count) {
        const colors = [];
        const baseHue = 200; // 知乎蓝的色相
        for (let i = 0; i < count; i++) {
            // 使用黄金分割角来生成视觉上分散的颜色
            const hue = (baseHue + (i * 137.508)) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    }

    // --- 1. 自定义 CSS ---
    GM_addStyle(`

        /* --- Shimmer 加载动画效果 --- */
        .zcp-shimmer {
            position: relative;
            overflow: hidden;
        }
        .zcp-shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(100deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 80%);
            transform: translateX(-100%);
            animation: zcp-shimmer-animation 1.5s infinite;
        }
        @keyframes zcp-shimmer-animation {
            100% {
                transform: translateX(100%);
            }
        }

        /* --- AI 功能按钮 --- */
        button#zcp-ai-btn.zcp-ai-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            height: 36px;
            background-color: ${ZHIHU_BLUE} !important;
            color: white !important;
            border: none !important;
            border-radius: 12px;
            cursor: pointer;
            padding: 0 16px;
            margin-left: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }

        button#zcp-ai-btn.zcp-ai-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.1) !important;
        }

        button#zcp-ai-btn.zcp-ai-button:active {
            transform: translateY(1px) !important;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.2) !important;
        }

        button#zcp-ai-btn.zcp-ai-button:disabled {
            background-color: #A0A0A0 !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
            opacity: 0.8;
        }

        button#zcp-ai-btn.zcp-ai-button .zcp-ai-icon {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            fill: currentColor;
        }
        
        .zcp-spinner {
            width: 22px;
            height: 22px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #ffffff;
            animation: zcp-spin 1s ease-in-out infinite;
        }
        @keyframes zcp-spin { to { transform: rotate(360deg); } }

        /* --- 模态框样式 --- */
        .zcp-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; z-index: 9999;
        }
        .zcp-modal-container {
            background-color: #ffffff;
            padding: 28px;
            border-radius: 24px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            width: 90%;
            max-width: 520px;
        }
        .zcp-modal-header {
            font-size: 22px; color: #1a1a1a; font-weight: 600;
            margin-bottom: 24px; text-align: center;
        }

        /* --- [修改] 供用户修改的文本框样式 --- */
        .zcp-modal-content textarea {
            width: 100%;
            min-height: 120px;
            border-radius: 12px;
            border: 1px solid #EAEAEA;
            padding: 14px;
            font-size: 16px;
            resize: vertical;
            box-sizing: border-box;
            background-color: #FDFDFD;
            color: #333;
            /* [修改] 为常态文本框添加入下沉效果 */
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
            transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE and Edge */
        }
        .zcp-modal-content textarea::-webkit-scrollbar { display: none; }

        /* [修改] 输入时下沉效果加深 */
        .zcp-modal-content textarea:focus {
            outline: none;
            border-color: #D0D0D0;
            background-color: #fff;
            /* 下沉效果更明显 */
            box-shadow: inset 0 3px 6px rgba(0,0,0,0.08);
        }

        .zcp-modal-actions {
            display: flex; justify-content: flex-end;
            margin-top: 24px; gap: 12px;
        }

        /* --- 模态框按钮 --- */
        .zcp-modal-button {
            padding: 10px 24px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s;
        }
        
        /* [修改] 统一并强化所有按钮的按下(active)效果 */
        .zcp-modal-button:active {
            transform: translateY(1px); /* 轻微下移 */
        }

        .zcp-modal-button.primary {
            background-color: ${ZHIHU_BLUE};
            color: white;
            box-shadow: 0 2px 5px rgba(5, 109, 232, 0.3);
        }
        .zcp-modal-button.primary:hover {
            opacity: 0.9;
            box-shadow: 0 4px 8px rgba(5, 109, 232, 0.35);
        }
        .zcp-modal-button.primary:active {
            /* 使用内阴影来创建清晰的“按下”感 */
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.2);
        }

        .zcp-modal-button.secondary {
            background-color: #f0f2f5;
            color: #333;
            border: 1px solid #EAEAEA;
        }
        .zcp-modal-button.secondary:hover {
            border-color: #DDD;
            background-color: #E9E9E9;
        }
        .zcp-modal-button.secondary:active {
            background-color: #E2E2E2;
            /* 使用内阴影来创建清晰的“按下”感 */
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
        }


    /* --- 功能二：整理 UI --- */

    /* 整理入口按钮 */
    button#zcp-organize-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        height: 36px;
        background-color: ${ZHIHU_BLUE} !important;
        color: white !important;
        border: none !important;
        border-radius: 12px;
        cursor: pointer;
        padding: 0 16px;
        margin-right: 20px; /*  与右侧按钮拉开距离 */
        margin-left: auto; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    button#zcp-organize-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.1) !important;
    }
    button#zcp-organize-btn:active {
        transform: translateY(1px) !important;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.2) !important;
    }
    button#zcp-organize-btn .zcp-ai-icon {
        width: 18px; height: 18px; fill: currentColor; margin-right: 6px;
    }
    button#zcp-organize-btn:disabled {
        background-color: #A0A0A0 !important;
        cursor: not-allowed !important;
        transform: none !important;
        box-shadow: none !important;
        opacity: 0.8;
    }

    /* 整理模态框 - 设置界面 */
    .zcp-organize-settings .zcp-fieldset {
        margin-bottom: 20px; border: 1px solid #e9e9e9; padding: 12px 16px;
        border-radius: 12px; background: #fcfcfc;
    }
    .zcp-organize-settings legend { font-weight: 600; padding: 0 8px; color: #333; }
    .zcp-collection-list { max-height: 150px; overflow-y: auto; padding: 5px; }
    .zcp-collection-list label { display: block; margin-bottom: 8px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background-color 0.2s; }
    .zcp-collection-list label:hover { background-color: #f0f2f5; }
    .zcp-collection-list input { margin-right: 10px; }

    /* --- 统一自定义复选框样式 --- */
    .zcp-custom-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 8px;
        padding: 4px; /* 增加点击区域 */
        border-radius: 6px;
        transition: background-color 0.2s;
    }
    .zcp-custom-checkbox:hover {
        background-color: #f0f2f5;
    }
    .zcp-custom-checkbox input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    .zcp-checkbox-visual {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 16px; /* 统一尺寸 */
        height: 16px;
        border: 2px solid #ccc; /* 默认边框 */
        border-radius: 5px;
        background-color: transparent;
        transition: all 0.2s ease-out;
    }
    .zcp-custom-checkbox:hover .zcp-checkbox-visual {
        border-color: #999;
    }
    /* 选中时，用伪元素创建内部小圆角正方形 */
    .zcp-checkbox-visual::after {
        content: '';
        display: block;
        width: 12px;
        height: 12px;
        background-color: ${ZHIHU_BLUE};
        border-radius: 2px; /* 小圆角正方形 */
        transform: scale(0);
        transition: transform 0.2s ease-in-out;
    }
    .zcp-custom-checkbox input[type="checkbox"]:checked + .zcp-checkbox-visual::after {
        transform: scale(1);
    }
    
    /* 针对收藏夹列表调整间距和大小 */
    .zcp-collection-list .zcp-custom-checkbox {
        width: 100%;
        gap: 12px;
    }

    .zcp-options-grid { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .zcp-options-grid input[type="number"] {
        border-radius: 8px;
        border: 1px solid #EAEAEA;
        padding: 6px 8px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: #FDFDFD;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
        transition: box-shadow 0.2s, border-color 0.2s;
        text-align: center;
        -moz-appearance: textfield; /* Firefox */
    }
    .zcp-options-grid input[type="number"]::-webkit-outer-spin-button,
    .zcp-options-grid input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .zcp-options-grid input[type="number"]:focus {
        outline: none;
        border-color: #D0D0D0;
        box-shadow: inset 0 3px 6px rgba(0,0,0,0.08);
    }

    /* 模态框尺寸过渡动画 */
    .zcp-modal-container {
        transition: max-width 0.5s ease-in-out, max-height 0.5s ease-in-out;
    }
    .zcp-modal-container.dashboard-mode {
        max-width: 1200px;
        width: 95%;
    }

    /* 整理模态框 - 仪表盘(Dashboard)总布局 */
    .zcp-dashboard-container {
        display: flex;
        gap: 24px;
        height: 60vh; /* 建议高度 */
        min-height: 500px;
    }
    .zcp-dashboard-left {
        width: 35%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .zcp-dashboard-right {
        width: 65%;
        display: flex;
        flex-direction: column;
    }

    /* 图表容器样式 */
    .zcp-chart-container {
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 15px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .zcp-chart-container h3 {
        margin: 0 0 10px 5px;
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }
    .zcp-chart-wrapper {
        position: relative;
        flex-grow: 1;
    }
    .zcp-chart-container canvas {
        cursor: pointer;
    }

    /* 日志区域新样式 */
    .zcp-progress-log {
        height: 100%; /* 占满右侧所有可用空间 */
        overflow-y: auto;
        background-color: #fdfdfd;
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 13px;
        line-height: 1.6;
        color: #444;
    }

    /* 日志条目新样式 */
    .zcp-log-item {
        padding: 8px 12px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .zcp-log-item:last-child {
        border-bottom: none;
    }
    .zcp-log-title {
        font-weight: 600;
        color: #1a1a1a;
    }
    .zcp-log-title a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s;
    }
    .zcp-log-title a:hover {
        color: ${ZHIHU_BLUE};
        text-decoration: underline;
    }
    .zcp-log-path {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #666;
    }
    .zcp-log-path .zcp-log-collection {
        background: #f0f2f5;
        padding: 2px 6px;
        border-radius: 4px;
    }
    .zcp-log-path .zcp-log-arrow {
        color: #999;
    }
    .zcp-log-path .zcp-log-status-text {
        font-style: italic;
    }
    .zcp-log-item.status-error .zcp-log-path .zcp-log-status-text {
        color: #dc3545;
        font-weight: bold;
    }

    /* 状态颜色应用 */
    .zcp-log-item.status-success .zcp-log-path .zcp-log-collection.target {
        background-color: #e6ffed;
        border: 1px solid #b7eb8f;
    }
    .zcp-log-item.status-skipped .zcp-log-path {
        color: #087a91;
    }
    .zcp-log-item.status-dryrun .zcp-log-path {
        color: #6c757d;
    }
    
    .zcp-undo-btn, .zcp-redo-btn {
        background: #e9e9e9; border: 1px solid #ddd; color: #555;
        padding: 2px 8px; font-size: 11px; border-radius: 5px; cursor: pointer;
        transition: all 0.2s; margin-left: auto; /* 推到最右边 */
    }
    .zcp-undo-btn:hover { background: #dcdcdc; border-color: #ccc; }
    .zcp-redo-btn { background: #e6f7ff; border: 1px solid #91d5ff; color: #096dd9; }
    .zcp-redo-btn:hover { background: #bae7ff; border-color: #69c0ff; }
    .zcp-undo-btn:disabled, .zcp-redo-btn:disabled {
        background: #f5f5f5; color: #aaa; cursor: not-allowed; border-color: #eee;
    }

    /* 底部按钮区域样式 */
    .zcp-modal-actions.dashboard-mode {
        justify-content: space-between;
        align-items: center;
    }
    .zcp-modal-actions .zcp-progress-stats {
        font-size: 13px; color: #666;
    }
    `);


    // --- 2. 核心 API 调用与工具函数 ---

    /**
     * 获取知乎 API 请求所需的 headers
     */
    function getZhihuApiHeaders() {
        const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('_xsrf='))?.split('=')[1];
        if (!xsrfToken) {
            throw new Error('无法找到 _xsrf token，请确保您已登录知乎。');
        }
        return {
            'Content-Type': 'application/json',
            'x-xsrftoken': xsrfToken,
        };
    }

    /**
     * 调用 DeepSeek API
     */
    async function callDeepSeek(prompt) {
        const apiKey = await GM_getValue('deepseek_api_key', '');
        if (!apiKey) {
            alert('请先在油猴脚本菜单中设置 DeepSeek API Key！');
            throw new Error('DeepSeek API Key 未设置');
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.deepseek.com/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                data: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { "role": "system", "content": "你是一位专业的知识库管理员和内容分析专家。" },
                        { "role": "user", "content": prompt }
                    ],
                    temperature: 0.7,
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const result = JSON.parse(response.responseText);
                        resolve(result.choices[0].message.content.trim());
                    } else {
                        console.error('DeepSeek API Error:', response);
                        reject(`API 请求失败: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    console.error('Network Error calling DeepSeek:', error);
                    reject('网络错误，无法连接到 DeepSeek API');
                }
            });
        });
    }
    // --- 功能二：API 封装与工具函数 ---

    /**
     * 从页面 URL 中获取当前用户的 ID
     */
    function getUserId() {
        const match = window.location.pathname.match(/\/people\/([^/]+)/);
        if (!match) throw new Error("无法在URL中找到用户ID");
        return match[1];
    }
    /**
     * "API"-1: 获取用户所有收藏夹 (已修改为从页面DOM抓取，不再使用API)
     */
    async function fetchAllUserCollections() {
        console.log('[知乎收藏夹 Pro] 正在从当前页面抓取收藏夹列表...');

        const itemElements = document.querySelectorAll('.SelfCollectionItem-innerContainer');

        if (itemElements.length === 0) {
            throw new Error('在当前页面上没有找到任何收藏夹。请确保您在 "我的收藏" (collections/mine) 页面，且收藏夹列表已完全加载。');
        }

        const allCollections = Array.from(itemElements).map(item => {
            const titleElement = item.querySelector('a.SelfCollectionItem-title');
            const descriptionElement = item.querySelector('.SelfCollectionItem-description');

            if (!titleElement || !titleElement.href) {
                console.warn('[知乎收藏夹 Pro] 跳过一个无效的收藏夹元素 (缺少标题链接)。');
                return null; // 跳过缺少标题链接的元素
            }

            // 提取标题：通过获取第一个文本节点来提取
            // 例如，从 `<a>文化<span>...</span></a>` 中正确提取 "文化"
            const title = (titleElement.childNodes[0] && titleElement.childNodes[0].nodeType === Node.TEXT_NODE)
                ? titleElement.childNodes[0].nodeValue.trim()
                : titleElement.textContent.trim();
            
            // 从链接中提取 URL 和收藏夹 ID
            const url = titleElement.href;
            const idMatch = url.match(/\/collection\/(\d+)/);
            const id = idMatch ? idMatch[1] : null;

            // 提取描述，如果存在的话
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';

            if (id && title) {
                return { id, title, description };
            }
            
            console.warn(`[知乎收藏夹 Pro] 解析一个收藏夹时失败，标题: "${title}", URL: "${url}"`);
            return null;
        }).filter(Boolean); // 过滤掉所有解析失败的 null 条目

        if (allCollections.length === 0) {
             throw new Error('成功找到收藏夹的HTML元素，但未能解析出任何有效的收藏夹信息。页面结构可能已更新。');
        }

        console.log(`[知乎收藏夹 Pro] 成功从页面抓取 ${allCollections.length} 个收藏夹。`);
        return allCollections;
    }
    /**
     * API-2: 获取单个收藏夹的所有内容
     */
    async function fetchCollectionItems(collectionId) {
        let allItems = [];
        let nextUrl = `/api/v4/collections/${collectionId}/items?limit=20&offset=0`;

        while (nextUrl) {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: nextUrl,
                    headers: getZhihuApiHeaders(),
                    onload: res => {
                        if (res.status === 200) resolve(JSON.parse(res.responseText));
                        else reject(new Error(`获取收藏夹内容失败: ${res.status}`));
                    },
                    onerror: err => reject(new Error('网络错误'))
                });
            });
            allItems = allItems.concat(response.data);
            nextUrl = response.paging.is_end ? null : response.paging.next;
        }
        return allItems;
    }

    /**
     * API-3: 抓取文章/回答正文
     */
    async function scrapeContent(url) {
        const html = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: res => {
                    if (res.status === 200) resolve(res.responseText);
                    else reject(new Error(`抓取内容失败: ${res.status} for ${url}`));
                },
                onerror: err => reject(new Error('网络错误'))
            });
        });
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const contentElement = doc.querySelector('.RichText.ztext');
        return contentElement ? contentElement.innerText.trim() : '正文抓取失败';
    }

    /**
     * API-4: 添加内容到收藏夹
     */
    async function addToCollection(contentId, contentType, targetCollectionId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `/api/v4/collections/${targetCollectionId}/contents?content_id=${contentId}&content_type=${contentType}`,
                headers: getZhihuApiHeaders(),
                data: '{}',
                onload: res => {
                    if (res.status === 200 && JSON.parse(res.responseText).success) resolve(true);
                    else reject(new Error(`添加失败: ${res.responseText}`));
                },
                onerror: err => reject(new Error('网络错误'))
            });
        });
    }

    /**
     * API-5: 从收藏夹移除内容
     */
    async function removeFromCollection(contentId, contentType, sourceCollectionId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'DELETE',
                url: `/api/v4/collections/${sourceCollectionId}/contents/${contentId}?content_type=${contentType}`,
                headers: getZhihuApiHeaders(),
                onload: res => {
                    if (res.status === 200 && JSON.parse(res.responseText).success) resolve(true);
                    else reject(new Error(`移除失败: ${res.responseText}`));
                },
                onerror: err => reject(new Error('网络错误'))
            });
        });
    }

    /**
     * 为整理功能构建 AI Prompt
     */
    function buildOrganizationPrompt(articleContent, articleTitle, targetCollections) {
        const collectionInfo = targetCollections
            .map(c => `- ${c.title}: ${c.description || '无描述'}`)
            .join('\n');

        return `你是一位图书管理员，任务是将一篇文章精准地分类到一个最合适的收藏夹中。

这是待分类的文章：
标题：${articleTitle}
正文摘要（前500字）：${articleContent.substring(0, 500)}...

这是你的可用收藏夹列表和它们的简介：
${collectionInfo}

请分析文章内容，并从上面的列表中，选择一个最匹配的收藏夹。
你的回答必须只包含你选择的收藏夹的 **完整标题**，不要添加任何解释、引号或其他文字。

例如，如果最匹配的是“技术视野”，你就只回答“技术视野”。

你选择的收藏夹标题是：`;
    }


    // --- 功能二：UI 渲染与流程控制 ---

    /**
     * 注入“整理”按钮
     */
    function injectOrganizeButton(container) {
        const organizeButton = document.createElement('button');
        organizeButton.id = 'zcp-organize-btn';
        organizeButton.className = 'zcp-ai-button';
        const svgIcon = `<svg class="zcp-ai-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M399.825455 247.901091a23.272727 23.272727 0 0 1 43.659636 0L493.381818 382.743273a23.272727 23.272727 0 0 0 13.730909 13.730909l134.842182 49.896727a23.272727 23.272727 0 0 1 0 43.659636L507.112727 539.927273a23.272727 23.272727 0 0 0-13.730909 13.730909l-49.896727 134.842182a23.272727 23.272727 0 0 1-43.659636 0l-49.896728-134.842182a23.272727 23.272727 0 0 0-13.730909-13.730909l-134.842182-49.896728a23.272727 23.272727 0 0 1 0-43.659636l134.842182-49.896727a23.272727 23.272727 0 0 0 13.730909-13.730909L399.825455 247.901091zM738.769455 584.890182a9.309091 9.309091 0 0 1 17.454545 0l27.461818 74.333091a9.309091 9.309091 0 0 0 5.538909 5.492363l74.286546 27.461819a9.309091 9.309091 0 0 1 0 17.50109l-74.286546 27.461819a9.309091 9.309091 0 0 0-5.492363 5.538909l-27.508364 74.286545a9.309091 9.309091 0 0 1-17.454545 0l-27.508364-74.286545a9.309091 9.309091 0 0 0-5.492364-5.492364l-74.333091-27.508364a9.309091 9.309091 0 0 1 0-17.454545l74.333091-27.508364a9.309091 9.309091 0 0 0 5.492364-5.492363l27.461818-74.333091z"></path></svg>`;
        organizeButton.innerHTML = `${svgIcon}<span>整理</span>`;
        container.appendChild(organizeButton);

        organizeButton.addEventListener('click', handleOrganizeClick);
        // 定位到“新建收藏夹”按钮
        const newCollectionButton = container.querySelector('.CollectionsHeader-addFavlistButton, .css-10dextj'); // 兼容新旧class

        if (newCollectionButton) {
            // 将按钮插入到“新建收藏夹”按钮之前
            container.insertBefore(organizeButton, newCollectionButton);
        } else {
            // 如果找不到，作为备选方案，还是添加到容器末尾
            container.appendChild(organizeButton);
        }

        organizeButton.addEventListener('click', handleOrganizeClick);
    }
    /**
     * 点击“整理”按钮后的处理
     */
    async function handleOrganizeClick(event) {
        const button = event.currentTarget;
        button.disabled = true;
        button.querySelector('span').textContent = '加载中...';

        try {
            const collections = await fetchAllUserCollections();
            showOrganizeSettingsModal(collections);
        } catch (error) {
            alert(`加载收藏夹列表失败: ${error.message}`);
        } finally {
            button.disabled = false;
            button.querySelector('span').textContent = '整理';
        }
    }

    /**
     * 显示整理的设置模态框
     */
    function showOrganizeSettingsModal(collections) {
        const overlay = document.createElement('div');
        overlay.className = 'zcp-modal-overlay';
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

        const createCollectionCheckbox = (c, name) => `
            <label class="zcp-custom-checkbox" title="${c.description || '无描述'}">
                <input type="checkbox" name="${name}" value="${c.id}">
                <span class="zcp-checkbox-visual"></span>
                <span>${c.title}</span>
            </label>`;

        const collectionOptions = collections.map(c => createCollectionCheckbox(c, 'source-collection')).join('');
        const targetCollectionOptions = collections.map(c => createCollectionCheckbox(c, 'target-collection')).join('');

        overlay.innerHTML = `
            <div class="zcp-modal-container">
                <div class="zcp-modal-header">整理收藏夹</div>
                <div class="zcp-modal-content zcp-organize-settings">
                    <fieldset class="zcp-fieldset">
                        <legend>1. 选择源收藏夹 (待整理)</legend>
                        <div class="zcp-collection-list" id="zcp-source-list">${collectionOptions}</div>
                    </fieldset>
                    <fieldset class="zcp-fieldset">
                        <legend>2. 选择目标收藏夹 (分类目的地)</legend>
                        <div class="zcp-collection-list" id="zcp-target-list">${targetCollectionOptions}</div>
                    </fieldset>
                    <fieldset class="zcp-fieldset">
                        <legend>3. 设置</legend>
                        <div class="zcp-options-grid">
                            <label class="zcp-custom-checkbox">
                                <input type="checkbox" id="zcp-dry-run" checked>
                                <span class="zcp-checkbox-visual"></span>
                                <span>试运行 (Dry Run)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <span>并发数:</span>
                                <input type="number" id="zcp-concurrency" value="3" min="1" max="5" style="width: 50px;">
                            </label>
                        </div>
                    </fieldset>
                </div>
                <div class="zcp-modal-actions">
                    <button id="zcp-cancel-btn" class="zcp-modal-button secondary">取消</button>
                    <button id="zcp-start-btn" class="zcp-modal-button primary">开始整理</button>
                </div>
            </div>`;

        document.body.appendChild(overlay);

        const closeModal = () => document.body.removeChild(overlay);
        overlay.querySelector('#zcp-cancel-btn').addEventListener('click', closeModal);
        overlay.querySelector('#zcp-start-btn').addEventListener('click', () => {
             startOrganizationProcess(collections, overlay);
        });
    }

    /**
     * 开始整理流程，构建任务队列并启动 workers
     */
    async function startOrganizationProcess(allCollectionsData, modalOverlay) {
        // 1. 从UI获取设置
        const getCheckedValues = name => Array.from(modalOverlay.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
        const sourceIds = getCheckedValues('source-collection');
        const targetIds = getCheckedValues('target-collection');
        const isDryRun = modalOverlay.querySelector('#zcp-dry-run').checked;
        const concurrency = parseInt(modalOverlay.querySelector('#zcp-concurrency').value, 10);

        if (sourceIds.length === 0 || targetIds.length === 0) {
            alert('请至少选择一个源收藏夹和一个目标收藏夹！');
            return;
        }

        const startBtn = modalOverlay.querySelector('#zcp-start-btn');
        const originalBtnText = startBtn.textContent; // 保存原始文本
        
        // [修改] 禁用按钮，更新文本，并添加 Shimmer 效果
        startBtn.disabled = true;
        startBtn.textContent = '正在构建任务...';
        startBtn.classList.add('zcp-shimmer');

        // 重置历史记录
        moveHistory = [];

        // 2. 构建任务队列
        const taskQueue = [];
        try {
            for (const sourceId of sourceIds) {
                const items = await fetchCollectionItems(sourceId);
                items.forEach((item, index) => {
                    if (item.content) {
                        taskQueue.push({
                            id: `task-${sourceId}-${index}`,
                            contentId: item.content.id,
                            contentType: item.content.type,
                            title: item.content.question ? item.content.question.title : item.content.title,
                            url: item.content.url.replace('http:', 'https:'),
                            sourceCollectionId: sourceId,
                            status: 'pending', // 初始状态
                        });
                    }
                });
            }
        } catch(e) {
            alert(`构建任务失败: ${e.message}`);
            // [修改] 在出错时恢复按钮状态
            startBtn.disabled = false;
            startBtn.textContent = originalBtnText; // 恢复原始文本
            startBtn.classList.remove('zcp-shimmer'); // 移除流光效果
            return;
        }

        if (taskQueue.length === 0) {
            alert('选中的源收藏夹中没有内容可供整理。');
            startBtn.disabled = false;
            startBtn.textContent = '开始整理';
            return;
        }

        // 3. 初始化仪表盘的全局状态对象
        const sourceCollections = allCollectionsData.filter(c => sourceIds.includes(c.id));
        const targetCollections = allCollectionsData.filter(c => targetIds.includes(c.id));
        // 合并并去重所有涉及的收藏夹
        const allInvolvedCollections = [...sourceCollections, ...targetCollections]
            .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

        progressDashboardState = {
            stats: {
                moved: 0,
                skipped: 0,
                error: 0,
                pending: taskQueue.length
            },
            collections: {}, // 用于存储增减统计
            logs: taskQueue.map(t => ({ ...t, message: '' })), // 扩展任务队列为日志对象
            // 将 filter 从字符串改为对象，以支持更复杂的筛选
            filter: { type: 'all', value: null }, 
            isDryRun: isDryRun,
            allCollectionsData: allCollectionsData, // 缓存所有收藏夹信息
            targetCollectionsData: targetCollections // 缓存目标收藏夹信息
        };

        allInvolvedCollections.forEach(c => {
            progressDashboardState.collections[c.id] = { title: c.title, added: 0, removed: 0 };
        });

        // 4. 切换到仪表盘UI并初始化
        await showDashboardUI(modalOverlay);

        // 5. 启动 Workers
        const workers = [];
        for (let i = 0; i < concurrency; i++) {
            // 将 taskQueue 传递给 worker
            workers.push(worker(taskQueue));
        }

        await Promise.all(workers);

        // 6. 任务结束
        const bulkActionButton = modalOverlay.querySelector('#zcp-bulk-action-btn');
        if (bulkActionButton) {
            if (moveHistory.length > 0 && !progressDashboardState.isDryRun) {
                bulkActionButton.textContent = '一键撤销';
                bulkActionButton.dataset.action = 'undo'; // [重要] 设置初始状态
                bulkActionButton.disabled = false;
                // 添加点击事件处理器
                bulkActionButton.addEventListener('click', () => handleBulkAction(modalOverlay));
            } else {
                bulkActionButton.textContent = '全部完成';
                bulkActionButton.disabled = true; // 保持禁用
            }
        }
    }
        
    async function showDashboardUI(modalOverlay) {
        const modalContainer = modalOverlay.querySelector('.zcp-modal-container');
        // 触发模态框放大动画
        modalContainer.classList.add('dashboard-mode');

        modalContainer.innerHTML = `
            <div class="zcp-modal-header">整理进度</div>
            <div class="zcp-modal-content zcp-dashboard-container">
                <div class="zcp-dashboard-left">
                    <div class="zcp-chart-container">
                        <h3>整理状态</h3>
                        <div class="zcp-chart-wrapper"><canvas id="zcp-status-chart"></canvas></div>
                    </div>
                    <div class="zcp-chart-container">
                        <h3>收藏夹增减情况</h3>
                        <div class="zcp-chart-wrapper"><canvas id="zcp-collections-chart"></canvas></div>
                    </div>
                </div>
                <div class="zcp-dashboard-right">
                    <div class="zcp-progress-log"></div>
                </div>
            </div>
            <div class="zcp-modal-actions dashboard-mode">
                <div class="zcp-progress-stats">0 / ${progressDashboardState.logs.length}</div>
                <div style="display: flex; gap: 12px;">
                    <button id="zcp-bulk-action-btn" class="zcp-modal-button secondary" disabled>处理中...</button>
                    <button id="zcp-close-progress-btn" class="zcp-modal-button primary">关闭</button>
                </div>
            </div>`;
        
        modalOverlay.querySelector('#zcp-close-progress-btn').addEventListener('click', () => document.body.removeChild(modalOverlay));

        // 为日志容器添加事件委托，修复撤销/重做按钮的点击事件
        const logContainer = modalOverlay.querySelector('.zcp-progress-log');
        if (logContainer) {
            logContainer.addEventListener('click', handleToggleActionClick);
        }

        // 检查 Chart 是否真的存在，以防 @require 失败
        if (typeof Chart === 'undefined') {
            console.error("Chart.js 未能通过 @require 加载！请检查油猴脚本设置或网络。");
            modalContainer.querySelector('.zcp-dashboard-left').innerHTML = '<p style="color:red;">无法加载图表库，请检查油猴脚本设置或网络。</p>';
            return;
        }

        // 直接初始化图表
        initializeCharts();
        updateDashboardUI(); // 首次渲染
    }

    function initializeCharts() {

        // 为两个图表添加了统一的、正确的点击处理逻辑
        const resetFilter = () => {
            progressDashboardState.filter = { type: 'all', value: null };
            updateDashboardUI();
        };

        // 状态饼图
        const statusCtx = document.getElementById('zcp-status-chart').getContext('2d');
        chartInstances.status = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['已移动', '已跳过', '错误', '待处理'],
                datasets: [{ data: [0, 0, 0, 0], backgroundColor: ['#28a745', '#087a91', '#dc3545', '#cccccc'] }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (e, elements) => {
                    if (elements.length > 0) { // 点击了扇区
                        const label = chartInstances.status.data.labels[elements[0].index];
                        const filterMap = {'已移动': 'success', '已跳过': 'skipped', '错误': 'error', '待处理': 'pending', '建议移动': 'dryrun'};
                        
                        const statusValue = filterMap[label];
                        if (statusValue) {
                            progressDashboardState.filter = { type: 'status', value: statusValue };
                            updateDashboardUI();
                        }
                    } else { // 点击了空白处
                        resetFilter();
                    }
                }
            }
        });

        // 收藏夹柱状图
        const collectionsCtx = document.getElementById('zcp-collections-chart').getContext('2d');
        const collectionLabels = Object.values(progressDashboardState.collections).map(c => c.title);
        const collectionColors = generateColors(collectionLabels.length);

        chartInstances.collections = new Chart(collectionsCtx, {
            type: 'bar',
            data: {
                labels: collectionLabels,
                // 分别表示移入和移出
                // 使用静态颜色
                datasets: [
                    {
                        label: '移入',
                        data: [],
                        backgroundColor: ZHIHU_BLUE, // 为“移入”设置固定的知乎蓝
                        borderColor: '#045bc7'      // 设置一个匹配的、稍暗的边框色
                    },
                    {
                        label: '移出',
                        data: [],
                        backgroundColor: '#ff9c38', // 为“移出”设置固定的警示橙色
                        borderColor: '#e08321'      // 设置一个匹配的、稍暗的边框色
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                // 设置坐标轴为堆叠模式，使正负条形图对齐
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: '#f0f0f0' }
                    },
                    y: {
                        stacked: true,
                        grid: { display: false }
                    }
                },
                plugins: {
                    // 重新显示图例，并自定义工具提示
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // 为负值（移出）取绝对值显示
                                return ` ${context.dataset.label}: ${Math.abs(context.raw)}`;
                            }
                        }
                    }
                },
                onClick: (e, elements) => {
                    // 移除试运行禁用，允许在任何模式下筛选
                    if (elements.length > 0) {
                        const collectionTitle = chartInstances.collections.data.labels[elements[0].index];
                        const collectionId = Object.keys(progressDashboardState.collections).find(
                            id => progressDashboardState.collections[id].title === collectionTitle
                        );
                        if (collectionId) {
                            progressDashboardState.filter = { type: 'collection', value: collectionId };
                            updateDashboardUI();
                        }
                    } else {
                        resetFilter();
                    }
                }
            }
        });
    }

    function updateDashboardUI() {
        if (typeof Chart === 'undefined') return;
        const state = progressDashboardState;

        // 更新状态图
        const statusData = chartInstances.status.data.datasets[0].data;
        statusData[0] = state.stats.moved;
        statusData[1] = state.stats.skipped;
        statusData[2] = state.stats.error;
        statusData[3] = state.stats.pending;
        chartInstances.status.update();
        
        // 更新收藏夹图
        const collectionsChart = chartInstances.collections;
        const collectionsData = Object.values(state.collections);
        collectionsChart.data.datasets[0].data = collectionsData.map(c => c.added);
        collectionsChart.data.datasets[1].data = collectionsData.map(c => -c.removed); // 移出数据设为负值
        collectionsChart.update();

        // 更新日志
        const logContainer = document.querySelector('.zcp-progress-log');
        if (!logContainer) return;

        const filter = state.filter;
        let filteredLogs;

        if (filter.type === 'all' || !filter.type) {
            filteredLogs = state.logs;
        } else if (filter.type === 'status') {
            if (filter.value === 'dryrun') {
                // '建议移动' 包含了所有 dryrun 状态下非 skipped 的条目
                filteredLogs = state.logs.filter(log => log.status === 'dryrun');
            } else {
                filteredLogs = state.logs.filter(log => log.status === filter.value);
            }
        } else if (filter.type === 'collection') {
            filteredLogs = state.logs.filter(log =>
                log.sourceCollectionId === filter.value ||
                log.targetCollectionId === filter.value
            );
        } else {
            filteredLogs = state.logs; 
        }

        logContainer.innerHTML = filteredLogs.map(log => {
            const sourceTitle = state.allCollectionsData.find(c => c.id === log.sourceCollectionId)?.title || '未知';
            let pathHtml = '';
            if (log.status === 'success' || (log.status === 'dryrun' && log.targetCollectionId)) {
                const targetTitle = state.allCollectionsData.find(c => c.id === log.targetCollectionId)?.title || '未知';
                const dryRunTag = log.status === 'dryrun' ? '[试运行] ' : '';
                pathHtml = `
                    <div class="zcp-log-path">
                        <span class="zcp-log-collection source">${sourceTitle}</span>
                        <span class="zcp-log-arrow">→</span>
                        <span class="zcp-log-collection target">${targetTitle}</span>
                        ${log.status === 'success' ? `
                        <button class="${moveHistory.find(m => m.contentId === log.contentId)?.undone ? 'zcp-redo-btn' : 'zcp-undo-btn'}" 
                                data-content-id="${log.contentId}">
                            ${moveHistory.find(m => m.contentId === log.contentId)?.undone ? '重做' : '撤销'}
                        </button>` : `<span class="zcp-log-status-text">${dryRunTag}</span>`}
                    </div>`;
            } else if (log.status === 'skipped') {
                pathHtml = `<div class="zcp-log-path"><span class="zcp-log-status-text">分类未变: ${sourceTitle}</span></div>`;
            } else if (log.status === 'error') {
                pathHtml = `<div class="zcp-log-path"><span class="zcp-log-status-text">错误: ${log.message}</span></div>`;
            }

            return `<div class="zcp-log-item status-${log.status}" id="${log.id}">
                        <div class="zcp-log-title"><a href="${log.url}" target="_blank">${log.title}</a></div>
                        ${pathHtml}
                    </div>`;
        }).join('');

        // 更新进度条
        const completed = state.stats.moved + state.stats.skipped + state.stats.error;
        document.querySelector('.zcp-progress-stats').textContent = `${completed} / ${state.logs.length}`;
    }

    async function handleToggleActionClick(event) {
        const button = event.target.closest('.zcp-undo-btn, .zcp-redo-btn'); // 使用 closest 确保点到图标也能触发
        if (!button) return;

        const { contentId } = button.dataset;
        const moveRecord = moveHistory.find(m => m.contentId === contentId);
        if (!moveRecord) return;

        const isUndoAction = button.classList.contains('zcp-undo-btn');
        const originalText = button.textContent;
        
        button.disabled = true;
        button.textContent = isUndoAction ? '撤销中...' : '重做中...';
        button.classList.add('zcp-shimmer'); 

        try {
            if (isUndoAction) {
                // 执行撤销：移回 source
                await addToCollection(moveRecord.contentId, moveRecord.contentType, moveRecord.sourceCollectionId);
                await removeFromCollection(moveRecord.contentId, moveRecord.contentType, moveRecord.targetCollectionId);
                
                // 更新UI和状态
                button.textContent = '重做';
                button.classList.remove('zcp-undo-btn');
                button.classList.add('zcp-redo-btn');
                moveRecord.undone = true; // 标记为已撤销
            } else {
                // 执行重做：移到 target
                await addToCollection(moveRecord.contentId, moveRecord.contentType, moveRecord.targetCollectionId);
                await removeFromCollection(moveRecord.contentId, moveRecord.contentType, moveRecord.sourceCollectionId);

                // 更新UI和状态
                button.textContent = '撤销';
                button.classList.remove('zcp-redo-btn');
                button.classList.add('zcp-undo-btn');
                moveRecord.undone = false; // 标记为未撤销（即已重做）
            }
        } catch (error) {
            console.error(`${originalText}失败:`, error);
            button.textContent = `${originalText}失败`;
        } finally {
            button.disabled = false;
            button.classList.remove('zcp-shimmer'); //
        }
    }

    // 处理一键撤销/重做的函数
    async function handleBulkAction(modalOverlay) {
        const bulkButton = modalOverlay.querySelector('#zcp-bulk-action-btn');
        const action = bulkButton.dataset.action; // 'undo' or 'redo'

        if (!action) return;

        bulkButton.disabled = true;
        bulkButton.textContent = action === 'undo' ? '正在一键撤销...' : '正在一键重做...';
        bulkButton.classList.add('zcp-shimmer'); // 

        const itemsToProcess = moveHistory.filter(move => action === 'undo' ? !move.undone : move.undone);
        let successCount = 0;
        let hasError = false;

        for (const move of itemsToProcess) {
            try {
                if (action === 'undo') {
                    await addToCollection(move.contentId, move.contentType, move.sourceCollectionId);
                    await removeFromCollection(move.contentId, move.contentType, move.targetCollectionId);
                    move.undone = true;
                } else { // redo
                    await addToCollection(move.contentId, move.contentType, move.targetCollectionId);
                    await removeFromCollection(move.contentId, move.contentType, move.sourceCollectionId);
                    move.undone = false;
                }
                successCount++;
            } catch (error) {
                console.error(`批量${action}失败于: ${move.contentId}`, error);
                hasError = true;
                break; // 一旦出错就停止
            }
        }

        console.log(`成功批量${action}了 ${successCount} 项。`);
        
        // 批量更新UI
        updateDashboardUI();

        // 更新按钮状态
        if (hasError) {
             bulkButton.textContent = `操作中断，请重试`;
        } else {
            if (action === 'undo') {
                bulkButton.textContent = '一键重做';
                bulkButton.dataset.action = 'redo';
            } else {
                bulkButton.textContent = '一键撤销';
                bulkButton.dataset.action = 'undo';
            }
        }
        bulkButton.disabled = false;
        bulkButton.classList.remove('zcp-shimmer');
    }

    /**
     * Worker 函数，并发处理任务
     */
    async function worker(taskQueue) {
        let task;
        // 使用更稳健的循环模式，将“取任务”和“检查是否存在”合并
        // 当 taskQueue 为空时, taskQueue.shift() 返回 undefined, 循环会自动终止。
        // 杜绝了多个 worker 竞争最后一个任务的 race condition。
        while ((task = taskQueue.shift())) {

            const logEntry = progressDashboardState.logs.find(l => l.id === task.id);
            
            try {
                const contentText = await scrapeContent(task.url);
                if (contentText === '正文抓取失败') throw new Error('正文抓取失败');

                const targetCollections = Object.values(progressDashboardState.collections)
                    .map(c => progressDashboardState.allCollectionsData.find(ac => ac.title === c.title));
                const prompt = buildOrganizationPrompt(contentText, task.title, targetCollections);
                const recommendedTitle = await callDeepSeek(prompt);
                
                const targetCollection = progressDashboardState.allCollectionsData.find(c => c.title === recommendedTitle);
                if (!targetCollection) throw new Error(`AI返回无效收藏夹名: "${recommendedTitle}"`);
                
                logEntry.targetCollectionId = targetCollection.id;

                if (targetCollection.id === task.sourceCollectionId) {
                    logEntry.status = 'skipped';
                } else if (progressDashboardState.isDryRun) {
                    logEntry.status = 'dryrun';
                } else {
                    await addToCollection(task.contentId, task.contentType, targetCollection.id);
                    await removeFromCollection(task.contentId, task.contentType, task.sourceCollectionId);
                    logEntry.status = 'success';
                    moveHistory.push({
                        contentId: task.contentId, contentType: task.contentType,
                        sourceCollectionId: task.sourceCollectionId,
                        targetCollectionId: targetCollection.id, undone: false
                    });
                }
            } catch (error) {
                console.error(`任务失败 [${task.title}]:`, error);
                logEntry.status = 'error';
                logEntry.message = error.message;
            } finally {
                // 更新统计数据
                progressDashboardState.stats.pending--;
                
                // 简化和修正统计逻辑
                if (logEntry.status === 'success' || (logEntry.status === 'dryrun' && logEntry.targetCollectionId !== task.sourceCollectionId)) {
                    // 在 dryrun 模式下，只有当目标与源不同时，才算作 '建议移动'
                    progressDashboardState.stats.moved++;
                    progressDashboardState.collections[task.sourceCollectionId].removed++;
                    if(logEntry.targetCollectionId) {
                        progressDashboardState.collections[logEntry.targetCollectionId].added++;
                    }
                } else if (logEntry.status === 'skipped') {
                    progressDashboardState.stats.skipped++;
                } else if (logEntry.status === 'error') {
                    progressDashboardState.stats.error++;
                }

                // 为了让饼图标签在试运行时显示正确，临时修改
                if (progressDashboardState.isDryRun) {
                    chartInstances.status.data.labels[0] = '建议移动';
                }
                
                // 调度UI更新
                requestAnimationFrame(updateDashboardUI);
            }
        }
    }

    // --- 3. 功能一：AI 生成描述 ---

    /**
     * 脚本主入口，检测页面并注入按钮
     */
    function init() {
        const path = window.location.pathname;

        const observer = new MutationObserver((mutationsList, obs) => {
            // 路由分发

            if (path.startsWith('/collections/mine')) {
                // 使用稳定、可读的 CSS class 选择器
                const actionsContainer = document.querySelector('.CollectionsHeader-mainContent'); 
                if (actionsContainer && !document.getElementById('zcp-organize-btn')) {
                    injectOrganizeButton(actionsContainer);
                    obs.disconnect();
                }
            }
            // 匹配个人收藏夹列表页: /people/xxx/collections
            else if (path.includes('/people/') && path.includes('/collections')) {
                // 优先选用新版 class
                let actionsContainer = document.querySelector('.CollectionsHeader-mainContent');
                if (!actionsContainer) {
                    actionsContainer = document.querySelector('.Profile-main .Profile-sideColumn');
                }
                if (actionsContainer && !document.getElementById('zcp-organize-btn')) {
                    // 如果是 Profile-sideColumn，插入一个容器
                    if (actionsContainer.classList.contains('Profile-sideColumn')) {
                        const btnContainer = document.createElement('div');
                        btnContainer.style.marginBottom = '12px';
                        actionsContainer.prepend(btnContainer);
                        injectOrganizeButton(btnContainer);
                    } else {
                        injectOrganizeButton(actionsContainer);
                    }
                    obs.disconnect();
                }
            }
            // 匹配单个收藏夹详情页: /collection/xxx
            else if (path.startsWith('/collection/')) {
                const actionsContainer = document.querySelector('.CollectionDetailPageHeader-actions');
                if (actionsContainer && !document.getElementById('zcp-ai-btn')) {
                    injectAIButton(actionsContainer);
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    /**
     * 注入 AI 按钮到页面
     */
    function injectAIButton(container) {
        const aiButton = document.createElement('button');
        aiButton.id = 'zcp-ai-btn';
        aiButton.className = 'zcp-ai-button';
        aiButton.title = " AI 生成描述";

        // 使用您提供的新 SVG 图标，并进行优化
        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
            </svg>
        `;
        const textSpan = document.createElement('span');
        textSpan.textContent = 'AI 描述';
        textSpan.style.fontSize = '14px';

        textSpan.style.display = 'inline-flex';
        textSpan.style.alignItems = 'center';
        // --------------------
        aiButton.innerHTML = svgIcon;
        aiButton.appendChild(textSpan);


        container.appendChild(aiButton);
        aiButton.addEventListener('click', handleGenerateDescription);
    }

    /**
     * 点击 AI 按钮后的主处理函数
     */
    async function handleGenerateDescription(event) {
        const button = event.currentTarget;
        const originalContent = button.innerHTML;

        // 步骤 1: 立即锁定按钮尺寸并显示加载动画
        const { width, height } = button.getBoundingClientRect();
        button.style.width = `${width}px`;
        button.style.height = `${height}px`;
        button.innerHTML = `<div class="zcp-spinner"></div>`;
        button.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 50)); 

        // 步骤 3: 现在开始执行耗时的抓取和 AI 调用
        console.log('%c[知乎收藏夹 Pro] 开始生成描述...', 'color: white; background-color: #056DE8; padding: 2px 5px; border-radius: 3px;');
        try {
            console.log("开始采集文章...");
            const articles = await scrapeCollectionPage();
            if (articles.length === 0) {
                alert('未能采集到页面上的任何文章内容，请确保页面上有文章列表。');
                // finally 块会自动处理按钮的恢复
                return;
            }
            console.log(`%c[知乎收藏夹 Pro] 数据采集完成:`, 'color: #056DE8; font-weight: bold;');
            console.log(`- 成功采集到 ${articles.length} 篇文章，将用于生成描述。`);

            console.log("构建 Prompt...");
            const prompt = buildDescriptionPrompt(articles);

            console.log("调用 AI API...");
            const generatedDescription = await callDeepSeek(prompt);
            console.log("AI 已生成描述。");

            showDescriptionConfirmModal(generatedDescription);

        } catch (error) {
            console.error('生成描述失败:', error);
            alert(`生成描述时出错: ${error.message || error}`);
        } finally {
            // 步骤 4: 无论成功或失败，最后都恢复按钮的原始状态
            button.innerHTML = originalContent;
            button.disabled = false;
            button.style.width = '';
            button.style.height = '';
        }
    }
    /**
     * 从收藏夹页面抓取文章数据
     */
    async function scrapeCollectionPage() {
        const articlesData = [];
        // 使用更稳定的 class 选择器
        const itemElements = document.querySelectorAll('.CollectionDetailPageItem');
        const itemsToProcess = Array.from(itemElements).slice(0, 18); // 最多处理18篇(1页)

        //  添加日志，告知开始处理单篇文章
        console.log('- 开始逐篇处理文章内容...');
        
        for (const item of itemsToProcess) {
            try {
                // 如果文章内容是折叠的，点击“阅读全文”
                const moreButton = item.querySelector('.ContentItem-more');
                if (moreButton) {
                    // 使用一个 Promise 来等待内容加载
                    await new Promise(resolve => {
                        const contentObserver = new MutationObserver(() => {
                            // 当 "阅读全文" 按钮消失时，我们认为内容已加载
                            if (!item.querySelector('.ContentItem-more')) {
                                contentObserver.disconnect();
                                resolve();
                            }
                        });
                        contentObserver.observe(item, { childList: true, subtree: true });
                        moreButton.click();
                        // 设置一个超时，防止无限等待
                        setTimeout(() => { contentObserver.disconnect(); resolve(); }, 2000);
                    });
                }
                
                const titleElement = item.querySelector('.ContentItem-title a');
                const contentElement = item.querySelector('.RichText.ztext');
                
                if (titleElement && contentElement) {
                    const title = titleElement.innerText.trim();
                    const content = contentElement.innerText.trim();

                    // 打印单篇文章的标题和字数
                    console.log(`  - 已处理: "${title}" (内容字数: ${content.length})`);

                    articlesData.push({ title, content });
                }
            } catch (e) {
                console.warn("处理单个文章时出错，已跳过:", e);
            }
        }
        return articlesData;
    }

    /**
     * 构建发送给 AI 的 Prompt
     */
    function buildDescriptionPrompt(articles) {
        let articleText = articles
            .map(a => `- 标题: ${a.title}\n  正文摘要: ${a.content.substring(0, 250).replace(/\s+/g, ' ')}...`)
            .join('\n\n');
        return `根据以下来自知乎收藏夹的文章标题和正文，为这个收藏夹生成一段话精炼的描述。不要列举介绍各篇文章的主题，宏观一点。介绍是给自己看的，直接介绍，开头不需要诸如"本收藏夹……"，不需要诸如"特别适合xxx的人"的话，字数不超过50字，不需要在最后输出字数统计。

文章列表：
${articleText}

请生成描述：`;
    }

    /**
     * 显示包含 AI 生成描述的确认模态框
     */
    function showDescriptionConfirmModal(description) {
        // 创建模态框
        const overlay = document.createElement('div');
        overlay.className = 'zcp-modal-overlay';

        overlay.innerHTML = `
            <div class="zcp-modal-container">
                <div class="zcp-modal-header">AI 生成的描述</div>
                <div class="zcp-modal-content">
                    <textarea id="zcp-desc-textarea">${description}</textarea>
                </div>
                <div class="zcp-modal-actions">
                    <button id="zcp-cancel-btn" class="zcp-modal-button secondary">取消</button>
                    <button id="zcp-apply-btn" class="zcp-modal-button primary">应用</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 添加事件监听
        const closeModal = () => document.body.removeChild(overlay);
        overlay.querySelector('#zcp-cancel-btn').addEventListener('click', closeModal);
        overlay.querySelector('#zcp-apply-btn').addEventListener('click', async () => {
            const newDescription = overlay.querySelector('#zcp-desc-textarea').value;
            try {
                await applyDescriptionChange(newDescription);
                alert("收藏夹描述更新成功！");
                closeModal();
            } catch (e) {
                 alert(`更新失败: ${e.message}`);
            }
        });
    }

    /**
     * 调用知乎 API，应用描述更改
     */
    async function applyDescriptionChange(newDescription) {
        const collectionId = window.location.pathname.split('/').pop();
        const title = document.querySelector('.CollectionDetailPageHeader-title').innerText;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'PUT',
                url: `/api/v4/collections/${collectionId}`,
                headers: getZhihuApiHeaders(),
                data: JSON.stringify({
                    title: title, // 知乎API要求必须同时提交标题
                    description: newDescription,
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        const descElement = document.querySelector('.CollectionDetailPageHeader-description');
                        if (descElement) {
                           descElement.innerText = newDescription;
                        } else {
                           // 如果原先没有描述，刷新页面以显示新描述
                           window.location.reload();
                        }
                        resolve(response);
                    } else {
                        console.error('更新收藏夹描述失败:', response);
                        try {
                           const errorInfo = JSON.parse(response.responseText);
                           reject(new Error(errorInfo.error.message || `HTTP ${response.status}`));
                        } catch(e) {
                           reject(new Error(`请求失败，HTTP 状态码: ${response.status}`));
                        }
                    }
                },
                onerror: (err) => reject(new Error('网络请求错误'))
            });
        });
    }

    // --- 4. 用户设置 ---
    GM_registerMenuCommand('设置 DeepSeek API Key', () => {
        const currentKey = GM_getValue('deepseek_api_key', '');
        const newKey = prompt('请输入你的 DeepSeek API Key:', currentKey);
        if (newKey !== null) { // 允许用户设置为空
            GM_setValue('deepseek_api_key', newKey);
            alert('API Key 已保存!');
        }
    });

    // --- 启动脚本 (处理 Chart.js 的异步加载) ---

    // 1. 读取 Chart.js 的代码
    const chartJsCode = GM_getResourceText('CHART_JS');

    if (chartJsCode) {
        try {
            // 2. 在脚本的沙箱环境中直接执行代码
            eval(chartJsCode);

            // 3. 验证一下
            if (typeof Chart !== 'undefined') {
                console.log('[知乎收藏夹 Pro] Chart.js 库加载并执行成功！');
                // 4. 立即启动主逻辑
                init();
            } else {
                throw new Error('Chart object not found after eval.');
            }

        } catch (e) {
            console.error('[知乎收藏夹 Pro] 执行依赖库时出错:', e);
            alert('知乎收藏夹 Pro：加载依赖库时发生错误，请查看控制台。');
        }
    } else {
        alert('知乎收藏夹 Pro：无法获取依赖库 Chart.js 的内容，脚本无法运行。');
    }

})();