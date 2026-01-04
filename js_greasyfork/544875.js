// ==UserScript==
// @name         GitHub DeepWiki Search (Visually Integrated)
// @namespace    http://tampermonkey.net/
// @version      2025-08-07.3
// @description  在GitHub仓库页面上添加一个与原生UI无缝集成的DeepWiki搜索框。
// @author       Your Name
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      api.devin.ai
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544875/GitHub%20DeepWiki%20Search%20%28Visually%20Integrated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544875/GitHub%20DeepWiki%20Search%20%28Visually%20Integrated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        // **CHANGED**: 直接定位到操作按钮的<ul>列表，这是最稳定的父容器。
        const actionsList = document.querySelector('ul.pagehead-actions');

        if (actionsList && !document.getElementById('deepwiki-search-container')) {
            console.log('Found actions list, adding integrated DeepWiki search UI...');
            addSearchUI(actionsList);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /**
     * @param {HTMLElement} targetList The <ul> element (pagehead-actions) to append to.
     */
    function addSearchUI(targetList) {
        // 1. 创建最外层的 <li> 元素，这是符合 GitHub 布局的关键
        const listItem = document.createElement('li');

        // 2. 创建一个 div 作为按钮组 (BtnGroup)，让输入框和按钮看起来像一个整体
        const btnGroup = document.createElement('div');
        btnGroup.id = 'deepwiki-search-container';
        btnGroup.className = 'BtnGroup d-flex'; // 使用 GitHub 的 BtnGroup 类

        // 3. 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'deepwiki-search-input';
        input.placeholder = 'DeepWiki Search';
        // 复用GitHub样式，并作为按钮组的一部分
        input.className = 'form-control input-sm BtnGroup-item';
        // 样式微调，使其与按钮无缝连接
        input.style.borderTopRightRadius = '0';
        input.style.borderBottomRightRadius = '0';
        input.style.zIndex = '1'; // 确保边框不会被旁边的按钮覆盖

        // 4. 创建搜索按钮
        const button = document.createElement('button');
        button.innerText = 'Search';
        button.id = 'deepwiki-search-button';
        // 复用GitHub样式，并作为按钮组的一部分
        button.className = 'btn btn-sm BtnGroup-item';
        // 负外边距，让按钮和输入框紧紧贴在一起
        button.style.marginLeft = '-1px';

        // 绑定事件
        button.addEventListener('click', performSearch);
        input.addEventListener('keyup', (event) => {
            if (event.key === "Enter") {
                performSearch();
            }
        });

        // 5. 按正确的层级组装 DOM
        btnGroup.appendChild(input);
        btnGroup.appendChild(button);
        listItem.appendChild(btnGroup);

        // 6. 将最终的 <li> 添加到操作列表中
        targetList.appendChild(listItem);
    }

    function performSearch() {
        const inputElement = document.getElementById('deepwiki-search-input');
        const keyword = inputElement.value.trim();

        if (!keyword) {
            alert('请输入搜索关键词！');
            return;
        }

        const searchButton = document.getElementById('deepwiki-search-button');
        searchButton.disabled = true;
        searchButton.innerText = '...'; // 使用更简洁的加载提示

        const repoNameMatch = window.location.pathname.match(/^\/([^/]+\/[^/]+)/);
        if (!repoNameMatch) {
            console.error('无法从URL中解析仓库名称。');
            alert('无法识别当前 GitHub 仓库！');
            searchButton.disabled = false;
            searchButton.innerText = 'Search';
            return;
        }
        const repoName = repoNameMatch[1];
        const queryId = generateUUID();
        const searchUrl = `https://deepwiki.com/search/_${queryId}`;

        const requestBody = {
            engine_id: "multihop",
            user_query: `${keyword}`,
            keywords: [],
            repo_names: [repoName],
            additional_context: "",
            query_id: `_${queryId}`,
            use_notes: false,
            generate_summary: false
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.devin.ai/ada/query",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "Referer": "https://deepwiki.com/"
            },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                console.log('DeepWiki API 请求成功:', response);
                GM_openInTab(searchUrl, { active: true });
                inputElement.value = '';
            },
            onerror: function(error) {
                console.error('DeepWiki API 请求失败:', error);
                alert('请求 DeepWiki API 失败，请查看浏览器控制台获取更多信息。');
            },
            ontimeout: function() {
                console.error('DeepWiki API 请求超时');
                alert('请求 DeepWiki API 超时。');
            },
            onloadend: function() {
                searchButton.disabled = false;
                searchButton.innerText = 'Search';
            }
        });
    }

    function generateUUID() {
        if (self.crypto && self.crypto.randomUUID) {
            return self.crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();