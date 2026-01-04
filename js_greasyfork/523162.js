// ==UserScript==
// @name         linodas卡组保存工具
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  提供一个简单的界面来输入卡组ID、卡片名称和数量，并发送保存请求
// @author       EviCalf
// @match        https://www.linodas.com/character/deck
// @match        https://www.linodas.com/character/deck/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523162/linodas%E5%8D%A1%E7%BB%84%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523162/linodas%E5%8D%A1%E7%BB%84%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加HTML元素
    const customUI = document.createElement('div');
    customUI.id = 'custom-ui';
    customUI.style.backgroundColor = 'black';
    customUI.style.padding = '10px';
    customUI.style.border = '1px solid #ccc';
    customUI.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    customUI.innerHTML = `
        <div id="custom-ui">
            <style>
            .custom-button {
                padding: 10px 20px;
                margin: 5px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            }
            .custom-button:hover {
                background-color: #0056b3;
            }
            .button-container {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }
            .input-container {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
            }
            .input-container label {
                margin-bottom: 5px;
            }
            .input-container input,
            .input-container textarea {
                width: 100%;
                padding: 5px;
                box-sizing: border-box;
            }
            .deck-list {
                margin-top: 20px;
            }
            .deck-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .deck-item button {
                padding: 5px 10px;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            }
            .deck-item button:hover {
                background-color: #c82333;
            }
            .storage-deck-name {
                cursor: pointer;
                color: white;
                text-decoration: underline;
            }
            .storage-deck-name:hover {
                color: red;
            }
            </style>
            <h3>linodas卡组保存小工具</h3>
            <div class="input-container">
                <label for="deck-name">卡组名称:</label>
                <input type="text" id="deck-name" placeholder="输入卡组名称">
            </div>
            <div class="input-container">
                <label for="deck-id">卡组ID:</label>
                <input type="text" id="deck-id" placeholder="输入卡组ID">
            </div>
            <div class="input-container">
                <label for="card-details">卡片名称和数量 (格式: cardID=value, 例如: card123=5):</label>
                <textarea id="card-details" rows="4" placeholder="输入卡片名称和数量"></textarea>
            </div>
            <div class="button-container">
                <button id="fill-button" class="custom-button">填充当前卡组信息</button>
                <button id="local-save-button" class="custom-button">保存</button>
                <button id="submit-button" class="custom-button">提交</button>
            </div>
            <div id="response-output" style="margin-top: 10px;"></div>
            <h3>卡组列表</h3>
            <div class="deck-list" id="deck-list"></div>
            <div class="button-container">
                <button id="save-button" class="custom-button">导出为文件</button>
                <button id="import-button" class="custom-button">导入文件</button>
            </div>
        </div>
    `;

    // 找到 wireframe 和 clearfloat 元素
    const decklistFlex = document.querySelector('div.decklist.flex');

    if (decklistFlex) {
        decklistFlex.parentNode.insertBefore(customUI, decklistFlex);
    } else {
        console.error('未找到 decklist flex 元素');
        document.body.appendChild(customUI); // 如果未找到，则回退到body末尾插入
    }

    function updateDeckList() {
        const deckListContainer = document.getElementById('deck-list');
        deckListContainer.innerHTML = '';
    
        const allDecks = loadAllDecks();
        for (const deckName in allDecks) {
            if (allDecks.hasOwnProperty(deckName)) {
                const deckItem = document.createElement('div');
                deckItem.className = 'deck-item';
                deckItem.innerHTML = `
                    <span class="storage-deck-name" data-deck-name="${deckName}">${deckName}</span>
                    <button class="delete-button" data-deck-name="${deckName}">删除</button>
                `;
                deckListContainer.appendChild(deckItem);
            }
        }
    
        // 添加删除按钮事件监听器
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const deckName = this.getAttribute('data-deck-name');
                deleteDeckFromLocalStorage(deckName);
            });
        });
    
        // 添加卡组名称点击事件监听器
        const deckNames = document.querySelectorAll('.storage-deck-name');
        deckNames.forEach(span => {
            span.addEventListener('click', function() {
                const deckName = this.getAttribute('data-deck-name');
                const deckData = loadFromLocalStorage(deckName);
                console.log('Deck Name:', deckName);
                console.log('Deck Data:', deckData);
                if (deckData) {
                    document.getElementById('deck-name').value = deckData.name;
                    document.getElementById('card-details').value = deckData.details;
                } else {
                    console.log('Deck data not found for:', deckName);
                }
            });
        });
    }

    // 获取所有Cookie
    function getAllCookies() {
        return document.cookie;
    }

    // 填充当前卡组信息
    document.getElementById('fill-button').addEventListener('click', function() {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split('/');
        const deckIdIndex = pathSegments.indexOf('id');
        let deckId = deckIdIndex !== -1 && pathSegments.length > deckIdIndex + 1 ? pathSegments[deckIdIndex + 1] : null;
        
        if (!deckId) {
            deckId = document.getElementById("user_static_deck_list").querySelector("div.decklist").getAttribute('data-deck-id');
        }

        // 找到id为nowdeck的div元素
        const nowdeckElement = document.getElementById('nowdeck');
        const nowdeck_name = document.getElementById('nowdeck_name');
        const cardElements = nowdeckElement.querySelectorAll('div.cardlist.flex');
    
        if (!deckId || cardElements.length === 0) {
            document.getElementById('response-output').innerHTML = '<p style="color: red;">未找到卡组ID或卡片信息。</p>';
            return;
        }

        const cards = [];
        cardElements.forEach(cardElement => {
            const cardId = cardElement.id.replace('deck_card', '').replace('_div', '');
            const cardNameTag = cardElement.querySelector('a.linodas_card.card.info.format');
            const cardCountTag = cardElement.querySelector('span._DECK_CARD_NUM');
            if (cardNameTag && cardCountTag) {
                const cardName = cardNameTag.getAttribute('data-card-id');
                const cardCount = cardCountTag.textContent.trim();
                cards.push(`card${cardName}=${cardCount}`);
            }
        });

        const deckName = nowdeck_name.textContent.trim();

        document.getElementById('deck-name').value = deckName;
        document.getElementById('deck-id').value = deckId;
        document.getElementById('card-details').value = cards.join(', ');

        document.getElementById('response-output').innerHTML = '<p style="color: green;">当前卡组信息已填充。</p>';
    });

    // 添加提交按钮事件监听器
    document.getElementById('submit-button').addEventListener('click', function() {
        const deckId = document.getElementById('deck-id').value;
        const deckName = document.getElementById('deck-name').value;
        const cardDetails = document.getElementById('card-details').value;
        const responseOutput = document.getElementById('response-output');
    
        if (!deckId || !deckName || !cardDetails) {
            responseOutput.innerHTML = '<p style="color: red;">请填写所有字段。</p>';
            return;
        }
    
        // 解析卡片名称和数量
        const cardData = cardDetails.split(',').map(item => item.trim().split('='));
        const cardParams = cardData.map(([key, value]) => `card[${key}]=${value}`).join('&');
    
        // 构造请求参数
        const saveDeckUrl = 'https://www.linodas.com/json/deck/action/savedeck';
        const renameDeckUrl = 'https://www.linodas.com/json/deck/action/renamedeck';
        const headers = {
            'accept-language': navigator.language,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cookie': getAllCookies(),
            'dnt': '1',
            'origin': 'https://www.linodas.com',
            'referer': `https://www.linodas.com/character/deck/id/${deckId}`,
            'user-agent': navigator.userAgent,
            'x-requested-with': 'XMLHttpRequest'
        };
        const saveDeckBody = `sel_gearid=${deckId}&${cardParams}`;
        const renameDeckBody = `gear_rename=${encodeURIComponent(deckName)}&gear_rename_id=${deckId}`;
    
        // 发送保存卡组请求
        fetch(saveDeckUrl, {
            method: 'POST',
            headers: headers,
            body: saveDeckBody
        })
        .then(response => response.json())
        .then(data => {
            // 发送重命名卡组请求
            return fetch(renameDeckUrl, {
                method: 'POST',
                headers: headers,
                body: renameDeckBody
            });
        })
        .then(response => response.json())
        .then(data => {
            // 刷新页面
            location.reload();
        })
        .catch(error => {
            responseOutput.innerHTML = `<p style="color: red;">请求失败: ${error.message}</p>`;
        });
    
        // 保存到LocalStorage
        saveToLocalStorage(deckName, cardDetails);
    });

    // 保存卡组信息到LocalStorage
    function saveToLocalStorage(deckName, cardDetails) {
        const deckData = {
            name: deckName,
            details: cardDetails
        };
        console.log('Saving Deck Data:', deckData); // 添加日志
    
        // 保存到 allDecks
        let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
        allDecks[deckName] = deckData;
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
    
        // 保存到 deck_<deckName>
        localStorage.setItem('deck_' + deckName, JSON.stringify(deckData));
    
        updateDeckList();
    }

    // 从LocalStorage加载卡组信息
    function loadFromLocalStorage(deckName) {
        const data = localStorage.getItem('deck_' + deckName);
        if (data) {
            const deckData = JSON.parse(data);
            console.log('Loaded Deck Data:', deckData); // 添加日志
            return deckData;
        }
        console.log('No data found for deck:', deckName); // 添加日志
        return null;    
    }

    function loadAllDecks() {
        return JSON.parse(localStorage.getItem('allDecks')) || {};
    }
    
    function deleteDeckFromLocalStorage(deckName) {
        let allDecks = JSON.parse(localStorage.getItem('allDecks')) || {};
        delete allDecks[deckName];
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
        updateDeckList();
    }

    // 导出为文件按钮事件监听器
    document.getElementById('save-button').addEventListener('click', function() {
        const allDecks = loadAllDecks();

        if (Object.keys(allDecks).length === 0) {
            document.getElementById('response-output').innerHTML = '<p style="color: red;">没有卡组数据可以导出。</p>';
            return;
        }

        // 将所有卡组数据转换为 JSON 字符串
        const jsonData = JSON.stringify(allDecks);

        // 使用 TextEncoder 将 JSON 字符串编码为 UTF-8 字节数组
        const utf8Bytes = new TextEncoder().encode(jsonData);

        // 将字节数组转换为 Latin1 字符串
        let latin1String = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
            latin1String += String.fromCharCode(utf8Bytes[i]);
        }

        // 使用 btoa 将 Latin1 字符串编码为 Base64
        const base64Data = btoa(latin1String);

        // 创建 Blob 对象
        const blob = new Blob([base64Data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_decks.txt'; // 修改文件扩展名为 .txt
        a.click();
        URL.revokeObjectURL(url);

        document.getElementById('response-output').innerHTML = '<p style="color: green;">所有卡组数据已导出为文件。</p>';
    });

    // 导入文件按钮事件监听器（从本地文件读取并保存到LocalStorage）
    document.getElementById('import-button').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt'; // 修改为接受.txt文件

        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        // 解码 Base64 字符串
                        const base64Data = e.target.result;
                        const latin1String = atob(base64Data);

                        // 将 Latin1 字符串转换为 UTF-8 字节数组
                        const utf8Bytes = new Uint8Array(latin1String.length);
                        for (let i = 0; i < latin1String.length; i++) {
                            utf8Bytes[i] = latin1String.charCodeAt(i);
                        }

                        // 使用 TextDecoder 将字节数组解码为原始字符串
                        const jsonData = new TextDecoder().decode(utf8Bytes);

                        // 解析 JSON 字符串为 JavaScript 对象
                        const allDecks = JSON.parse(jsonData);

                        // 清空当前的localStorage
                        localStorage.removeItem('allDecks');
                        for (const deckName in allDecks) {
                            if (allDecks.hasOwnProperty(deckName)) {
                                localStorage.removeItem('deck_' + deckName);
                            }
                        }

                        // 保存新的卡组信息到localStorage
                        for (const deckName in allDecks) {
                            if (allDecks.hasOwnProperty(deckName)) {
                                saveToLocalStorage(deckName, allDecks[deckName].details);
                            }
                        }

                        document.getElementById('response-output').innerHTML = '<p style="color: green;">所有卡组数据已成功导入并覆盖当前数据。</p>';
                        updateDeckList(); // 更新卡组列表
                    } catch (error) {
                        document.getElementById('response-output').innerHTML = `<p style="color: red;">文件解析错误: ${error.message}</p>`;
                    }
                };
                reader.readAsText(file);
            }
        });

        input.click();
    });

    // 本地保存按钮添加事件监听器
    document.getElementById('local-save-button').addEventListener('click', function() {
        const deckName = document.getElementById('deck-name').value;
        const cardDetails = document.getElementById('card-details').value;

        if (!deckName || !cardDetails) {
            document.getElementById('response-output').innerHTML = '<p style="color: red;">请填写卡组名称和卡片信息。</p>';
            return;
        }

        // 调用现有的保存函数
        saveToLocalStorage(deckName, cardDetails);

        document.getElementById('response-output').innerHTML = '<p style="color: green;">卡片信息已保存到浏览器存储。</p>';
    });

    // 初始化时更新卡组列表
    updateDeckList();
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/');
    const deckIdIndex = pathSegments.indexOf('id');
    let deckId = deckIdIndex !== -1 && pathSegments.length > deckIdIndex + 1 ? pathSegments[deckIdIndex + 1] : null;
        
    if (!deckId) {
        deckId = document.getElementById("user_static_deck_list").querySelector("div.decklist").getAttribute('data-deck-id');
    }

    if (deckId) {
        document.getElementById('fill-button').click();
    }
})();