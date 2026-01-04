// ==UserScript==
// @name         l2d plus
// @namespace    https://l2d.su
// @version      2025-06-03
// @description  添加搜索和随机
// @author       l2d
// @match        *://l2d.su/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538166/l2d%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/538166/l2d%20plus.meta.js
// ==/UserScript==

(function() {
    const jsonUrl = "https://l2d.su/json/live2dMaster.json?250529a";
    const cmap = new Map();
    // 获取角色和皮肤
    GM_xmlhttpRequest({
        method: 'GET',
        url: jsonUrl,
        onload: function(response) {
            if (response.status === 200) {
                try {
                    const jsonData = JSON.parse(response.responseText);
                    // 在这里处理 JSON 数据
                    parseJsonToMap(jsonData);

                } catch (error) {
                    GM_log('解析 JSON 失败:', error);
                }
            } else {
                GM_log('请求失败，状态码:', response.status);
            }
        },
        onerror: function(response) {
            GM_log('请求出错:', response);
        }
    });
    // 处理为map
    function parseJsonToMap(jsonData) {
        if (jsonData && jsonData.Master && Array.isArray(jsonData.Master)) {
            let game = jsonData.Master[0]
            if (game.character && Array.isArray(game.character)) {
                game.character.forEach(character => {
                    if (character.live2d && Array.isArray(character.live2d)) {
                        character.live2d.forEach(live2d => {
                            const key = `${character.charName}[${live2d.costumeName}]`;
                            const value = [character.charId, live2d.costumeId];
                            cmap.set(key, value);
                        });
                    }
                });
            }
        }
        console.log(cmap)
    }

    // 创建搜索框和下拉列表
    const searchContainer = document.createElement('div');
    searchContainer.style.position = 'relative'; // 相对定位，方便下拉列表定位

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索...';
    searchInput.style.width = '240px'; // 宽度占满容器
    searchInput.style.padding = '8px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '4px';
    searchContainer.appendChild(searchInput);

    const suggestionsList = document.createElement('ul');
    suggestionsList.style.position = 'absolute';
    suggestionsList.style.top = '100%'; // 位于搜索框下方
    suggestionsList.style.left = '0';
    suggestionsList.style.width = '100%';
    suggestionsList.style.listStyleType = 'none';
    suggestionsList.style.padding = '0';
    suggestionsList.style.margin = '0';
    suggestionsList.style.border = '1px solid #ccc';
    suggestionsList.style.borderRadius = '4px';
    suggestionsList.style.backgroundColor = 'white';
    suggestionsList.style.zIndex = '1000'; // 确保在其他元素之上
    suggestionsList.style.display = 'none'; // 初始状态隐藏
    searchContainer.appendChild(suggestionsList);

    // 添加样式 (使用 GM_addStyle 避免样式冲突)
    GM_addStyle(`
        .suggestion-item {
            padding: 8px;
            cursor: pointer;
        }
        .suggestion-item:hover {
            background-color: #f0f0f0;
        }
        .suggestion-item.selected {
            background-color: #ddd;
        }
        .randomBtn{
            width: 60px;
            height: 30px;
        }
    `);

    // 搜索框输入事件
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        suggestionsList.innerHTML = ''; // 清空之前的建议

        if (searchTerm.length > 0) {
            let suggestions = [];
            cmap.forEach((value, key) => {
                if (key.toLowerCase().includes(searchTerm)) {
                    suggestions.push(key);
                }
            });

            // 创建建议列表项
            suggestions.forEach(suggestion => {
                const listItem = document.createElement('li');
                listItem.textContent = suggestion;
                listItem.classList.add('suggestion-item');
                suggestionsList.appendChild(listItem);

                // 鼠标点击选择
                listItem.addEventListener('click', function() {
                    searchInput.value = suggestion;
                    suggestionsList.style.display = 'none';
                    // 在这里处理选择的 suggestion，例如获取 cmap 中的值
                    const selectedValue = cmap.get(suggestion);
                    //console.log('Selected:', suggestion, 'Value:', selectedValue);
                    load(selectedValue);
                });
            });

            suggestionsList.style.display = suggestions.length > 0 ? 'block' : 'none';
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // 上下方向键选择
    let selectedIndex = -1;
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault(); // 阻止滚动页面
            selectedIndex = Math.min(selectedIndex + 1, suggestionsList.children.length - 1);
            updateSelection();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // 阻止滚动页面
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection();
        } else if (event.key === 'Enter' && selectedIndex >= 0 && selectedIndex < suggestionsList.children.length) {
            event.preventDefault(); // 阻止默认行为
            const selectedItem = suggestionsList.children[selectedIndex];
            searchInput.value = selectedItem.textContent;
            suggestionsList.style.display = 'none';
            const selectedValue = cmap.get(selectedItem.textContent);
            //console.log('Selected (Enter):', selectedItem.textContent, 'Value:', selectedValue);
            load(selectedValue);
            selectedIndex = -1; // 重置选择
        }

        function updateSelection() {
            // 移除所有选中状态
            Array.from(suggestionsList.children).forEach(item => item.classList.remove('selected'));
            // 添加选中状态
            if (selectedIndex >= 0 && selectedIndex < suggestionsList.children.length) {
                suggestionsList.children[selectedIndex].classList.add('selected');
            }
        }
    });

    // 点击搜索框外部隐藏建议列表
    document.addEventListener('click', function(event) {
        if (!searchContainer.contains(event.target)) {
            suggestionsList.style.display = 'none';
            selectedIndex = -1; // 重置选择
            Array.from(suggestionsList.children).forEach(item => item.classList.remove('selected')); // 移除所有选中状态
        }
    });

    // 插入到页面
    function insertSearchBox() {
        const targetDiv = document.querySelector('.add-model-block');
        console.log(targetDiv)
        if (targetDiv) {
            targetDiv.insertBefore(searchContainer, targetDiv.firstChild);
            // 添加随机按钮
            const buttonElement = document.createElement('button');
            buttonElement.textContent = '随机';
            buttonElement.classList.add('randomBtn');
            buttonElement.addEventListener('click', randomLoad);
            targetDiv.appendChild(buttonElement);
        } else {
            console.log('找不到 .add-model-block 元素');
        }
    }
    // select game
    setTimeout(function(){insertSearchBox();change("gameSelect","1");}, 1200);
    // 加载
    function load(ids){
        change("characterSelect",ids[0]);
        setTimeout(function(){change("costumeSelect",ids[1]);}, 100);
        setTimeout(function(){cli("addL2DModelBtn");}, 100);
    }
    // 随机
    unsafeWindow.randomLoad = function randomLoad(){
        const keys = Array.from(cmap.keys());
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const value = cmap.get(randomKey);
        load(value);
    }
    // base function
    function $(id){
        return document.querySelector("#"+id)
    }
    function change(id, val){
        $(id).value = val;
        $(id).dispatchEvent(new Event("change"));
    }
    function cli(id){
        $(id).click();
    }
})();