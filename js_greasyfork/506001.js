// ==UserScript==
// @name     HKU Moodle Bookmark
// @version  3
// @description  Add bookmarks to HKU Moodle
// @grant    none
// @match    https://*.moodle.hku.hk/*
// @license MIT
// @namespace https://greasyfork.org/users/1360707
// @downloadURL https://update.greasyfork.org/scripts/506001/HKU%20Moodle%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/506001/HKU%20Moodle%20Bookmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从localStorage获取链接，如果没有则初始化为空数组
    const storedLinks = JSON.parse(localStorage.getItem('userLinks')) || [];
    let editMode = false;

    // 创建悬浮窗元素
    const floatDiv = document.createElement('div');
    setupFloatDivStyle(floatDiv);

    // 创建并添加列表到悬浮窗
    const list = document.createElement('ul');
    setupListStyle(list);
    floatDiv.appendChild(list);

    // 操作界面元素
    const controlPanel = document.createElement('div');
    setupControlPanelStyle(controlPanel);

    const toggleEditButton = createElement('button', { textContent: 'Edit Links', className: 'toggle-button' });
    toggleEditButton.onclick = toggleEditMode;

    controlPanel.appendChild(toggleEditButton);
    floatDiv.appendChild(controlPanel);

    // 初始化页面加载的链接
    updateList(storedLinks);

    // 添加拖动功能
    addDraggableFeature(floatDiv);

    document.body.appendChild(floatDiv);

    function setupFloatDivStyle(div) {
        Object.assign(div.style, {
            position: 'fixed', top: '50%', right: '10px', width: '150px',
            background: 'white', border: '1px solid black', padding: '10px',
            zIndex: '99999', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: 'move'
        });
    }

    function setupListStyle(ul) {
        Object.assign(ul.style, {
            listStyle: 'none', padding: '0', margin: '0'
        });
    }

    function setupControlPanelStyle(panel) {
        Object.assign(panel.style, {
            textAlign: 'center', marginTop: '10px'
        });
    }

    function createElement(tag, props = {}) {
        const element = document.createElement(tag);
        Object.assign(element, props);
        element.style.margin = '5px';
        element.style.padding = '5px 10px';
        element.style.border = '1px solid #007BFF';
        element.style.width = '90%';  // 输入框宽度调整为占悬浮窗宽度的90%
        element.style.background = 'transparent';
        element.style.color = '#007BFF';
        element.style.borderRadius = '5px';
        element.style.cursor = 'pointer';
        element.style.transition = 'background-color 0.3s, color 0.3s';

        element.onmouseover = () => {
            element.style.background = '#007BFF';
            element.style.color = 'white';
        };

        element.onmouseout = () => {
            element.style.background = 'transparent';
            element.style.color = '#007BFF';
        };

        return element;
    }

    function toggleEditMode() {
        editMode = !editMode;
        toggleEditButton.textContent = editMode ? 'Close Editor' : 'Edit Links';
        controlPanel.querySelectorAll('.editor').forEach(el => el.remove());
        if (editMode) {
            const inputName = createElement('input', { placeholder: 'Name', type: 'text', className: 'editor' });
            const inputUrl = createElement('input', { placeholder: 'URL', type: 'text', value: window.location.href, className: 'editor' });
            const addButton = createElement('button', { textContent: 'Add', className: 'editor' });
            addButton.onclick = () => {
                addLink(inputName.value, inputUrl.value);
                inputName.value = '';
                inputUrl.value = window.location.href; // Reset URL to current location
            };
            controlPanel.append(inputName, inputUrl, addButton);
        }
        updateList(storedLinks);  // Refresh the list to update the edit mode view
    }

    function addLink(name, url) {
        if (name && url) {
            storedLinks.push({ name, url });
            localStorage.setItem('userLinks', JSON.stringify(storedLinks));
            updateList(storedLinks);
        }
    }

    function updateList(links) {
        list.innerHTML = '';
        links.forEach((link, index) => {
            const listItem = document.createElement('li');
            listItem.style.margin = '5px 0';

            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.textContent = link.name;
            anchor.target = "_blank";

            listItem.appendChild(anchor);

            if (editMode) {
                const deleteButton = createElement('button', { textContent: 'Delete', className: 'editor' });
                deleteButton.onclick = () => deleteLink(index);
                listItem.appendChild(deleteButton);
            }

            list.appendChild(listItem);
        });
    }

    function deleteLink(indexToDelete) {
        storedLinks.splice(indexToDelete, 1);
        localStorage.setItem('userLinks', JSON.stringify(storedLinks));
        updateList(storedLinks);
    }

    function addDraggableFeature(element) {
        let isDragging = false;
        let startX, startY;

        element.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
        });

        element.addEventListener('touchstart', function (e) {
            isDragging = true;
            startX = e.touches[0].clientX - element.offsetLeft;
            startY = e.touches[0].clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                element.style.left = (e.clientX - startX) + 'px';
                element.style.top = (e.clientY - startY) + 'px';
            }
        });

        document.addEventListener('touchmove', function (e) {
            if (isDragging) {
                element.style.left = (e.touches[0].clientX - startX) + 'px';
                element.style.top = (e.touches[0].clientY - startY) + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        document.addEventListener('touchend', function () {
            isDragging = false;
        });
    }
})();