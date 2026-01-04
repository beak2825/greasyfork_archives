// ==UserScript==
// @name         随缘居屏蔽过滤助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0.3
// @description  在随缘居搜索、版块、标签和帖子页过滤内容，支持关键词、作者黑白名单及终极黑名单。
// @author       Gemini & cm
// @license      MIT
// @match        *://www.mtslash.*/search.php?mod=forum*
// @match        *://www.mtslash.*/*
// @match        *://www.mtslash.*/thread-*-*-*.html*
// @match        *://www.mtslash.*/forum.php?mod=viewthread*
// @match        *://www.mtslash.*/forum-*-*.html*
// @match        *://www.mtslash.*/forum.php?mod=forumdisplay*
// @match        *://www.mtslash.*/misc.php?mod=tag*
// @exclude      *://*.mtslash.*/forum.php?mod=post*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541902/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%B1%8F%E8%94%BD%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541902/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%B1%8F%E8%94%BD%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS 样式 ---
    GM_addStyle(`
        /* 浮动设置按钮 */
        #sy-settings-toggle-button {
            position: fixed;
            top: 50px; /* 稍微向上移动 */
            right: 10px; /* 靠右 */
            z-index: 9999;
            background-color: #6495ED; /* 低饱和度蓝色 (Cornflower Blue) */
            color: white;
            border: none;
            padding: 10px 10px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 14px;
            transition: background-color 0.2s ease;
            writing-mode: vertical-rl;
            text-orientation: upright;
            line-height: 1.5;
            white-space: nowrap;
            letter-spacing: 3px;
        }
        #sy-settings-toggle-button:hover {
            background-color: #4682B4;
        }

        /* 设置面板本身 */
        #sy-filter-settings-panel {
            position: fixed;
            top: 0;
            right: -350px; /* 初始隐藏在右侧，面板宽度设为340px + 10px 右边距 */
            width: 340px;
            height: 100%;
            background-color: #f0f0f0;
            border-left: 1px solid #ccc;
            box-shadow: -5px 0 15px rgba(0,0,0,0.3);
            color: #333;
            z-index: 10000;
            overflow-y: auto;
            transition: right 0.3s ease-out;
            padding: 20px 15px;
            box-sizing: border-box;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }
        #sy-filter-settings-panel.open {
            right: 0;
        }
        #sy-filter-settings-panel h3 {
            margin-top: 0;
            color: #555;
            text-align: center;
            margin-bottom: 15px;
        }
        #sy-filter-settings-panel label {
            display: block;
            margin-top: 10px;
            margin-bottom: 3px;
            font-weight: bold;
        }
        #sy-filter-settings-panel textarea {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 5px;
            font-family: monospace;
            resize: vertical;
            min-height: 60px;
            box-sizing: border-box;
        }
        #sy-filter-settings-panel input[type="checkbox"] {
            margin-right: 5px;
            vertical-align: middle;
        }
        #sy-filter-settings-panel .checkbox-group {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #sy-filter-settings-panel .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            align-items: center;
        }
        #sy-filter-settings-panel button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        #sy-filter-settings-panel button:hover {
            background-color: #0056b3;
        }
        #sy-filter-settings-panel .close-button {
            background-color: #6c757d;
        }
        #sy-filter-settings-panel .close-button:hover {
            background-color: #5a6268;
        }
        #sy-filter-settings-panel .help-link {
            color: #007bff;
            text-decoration: none;
            margin-right: auto;
        }
        #sy-filter-settings-panel .help-link:hover {
            text-decoration: underline;
        }

        /* 过滤规则说明模态框 */
        #sy-rules-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #sy-rules-modal-content {
            background-color: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            width: 80%;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }
        #sy-rules-modal-content h3, #sy-rules-modal-content h4 {
            color: #333;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        #sy-rules-modal-content p {
            line-height: 1.6;
            margin-bottom: 10px;
        }
        #sy-rules-modal-content strong {
            color: #007bff;
        }
        #sy-rules-close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
            border: none;
            background: none;
        }
        #sy-rules-close-button:hover {
            color: #333;
        }

        /* 过滤项的占位符和按钮样式 */
        /* 搜索页默认样式 (display: flex) */
        .sy-filtered-placeholder {
            border: 1px dashed #ccc;
            padding: 10px;
            margin-bottom: 2px; /* 调整为更小的下边距 */
            background-color: #f9f9f9;
            color: #666;
            font-style: italic;
            display: flex; /* 默认 flex 布局，用于搜索页 */
            justify-content: space-between;
            align-items: center;
            list-style: none; /* 移除列表点 */
            min-height: 40px;
            /* 确保有足够高度 */
            box-sizing: border-box;
            /* 确保 padding 不增加总宽度 */
            width: 100%;
            /* 确保在搜索结果中占满宽度 */
        }

        /* 针对版块页面 (forum-*.html, forum.php?mod=forumdisplay) 和 标签页面 (misc.php?mod=tag) 的特殊处理 */
        /* 由于版块页和标签页是表格布局，占位符需要模拟 table-row */
        /* 确保是直接插入到 tbody 里的元素，所以父级是 table */
        body.pg_forumdisplay table .sy-filtered-placeholder { /* Added body.pg_misc for tag page */
            display: table-row;
            /* 模拟表格行 */
            background-color: transparent;
            /* 移除背景色 */
            border: none;
            /* 移除边框 */
            color: #666;
            /* 恢复默认文字颜色 */
            font-weight: normal;
            vertical-align: middle;
            /* 垂直居中对齐单元格内容 */
            margin: 0;
            /* 移除外边距，以更好地模拟表格行 */
            box-sizing: border-box;
            border-collapse: collapse;
            /* 确保边框正确显示 */
            height: auto;
            /* 移除固定高度 */
        }
        /* 隐藏占位符内部原本的flex布局的子元素，避免冲突 */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder > span,
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder > button,
        body.pg_misc table .sy-filtered-placeholder > span, /* Added body.pg_misc for tag page */
        body.pg_misc table .sy-filtered-placeholder > button { /* Added body.pg_misc for tag page */
            display: none !important;
            /* 强制隐藏搜索页默认的文本和按钮 */
        }

        /* 版块页和标签页占位符内部的模拟 td 单元格 */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell { /* Added body.pg_misc for tag page */
            display: table-cell;
            /* 模拟单元格 */
            padding: 8px 5px;
            /* 调整内边距，减少左右空间 */
            vertical-align: middle;
            text-align: left;
            border-bottom: 1px solid #e0e0e0; /* 底部细线 */
            white-space: nowrap;
            /* 防止文字折行 */
            overflow: hidden;
            text-overflow: ellipsis;
            /* 超出部分显示省略号 */
            height: inherit;
            /* 继承父元素的高度 */
        }

        /* 调整每个模拟单元格的宽度，以匹配表格列 */
        /* 针对图标列 (第一列，现在留空) */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell:nth-child(1) { /* Added body.pg_misc for tag page */
            width: 2.5%;
            /* 小图标列的宽度 */
            min-width: 25px;
            /* 确保足够宽度 */
            padding-left: 0;
            /* 移除左侧留白 */
        }
        /* 针对标题列 (第二列，现在放置占位符文字) */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell:nth-child(2) { /* Added body.pg_misc for tag page */
            width: 47.5%;
            /* 标题列宽度 - 减去图标列的宽度 */
            padding-left: 20px;
            /* 左侧留白，与标题对齐 */
        }
        /* 针对作者列 (第三列，现在放置按钮) */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell:nth-child(3) { /* Added body.pg_misc for tag page */
            width: 15%;
            /* 作者列宽度 */
            text-align: center;
            /* 按钮居中 */
        }
        /* 模拟回复/点击列 (第四列，留空) */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell:nth-child(4) { /* Added body.pg_misc for tag page */
            width: 10%;
            display: table-cell; /* 确保显示为单元格 */
        }
        /* 模拟最后发表列 (第五列，留空) */
        body.pg_forumdisplay #threadlist table .sy-filtered-placeholder .sy-placeholder-cell:nth-child(5) { /* Added body.pg_misc for tag page */
            width: 15%;
            display: table-cell; /* 确保显示为单元格 */
        }



        /* 按钮样式 */
        .sy-filtered-placeholder button, .sy-rehide-button, .sy-blacklist-button {
            /* 移除可能继承的竖排样式 */
            writing-mode: horizontal-tb !important;
            text-orientation: mixed !important;

            margin-left: 0; /* 按钮在单元格内不需额外左边距 */
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            background-color: #eee;
            color: #333;
            /* 确保按钮文字颜色正常 */
            border-radius: 3px;
            font-size: 13px;
            /* 适当调整字体大小 */
        }
        .sy-filtered-placeholder button:hover, .sy-rehide-button:hover, .sy-blacklist-button:hover {
            background-color: #ddd;
        }
        .sy-hidden-item {
            display: none !important;
        }

        /* NEW: Search page - Place rehide button next to title */
        body.pg_search h3.xs3 {
            display: flex; /* Make the h3 a flex container */
            align-items: center; /* Vertically align items */
            gap: 10px; /* Space between title and button */
        }

        body.pg_search h3.xs3 .sy-rehide-button {
            flex-shrink: 0; /* Prevent button from shrinking */
            margin-left: 0; /* Override any auto margin */
            order: initial; /* Override any order property */
        }


        /* 针对帖子内部回复楼层的占位符样式 (保持不变) */
        .sy-reply-placeholder {
            border: 1px dashed #d1a938;
            padding: 10px;
            margin: 5px 0;
            background-color: #fffbe6;
            color: #a07d2a;
            font-style: italic;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        /* 给拉黑按钮增加一点边距，使其与用户名不至于粘在一起 */
        .sy-blacklist-button {
            margin-left: 5px;
            font-size: 12px;
            padding: 2px 6px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
        }
        .sy-blacklist-button:hover {
            background-color: #c82333;
        }
    `);

    // --- 配置及默认值 ---
    const SETTINGS_KEY = 'sy_filter_settings';
    const DEFAULT_SETTINGS = {
        showPlaceholder: true, // 搜索页和版块页的占位符
        keywordBlacklist: '',
        keywordWhitelist: '',
        authorBlacklist: '',
        authorWhitelist: '',
        ultimateBlacklist: '',
        ultimateBlacklistShowPlaceholder: true // 终极黑名单在帖子详情页的占位符
    };
    let settings = {};

    // --- 过滤规则说明内容 ---
    const FILTER_RULES_TEXT = `
        <h3>点击“保存”后会自动刷新页面，点击“关闭”则不会保存修改。每次修改可以直接从页面中多次复制，以免频繁刷新。</h3>
        <h3>过滤规则说明：</h3>
        <p>帖子标题如果含有<strong>关键词黑名单</strong>中出现的关键词，就会被隐藏；但如果同时出现了<strong>关键词白名单</strong>中的关键词，则该帖不会被隐藏。</p>
        <p><strong>作者黑名单</strong>用来隐藏特定作者的发帖。如果帖子的作者在作者黑名单中，无论标题是否包含白名单关键词，该帖子都会被隐藏或占位。此黑名单只针对发帖，不针对贴内评论。</p>
        <p>如果帖子的作者在<strong>作者白名单</strong>中，则该帖子将完全忽略所有关键词筛选条件，不进行任何隐藏，直接显示。</p>

        <h4>终极黑名单规则：</h4>
        <p><strong>终极黑名单</strong>中的用户，其发布的所有帖子和回复楼层都将被隐藏或占位。此列表优先级最高，不受关键词白名单影响。（简单地说，作者黑名单是为了不看到对方的发帖，终极黑名单则是为了不看到对方的任何发言。）</p>
        <p><strong>在帖子详情页内，你可以点击楼层发帖人旁边的“拉黑”按钮，快速将该用户添加到终极黑名单。</strong></p>

        <h4>应用场合举例：</h4>
        <p><strong>我想吃AB，但是不想吃BA，也不想吃AC，我该怎么办？</strong><br>
        在关键词黑名单里输入 "BA" 和 "AC"（每行一个）。这样在搜索AB时，标题中包含“BA”或“AC”的文章（如“ABA”、“BAB”、“ABAC”、“ACB”等）就会被过滤掉。</p>
        <p><strong>我不吃凹A，但如果有BA的话我就吃一口，怎么办？</strong><br>
        在关键词黑名单里输入 "凹A"。<br>
        在关键词白名单中输入 "BA"。<br>
        这样包含“凹A”的会被隐藏，但如果同时包含“BA”就不会被隐藏。</p>
        <p><strong>我一般不吃AB或某个梗，但是我暗恋女神，女神做什么我都吃，怎么办？</strong><br>
        在关键词黑名单里输入 "AB" 和你不想看的“梗名”（每行一个）。<br>
        在作者白名单中输入你的“女神用户名”（每行一个）。<br>
        这样除了你女神的文章外，所有包含“AB”或该“梗名”的帖子都会被隐藏。</p>
    `;
    // --- 辅助函数 ---

    // 从字符串解析列表（只用换行符分隔）
    function parseList(str) {
        return str.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    // 检查文本是否包含黑名单关键词 (用于关键词黑名单，进行模糊匹配)
    function containsBlacklistedKeyword(text, blacklist) {
        if (!text || !blacklist || blacklist.length === 0) return false;
        for (const keyword of blacklist) {
            const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            if (regex.test(text)) {
                return true;
            }
        }
        return false;
    }

    // 检查文本是否包含白名单关键词 (用于关键词白名单，进行模糊匹配)
    function containsWhitelistedKeyword(text, whitelist) {
        if (!text || !whitelist || whitelist.length === 0) return false;
        for (const keyword of whitelist) {
            const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            if (regex.test(text)) {
                return true;
            }
        }
        return false;
    }

    // 检查作者名是否在列表中 (用于作者黑白名单、终极黑名单，进行精确匹配)
    function isAuthorInList(authorName, list) {
        return list.includes(authorName);
    }

    // 加载设置
    function loadSettings() {
        try {
            const savedSettings = GM_getValue(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
            settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
            console.log("[随缘居过滤调试] 设置已加载:", settings);
        } catch (e) {
            console.error("[随缘居过滤调试] 加载设置失败，使用默认设置。", e);
            settings = DEFAULT_SETTINGS;
        }
    }

    // 保存设置
    function saveSettings() {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
        console.log("[随缘居过滤调试] 设置已保存:", settings);
    }

    // --- UI 相关（占位符和设置界面） ---

    // 创建占位符元素，并添加“仍然显示”和“隐藏”按钮的逻辑 (用于搜索页、版块页、标签页)
    function createPlaceholder(originalItem, hiddenInfo, pageType = 'search') {
        let text = '';
        if (hiddenInfo.isUltimateBlacklist) {
            text = `作者“${hiddenInfo.author}”已被终极黑名单隐藏`;
        } else if (hiddenInfo.keywords && hiddenInfo.keywords.length > 0 && hiddenInfo.author) {
            text = `关键词“${hiddenInfo.keywords.join('、')}”、 作者“${hiddenInfo.author}”已隐藏`;
        } else if (hiddenInfo.keywords && hiddenInfo.keywords.length > 0) {
            text = `关键词“${hiddenInfo.keywords.join('、')}”已隐藏`;
        } else if (hiddenInfo.author) {
            text = `作者“${hiddenInfo.author}”已隐藏`;
        }

        let resultElement; // 用于保存最终要返回的元素 (div 或 tr)

        if (pageType === 'forum') {
            resultElement = document.createElement('div'); // 版块页仍然用 div
            resultElement.className = 'sy-filtered-placeholder';
            resultElement.innerHTML = `
            <div class="sy-placeholder-cell"></div>
            <div class="sy-placeholder-cell" style="text-align: left;">${text}</div>
            <div class="sy-placeholder-cell"><button class="sy-show-hidden">仍然显示</button></div>
            <div class="sy-placeholder-cell"></div>
            <div class="sy-placeholder-cell"></div>
        `;
        } else if (pageType === 'tag') {
            resultElement = document.createElement('tr'); // 标签页直接创建 tr
            resultElement.classList.add('sy-filtered-placeholder-row'); // 为 TR 本身添加类

            // !!! 关键修改点 !!!
            // 创建 6 个 <td> 元素，模拟标签页的列结构
            for (let i = 0; i < 6; i++) {
                const td = document.createElement('td');
                // 可以给每个 td 添加一个通用类，方便 CSS 统一设置 padding 等
                td.classList.add('sy-tag-placeholder-cell');
                resultElement.appendChild(td);
            }

            // 现在把内容放入对应的 <td>
            const tds = resultElement.children; // 获取所有创建的 <td> 元素

            // 第一列（索引 0）：通常是图标列，留空
            // tds[0].innerHTML = `<div class="sy-placeholder-icon"></div>`; // 如果有图标可以放

            // 第二列（索引 1）：放入占位信息
            if (tds[1]) {
                const span = document.createElement('span');
                span.textContent = `占位：${text}`;
                span.classList.add('sy-placeholder-message'); // 沿用版块页的 class
                tds[1].appendChild(span);
                tds[1].style.textAlign = 'left'; // 确保文字左对齐
            }

            // 第三列（索引 2）：放入“仍然显示”按钮
            if (tds[3]) {
                const button = document.createElement('button');
                button.classList.add('sy-show-hidden');
                button.textContent = '仍然显示';
                tds[3].appendChild(button);
                tds[3].style.textAlign = 'center'; // 按钮居中
            }

            // 第四、五、六列（索引 3, 4, 5）：留空或者根据需要添加其他内容
            // 比如，你可能希望把“隐藏”按钮放在其他列
            // if (tds[3]) { /* ... */ }
            // if (tds[4]) { /* ... */ }
            // if (tds[5]) { /* ... */ }

        } else { // 默认是搜索页
            resultElement = document.createElement('div');
            resultElement.className = 'sy-filtered-placeholder';
            resultElement.innerHTML = `
            <span>占位：${text}</span>
            <button class="sy-show-hidden">仍然显示</button>
        `;
        }

        // 统一处理按钮事件监听器（这部分保持不变，因为所有 resultElement 现在都包含 .sy-show-hidden 按钮）
        const showButton = resultElement.querySelector('.sy-show-hidden');
        if (showButton) {
            showButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                console.log("[随缘居过滤调试] '仍然显示' 按钮点击。"); // 调试日志
                console.log("Original item:", originalItem); // 调试日志
                console.log("Placeholder element:", resultElement); // 调试日志

                // 移除原始项的隐藏类，使其可见
                originalItem.classList.remove('sy-hidden-item');
                // 隐藏占位符本身
                resultElement.classList.add('sy-hidden-item');

                const rehideButton = document.createElement('button');
                rehideButton.className = 'sy-rehide-button';
                rehideButton.textContent = '隐藏';
                rehideButton.addEventListener('click', () => {
                    console.log("[随缘居过滤调试] '隐藏' 按钮点击。"); // 调试日志
                    originalItem.classList.add('sy-hidden-item');
                    resultElement.classList.remove('sy-hidden-item');
                    rehideButton.remove();
                });

                let targetElementForRehideButton;
                // 根据页面类型找到放置“隐藏”按钮的目标元素
                if (pageType === 'forum' || pageType === 'tag') {
                    // 对于论坛和标签页，通常添加到作者名称旁边
                    // 确保 originalItem 是包含作者信息的 tr
                    // 查找 originalItem 内部的作者元素
                    const authorCite = originalItem.querySelector('td.by cite');
                    if (authorCite) {
                        targetElementForRehideButton = authorCite;
                    } else {
                        // 如果找不到 td.by cite，尝试找标题的 h3 或者其他能定位到的元素
                        // console.warn("[随缘居过滤调试] 找不到作者cite元素，尝试其他位置放置隐藏按钮。");
                        // targetElementForRehideButton = originalItem.querySelector('th.new a.xst') || originalItem; // 备用方案
                    }
                } else { // For search page
                    targetElementForRehideButton = originalItem.querySelector('h3.xs3');
                }

                if (targetElementForRehideButton) {
                    // 避免重复添加“隐藏”按钮
                    if (!targetElementForRehideButton.querySelector('.sy-rehide-button')) {
                        targetElementForRehideButton.appendChild(rehideButton);
                        console.log("[随缘居过滤调试] '隐藏' 按钮已添加。"); // 调试日志
                    } else {
                        console.log("[随缘居过滤调试] '隐藏' 按钮已存在，未重复添加。"); // 调试日志
                    }
                } else {
                    console.warn("[随缘居过滤调试] 未能找到目标元素来放置'隐藏'按钮。"); // 调试日志
                }
            });
        } else {
            console.warn("[随缘居过滤调试] 未能找到 '.sy-show-hidden' 按钮，可能事件监听器未成功附加。"); // 调试日志
        }

        return resultElement; // 返回最终创建的元素
    }


    // 创建回复楼层占位符 (用于帖子详情页)
    function createReplyPlaceholder(originalReply, authorName) {
        const placeholder = document.createElement('div');
        placeholder.className = 'sy-reply-placeholder';
        placeholder.innerHTML = `
            <span>楼层内容已隐藏，发布者：${authorName} (终极黑名单)</span>
            <button class="sy-show-hidden">仍然显示</button>
        `;
        const showButton = placeholder.querySelector('.sy-show-hidden');
        showButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            originalReply.classList.remove('sy-hidden-item');
            placeholder.classList.add('sy-hidden-item');

            const rehideButton = document.createElement('button');
            rehideButton.className = 'sy-rehide-button';
            rehideButton.textContent = '隐藏';

            const authorElement = originalReply.querySelector('.pls.favatar .authi a.xw1');
            if (authorElement && (!authorElement.nextElementSibling || !authorElement.nextElementSibling.classList.contains('sy-rehide-button'))) {
                authorElement.insertAdjacentElement('afterend', rehideButton);
            } else {
                originalReply.appendChild(rehideButton);
            }

            rehideButton.addEventListener('click', () => {
                originalReply.classList.add('sy-hidden-item');
                placeholder.classList.remove('sy-hidden-item');
                rehideButton.remove();
            });
        });
        return placeholder;
    }

    // 设置面板的创建和操作
    function setupSettingsPanel() {
        let toggleButton = document.getElementById('sy-settings-toggle-button');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'sy-settings-toggle-button';
            toggleButton.textContent = '过滤设置';
            document.body.appendChild(toggleButton);
        }

        let settingsPanel = document.getElementById('sy-filter-settings-panel');
        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.id = 'sy-filter-settings-panel';
            settingsPanel.innerHTML = `
                <h3>过滤设置</h3>

                <div class="checkbox-group">
                    <label for="sy-showPlaceholder">
                        <input type="checkbox" id="sy-showPlaceholder" />
                        显示搜索/版块/标签结果占位符 (勾选后，隐藏帖子时用占位符替代)
                    </label>
                    <label for="sy-ultimateBlacklistShowPlaceholder">
                        <input type="checkbox" id="sy-ultimateBlacklistShowPlaceholder" />
                        显示终极黑名单占位符 (勾选后，帖子中被隐藏的楼层使用占位符替代)
                    </label>
                </div>

                <label for="sy-keywordBlacklist">关键词黑名单 (每行一个，仅针对文章标题)</label>
                <textarea id="sy-keywordBlacklist"></textarea>

                <label for="sy-keywordWhitelist">关键词白名单 (每行一个，用于豁免黑名单)</label>
                <textarea id="sy-keywordWhitelist"></textarea>

                <label for="sy-authorBlacklist">作者黑名单 (每行一个，精确匹配)</label>
                <textarea id="sy-authorBlacklist"></textarea>

                <label for="sy-authorWhitelist">作者白名单 (每行一个，精确匹配，优先级高于关键词过滤)</label>
                <textarea id="sy-authorWhitelist"></textarea>

                <label for="sy-ultimateBlacklist">终极黑名单 (每行一个，精确匹配，最高优先级，占位或隐藏所有发帖和贴内回复)</label>
                <textarea id="sy-ultimateBlacklist"></textarea>

                <div class="button-group">
                    <a href="javascript:void(0);" class="help-link" id="sy-show-rules">查看过滤规则说明</a>
                    <button id="sy-save-settings">保存</button>
                    <button id="sy-close-settings" class="close-button">关闭</button>
                </div>
            `;
            document.body.appendChild(settingsPanel);
        }

        const showPlaceholderCheckbox = document.getElementById('sy-showPlaceholder');
        const ultimateBlacklistShowPlaceholderCheckbox = document.getElementById('sy-ultimateBlacklistShowPlaceholder');
        const keywordBlacklistTextarea = document.getElementById('sy-keywordBlacklist');
        const keywordWhitelistTextarea = document.getElementById('sy-keywordWhitelist');
        const authorBlacklistTextarea = document.getElementById('sy-authorBlacklist');
        const authorWhitelistTextarea = document.getElementById('sy-authorWhitelist');
        const ultimateBlacklistTextarea = document.getElementById('sy-ultimateBlacklist');
        const saveButton = document.getElementById('sy-save-settings');
        const closeButton = document.getElementById('sy-close-settings');
        const showRulesLink = document.getElementById('sy-show-rules');
        const loadSettingsToPanel = () => {
            showPlaceholderCheckbox.checked = settings.showPlaceholder;
            ultimateBlacklistShowPlaceholderCheckbox.checked = settings.ultimateBlacklistShowPlaceholder;
            keywordBlacklistTextarea.value = settings.keywordBlacklist;
            keywordWhitelistTextarea.value = settings.keywordWhitelist;
            authorBlacklistTextarea.value = settings.authorBlacklist;
            authorWhitelistTextarea.value = settings.authorWhitelist;
            ultimateBlacklistTextarea.value = settings.ultimateBlacklist;
        };
        const saveSettingsFromPanel = () => {
            settings.showPlaceholder = showPlaceholderCheckbox.checked;
            settings.ultimateBlacklistShowPlaceholder = ultimateBlacklistShowPlaceholderCheckbox.checked;
            settings.keywordBlacklist = keywordBlacklistTextarea.value;
            settings.keywordWhitelist = keywordWhitelistTextarea.value;
            settings.authorBlacklist = authorBlacklistTextarea.value;
            settings.authorWhitelist = authorWhitelistTextarea.value;
            settings.ultimateBlacklist = ultimateBlacklistTextarea.value;
            saveSettings();

            alert('设置已保存，页面将刷新以应用更改。');
            location.reload();
        };

        const showPanel = () => {
            loadSettingsToPanel();
            settingsPanel.classList.add('open');
        };
        const hidePanel = () => {
            settingsPanel.classList.remove('open');
        };
        toggleButton.addEventListener('click', showPanel);
        saveButton.addEventListener('click', saveSettingsFromPanel);
        closeButton.addEventListener('click', hidePanel);

        let rulesModalOverlay = document.getElementById('sy-rules-modal-overlay');
        let rulesModalContent = document.getElementById('sy-rules-modal-content');
        let rulesCloseButton;
        if (!rulesModalOverlay) {
            rulesModalOverlay = document.createElement('div');
            rulesModalOverlay.id = 'sy-rules-modal-overlay';
            rulesModalOverlay.innerHTML = `
                <div id="sy-rules-modal-content">
                    <button id="sy-rules-close-button">&times;</button>
                    ${FILTER_RULES_TEXT}
                </div>
            `;
            document.body.appendChild(rulesModalOverlay);
            rulesModalContent = document.getElementById('sy-rules-modal-content');
            rulesCloseButton = document.getElementById('sy-rules-close-button');

            rulesCloseButton.addEventListener('click', () => {
                rulesModalOverlay.style.display = 'none';
            });
            rulesModalOverlay.addEventListener('click', (e) => {
                if (e.target === rulesModalOverlay) {
                    rulesModalOverlay.style.display = 'none';
                }
            });
        } else {
            rulesModalContent = document.getElementById('sy-rules-modal-content');
            rulesCloseButton = document.getElementById('sy-rules-close-button');
        }

        showRulesLink.addEventListener('click', (e) => {
            e.preventDefault();
            rulesModalOverlay.style.display = 'flex';
        });
    }

    // --- 搜索页过滤逻辑 ---
    function applyFiltersForSearchPage() {
        console.log("[随缘居过滤调试] 正在应用搜索页过滤...");
        const threadList = document.getElementById('threadlist');
        if (!threadList) {
            console.log("[随缘居过滤调试] 搜索页未找到帖子列表容器 (#threadlist)。");
            return;
        }

        const items = threadList.querySelectorAll('ul > li.pbw');
        console.log(`[随缘居过滤调试] 搜索页找到 ${items.length} 个帖子项。`);
        if (items.length === 0) {
            console.log("[随缘居过滤调试] 搜索页未找到任何可过滤的帖子项。");
            return;
        }

        const kwBlacklist = parseList(settings.keywordBlacklist);
        const kwWhitelist = parseList(settings.keywordWhitelist);
        const authorBlacklist = parseList(settings.authorBlacklist);
        const authorWhitelist = parseList(settings.authorWhitelist);
        const ultimateBlacklist = parseList(settings.ultimateBlacklist);

        items.forEach((item, index) => {
            // 清理旧状态
            const existingRehideButton = item.querySelector('.sy-rehide-button');
            if (existingRehideButton) {
                existingRehideButton.remove();
            }
            item.classList.remove('sy-hidden-item');
            const existingPlaceholder = item.previousElementSibling;
            if (existingPlaceholder && existingPlaceholder.classList.contains('sy-filtered-placeholder')) {
                existingPlaceholder.remove();
            }

            const titleElement = item.querySelector('h3.xs3 a');
            const authorElement = item.querySelector('p span a[href*="space-uid-"]');

            if (!titleElement || !authorElement) {
                console.warn(`[随缘居过滤调试] 搜索页第 ${index} 项：未找到标题或作者元素，跳过过滤。`, item);
                return;
            }

            const title = titleElement.textContent.trim();
            const author = authorElement.textContent.trim();
            console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：标题="${title}", 作者="${author}"`);
            let shouldHide = false;
            const hiddenReasons = {
                keywords: [],
                author: null,
                isUltimateBlacklist: false
            };
            // 0. 检查终极黑名单 (最高优先级 - 精确匹配)
            if (ultimateBlacklist.length > 0 && isAuthorInList(author, ultimateBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                hiddenReasons.isUltimateBlacklist = true;
                console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：作者"${author}"在终极黑名单中，将隐藏。`);
            }

            if (shouldHide && hiddenReasons.isUltimateBlacklist) {
                item.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    const placeholder = createPlaceholder(item, hiddenReasons, 'search'); // Not a table page
                    item.parentNode.insertBefore(placeholder, item);
                }
                return;
            }

            // 1. 检查作者白名单 (次高优先级 - 精确匹配)
            if (authorWhitelist.length > 0 && isAuthorInList(author, authorWhitelist)) {
                console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：作者"${author}"在白名单中，跳过过滤。`);
                return;
            }

            // 2. 检查关键词黑名单和白名单 (模糊匹配)
            const isTitleBlacklisted = containsBlacklistedKeyword(title, kwBlacklist);
            const isTitleWhitelisted = containsWhitelistedKeyword(title, kwWhitelist);

            if (isTitleBlacklisted && kwBlacklist.length > 0) {
                if (!isTitleWhitelisted || kwWhitelist.length === 0) {
                    shouldHide = true;
                    for (const keyword of kwBlacklist) {
                        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                        if (regex.test(title)) {
                            hiddenReasons.keywords.push(keyword);
                        }
                    }
                    console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：标题包含黑名单关键词"${hiddenReasons.keywords.join('、')}"，且不在白名单，将隐藏。`);
                } else {
                    console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：标题包含黑名单关键词，但被白名单关键词豁免。`);
                }
            }

            // 3. 检查作者黑名单 (精确匹配)
            if (authorBlacklist.length > 0 && isAuthorInList(author, authorBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：作者"${author}"在黑名单中，将隐藏。`);
            }

            if (shouldHide) {
                item.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    const placeholder = createPlaceholder(item, hiddenReasons, 'search'); // Not a table page
                    item.parentNode.insertBefore(placeholder, item);
                }
            } else {
                console.log(`[随缘居过滤调试] 搜索页第 ${index} 项：未匹配任何过滤条件，不隐藏。`);
            }
        });
    }

    // --- 版块页过滤逻辑 ---
    function applyFiltersForForumPage() {
        console.log("[随缘居过滤调试] 正在应用板块页过滤...");
        const threadBodies = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');
        console.log(`[随缘居过滤调试] 版块页找到 ${threadBodies.length} 个帖子项。`);
        if (threadBodies.length === 0) {
            console.log("[随缘居过滤调试] 版块页未找到任何可过滤的帖子项。");
            return;
        }

        const kwBlacklist = parseList(settings.keywordBlacklist);
        const kwWhitelist = parseList(settings.keywordWhitelist);
        const authorBlacklist = parseList(settings.authorBlacklist);
        const authorWhitelist = parseList(settings.authorWhitelist);
        const ultimateBlacklist = parseList(settings.ultimateBlacklist);
        threadBodies.forEach((threadBody, index) => {
            // 清理旧状态
            const existingRehideButton = threadBody.querySelector('.sy-rehide-button');
            if (existingRehideButton) {
                existingRehideButton.remove();
            }
            threadBody.classList.remove('sy-hidden-item');
            const existingPlaceholder = threadBody.previousElementSibling;
            if (existingPlaceholder && existingPlaceholder.classList.contains('sy-filtered-placeholder')) {
                existingPlaceholder.remove();
            }

            const titleElement = threadBody.querySelector('th .xst');
            const authorElement = threadBody.querySelector('td.by cite a');

            if (!titleElement || !authorElement) {
                console.warn(`[随缘居过滤调试] 版块页第 ${index} 项：未找到标题或作者元素，跳过过滤。`, threadBody);
                if (!titleElement) console.warn(`[随缘居过滤调试] 标题元素未找到 for 项 ${index}。`);
                if (!authorElement) console.warn(`[随缘居过滤调试] 作者元素未找到 for 项 ${index}。`);
                return;
            }

            const title = titleElement.textContent.trim();
            const author = authorElement.textContent.trim();
            console.log(`[随缘居过滤调试] 版块页第 ${index} 项：成功提取标题="${title}", 作者="${author}"`);

            let shouldHide = false;
            const hiddenReasons = {
                keywords: [],
                author: null,
                isUltimateBlacklist: false
            };
            // 0. 检查终极黑名单 (最高优先级 - 精确匹配)
            if (ultimateBlacklist.length > 0 && isAuthorInList(author, ultimateBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                hiddenReasons.isUltimateBlacklist = true;
                console.log(`[随缘居过滤调试] 版块页第 ${index} 项：作者"${author}"在终极黑名单中，将隐藏。`);
            }

            if (shouldHide && hiddenReasons.isUltimateBlacklist) {
                threadBody.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    // 对于 tbody 元素，我们插入一个 div 作为占位符，模拟表格行
                    const placeholder = createPlaceholder(threadBody, hiddenReasons, 'forum'); // It is a table page
                    threadBody.parentNode.insertBefore(placeholder, threadBody);
                }
                return;
            }

            // 1. 检查作者白名单 (次高优先级 - 精确匹配)
            if (authorWhitelist.length > 0 && isAuthorInList(author, authorWhitelist)) {
                console.log(`[随缘居过滤调试] 版块页第 ${index} 项：作者"${author}"在白名单中，跳过过滤。`);
                return;
            }

            // 2. 检查关键词黑名单和白名单 (模糊匹配)
            const isTitleBlacklisted = containsBlacklistedKeyword(title, kwBlacklist);
            const isTitleWhitelisted = containsWhitelistedKeyword(title, kwWhitelist);

            if (isTitleBlacklisted && kwBlacklist.length > 0) {
                if (!isTitleWhitelisted || kwWhitelist.length === 0) {
                    shouldHide = true;
                    for (const keyword of kwBlacklist) {
                        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                        if (regex.test(title)) {
                            hiddenReasons.keywords.push(keyword);
                        }
                    }
                    console.log(`[随缘居过滤调试] 版块页第 ${index} 项：标题包含黑名单关键词"${hiddenReasons.keywords.join('、')}"，且不在白名单，将隐藏。`);
                } else {
                    console.log(`[随缘居过滤调试] 版块页第 ${index} 项：标题包含黑名单关键词，但被白名单关键词豁免。`);
                }
            }

            // 3. 检查作者黑名单 (精确匹配)
            if (authorBlacklist.length > 0 && isAuthorInList(author, authorBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                console.log(`[随缘居过滤调试] 版块页第 ${index} 项：作者"${author}"在黑名单中，将隐藏。`);
            }

            if (shouldHide) {
                threadBody.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    const placeholder = createPlaceholder(threadBody, hiddenReasons, 'forum'); // It is a table page
                    threadBody.parentNode.insertBefore(placeholder, threadBody);
                }
            } else {
                console.log(`[随缘居过滤调试] 版块页第 ${index} 项：未匹配任何过滤条件，不隐藏。`);
            }
        });
    }

    // --- 标签页过滤逻辑 ---
    function applyFiltersForTagPage() {
        console.log("[随缘居过滤调试] 正在应用标签页过滤...");
        // Select all table rows directly under the tbody of the main content table
        const items = document.querySelectorAll('table[cellspacing="0"][cellpadding="0"] tbody tr');
        console.log(`[随缘居过滤调试] 标签页找到 ${items.length} 个帖子项。`);
        if (items.length === 0) {
            console.log("[随缘居过滤调试] 标签页未找到任何可过滤的帖子项。");
            return;
        }

        const kwBlacklist = parseList(settings.keywordBlacklist);
        const kwWhitelist = parseList(settings.keywordWhitelist);
        const authorBlacklist = parseList(settings.authorBlacklist);
        const authorWhitelist = parseList(settings.authorWhitelist);
        const ultimateBlacklist = parseList(settings.ultimateBlacklist);

        items.forEach((item, index) => {
            // Skip header row if present, or any other non-content rows if needed
            // A simple check: if it doesn't have a title 'th' then it's probably not a content row
            if (!item.querySelector('th a')) {
                console.log(`[随缘居过滤调试] 标签页第 ${index} 项：未找到标题元素，可能为头部或无效行，跳过。`);
                return;
            }

            // Clean up previous states
            const existingRehideButton = item.querySelector('.sy-rehide-button');
            if (existingRehideButton) {
                existingRehideButton.remove();
            }
            item.classList.remove('sy-hidden-item');
            const existingPlaceholder = item.previousElementSibling;
            if (existingPlaceholder && existingPlaceholder.classList.contains('sy-filtered-placeholder')) {
                existingPlaceholder.remove();
            }

            const titleElement = item.querySelector('th a');
            // Author is within <td class="by"> <cite> <a ...>
            const authorElement = item.querySelector('td.by cite a');


            if (!titleElement || !authorElement) {
                console.warn(`[随缘居过滤调试] 标签页第 ${index} 项：未找到标题或作者元素，跳过过滤。`, item);
                if (!titleElement) console.warn(`[随缘居过滤调试] 标题元素未找到 for 项 ${index}。`);
                if (!authorElement) console.warn(`[随缘居过滤调试] 作者元素未找到 for 项 ${index}。`);
                return;
            }

            const title = titleElement.textContent.trim();
            const author = authorElement.textContent.trim();
            console.log(`[随缘居过滤调试] 标签页第 ${index} 项：标题="${title}", 作者="${author}"`);

            let shouldHide = false;
            const hiddenReasons = {
                keywords: [],
                author: null,
                isUltimateBlacklist: false
            };

            // 0. 检查终极黑名单 (最高优先级 - 精确匹配)
            if (ultimateBlacklist.length > 0 && isAuthorInList(author, ultimateBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                hiddenReasons.isUltimateBlacklist = true;
                console.log(`[随缘居过滤调试] 标签页第 ${index} 项：作者"${author}"在终极黑名单中，将隐藏。`);
            }

            if (shouldHide && hiddenReasons.isUltimateBlacklist) {
                item.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    const placeholder = createPlaceholder(item, hiddenReasons, 'tag'); // It is a table page
                    item.parentNode.insertBefore(placeholder, item);
                }
                return;
            }

            // 1. 检查作者白名单 (次高优先级 - 精确匹配)
            if (authorWhitelist.length > 0 && isAuthorInList(author, authorWhitelist)) {
                console.log(`[随缘居过滤调试] 标签页第 ${index} 项：作者"${author}"在白名单中，跳过过滤。`);
                return;
            }

            // 2. 检查关键词黑名单和白名单 (模糊匹配)
            const isTitleBlacklisted = containsBlacklistedKeyword(title, kwBlacklist);
            const isTitleWhitelisted = containsWhitelistedKeyword(title, kwWhitelist);

            if (isTitleBlacklisted && kwBlacklist.length > 0) {
                if (!isTitleWhitelisted || kwWhitelist.length === 0) {
                    shouldHide = true;
                    for (const keyword of kwBlacklist) {
                        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                        if (regex.test(title)) {
                            hiddenReasons.keywords.push(keyword);
                        }
                    }
                    console.log(`[随缘居过滤调试] 标签页第 ${index} 项：标题包含黑名单关键词"${hiddenReasons.keywords.join('、')}"，且不在白名单，将隐藏。`);
                } else {
                    console.log(`[随缘居过滤调试] 标签页第 ${index} 项：标题包含黑名单关键词，但被白名单关键词豁免。`);
                }
            }

            // 3. 检查作者黑名单 (精确匹配)
            if (authorBlacklist.length > 0 && isAuthorInList(author, authorBlacklist)) {
                shouldHide = true;
                hiddenReasons.author = author;
                console.log(`[随缘居过滤调试] 标签页第 ${index} 项：作者"${author}"在黑名单中，将隐藏。`);
            }

            if (shouldHide) {
                item.classList.add('sy-hidden-item');
                if (settings.showPlaceholder) {
                    const placeholder = createPlaceholder(item, hiddenReasons, 'tag'); // It is a table page
                    item.parentNode.insertBefore(placeholder, item);
                }
            } else {
                console.log(`[随缘居过滤调试] 标签页第 ${index} 项：未匹配任何过滤条件，不隐藏。`);
            }
        });
    }

    // --- 帖子详情页过滤逻辑 ---
    function applyFiltersForThreadPage() {
        console.log("[随缘居过滤调试] 正在应用帖子详情页过滤...");
        const postlist = document.getElementById('postlist');
        if (!postlist) {
            console.log("[随缘居过滤调试] 帖子详情页未找到帖子列表容器 (#postlist)。");
            return;
        }

        const ultimateBlacklist = parseList(settings.ultimateBlacklist);
        const showPlaceholder = settings.ultimateBlacklistShowPlaceholder;
        const allPosts = postlist.querySelectorAll('div[id^="post_"]');
        console.log(`[随缘居过滤调试] 帖子详情页找到 ${allPosts.length} 个帖子/回复项。`);

        allPosts.forEach((item, index) => {
            // 清理旧状态
            const existingRehideButton = item.querySelector('.sy-rehide-button');
            if (existingRehideButton) {
                existingRehideButton.remove();
            }
            item.classList.remove('sy-hidden-item');
            const existingPlaceholder = item.previousElementSibling;
            if (existingPlaceholder && existingPlaceholder.classList.contains('sy-reply-placeholder')) {
                existingPlaceholder.remove();
            }

            const authorElement = item.querySelector('.pls.favatar .authi a.xw1');
            if (!authorElement) {
                console.warn(`[随缘居过滤调试] 帖子详情页第 ${index} 项：未找到作者元素，跳过过滤。`, item);
                return;
            }

            const authorName = authorElement.textContent.trim();
            console.log(`[随缘居过滤调试] 帖子详情页第 ${index} 项：作者="${authorName}"`);

            // 如果是终极黑名单用户 (精确匹配)
            if (ultimateBlacklist.length > 0 && isAuthorInList(authorName, ultimateBlacklist)) {
                console.log(`[随缘居过滤调试] 帖子详情页第 ${index} 项：作者"${authorName}"在终极黑名单中，将隐藏。`);
                item.classList.add('sy-hidden-item');
                if (showPlaceholder) {
                    const placeholder = createReplyPlaceholder(item, authorName);
                    item.parentNode.insertBefore(placeholder, item);
                }
            } else {
                console.log(`[随缘居过滤调试] 帖子详情页第 ${index} 项：作者"${authorName}"不在终极黑名单中，不隐藏。`);
            }

            // 添加“拉黑”按钮
            if (!authorElement.nextElementSibling || !authorElement.nextElementSibling.classList.contains('sy-blacklist-button')) {
                const blacklistButton = document.createElement('button');
                blacklistButton.className = 'sy-blacklist-button';
                blacklistButton.textContent = '拉黑';

                authorElement.insertAdjacentElement('afterend', blacklistButton);

                blacklistButton.addEventListener('click', () => {
                    if (!confirm(`确定要将用户 "${authorName}" 加入终极黑名单吗？其所有帖子和回复都将被隐藏。`)) {
                        return;
                    }
                    const currentUltimateBlacklist = parseList(settings.ultimateBlacklist);
                    if (!currentUltimateBlacklist.includes(authorName)) {
                        currentUltimateBlacklist.push(authorName);
                        settings.ultimateBlacklist = currentUltimateBlacklist.join('\n');
                        saveSettings();

                        alert(`用户 "${authorName}" 已加入终极黑名单。页面将刷新。`);
                        location.reload();
                    } else {
                        alert(`用户 "${authorName}" 已在终极黑名单中。`);
                    }
                });
            }
        });
    }

    // --- 主执行流程 ---
    function init() {
        console.log("[随缘居过滤调试] 脚本开始初始化...");
        const currentUrl = window.location.href;
        console.log("[随缘居过滤调试] 当前URL:", currentUrl);

        const isSearchPage = currentUrl.includes('/search.php?mod=forum');
        const isThreadPage = currentUrl.includes('/thread-') || currentUrl.includes('/forum.php?mod=viewthread');
        const isForumPage = (currentUrl.includes('/forum-') && currentUrl.endsWith('.html')) || currentUrl.includes('/forum.php?mod=forumdisplay');
        const isTagPage = currentUrl.includes('/misc.php?mod=tag'); // New tag page detection
        console.log(`[随缘居过滤调试] 页面类型判断: 搜索页=${isSearchPage}, 帖子页=${isThreadPage}, 版块页=${isForumPage}, 标签页=${isTagPage}`);

        setupSettingsPanel();
        loadSettings();

        if (isSearchPage) {
            applyFiltersForSearchPage();
        } else if (isThreadPage) {
            applyFiltersForThreadPage();
        } else if (isForumPage) {
            applyFiltersForForumPage();
        } else if (isTagPage) { // Call new function for tag pages
            applyFiltersForTagPage();
        } else {
            console.log("[随缘居过滤调试] 当前页面不是脚本的目标页面类型。");
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        requestAnimationFrame(init); // 使用 requestAnimationFrame 确保在浏览器绘制前执行
    }

})();