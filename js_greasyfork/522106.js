// ==UserScript==
// @name         拖拽搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过拖拽文本实现快速搜索
// @author       PaulW47
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522106/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/522106/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认搜索引擎配置
    const defaultEngines = {
        up: {
            name: '百度',
            url: 'https://www.baidu.com/s?wd='
        },
        right: {
            name: '谷歌',
            url: 'https://www.google.com/search?q='
        },
        down: {
            name: '必应',
            url: 'https://www.bing.com/search?q='
        },
        left: {
            name: '必应',
            url: 'https://www.bing.com/search?q='
        }
    };

    // 添加预定义的搜索引擎列表
    const defaultEnginesList = {
        'baidu': {
            name: '百度',
            url: 'https://www.baidu.com/s?wd='
        },
        'google': {
            name: '谷歌',
            url: 'https://www.google.com/search?q='
        },
        'bing': {
            name: '必应',
            url: 'https://www.bing.com/search?q='
        }
    };

    // 获取保存的搜索引擎配置和列表
    let searchEngines = GM_getValue('searchEngines', defaultEngines);
    let enginesList = GM_getValue('enginesList', defaultEnginesList);

    let dragIndicator = null;

    function createDragIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10000;
            display: none;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

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
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            max-width: 600px;
            width: 90%;
        `;

        // 创建搜索引擎管理部分的HTML
        const enginesListHTML = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
                <h3>添加新的搜索引擎</h3>
                <div style="margin: 10px 0;">
                    <input type="text" id="new-engine-name" placeholder="搜索引擎名称" style="margin-right: 5px;">
                    <input type="text" id="new-engine-url" placeholder="搜索URL" style="width: 250px; margin-right: 5px;">
                    <button id="add-engine">添加</button>
                </div>
            </div>
        `;

        // 创建方向设置部分的HTML
        const directionsHTML = Object.entries(searchEngines).map(([direction, engine]) => `
            <div style="margin: 10px 0;">
                <label>${direction === 'up' ? '向上' : direction === 'right' ? '向右' :
                       direction === 'down' ? '向下' : '向左'}方向：</label>
                <select id="select-${direction}" style="margin: 0 5px; width: 150px;">
                    ${Object.entries(enginesList).map(([key, e]) => `
                        <option value="${key}" ${e.name === engine.name ? 'selected' : ''}>
                            ${e.name}
                        </option>
                    `).join('')}
                </select>
            </div>
        `).join('');

        panel.innerHTML = `
            <h2 style="margin-top: 0;">搜索引擎设置</h2>
            ${enginesListHTML}
            <h3>方向设置</h3>
            ${directionsHTML}
            <div style="margin-top: 15px;">
                <button id="save-settings">保存</button>
                <button id="close-settings">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加新搜索引擎的处理
        document.getElementById('add-engine').onclick = () => {
            const name = document.getElementById('new-engine-name').value.trim();
            const url = document.getElementById('new-engine-url').value.trim();

            if (name && url) {
                const key = name.toLowerCase().replace(/\s+/g, '_');
                enginesList[key] = { name, url };
                GM_setValue('enginesList', enginesList);
                // 刷新设置面板
                panel.remove();
                createSettingsPanel();
            }
        };

        // 保存设置
        document.getElementById('save-settings').onclick = () => {
            Object.keys(searchEngines).forEach(direction => {
                const selectedKey = document.getElementById(`select-${direction}`).value;
                searchEngines[direction] = enginesList[selectedKey];
            });
            GM_setValue('searchEngines', searchEngines);
            panel.remove();
        };

        document.getElementById('close-settings').onclick = () => panel.remove();
    }

    // 注册设置菜单
    GM_registerMenuCommand('设置搜索引擎', createSettingsPanel);

    // 处理拖拽
    let startX, startY;
    let selectedText = '';

    document.addEventListener('dragstart', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        selectedText = window.getSelection().toString().trim();

        // 创建提示元素
        if (!dragIndicator) {
            dragIndicator = createDragIndicator();
        }
    });

    document.addEventListener('drag', (e) => {
        if (!selectedText || !e.clientX || !e.clientY) return; // 某些浏览器可能返回0

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        let direction;
        if (absX > absY) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'down' : 'up';
        }

        const engine = searchEngines[direction];
        if (engine) {
            dragIndicator.textContent = `${engine.name}搜索`;
            dragIndicator.style.display = 'block';
        }
    });

    document.addEventListener('dragend', (e) => {
        // 隐藏提示元素
        if (dragIndicator) {
            dragIndicator.style.display = 'none';
        }

        if (!selectedText) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        let direction;
        if (absX > absY) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'down' : 'up';
        }

        const engine = searchEngines[direction];
        if (engine) {
            const searchUrl = engine.url + encodeURIComponent(selectedText);
            window.open(searchUrl, '_blank');
        }
    });
})();