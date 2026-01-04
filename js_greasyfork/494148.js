// ==UserScript==
// @name         GitHub 简易搜索
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Help perform advanced GitHub searches with dynamic parameters.简单搜索Github方法。
// @author       Hill
// @match        *://github.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494148/GitHub%20%E7%AE%80%E6%98%93%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/494148/GitHub%20%E7%AE%80%E6%98%93%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个简单的表单来输入搜索参数
    const formHTML = `
        <div id="searchForm" style="position: fixed; top: 20px; right: 20px; background-color: white; padding: 10px; border: 1px solid #ccc; z-index: 1000; display: none;">
            <div>
                <label>Search Query:</label>
                <input type="text" id="searchQuery" style="width: 200px;">
            </div>
            <div>
                <label>Stars (>N):</label>
                <input type="number" id="searchStars" placeholder="Enter number" style="width: 100px;">
            </div>
            <div>
                <label>Language:</label>
                <input type="text" id="searchLanguage" style="width: 100px;">
            </div>
            <button type="button" id="searchButton">Search on GitHub</button>
        </div>
        <button type="button" id="expandSearch" style="position: fixed; top: 10px; right: 20px; font-size: 20px; padding: 2px 10px; z-index: 1000;">+</button>
    `;

    // 插入表单到页面
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);

    // 添加事件监听器到展开按钮
    document.getElementById('expandSearch').addEventListener('click', function() {
        const form = document.getElementById('searchForm');
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
            document.getElementById('expandSearch').textContent = '-';
        } else {
            form.style.display = 'none';
            document.getElementById('expandSearch').textContent = '+';
        }
    });

    // 处理搜索按钮点击事件
    document.getElementById('searchButton').addEventListener('click', function() {
        const query = document.getElementById('searchQuery').value;
        let stars = document.getElementById('searchStars').value;
        const language = document.getElementById('searchLanguage').value;

        // 格式化星标搜索参数
        if (stars) {
            stars = `>${stars}`; // 构建大于指定星标的搜索条件
        }

        // 构建搜索URL
        let searchURL = 'https://github.com/search?q=';
        if (query) {
            searchURL += encodeURIComponent(query);
        }
        if (stars) {
            searchURL += '+stars:' + encodeURIComponent(stars);
        }
        if (language) {
            searchURL += '+language:' + encodeURIComponent(language);
        }

        // 在新标签页中打开搜索结果
        location.href = searchURL;
    });
})();
