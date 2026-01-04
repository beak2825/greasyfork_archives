// ==UserScript==
// @name         拖拽搜图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  拖拽图片进行以图搜图，可自定义四个方向的搜索引擎
// @author       PaulW47
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522102/%E6%8B%96%E6%8B%BD%E6%90%9C%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/522102/%E6%8B%96%E6%8B%BD%E6%90%9C%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let initialMouseX = 0;
    let initialMouseY = 0;

    // 搜索引擎URL模板
    const searchEngines = {
        google: "https://lens.google.com/uploadbyurl?url=",
        baidu: "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image=",
        yandex: "https://yandex.com/images/search?rpt=imageview&url="
    };

    // 默认方向设置
    const defaultDirections = {
        topLeft: 'baidu',
        topRight: 'google',
        bottomLeft: 'yandex',
        bottomRight: 'google'
    };

    // 获取保存的设置或使用默认值
    let directions = GM_getValue('searchDirections', defaultDirections);

    // 在搜索引擎定义后添加显示名称映射
    const engineDisplayNames = {
        google: 'Google搜索',
        baidu: '百度搜索',
        yandex: 'Yandex搜索'
    };

    // 创建提示元素
    const dragTip = document.createElement('div');
    dragTip.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10000;
        display: none;
    `;
    document.body.appendChild(dragTip);

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            z-index: 10001;
            display: none;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h3');
        title.textContent = '搜索引擎设置';
        title.style.margin = '0 0 15px 0';

        const directionConfigs = [
            { key: 'topLeft', name: '左上' },
            { key: 'topRight', name: '右上' },
            { key: 'bottomLeft', name: '左下' },
            { key: 'bottomRight', name: '右下' }
        ];

        const container = document.createElement('div');
        container.style.cssText = `
            display: grid;
            grid-template-columns: auto auto;
            gap: 10px;
            margin-bottom: 15px;
        `;

        directionConfigs.forEach(dir => {
            const label = document.createElement('label');
            label.textContent = `${dir.name}：`;
            label.style.marginRight = '10px';

            const select = document.createElement('select');
            select.id = `setting-${dir.key}`;
            select.style.cssText = `
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #ddd;
                width: 100px;
            `;

            [
                { value: 'google', text: '谷歌' },
                { value: 'baidu', text: '百度' },
                { value: 'yandex', text: 'Yandex' }
            ].forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                select.appendChild(opt);
            });

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.appendChild(label);
            wrapper.appendChild(select);
            container.appendChild(wrapper);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.cssText = `
            margin-right: 10px;
            padding: 5px 15px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 5px 15px;
            border: none;
            border-radius: 4px;
            background: #f44336;
            color: white;
            cursor: pointer;
        `;

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

        panel.appendChild(title);
        panel.appendChild(container);
        panel.appendChild(buttonContainer);

        // 保存按钮事件
        saveButton.addEventListener('click', () => {
            const newSettings = {};
            directionConfigs.forEach(dir => {
                newSettings[dir.key] = document.getElementById(`setting-${dir.key}`).value;
            });
            GM_setValue('searchDirections', newSettings);
            directions = newSettings;
            panel.style.display = 'none';
        });

        // 取消按钮事件
        cancelButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        return panel;
    }

    const settingsPanel = createSettingsPanel();
    document.body.appendChild(settingsPanel);

    // 修改菜单命令
    GM_registerMenuCommand('设置搜索引擎', () => {
        // 显示设置面板并设置当前值
        const currentSettings = GM_getValue('searchDirections', defaultDirections);
        Object.keys(currentSettings).forEach(key => {
            const select = document.getElementById(`setting-${key}`);
            if (select) {
                select.value = currentSettings[key];
            }
        });
        settingsPanel.style.display = 'block';
    });

    // 监听拖动开始
    document.addEventListener('dragstart', function(e) {
        const imgElement = e.target;
        if (imgElement.tagName === 'IMG') {
            isDragging = true;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;

            // 显示初始方向的提示
            const searchEngine = directions.topRight; // 默认显示向右上方向的搜索引擎
            dragTip.textContent = engineDisplayNames[searchEngine];
            dragTip.style.display = 'block';
        }
    });

    // 监听拖动结束
    document.addEventListener('dragend', function(e) {
        if (!isDragging) return;

        const imgElement = e.target;
        if (imgElement.tagName === 'IMG') {
            const currentMouseX = e.clientX;
            const currentMouseY = e.clientY;
            const deltaX = currentMouseX - initialMouseX;
            const deltaY = currentMouseY - initialMouseY;

            // 获取图片URL
            let imageUrl = imgElement.src;

            // 确保图片URL是完整的
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            } else if (imageUrl.startsWith('/')) {
                imageUrl = window.location.origin + imageUrl;
            }

            // 编码图片URL
            const encodedUrl = encodeURIComponent(imageUrl);
            let searchEngine;

            // 判断拖动方向
            if (deltaX < 0) {
                // 向左
                searchEngine = deltaY < 0 ? directions.topLeft : directions.bottomLeft;
            } else {
                // 向右
                searchEngine = deltaY < 0 ? directions.topRight : directions.bottomRight;
            }

            // 打开搜索页面
            if (searchEngine) {
                window.open(searchEngines[searchEngine] + encodedUrl, '_blank');
            }
        }

        isDragging = false;
        dragTip.style.display = 'none';
    });

    // 修改拖动事件监听
    document.addEventListener('drag', function(e) {
        if (!isDragging) return;

        const imgElement = e.target;
        if (imgElement.tagName === 'IMG') {
            const currentMouseX = e.clientX;
            const currentMouseY = e.clientY;
            const deltaX = currentMouseX - initialMouseX;
            const deltaY = currentMouseY - initialMouseY;

            let searchEngine;
            // 判断拖动方向
            if (deltaX < 0) {
                // 向左
                searchEngine = deltaY < 0 ? directions.topLeft : directions.bottomLeft;
            } else {
                // 向右
                searchEngine = deltaY < 0 ? directions.topRight : directions.bottomRight;
            }

            // 更新提示文本
            if (searchEngine) {
                dragTip.textContent = engineDisplayNames[searchEngine];
                dragTip.style.display = 'block';
            }
        }
    });

})();