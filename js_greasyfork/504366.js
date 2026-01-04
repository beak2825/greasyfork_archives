// ==UserScript==
// @name         maxspeed 增强工具箱
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Reorder items based on the name in fake-avatar class when a button is clicked
// @author       xin.xu
// @match        https://maxspeed.spotmaxtech.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504366/maxspeed%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/504366/maxspeed%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建工具列表容器
    const toolContainer = document.createElement('div');
    toolContainer.style.position = 'fixed';
    toolContainer.style.top = '10px';
    toolContainer.style.right = '10px';
    toolContainer.style.zIndex = 1000;
    toolContainer.style.width = '200px';
    toolContainer.style.padding = '10px';
    toolContainer.style.backgroundColor = '#007bff';
    toolContainer.style.color = '#fff';
    toolContainer.style.border = 'none';
    toolContainer.style.borderRadius = '5px';
    toolContainer.style.cursor = 'pointer';

    // 创建工具列表标题
    const toolTitle = document.createElement('div');
    toolTitle.innerText = 'maxspeed 优化工具箱';
    toolTitle.style.fontWeight = 'bold';
    toolTitle.style.marginBottom = '10px';
    toolTitle.style.textAlign = 'center';
    toolTitle.style.cursor = 'pointer';
    toolContainer.appendChild(toolTitle);

    // 创建工具列表项容器
    const toolItemsContainer = document.createElement('div');

    // 创建工具列表项
    const tools = [
        { name: '点我排序', action: sortItems },
        { name: '待开发功能', action: () => alert('优化maxspeed使用体验 😄') },
    ];

    tools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.innerText = tool.name;
        toolItem.style.marginBottom = '5px';
        toolItem.style.padding = '5px';
        toolItem.style.backgroundColor = '#0056b3';
        toolItem.style.borderRadius = '3px';
        toolItem.style.cursor = 'pointer';
        toolItem.style.textAlign = 'center';
        toolItem.addEventListener('click', tool.action);
        toolItemsContainer.appendChild(toolItem);
    });

    toolContainer.appendChild(toolItemsContainer);

    // 将工具列表容器添加到页面中
    document.body.appendChild(toolContainer);

    // 折叠和展开功能
    let isCollapsed = false;

    toolTitle.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        toolItemsContainer.style.display = isCollapsed ? 'none' : 'block';
    });

    // 工具列表项点击事件 - 排序
    function sortItems() {
        // 检查当前 URL 是否包含 'iteration' 字段
        if (!window.location.href.includes('iteration')) {
            alert('只有在迭代模块使用');
            return;
        }
        // 选择所有 class 为 story-list 的 div
        const storyLists = document.querySelectorAll('.story-list');

        storyLists.forEach(storyList => {
            // 获取所有 class 为 item 的 div
            let items = Array.from(storyList.querySelectorAll('.item'));

            // 对 items 进行排序，依据是 class 为 fake-avatar 的 div 中的名字
            items.sort((a, b) => {
                let nameA = a.querySelector('.fake-avatar').innerText.trim();
                let nameB = b.querySelector('.fake-avatar').innerText.trim();
                return nameA.localeCompare(nameB);
            });

            // 清空 story-list 并重新添加排序后的 items
            items.forEach(item => {
                storyList.appendChild(item);
            });
        });
    }

    // 使工具列表容器可拖动
    toolContainer.onmousedown = function(event) {
        event.preventDefault();

        let shiftX = event.clientX - toolContainer.getBoundingClientRect().left;
        let shiftY = event.clientY - toolContainer.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            toolContainer.style.left = pageX - shiftX + 'px';
            toolContainer.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        toolContainer.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            toolContainer.onmouseup = null;
        };
    };

    toolContainer.ondragstart = function() {
        return false;
    };

})();
