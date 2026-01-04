// ==UserScript==
// @name         Mark5
// @namespace    https://github.com/yptd-1024
// @version      1.0
// @description  为特定用户添加自定义标签，支持本地和远程（GitHub）用户清单。
// @author       yptd-1024
// @match        *://*/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531044/Mark5.user.js
// @updateURL https://update.greasyfork.org/scripts/531044/Mark5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 只在 t66y.com 上运行（可通过设置扩展到其他网站）
    if (!window.location.hostname.includes('t66y.com')) return;

    // 工具函数：规范化文本
    function normalizeText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    // 从 GitHub 获取远程用户清单
    async function fetchRemoteUserList(repoUrl) {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/${repoUrl}/main/userlist.txt`);
            if (!response.ok) throw new Error('无法获取远程用户清单');
            const text = await response.text();
            return text.split(',').map(u => normalizeText(u)).filter(u => u.length > 0);
        } catch (error) {
            return [];
        }
    }

    // 主逻辑函数
    async function applyTags() {
        const userListStr = GM_getValue('userList', '');
        const localList = userListStr ? userListStr.split(',').map(u => normalizeText(u)) : [];
        const tagContent = GM_getValue('tagContent', '五毛');
        const defaultCSS = `
            position: absolute;
            font-size: 12px;
            color: red;
            border: 2px solid red;
            padding: 3px;
            z-index: 9999;
        `;
        const tagCSS = GM_getValue('tagCSS', defaultCSS);
        const listMode = GM_getValue('listMode', 'both'); // 默认改为 'both'
        const repoUrl = GM_getValue('repoUrl', 'yptd-1024/mark5');

        let userList = [];
        if (listMode === 'local') {
            userList = localList;
        } else if (listMode === 'remote') {
            userList = await fetchRemoteUserList(repoUrl);
        } else if (listMode === 'both') {
            const remoteList = await fetchRemoteUserList(repoUrl);
            userList = [...new Set([...localList, ...remoteList])];
        }

        if (userList.length === 0) return;

        const allElements = document.querySelectorAll('th, li span a, td a:not(.w70)');
        allElements.forEach((element) => {
            let targetElement = element;
            let username = normalizeText(element.textContent);

            const bElement = element.querySelector('b');
            if (bElement) {
                username = normalizeText(bElement.textContent);
                targetElement = bElement;
            }

            if (!username || username === '' || /[\d\/]+/.test(username)) return;

            if (userList.includes(username) && !element.parentElement.querySelector('.custom-user-tag')) {
                const parent = targetElement.parentElement;
                if (window.getComputedStyle(parent).position === 'static') {
                    parent.style.position = 'relative';
                }

                const tag = document.createElement('span');
                tag.textContent = tagContent;
                tag.style.cssText = tagCSS;
                tag.className = 'custom-user-tag';
                targetElement.insertAdjacentElement('afterend', tag);
            }
        });
    }

    // 创建设置弹窗
    function createSettingsWindow() {
        const existingWindow = document.getElementById('mark5-settings-window');
        if (existingWindow) existingWindow.remove();

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'mark5-settings-window';
        settingsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            width: 350px;
        `;

        settingsDiv.innerHTML = `
            <h2>Mark5 设置</h2>
            <label>本地用户清单（英文逗号分隔）:</label><br>
            <textarea id="userList" style="width: 100%; height: 80px;"></textarea><br>
            <label>用户清单模式:</label><br>
            <select id="listMode" style="width: 100%;">
                <option value="local">仅本地</option>
                <option value="remote">仅远程</option>
                <option value="both">本地和远程</option>
            </select><br>
            <label>GitHub 仓库地址:</label><br>
            <input type="text" id="repoUrl" style="width: 100%;"><br>
            <label>标签内容:</label><br>
            <input type="text" id="tagContent" style="width: 100%;"><br>
            <label>标签 CSS 样式:</label><br>
            <textarea id="tagCSS" style="width: 100%; height: 80px;"></textarea><br>
            <button id="saveSettings" style="margin-top: 10px;">保存</button>
            <button id="closeSettings" style="margin-top: 10px; margin-left: 10px;">关闭</button>
            <p id="status" style="color: green;"></p>
        `;

        document.body.appendChild(settingsDiv);

        document.getElementById('userList').value = GM_getValue('userList', '');
        document.getElementById('listMode').value = GM_getValue('listMode', 'both'); // 默认显示 'both'
        document.getElementById('repoUrl').value = GM_getValue('repoUrl', 'yptd-1024/mark5');
        document.getElementById('tagContent').value = GM_getValue('tagContent', '五毛');
        document.getElementById('tagCSS').value = GM_getValue('tagCSS', `
            position: absolute;
            font-size: 12px;
            color: red;
            border: 2px solid red;
            padding: 3px;
            z-index: 9999;
        `);

        document.getElementById('saveSettings').addEventListener('click', () => {
            GM_setValue('userList', document.getElementById('userList').value);
            GM_setValue('listMode', document.getElementById('listMode').value);
            GM_setValue('repoUrl', document.getElementById('repoUrl').value);
            GM_setValue('tagContent', document.getElementById('tagContent').value);
            GM_setValue('tagCSS', document.getElementById('tagCSS').value || `
                position: absolute;
                font-size: 12px;
                color: red;
                border: 2px solid red;
                padding: 3px;
                z-index: 9999;
            `);

            const status = document.getElementById('status');
            status.textContent = '设置已保存！';
            setTimeout(() => {
                status.textContent = '';
                settingsDiv.remove();
                applyTags();
            }, 1000);
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            settingsDiv.remove();
        });
    }

    // 注册菜单命令
    GM_registerMenuCommand('Mark5 设置', createSettingsWindow);

    // 页面初次加载时执行
    document.addEventListener('DOMContentLoaded', applyTags);

    // 监听动态内容变化
    const observer = new MutationObserver(applyTags);
    observer.observe(document.body, { childList: true, subtree: true });
})();