// ==UserScript==
// @name        批量搜索蓝湖设计图链接
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  在蓝湖页面上快速搜索多个设计图并自动打开，并显示生成的链接
// @author       Dong
// @match        https://lanhuapp.com/dashboard/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502931/%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E8%93%9D%E6%B9%96%E8%AE%BE%E8%AE%A1%E5%9B%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/502931/%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E8%93%9D%E6%B9%96%E8%AE%BE%E8%AE%A1%E5%9B%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL中的tid，或从IndexedDB查找，最后使用默认值
    async function getTidFromUrl() {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        let tid = urlParams.get('tid');

        if (!tid) { // 如果URL中没有tid，尝试从IndexedDB获取
            tid = await getTidFromIndexedDB();
        }

        return tid;
    }

    // 从IndexedDB中获取tid
    async function getTidFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('lanhu dashboard app');

            request.onerror = function(event) {
                console.error("IndexedDB error: ", event);
                resolve(null);
            };

            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['keyvaluepairs'], 'readonly');
                const objectStore = transaction.objectStore('keyvaluepairs');
                const getRequest = objectStore.get('tid');

                getRequest.onerror = function(event) {
                    console.error("IndexedDB get error: ", event);
                    resolve(null);
                };

                getRequest.onsuccess = function(event) {
                    if (getRequest.result) {
                        resolve(getRequest.result);
                    } else {
                        resolve(null);
                    }
                };
            };
        });
    }

    // 添加输入框、进度条和表格到页面
    let inputDiv = document.createElement('div');
    inputDiv.id = 'tampermonkey-lanhu-quick-search';
    document.body.appendChild(inputDiv);

    let inputContainer = document.createElement('div');
    inputContainer.id = 'input-container';
    inputDiv.appendChild(inputContainer);

    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = '输入关键词，使用空格分隔';
    inputContainer.appendChild(inputField);

    let searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    inputContainer.appendChild(searchButton);

    let autoOpenCheckbox = document.createElement('input');
    autoOpenCheckbox.type = 'checkbox';
    autoOpenCheckbox.id = 'auto-open-checkbox';
    autoOpenCheckbox.checked = true; // 默认勾选
    inputContainer.appendChild(autoOpenCheckbox);

    let autoOpenLabel = document.createElement('label');
    autoOpenLabel.htmlFor = 'auto-open-checkbox';
    autoOpenLabel.textContent = '自动打开链接';
    inputContainer.appendChild(autoOpenLabel);

    let clearButton = document.createElement('button');
    clearButton.textContent = 'X';
    clearButton.id = 'clear-button';
    clearButton.style.display = 'none'; // 初始隐藏
    inputContainer.appendChild(clearButton);

    let progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'progress-bar-container';
    inputDiv.appendChild(progressBarContainer);

    let progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBarContainer.appendChild(progressBar);

    let errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    inputDiv.appendChild(errorMessage);

    // 创建显示结果的表格
    let resultTableContainer = document.createElement('div');
    resultTableContainer.id = 'result-table-container';
    resultTableContainer.style.display = 'none'; // 初始隐藏
    inputDiv.appendChild(resultTableContainer);

    let resultTable = document.createElement('table');
    resultTable.id = 'result-table';
    resultTableContainer.appendChild(resultTable);

    // 初始隐藏进度条和错误提示
    progressBarContainer.style.display = 'none';
    errorMessage.style.display = 'none';

    // 处理搜索事件
    function handleSearch() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        let keywords = inputField.value.trim().split(/\s+/);
        if (keywords.length === 0 || keywords[0] === '') {
            showError('请输入搜索关键词');
            return;
        }
        progressBarContainer.style.display = 'block'; // 显示进度条
        resultTable.innerHTML = ''; // 清空表格内容
        resultTableContainer.style.display = 'none'; // 隐藏表格容器
        clearButton.style.display = 'none'; // 隐藏清除按钮
        searchKeywords(keywords);
    }

    // 点击搜索按钮时搜索
    searchButton.addEventListener('click', handleSearch);

    // 点击清除按钮时清空表格
    clearButton.addEventListener('click', function() {
        resultTable.innerHTML = ''; // 清空表格内容
        resultTableContainer.style.display = 'none'; // 隐藏表格容器
        clearButton.style.display = 'none'; // 隐藏清除按钮
    });

    // 在输入框中按回车键时搜索
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    async function searchKeywords(keywords) {
        let totalKeywords = keywords.length;
        let completedKeywords = 0;
        let autoOpenLinks = autoOpenCheckbox.checked;
        const tid = await getTidFromUrl(); // 获取tid

        keywords.forEach(keyword => {
            searchAndOpenLinks(keyword, tid, (link) => {
                completedKeywords++;
                updateProgressBar(completedKeywords / totalKeywords * 100);
                addResultToTable(keyword, link, autoOpenLinks);
                if (completedKeywords === totalKeywords) {
                    setTimeout(() => {
                        updateProgressBar(0);
                        progressBarContainer.style.display = 'none'; // 隐藏进度条
                    }, 1000);
                }
            });
        });
    }

    function searchAndOpenLinks(keyword, tid, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://lanhuapp.com/workbench/api/workbench/abstractfile/search',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                tenantId: tid, // 使用从URL获取的tid
                keyword: keyword,
                sourceType: ["dc_prj", "board", "ts_single_doc", "folder", "dc_prj_image", "dc_prj_prd"],
                pageNo: 1,
                pageSize: 5
            }),
            onload: function(response) {
                let result = JSON.parse(response.responseText);
                if (result && result.data && result.data.dc_prj && result.data.dc_prj.items.length > 0) {
                    let itemId = result.data.dc_prj.items[0].itemId;
                    let link = `https://lanhuapp.com/web/#/item/project/stage?tid=${tid}&pid=${itemId}`; // 使用从URL获取的tid
                    callback(link);
                } else {
                    callback(null);
                }
            },
            onerror: function() {
                showError('搜索请求失败，请稍后重试');
                callback(null); // 错误情况下也调用回调
            }
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function updateProgressBar(percentage) {
        progressBar.style.width = `${percentage}%`;
    }

    function addResultToTable(keyword, link, autoOpenLinks) {
        let row = resultTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.textContent = keyword;
        let linkElement = document.createElement('a');
        if (link) {
            linkElement.href = link;
            linkElement.textContent = link;
            linkElement.target = '_blank';
        } else {
            linkElement.textContent = '未找到结果';
        }
        cell2.appendChild(linkElement);

        if (link && autoOpenLinks) {
            GM_openInTab(link, { active: false });
        }

        resultTableContainer.style.display = 'block'; // 显示表格容器
        clearButton.style.display = 'inline-block'; // 显示清除按钮
    }

    // 样式
    GM_addStyle(`
        #tampermonkey-lanhu-quick-search {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background-color: #fff;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            width: auto;
        }
        #input-container {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
        }
        #tampermonkey-lanhu-quick-search input[type="text"] {
            min-width: 200px;
            max-width: 100%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
            margin-right: 10px;
        }
        #tampermonkey-lanhu-quick-search button {
            padding: 5px 10px;
            background-color: #2878ff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #tampermonkey-lanhu-quick-search button:hover {
            background-color: #236bcb;
        }
        #clear-button {
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: auto; /* 使清除按钮靠右对齐 */
        }
        #clear-button:hover {
            background-color: #e53935;
        }
        #auto-open-checkbox {
            margin-left: 10px;
            margin-right: 5px;
        }
        #hidden-span {
            position: absolute;
            visibility: hidden;
            white-space: pre;
            font-size: 14px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
        }
        #progress-bar-container {
            width: 100%;
            height: 5px;
            background-color: #f0f0f0;
            margin-top: 5px;
            border-radius: 5px;
            overflow: hidden;
            display: none;
        }
        #progress-bar {
            width: 0;
            height: 100%;
            background-color: #2878ff;
            transition: width 0.3s ease-in-out;
        }
        #error-message {
            color: red;
            margin-top: 5px;
            font-size: 12px;
            text-align: center;
        }
        #result-table-container {
            max-height: 600px; /* 设置最大高度 */
            overflow-y: auto; /* 当内容超出高度时，显示滚动条 */
            width: 100%;
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        #result-table {
            width: 100%;
            border-collapse: collapse;
        }
        #result-table th, #result-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        #result-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        #result-table tr:hover {
            background-color: #ddd;
        }
    `);
})();