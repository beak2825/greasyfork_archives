// ==UserScript==
// @name         闲鱼智能搜索助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  捕获闲鱼搜索下拉词，点击建议可复制内容，列表无内部滚动条，手动关闭。
// @author       Your Name
// @match        https://www.goofish.com/*
// @match        https://s.goofish.com/*
// @match        https://m.goofish.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      h5api.m.goofish.com
// @connect      goofish.com
// @connect      taobao.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538139/%E9%97%B2%E9%B1%BC%E6%99%BA%E8%83%BD%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538139/%E9%97%B2%E9%B1%BC%E6%99%BA%E8%83%BD%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log('闲鱼智能搜索助手 (点击复制版 v0.7) 已加载');

    // --- CSS样式 ---
    GM_addStyle(`
        #goofish-suggestions-toast {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 340px;
            background-color: #ffffff;
            color: #333333;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0,0,0,0.07);
            z-index: 2147483647;
            font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            font-size: 14px;
            /* overflow: hidden; CHANGED BELOW */
            opacity: 0;
            transform: scale(0.9) translateX(50px);
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            visibility: hidden;

            max-height: 75vh; /* 提示框最大高度为视窗的75% */
            overflow-y: auto;   /* 如果内容超出max-height，则整个toast出现滚动条 */
            overflow-x: hidden; /* 水平方向不出现滚动条 */
        }

        #goofish-suggestions-toast.show {
            opacity: 1;
            transform: scale(1) translateX(0);
            visibility: visible;
        }

        #goofish-suggestions-toast .toast-header {
            padding: 12px 18px;
            background-image: linear-gradient(135deg, #1E90FF, #00BFFF);
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            font-size: 15px;
            cursor: grab;
            /* position: sticky; top: 0; z-index: 1; /* 使头部在toast滚动时置顶 (可选) */
        }
        #goofish-suggestions-toast .toast-header:active {
            cursor: grabbing;
        }

        #goofish-suggestions-toast .toast-header .toast-title-container {
            display: flex;
            align-items: center;
        }

        #goofish-suggestions-toast .toast-header .copy-feedback {
            font-size: 12px;
            font-weight: normal;
            margin-left: 8px;
            padding: 2px 6px;
            background-color: rgba(255,255,255,0.2);
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        #goofish-suggestions-toast .toast-header .copy-feedback.show {
            opacity: 1;
        }

        #goofish-suggestions-toast .toast-header .toast-close {
            background: none;
            border: none;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
            padding: 0 3px;
            line-height: 1;
            transition: color 0.2s ease, transform 0.2s ease;
        }
        #goofish-suggestions-toast .toast-header .toast-close:hover {
            color: #ffffff;
            transform: rotate(90deg);
        }

        #goofish-suggestions-toast .toast-list {
            list-style: none;
            padding: 0;
            margin: 0;
            /* max-height: 300px; REMOVED */
            /* overflow-y: auto;   CHANGED to hidden or remove */
            overflow-y: hidden; /* 列表本身不出现滚动条 */
            background-color: #fcfdff;
        }

        #goofish-suggestions-toast .toast-list li {
            padding: 11px 18px;
            border-bottom: 1px solid #e9edf2;
            white-space: nowrap;
            overflow: hidden; /* 这个hidden用于单行超长时显示省略号 */
            text-overflow: ellipsis;
            color: #4A5568;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.15s ease, color 0.15s ease;
        }
        #goofish-suggestions-toast .toast-list li:hover {
            background-color: #e6f4ff;
            color: #007AFF;
        }
        #goofish-suggestions-toast .toast-list li:last-child {
            border-bottom: none;
        }
        #goofish-suggestions-toast .toast-list li.copied-item {
            background-color: #D1FAE5 !important;
            color: #065F46 !important;
            font-weight: 500;
        }

        /* 美化整个toast的滚动条 (如果出现) */
        #goofish-suggestions-toast::-webkit-scrollbar {
            width: 8px;
        }
        #goofish-suggestions-toast::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05); /* 轨道颜色 */
            border-radius: 0 10px 10px 0; /* 配合toast的圆角 */
        }
        #goofish-suggestions-toast::-webkit-scrollbar-thumb {
            background: #bdc3c7; /* 滑块颜色 (灰色系) */
            border-radius: 4px;
        }
        #goofish-suggestions-toast::-webkit-scrollbar-thumb:hover {
            background: #95a5a6; /* 滑块悬停颜色 */
        }
    `);

    // --- Toast 管理 (JavaScript逻辑与0.6版本基本一致) ---
    let suggestionsToastElement = null;
    let copyFeedbackTimer = null;

    function showSuggestionsToast(suggestions) {
        if (copyFeedbackTimer) {
            clearTimeout(copyFeedbackTimer);
        }

        if (!suggestionsToastElement) {
            suggestionsToastElement = document.createElement('div');
            suggestionsToastElement.id = 'goofish-suggestions-toast';

            const header = document.createElement('div');
            header.className = 'toast-header';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'toast-title-container';
            const title = document.createElement('span');
            title.textContent = '🔍 搜索建议';
            const copyFeedbackSpan = document.createElement('span');
            copyFeedbackSpan.className = 'copy-feedback';
            titleContainer.appendChild(title);
            titleContainer.appendChild(copyFeedbackSpan);

            const closeButton = document.createElement('button');
            closeButton.className = 'toast-close';
            closeButton.innerHTML = '&times;';
            closeButton.title = '关闭';
            closeButton.onclick = () => {
                suggestionsToastElement.classList.remove('show');
            };

            header.appendChild(titleContainer);
            header.appendChild(closeButton);

            const list = document.createElement('ul');
            list.className = 'toast-list';

            suggestionsToastElement.appendChild(header);
            suggestionsToastElement.appendChild(list);
            document.body.appendChild(suggestionsToastElement);
        }

        const listElement = suggestionsToastElement.querySelector('.toast-list');
        const copyFeedbackSpan = suggestionsToastElement.querySelector('.copy-feedback');
        listElement.innerHTML = '';
        copyFeedbackSpan.classList.remove('show');

        if (!suggestions || suggestions.length === 0) {
            suggestionsToastElement.classList.remove('show');
            return;
        }

        suggestions.forEach(sugText => {
            const listItem = document.createElement('li');
            listItem.textContent = sugText;
            listItem.title = `点击复制: "${sugText}"`;
            listItem.onclick = function() {
                GM_setClipboard(sugText, 'text');
                listElement.querySelectorAll('li.copied-item').forEach(li => li.classList.remove('copied-item'));
                this.classList.add('copied-item');
                copyFeedbackSpan.textContent = '已复制!';
                copyFeedbackSpan.classList.add('show');
                if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
                copyFeedbackTimer = setTimeout(() => {
                    copyFeedbackSpan.classList.remove('show');
                }, 1800);
            };
            listElement.appendChild(listItem);
        });

        // 确保在显示前，如果toast本身有滚动条，滚动到顶部
        if (suggestionsToastElement.scrollHeight > suggestionsToastElement.clientHeight) {
             suggestionsToastElement.scrollTop = 0;
        }
        // 对于列表内部，由于取消了滚动条，不需要单独设置scrollTop
        // listElement.scrollTop = 0;

        suggestionsToastElement.classList.add('show');
    }


    // --- XMLHttpRequest 劫持逻辑 (与之前版本相同) ---
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // ... (此处代码与0.6版本完全相同，为简洁省略)
        if (url.includes('mtop.taobao.idlemtopsearch.pc.search.suggest')) {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    GM_log('捕获到目标下拉建议API请求: ' + url);
                    try {
                        const responseText = this.responseText;
                        let parsedData;

                        if (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) {
                            parsedData = JSON.parse(responseText);
                        } else {
                            const match = responseText.match(/[^(]*\((.*)\)/);
                            if (match && match[1]) {
                                parsedData = JSON.parse(match[1]);
                            } else {
                                GM_log('无法解析响应: ' + responseText);
                                return;
                            }
                        }

                        let suggestions = [];
                        if (parsedData && parsedData.data && parsedData.data.items && Array.isArray(parsedData.data.items)) {
                            suggestions = parsedData.data.items.map(item => item.suggest);
                        }

                        if (suggestions.length > 0) {
                            GM_log('获取到的下拉推荐词:');
                            suggestions.forEach(sug => GM_log('- ' + sug));
                            showSuggestionsToast(suggestions);
                        } else {
                            GM_log('未从响应中提取到下拉词。');
                            showSuggestionsToast([]);
                        }

                    } catch (e) {
                        GM_log('处理下拉建议响应时出错: ' + e);
                    }
                } else if (this.readyState === 4) {
                    GM_log('请求完成但状态码非200: ' + this.status + ' for URL: ' + url);
                }
            });

            this.addEventListener('error', function () {
                GM_log('请求API时发生错误: ' + url);
            });
        }
        originOpen.apply(this, arguments);
    };

    GM_log('脚本执行完毕，等待用户操作触发API请求。');

})();