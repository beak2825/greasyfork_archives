// ==UserScript==
// @name         增强型批量打开网页
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  增强型批量打开网页,支持多种打开方式和自定义设置
// @author       MOASE
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502852/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/502852/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化设置
    let urls = GM_getValue('urls', []);
    let key = GM_getValue('key', 'Z');
    let maxOpen = GM_getValue('maxOpen', 10);
    let openDelay = GM_getValue('openDelay', 1000);
    let dialogSize = GM_getValue('dialogSize', { width: '600px', height: '450px' });
    let dialogPosition = GM_getValue('dialogPosition', { top: '20%', left: '50%' });

    // 添加样式
    GM_addStyle(`
        .enhanced-dialog {
            position: fixed;
            top: ${dialogPosition.top};
            left: ${dialogPosition.left};
            transform: translateX(-50%);
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
            resize: both;
            overflow: auto;
            width: ${dialogSize.width};
            height: ${dialogSize.height};
        }
        .enhanced-dialog input, .enhanced-dialog textarea, .enhanced-dialog select {
            width: 100%;
            padding: 5px;
            margin: 5px 0;
        }
        .enhanced-dialog .buttons {
            text-align: center;
            margin-top: 10px;
        }
        .enhanced-dialog button {
            margin: 5px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .enhanced-dialog button:hover {
            background: #45a049;
        }
        .enhanced-dialog .header {
            cursor: move;
            padding: 10px;
            background: #f1f1f1;
            border-bottom: 1px solid #ccc;
        }
        .enhanced-dialog .restore-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f44336;
        }
        .selection-box {
            position: fixed;
            border: 2px dashed blue;
            background-color: rgba(0, 0, 255, 0.1);
            pointer-events: none;
            z-index: 9998;
        }
        .highlight-link {
            outline: 2px dashed yellow !important;
        }
    `);

    let currentDialog = null;

    function showDialog(title, content, buttons) {
        if (currentDialog) {
            currentDialog.remove();
        }

        const dialog = document.createElement('div');
        dialog.className = 'enhanced-dialog';
        dialog.style.width = dialogSize.width;
        dialog.style.height = dialogSize.height;
        dialog.innerHTML = `
            <div class="header">${title}</div>
            ${content}
            <div class="buttons"></div>
            <button class="restore-button">恢复默认</button>
        `;
        const buttonsContainer = dialog.querySelector('.buttons');
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.onclick = () => {
                btn.onClick();
                dialog.remove();
                currentDialog = null;
            };
            buttonsContainer.appendChild(button);
        });
        document.body.appendChild(dialog);
        currentDialog = dialog;

        enableDragging(dialog);

        const restoreButton = dialog.querySelector('.restore-button');
        restoreButton.onclick = function() {
            dialog.style.width = '600px';
            dialog.style.height = '450px';
            GM_setValue('dialogSize', { width: '600px', height: '450px' });
            GM_setValue('dialogPosition', { top: '20%', left: '50%' });
        };

        const observer = new MutationObserver(() => {
            GM_setValue('dialogSize', {
                width: dialog.style.width,
                height: dialog.style.height
            });
            GM_setValue('dialogPosition', {
                top: dialog.style.top,
                left: dialog.style.left
            });
        });
        observer.observe(dialog, { attributes: true, attributeFilter: ['style'] });
    }

    function enableDragging(dialog) {
        const header = dialog.querySelector('.header');
        let isDragging = false;
        let offsetX, offsetY;

        header.onmousedown = function(e) {
            isDragging = true;
            offsetX = e.clientX - dialog.offsetLeft;
            offsetY = e.clientY - dialog.offsetTop;

            document.onmousemove = function(e) {
                if (isDragging) {
                    let left = e.clientX - offsetX;
                    let top = e.clientY - offsetY;

                    left = Math.max(0, Math.min(left, window.innerWidth - dialog.offsetWidth));
                    top = Math.max(0, Math.min(top, window.innerHeight - dialog.offsetHeight));

                    dialog.style.left = left + 'px';
                    dialog.style.top = top + 'px';
                }
            };

            document.onmouseup = function() {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
                GM_setValue('dialogSize', {
                    width: dialog.style.width,
                    height: dialog.style.height
                });
                GM_setValue('dialogPosition', {
                    top: dialog.style.top,
                    left: dialog.style.left
                });
            };
        };
    }

    function openUrls(urlsToOpen) {
        let index = 0;
        function openNext() {
            if (index < urlsToOpen.length) {
                window.open(urlsToOpen[index], '_blank');
                index++;
                setTimeout(openNext, openDelay);
            }
        }
        openNext();
    }

    GM_registerMenuCommand('批量打开链接', () => {
        showDialog('批量打开链接', `
            <textarea id="urlInput" placeholder="请输入要打开的链接（每行一个）" style="height: 150px; width: 100%;">${urls.join('\n')}</textarea>
            <label for="openMethod">打开方式:</label>
            <select id="openMethod">
                <option value="all">全部打开</option>
                <option value="random">随机打开</option>
            </select>
            <label for="openCount">打开数量 (仅随机模式):</label>
            <input type="number" id="openCount" value="${maxOpen}" min="1">
        `, [
            {
                text: '打开',
                onClick: () => {
                    const input = document.getElementById('urlInput').value;
                    const method = document.getElementById('openMethod').value;
                    const count = parseInt(document.getElementById('openCount').value, 10);
                    urls = input.split('\n').map(url => url.trim()).filter(url => url);
                    GM_setValue('urls', urls);

                    let urlsToOpen;
                    if (method === 'random') {
                        urlsToOpen = urls.sort(() => 0.5 - Math.random()).slice(0, count);
                    } else {
                        urlsToOpen = urls.slice(0, maxOpen);
                    }
                    openUrls(urlsToOpen);
                }
            },
            {
                text: '保存',
                onClick: () => {
                    const input = document.getElementById('urlInput').value;
                    urls = input.split('\n').map(url => url.trim()).filter(url => url);
                    GM_setValue('urls', urls);
                }
            },
            {
                text: '取消',
                onClick: () => {}
            }
        ]);
    });

    GM_registerMenuCommand('设置', () => {
        showDialog('设置', `
            <label for="keyInput">快捷键:</label>
            <input type="text" id="keyInput" placeholder="请输入新的按键" value="${key}">
            <label for="maxOpenInput">最大打开数量:</label>
            <input type="number" id="maxOpenInput" placeholder="请输入最大打开数量" value="${maxOpen}">
            <label for="openDelayInput">打开延迟 (毫秒):</label>
            <input type="number" id="openDelayInput" placeholder="请输入打开延迟" value="${openDelay}">
        `, [
            {
                text: '保存',
                onClick: () => {
                    const newKey = document.getElementById('keyInput').value;
                    const newMaxOpen = document.getElementById('maxOpenInput').value;
                    const newOpenDelay = document.getElementById('openDelayInput').value;
                    if (newKey) {
                        key = newKey.toUpperCase();
                        GM_setValue('key', key);
                    }
                    if (newMaxOpen) {
                        maxOpen = parseInt(newMaxOpen, 10);
                        GM_setValue('maxOpen', maxOpen);
                    }
                    if (newOpenDelay) {
                        openDelay = parseInt(newOpenDelay, 10);
                        GM_setValue('openDelay', openDelay);
                    }
                }
            },
            {
                text: '取消',
                onClick: () => {}
            }
        ]);
    });

    function startSelection(e) {
        if (e.button !== 0) return;
        const selection = new Set();
        let startX = e.clientX;
        let startY = e.clientY;

        // 创建选框元素
        const selectionBox = document.createElement('div');
        selectionBox.className = 'selection-box';
        document.body.appendChild(selectionBox);

        const mouseMoveHandler = (e) => {
            // 更新选框位置和大小
            const left = Math.min(startX, e.clientX);
            const top = Math.min(startY, e.clientY);
            const width = Math.abs(e.clientX - startX);
            const height = Math.abs(e.clientY - startY);

            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;

            // 检查并高亮链接
            document.querySelectorAll('a').forEach(link => {
                const rect = link.getBoundingClientRect();
                if (rect.left < e.clientX && rect.right > startX &&
                    rect.top < e.clientY && rect.bottom > startY) {
                    link.classList.add('highlight-link');
                    selection.add(link.href);
                } else {
                    link.classList.remove('highlight-link');
                    selection.delete(link.href);
                }
            });
        };

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            selectionBox.remove();

            // 移除所有高亮
            document.querySelectorAll('.highlight-link').forEach(link => {
                link.classList.remove('highlight-link');
            });

            if (selection.size > 0) {
                showDialog('确认打开', `是否打开选中的 ${selection.size} 个链接？`, [
                    {
                        text: '确认',
                        onClick: () => {
                            const linksToOpen = Array.from(selection).slice(0, maxOpen);
                            openUrls(linksToOpen);
                        }
                    },
                    {
                        text: '取消',
                        onClick: () => {}
                    }
                ]);
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key.toUpperCase() === key) {
            document.addEventListener('mousedown', startSelection);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key.toUpperCase() === key) {
            document.removeEventListener('mousedown', startSelection);
        }
    });
})();