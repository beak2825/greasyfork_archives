// ==UserScript==
// @name         Copy and Paste Storage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  复制和粘贴 localStorage 和 sessionStorage 数据
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499469/Copy%20and%20Paste%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/499469/Copy%20and%20Paste%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dragging = false; // 标志变量，用于控制是否正在拖动

    // 创建按钮并添加到页面
    function createButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.width = 'auto';
        button.style.cursor = 'pointer'
        button.addEventListener('click', onClick);
        document.body.appendChild(button);

        // 创建拖动区域
        const dragArea = document.createElement('div');
        dragArea.style.position = 'absolute';
        dragArea.style.bottom = '0';
        dragArea.style.right = '0';
        dragArea.style.width = '20px';
        dragArea.style.height = '100%';
        dragArea.style.cursor = 'move';
        button.appendChild(dragArea);

        // 拖动功能实现
        dragArea.addEventListener('mousedown', function(e) {
            e.preventDefault(); // 阻止默认行为
            dragging = true; // 开始拖动
            let prevX = e.clientX;
            let prevY = e.clientY;

            document.onmousemove = function(e) {
                e.preventDefault();
                const pos1 = prevX - e.clientX;
                const pos2 = prevY - e.clientY;
                prevX = e.clientX;
                prevY = e.clientY;
                button.style.top = (button.offsetTop - pos2) + "px";
                button.style.left = (button.offsetLeft - pos1) + "px";
                button.style.bottom = 'unset';
                button.style.right = 'unset';
            };

            document.onmouseup = function() {
                dragging = false; // 停止拖动
                document.onmouseup = null;
                document.onmousemove = null;
            };
        });
        dragArea.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 复制或粘贴 localStorage 和 sessionStorage 数据
    function copyOrPasteStorage() {
        const action = prompt('请输入要执行的操作：\n1. 复制Storage\n2. 粘贴Storage');
        console.log(action);
        if (action === '1') {
            // 复制操作
            const storageData = {
                localStorage: {...localStorage},
                sessionStorage: {...sessionStorage}
            };
            const jsonData = JSON.stringify(storageData);
            GM_setClipboard(jsonData, 'text');
            alert('Storage data copied to clipboard!');
        } else if (action === '2') {
            // 粘贴操作
            const jsonData = prompt('请输入要粘贴的Storage数据：');
            if (jsonData) {
                try {
                    const storageData = JSON.parse(jsonData);
                    for (const key in storageData.localStorage) {
                        localStorage.setItem(key, storageData.localStorage[key]);
                    }
                    for (const key in storageData.sessionStorage) {
                        sessionStorage.setItem(key, storageData.sessionStorage[key]);
                    }
                    alert('Storage data pasted successfully!');
                } catch (e) {
                    alert('Failed to parse storage data.');
                }
            }
        } else if(action !== null){
            alert('无效的操作！');
        }
    }

    // 添加按钮到页面
    createButton('copyOrPasteStorageButton', '复制/粘贴 Storage', copyOrPasteStorage);

})();
