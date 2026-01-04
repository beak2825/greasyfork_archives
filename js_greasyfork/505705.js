// ==UserScript==
// @name         全站搜索
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  给所有网页右上角加一个搜索框，搜索当前域名下搜索词信息
// @license     MIT
// @author      失辛向南
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505705/%E5%85%A8%E7%AB%99%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/505705/%E5%85%A8%E7%AB%99%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.search-container {
            position: fixed;
            top: 50px;
            right: -250px; // 初始隐藏在右侧外面
            width: 250px;
            z-index: 9999;
            background-color: #444; // 深灰色，不透明
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 3px;
            padding: 5px;
            transition: right 0.3s ease;
        }
.engine-select {
            display: inline-block;
            margin-right: 5px;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 14px;
            color: #333;
        }
.search-container:hover,.search-container:focus-within {
            background-color: #888; // 鼠标移上去时浅灰色
        }
        input[type="text"] {
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 14px;
            color: #333;
        }
        button {
            background-color: transparent;
            border: none;
            outline: none;
            font-size: 14px;
            color: #333;
            cursor: pointer;
        }
     .hide-arrow {
            font-size: 20px;
            cursor: pointer;
        }
    `);

    const container = document.createElement('div');
    container.className = 'search-container';

    const engineSelect = document.createElement('select');
    engineSelect.className = 'engine-select';
    const searchEngines = [
        { name: '百度', url: 'https://www.baidu.com/s?wd=' },
        { name: '搜狗', url: 'https://www.sogou.com/web?query=' },
        { name: '360', url: 'https://www.so.com/s?q=' },
        { name: '谷歌', url: 'https://www.google.com/search?q=' },
        { name: '必应', url: 'https://www.bing.com/search?q=' }
    ];
    searchEngines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine.url;
        option.textContent = engine.name;
        engineSelect.appendChild(option);
    });
    container.appendChild(engineSelect);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入搜索词...';
    container.appendChild(input);

    const searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.addEventListener('click', function() {
        const selectedEngineUrl = engineSelect.value;
        const keyword = input.value;
        const currentUrl = window.location.host;
        const searchUrl = `${selectedEngineUrl}site:${currentUrl}+${keyword}`;
        window.open(searchUrl, '_blank');
        container.style.right = '-250px';
        input.value = '';
    });
    container.appendChild(searchButton);

    const hideArrow = document.createElement('span');
    hideArrow.className = 'hide-arrow';
    hideArrow.textContent = '➡';
    hideArrow.addEventListener('click', function() {
        container.style.right = '-250px';
    });
    container.appendChild(hideArrow);

    document.body.appendChild(container);

    // 添加触摸事件处理
    container.addEventListener('touchstart', function() {
        container.style.right = '20px';
        container.style.backgroundColor = '#888';
    });

    container.addEventListener('mouseenter', function() {
        container.style.right = '20px';
        container.style.backgroundColor = '#888';
    });
})();