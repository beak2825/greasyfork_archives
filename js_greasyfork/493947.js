// ==UserScript==
// @name         知乎问题标记已读
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在知乎问题标题旁添加标记为已读的按钮，并允许导出和导入已读数据
// @author       shaoz
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493947/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/493947/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton(element, questionId) {
        if (element.querySelector('.mark-as-read')) {
            return; // 避免重复添加按钮
        }

        const isRead = localStorage.getItem('read_' + questionId) === 'true';

        const readButton = document.createElement('button');
        readButton.className = 'mark-as-read';
        readButton.innerText = isRead ? '已读' : '标记为已读';
        readButton.style.marginLeft = '10px';
        readButton.style.color = '#000000';
        readButton.style.backgroundColor = isRead ? '#4CAF50' : '#e0e0e0';
        readButton.style.border = '1px solid #dcdcdc';
        readButton.style.padding = '1px 4px';
        readButton.style.fontSize = '12px';
        readButton.style.fontWeight = 'normal';
        readButton.style.cursor = 'pointer';

        readButton.onclick = function() {
            const currentState = localStorage.getItem('read_' + questionId) === 'true';
            localStorage.setItem('read_' + questionId, !currentState);
            this.style.backgroundColor = currentState ? '#e0e0e0' : '#4CAF50';
            this.innerText = currentState ? '标记为已读' : '已读';
        };

        // 使按钮在标题的同一行显示
        element.style.display = 'inline-flex';
        element.style.alignItems = 'center';
        element.appendChild(readButton);
    }

    function processPage() {
        // 尝试从详情页获取问题ID
        const dataElement = document.getElementById('js-initialData');
        if (dataElement) {
            try {
                const initialData = JSON.parse(dataElement.textContent);
                const questionId = initialData.initialState.entities.questions[Object.keys(initialData.initialState.entities.questions)[0]].id;
                const titleElement = document.querySelector('.QuestionHeader-title');
                if (titleElement) {
                    addButton(titleElement, questionId);
                }
            } catch (e) {
                console.error('Error parsing initial data:', e);
            }
        }

        // 主页或搜索结果页
        document.querySelectorAll('.ContentItem-title, .SearchResult-Card .ContentItem-title').forEach(title => {
            const linkElement = title.querySelector('a[href*="/question/"]');
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const match = href.match(/question\/(\d+)/);
                if (match) {
                    addButton(title, match[1]);
                }
            }
        });
    }

    function exportReadData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('read_')) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'read_data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importReadData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const importedData = JSON.parse(reader.result);
                    for (const [key, value] of Object.entries(importedData)) {
                        if (key.startsWith('read_') && localStorage.getItem(key) === null) {
                            localStorage.setItem(key, value);
                        }
                    }
                    alert('数据导入成功！');
                } catch (e) {
                    alert('导入失败，文件格式不正确！');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function addExportImportButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.gap = '10px';

        const exportButton = document.createElement('button');
        exportButton.innerText = '导出已读数据';
        exportButton.style.padding = '5px 10px';
        exportButton.style.cursor = 'pointer';
        exportButton.onclick = exportReadData;

        const importButton = document.createElement('button');
        importButton.innerText = '导入已读数据';
        importButton.style.padding = '5px 10px';
        importButton.style.cursor = 'pointer';
        importButton.onclick = importReadData;

        container.appendChild(exportButton);
        container.appendChild(importButton);
        document.body.appendChild(container);
    }

    const observer = new MutationObserver(mutations => {
        processPage();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processPage();
    addExportImportButtons();
})();
