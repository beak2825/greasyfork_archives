// ==UserScript==
// @name         豆瓣用户标记器（增强版）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  给豆瓣用户添加自定义标签，支持多次添加标记、颜色选择、删除标记、标签整理、数据导入导出
// @author       cui
// @match        https://www.douban.com/people/*
// @match        https://www.douban.com/group/topic/*
// @match        https://www.douban.com/group/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510672/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E6%A0%87%E8%AE%B0%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510672/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E6%A0%87%E8%AE%B0%E5%99%A8%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('豆瓣标记器脚本已加载');

    GM_addStyle(`
        .user-tag {
            font-weight: bold;
            margin-left: 5px;
        }
        .tag-button, .delete-button, .organize-button, .export-button, .import-button, .toggle-button {
            margin: 5px;
            cursor: pointer;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            background-color: #f0f0f0;
        }
        #tagOrganizer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid black;
            border-radius: 5px;
            z-index: 9999;
            display: none;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .tag-list, .user-list {
            margin-top: 10px;
        }
        .tag-item {
            cursor: pointer;
            margin-right: 10px;
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
        }
        #colorPickerModal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid black;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        #controlPanel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9998;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        #controlPanel.minimized {
            width: 0px;
            height: 0px;
            overflow: hidden;
        }
        #controlPanel .toggle-button {
            position: absolute;
            top: -10px;
            right: -10px;
        }
    `);

    function getUserId(url) {
        const match = url.match(/people\/(.+?)\//);
        return match ? match[1] : null;
    }

    function setTag(userId, tag, color) {
        const tags = GM_getValue('userTags', {});
        if (tags[userId]) {
            tags[userId].text += `, ${tag}`;
        } else {
            tags[userId] = { text: tag, color: color };
        }
        GM_setValue('userTags', tags);
    }

    function getTag(userId) {
        const tags = GM_getValue('userTags', {});
        return tags[userId] || null;
    }

    function displayTag(element, userId) {
        const tag = getTag(userId);
        if (tag && element) {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'user-tag';
            tagSpan.textContent = `#${tag.text.split(', ').join(' #')}`;
            tagSpan.style.color = tag.color;
            element.appendChild(tagSpan);
        }
    }

    function createColorPicker() {
        const picker = document.createElement('input');
        picker.type = 'color';
        picker.style.display = 'block';
        picker.style.margin = '10px auto';
        return picker;
    }

    function showColorPicker(callback) {
        const modal = document.createElement('div');
        modal.id = 'colorPickerModal';

        const picker = createColorPicker();
        modal.appendChild(picker);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.onclick = () => {
            callback(picker.value);
            document.body.removeChild(modal);
        };
        modal.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.onclick = () => {
            document.body.removeChild(modal);
        };
        modal.appendChild(cancelButton);

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    function addTagButton(element, userId) {
        if (!element || !userId) return;

        const button = document.createElement('button');
        button.className = 'tag-button';
        button.textContent = '添加标记';
        button.onclick = () => {
            const tag = prompt('请输入标签：', '');
            if (tag !== null && tag !== '') {
                showColorPicker((color) => {
                    setTag(userId, tag, color);
                    location.reload();
                });
            }
        };
        element.appendChild(button);

        const existingTag = getTag(userId);
        if (existingTag) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '删除标记';
            deleteButton.onclick = () => {
                if (confirm('确定要删除所有标记吗？')) {
                    removeTag(userId);
                    location.reload();
                }
            };
            element.appendChild(deleteButton);
        }
    }

    function removeTag(userId) {
        const tags = GM_getValue('userTags', {});
        delete tags[userId];
        GM_setValue('userTags', tags);
    }

    function createTagOrganizer() {
        const organizer = document.createElement('div');
        organizer.id = 'tagOrganizer';

        const title = document.createElement('h2');
        title.textContent = '标签整理';
        organizer.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.onclick = () => organizer.style.display = 'none';
        organizer.appendChild(closeButton);

        const tagList = document.createElement('div');
        tagList.className = 'tag-list';
        organizer.appendChild(tagList);

        const userList = document.createElement('div');
        userList.className = 'user-list';
        organizer.appendChild(userList);

        document.body.appendChild(organizer);
        return organizer;
    }

    function updateTagOrganizer() {
        const organizer = document.getElementById('tagOrganizer') || createTagOrganizer();
        const tagList = organizer.querySelector('.tag-list');
        const userList = organizer.querySelector('.user-list');

        tagList.innerHTML = '';
        userList.innerHTML = '';

        const tags = GM_getValue('userTags', {});
        const tagGroups = {};

        for (const [userId, tagInfo] of Object.entries(tags)) {
            tagInfo.text.split(', ').forEach(tag => {
                if (!tagGroups[tag]) {
                    tagGroups[tag] = [];
                }
                tagGroups[tag].push({ userId, color: tagInfo.color });
            });
        }

        for (const [tag, users] of Object.entries(tagGroups)) {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-item';
            tagSpan.textContent = tag;
            tagSpan.style.color = users[0].color;
            tagSpan.onclick = () => {
                userList.innerHTML = '';
                users.forEach(user => {
                    const userLink = document.createElement('a');
                    userLink.href = `https://www.douban.com/people/${user.userId}/`;
                    userLink.textContent = user.userId;
                    userLink.style.color = user.color;
                    userLink.target = '_blank';
                    userList.appendChild(userLink);
                    userList.appendChild(document.createElement('br'));
                });
            };
            tagList.appendChild(tagSpan);
        }
    }

    function addControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'controlPanel';

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '-';
        toggleButton.onclick = () => {
            panel.classList.toggle('minimized');
            toggleButton.textContent = panel.classList.contains('minimized') ? '+' : '-';
        };

        const organizeButton = document.createElement('button');
        organizeButton.className = 'organize-button';
        organizeButton.textContent = '标签整理';
        organizeButton.onclick = () => {
            updateTagOrganizer();
            const organizer = document.getElementById('tagOrganizer');
            organizer.style.display = organizer.style.display === 'none' ? 'block' : 'none';
        };

        const exportButton = document.createElement('button');
        exportButton.className = 'export-button';
        exportButton.textContent = '导出标签';
        exportButton.onclick = exportTags;

        const importButton = document.createElement('button');
        importButton.className = 'import-button';
        importButton.textContent = '导入标签';
        importButton.onclick = importTags;

        panel.appendChild(toggleButton);
        panel.appendChild(organizeButton);
        panel.appendChild(exportButton);
        panel.appendChild(importButton);

        document.body.appendChild(panel);
    }

    function exportTags() {
        const tags = GM_getValue('userTags', {});
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tags));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "douban_tags.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function importTags() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                try {
                    const tags = JSON.parse(content);
                    GM_setValue('userTags', tags);
                    alert('标签导入成功！');
                    location.reload();
                } catch (error) {
                    alert('导入失败，请确保文件格式正确。');
                }
            }
        }
        input.click();
    }

    function handleAllPages() {
        console.log('处理所有页面');
        const userLinks = document.querySelectorAll('a[href*="/people/"]');
        const excludeKeywords = ['的主页', '广播', '相册', '日记', '豆列', '片单', '书单'];

        userLinks.forEach(link => {
            const userId = getUserId(link.href);
            if (userId && !excludeKeywords.some(keyword => link.textContent.includes(keyword))) {
                displayTag(link, userId);
            }
        });
    }

    function handleUserPage() {
        console.log('处理用户页面');
        const userId = getUserId(window.location.href);
        if (userId) {
            const nameElement = document.querySelector('#content h1') || document.querySelector('.info h1');
            if (nameElement) {
                displayTag(nameElement, userId);
                addTagButton(nameElement, userId);
            } else {
                console.log('未找到用户名元素');
            }
        } else {
            console.log('未找到用户ID');
        }
    }

    function main() {
        console.log('主函数开始执行');
        console.log('当前URL:', window.location.href);
        try {
            if (window.location.href.includes('/people/')) {
                handleUserPage();
            } else {
                handleAllPages();
            }
            addControlPanel();
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    console.log('豆瓣标记器脚本结束运行');
})();