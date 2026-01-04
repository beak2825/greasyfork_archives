// ==UserScript==
// @name         选中文本
// @author       aeae------LceAn（www.lcean.com)
// @version      2.0
// @namespace    https://greasyfork.org/zh-CN/users/858044

// @description  选中的文本后在浏览器左上角弹出菜单(位置固定），可以进行搜索，复制，识别其中的网站。

// @match        http://*/*
// @include         http://*
// @include         https://*
// @encoding         utf-8

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license          GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/460181/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460181/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 默认搜索引擎设置
    let searchEngine = GM_getValue('searchEngine', 'https://www.google.com/search?q=');
    let imageSearchEngine = GM_getValue('imageSearchEngine', 'https://www.google.com/search?tbm=isch&q=');
    let translationEngine = GM_getValue('translationEngine', 'https://translate.google.com/?sl=auto&tl=en&text=');

    // 创建浮动菜单容器
    const menu = document.createElement('div');
    menu.id = 'text-selection-menu';
    document.body.appendChild(menu);

    // 应用CSS样式
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.textContent = `
                #text-selection-menu {
            position: fixed;
            top: 55px;
            left: 20px;
            padding: 10px;
            border: none;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 99999;
            display: none;
            font-family: 'Roboto', sans-serif;
        }
        #text-selection-menu a {
            display: block;
            padding: 10px 15px;
            margin: 0;
            color: #555;
            text-decoration: none;
            transition: background-color 0.3s, color 0.3s;
        }
        #text-selection-menu a:hover {
            background-color: #f5f5f5;
            color: #333;
        }
        #settings-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: auto;
            padding: 20px;
            background: white;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 100000;
            font-family: 'Roboto', sans-serif;
        }
        #settings-dialog div {
            margin-bottom: 10px;
        }
        #settings-dialog label {
            font-weight: 500;
        }
        #settings-dialog select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            background-color: #fff;
        }
        #settings-dialog button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #settings-dialog button:hover {
            background-color: #45a049;
        }
    `;


    // 添加菜单选项
    ['搜索', '复制', '链接', '搜图', '翻译'].forEach(function(action) {
        const option = document.createElement('a');
        option.textContent = action;
        option.href = '#';
        menu.appendChild(option);
        option.addEventListener('click', function(e) {
            e.preventDefault();
            switch (action) {
                case '搜索': performSearch(); break;
                case '复制': copyText(); break;
                case '链接': openLink(); break;
                case '搜图': searchImage(); break;
                case '翻译': translateText(); break;
            }
        });
    });

    // 鼠标放开时显示或隐藏菜单
    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString();
        if (selectedText.trim().length > 0) {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });

    // 实现搜索功能
    function performSearch() {
        const selectedText = window.getSelection().toString();
        window.open(searchEngine + encodeURIComponent(selectedText), '_blank');
        menu.style.display = 'none';
    }
    // 实现复制功能
    function copyText() {
        const selectedText = window.getSelection().toString();
        GM_setClipboard(selectedText);
        alert('Copied: ' + selectedText);
        menu.style.display = 'none';
    }
    // 实现打开链接功能
    function openLink() {
        const selectedText = window.getSelection().toString();
        const urlRegex = /https?:\/\/[^\s]+/g;
        const foundUrl = selectedText.match(urlRegex);
        if (foundUrl) {
            window.open(foundUrl[0], '_blank');
        } else {
            alert('No URL found in the selected text.');
        }
        menu.style.display = 'none';
    }
    // 实现搜图功能
    function searchImage() {
        const selectedText = window.getSelection().toString();
        window.open(imageSearchEngine + encodeURIComponent(selectedText), '_blank');
        menu.style.display = 'none';
    }
    // 实现翻译功能
    function translateText() {
        const selectedText = window.getSelection().toString();
        window.open(translationEngine + encodeURIComponent(selectedText), '_blank');
        menu.style.display = 'none';
    }

    // 设置对话框
    GM_registerMenuCommand('设置', openSettingsDialog);

    function openSettingsDialog() {
        const dialogHtml = `
        <div id="settings-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border: 1px solid black; z-index: 100000;">
            <div>
                <label for="search-engine-select">搜索引擎:</label>
                <select id="search-engine-select">
                    <option value="https://www.google.com/search?q=" ${searchEngine === "https://www.google.com/search?q=" ? "selected" : ""}>Google</option>
                    <option value="https://www.bing.com/search?q=" ${searchEngine === "https://www.bing.com/search?q=" ? "selected" : ""}>Bing</option>
                    <option value="https://www.baidu.com/s?wd=" ${searchEngine === "https://www.baidu.com/s?wd=" ? "selected" : ""}>Baidu</option>
                </select>
            </div>
            <div>
                <label for="image-search-engine-select">图像搜索引擎:</label>
                <select id="image-search-engine-select">
                    <option value="https://www.google.com/search?tbm=isch&q=" ${imageSearchEngine === "https://www.google.com/search?tbm=isch&q=" ? "selected" : ""}>Google Images</option>
                    <option value="https://www.bing.com/images/search?q=" ${imageSearchEngine === "https://www.bing.com/images/search?q=" ? "selected" : ""}>Bing Images</option>
                    <option value="https://image.baidu.com/search/index?tn=baiduimage&word=" ${imageSearchEngine === "https://image.baidu.com/search/index?tn=baiduimage&word=" ? "selected" : ""}>Baidu Images</option>
                </select>
            </div>
            <div>
                <label for="translation-engine-select">翻译引擎:</label>
                <select id="translation-engine-select">
                    <option value="https://translate.google.com/?sl=auto&tl=en&text=" ${translationEngine === "https://translate.google.com/?sl=auto&tl=en&text=" ? "selected" : ""}>Google Translate</option>
                    <option value="https://www.bing.com/translator" ${translationEngine === "https://www.bing.com/translator" ? "selected" : ""}>Bing Translator</option>
                </select>
            </div>
            <button onclick="saveSettings()">保存</button>
            <button onclick="document.getElementById('settings-dialog').remove()">关闭</button>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        document.getElementById('saveButton').addEventListener('click', saveSettings);
        document.getElementById('closeButton').addEventListener('click', function() {
        document.getElementById('settings-dialog').remove();
        });
    }

    function saveSettings() {
        const searchEngineSelect = document.getElementById('search-engine-select');
        const imageSearchEngineSelect = document.getElementById('image-search-engine-select');
        const translationEngineSelect = document.getElementById('translation-engine-select');

        GM_setValue('searchEngine', searchEngineSelect.value);
        GM_setValue('imageSearchEngine', imageSearchEngineSelect.value);
        GM_setValue('translationEngine', translationEngineSelect.value);

        searchEngine = searchEngineSelect.value;
        imageSearchEngine = imageSearchEngineSelect.value;
        translationEngine = translationEngineSelect.value;

        document.getElementById('settings-dialog').remove();
        alert('Settings saved!');
    }

})();