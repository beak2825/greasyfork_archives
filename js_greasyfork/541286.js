// ==UserScript==
// @name        关键词查找工具
// @namespace   http://tampermonkey.net/
// @version     0.4
// @description 专门用于查找页面关键词，优化了特殊字符处理
// @author      八千xmx
// @match       *://*/*
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541286/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%9F%A5%E6%89%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541286/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%9F%A5%E6%89%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        .trade-search-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-height: 40px;
            overflow: hidden;
            transition: all 0.3s ease;
            border-radius: 6px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0,0,0,0.08);
        }

        .trade-search-container.expanded {
            max-height: 400px;
        }

        .trade-search-header {
            padding: 10px 12px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            background: rgba(0,0,0,0.03);
        }

        .trade-search-content {
            padding: 12px;
            overflow-y: auto;
            max-height: 330px;
        }

        .trade-search-input {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 4px;
            font-size: 13px;
            background: rgba(255,255,255,0.8);
        }

        .trade-search-results {
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-wrap;
            max-height: 250px;
            overflow-y: auto;
            padding: 5px 0;
            font-family: monospace;
        }

        .trade-search-match {
            background: rgba(255, 235, 59, 0.35);
            padding: 0 2px;
            border-radius: 2px;
            margin: 2px 0;
            color: #d32f2f;
            font-weight: bold;
        }

        .trade-search-buttons {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        .trade-search-button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .trade-search-button.search {
            background: #4CAF50;
            color: white;
        }

        .trade-search-button.copy {
            background: #2196F3;
            color: white;
        }

        .trade-search-count {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            text-align: right;
        }

        .trade-search-toggle {
            transition: transform 0.2s;
        }

        .trade-search-options {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .trade-search-checkbox {
            margin-right: 5px;
        }

        .trade-search-label {
            margin-right: 15px;
            display: flex;
            align-items: center;
        }
    `);

    // 创建容器
    const container = document.createElement('div');
    container.className = 'trade-search-container';
    container.innerHTML = `
        <div class="trade-search-header">
            <span>数据查找</span>
            <span class="trade-search-toggle">▼</span>
        </div>
        <div class="trade-search-content">
            <input type="text" class="trade-search-input" placeholder="输入关键词(如'身高')...">
            <div class="trade-search-options">
                <label class="trade-search-label">
                    <input type="checkbox" class="trade-search-checkbox" checked> 中文匹配
                </label>
                <label class="trade-search-label">
                    <input type="checkbox" class="trade-search-checkbox"> 精确匹配
                </label>
            </div>
            <div class="trade-search-buttons">
                <button class="trade-search-button search">查找</button>
                <button class="trade-search-button copy">复制</button>
            </div>
            <div class="trade-search-results"></div>
            <div class="trade-search-count"></div>
        </div>
    `;

    document.body.appendChild(container);

    const header = container.querySelector('.trade-search-header');
    const content = container.querySelector('.trade-search-content');
    const input = container.querySelector('.trade-search-input');
    const searchBtn = container.querySelector('.trade-search-button.search');
    const copyBtn = container.querySelector('.trade-search-button.copy');
    const results = container.querySelector('.trade-search-results');
    const countDisplay = container.querySelector('.trade-search-count');
    const toggle = container.querySelector('.trade-search-toggle');
    const chineseCheckbox = container.querySelector('.trade-search-checkbox');
    const exactCheckbox = container.querySelectorAll('.trade-search-checkbox')[1];

    // 查找数据中的关键词
    function searchInTrades(keyword) {
        if (!keyword) {
            results.innerHTML = '<div style="color:#666">请输入关键词</div>';
            countDisplay.textContent = '';
            return;
        }

        const selection = window.getSelection();
        let currentElement = selection.anchorNode;

        if (!currentElement || currentElement.nodeType !== Node.TEXT_NODE) {
            currentElement = document.body;
        } else {
            currentElement = currentElement.parentElement;
        }

        const text = currentElement.textContent;
        const useChinese = chineseCheckbox.checked;
        const exactMatch = exactCheckbox.checked;

        let regex;
        if (exactMatch) {
            regex = new RegExp(`(${escapeRegExp(keyword)})`, 'g');
        } else if (useChinese) {
            // 专门匹配中文字符
            regex = new RegExp(`([^\\p{P}\\s]*${escapeRegExp(keyword)}[^\\p{P}\\s]*)`, 'gu');
        } else {
            regex = new RegExp(`(\\b[^\\s]*${escapeRegExp(keyword)}[^\\s]*\\b)`, 'gi');
        }

        const matches = [...text.matchAll(regex)];
        const uniqueMatches = [...new Set(matches.map(m => m[0]))];

        if (uniqueMatches.length > 0) {
            const highlighted = uniqueMatches.map(match =>
                match.replace(new RegExp(escapeRegExp(keyword), 'gi'),
                    '<span class="trade-search-match">$&</span>')
            ).join('<br>');

            results.innerHTML = highlighted;
            countDisplay.textContent = `找到 ${uniqueMatches.length} 个唯一匹配`;

            // 自动滚动到第一个匹配项
            const firstMatch = results.querySelector('.trade-search-match');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            results.innerHTML = `<div style="color:#666">未找到"${keyword}"</div>`;
            countDisplay.textContent = '';
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 自动收缩功能
    let collapseTimer;
    container.addEventListener('mouseleave', () => {
        collapseTimer = setTimeout(() => {
            container.classList.remove('expanded');
            toggle.textContent = '▼';
            toggle.style.transform = 'rotate(0deg)';
        }, 1000);
    });

    container.addEventListener('mouseenter', () => {
        clearTimeout(collapseTimer);
    });

    // 点击标题切换展开/收缩
    header.addEventListener('click', () => {
        container.classList.toggle('expanded');
        const isExpanded = container.classList.contains('expanded');
        toggle.textContent = isExpanded ? '▲' : '▼';
        toggle.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        if (isExpanded) {
            input.focus();
        }
    });

    // 事件监听
    searchBtn.addEventListener('click', () => {
        searchInTrades(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchInTrades(input.value.trim());
        }
    });

    copyBtn.addEventListener('click', () => {
        if (results.textContent && results.textContent !== '请输入关键词' && !results.textContent.includes('未找到')) {
            GM_setClipboard(results.textContent);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    });

    // 初始状态
    container.classList.add('expanded');
    toggle.textContent = '▲';
    toggle.style.transform = 'rotate(180deg)';
    input.focus();
})();