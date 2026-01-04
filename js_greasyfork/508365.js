// ==UserScript==
// @name 智能网页书签管理器
// @namespace http://tampermonkey.net/
// @version 2.22
// @description 一键复制网页标题和URL，支持在线管理书签，可自定义隐藏浮动按钮，让您的网络冲浪更加高效！现在支持配置导入导出。
// @match *://*/*
// @grant GM_setClipboard
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/508365/%E6%99%BA%E8%83%BD%E7%BD%91%E9%A1%B5%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508365/%E6%99%BA%E8%83%BD%E7%BD%91%E9%A1%B5%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to generate UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Initialize settings
    let settings = GM_getValue('settings', {
        account: generateUUID().slice(0, 10),
        accessToken: generateUUID(),
        serverUrl: 'http://139.196.228.228:5055/api/save',
        registerUrl: 'http://139.196.228.228:8505',
        debugMode: false,
        showFloatingButton: true,
        hiddenUrls: []
    });

    // Create floating button
    const button = document.createElement('div');
    button.innerHTML = '📋';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #4CAF50;
        color: white;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        font-size: 24px;
        cursor: move;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: background-color 0.3s;
        display: ${shouldShowButton() ? 'block' : 'none'};
    `;

    // Add button to the page
    document.body.appendChild(button);

    // Function to check if button should be shown
    function shouldShowButton() {
        if (!settings.showFloatingButton) return false;
        const currentUrl = window.location.href;
        return !settings.hiddenUrls.some(url => currentUrl.includes(url));
    }

    // Dragging functionality (unchanged)
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    button.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(window.getComputedStyle(button).left);
        startTop = parseInt(window.getComputedStyle(button).top);
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        let newLeft = startLeft + e.clientX - startX;
        let newTop = startTop + e.clientY - startY;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - button.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - button.offsetHeight));

        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';
        button.style.bottom = 'auto';
        button.style.right = 'auto';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Button click event
    button.addEventListener('click', function(e) {
        if (isDragging) return;

        const pageTitle = document.title;
        const pageUrl = window.location.href;
        const copyText = `${pageTitle}\n${pageUrl}`;

        GM_setClipboard(copyText, 'text');

        // Send data to server
        sendDataToServer(pageTitle, pageUrl);

        if (settings.debugMode) {
            alert(`Copied to clipboard and sending to server:\nTitle: ${pageTitle}\nURL: ${pageUrl}`);
        }
    });

    function sendDataToServer(title, url) {
        GM_xmlhttpRequest({
            method: "POST",
            url: settings.serverUrl,
            data: JSON.stringify({
                account: settings.account,
                accessToken: settings.accessToken,
                title: title,
                url: url
            }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    button.innerHTML = '✅';
                    button.style.backgroundColor = '#45a049';
                    console.log("Data sent to server successfully:", response.responseText);
                } else {
                    button.innerHTML = '❌';
                    button.style.backgroundColor = '#f44336';
                    console.error("Failed to send data to server:", response.statusText);
                }
            },
            onerror: function(response) {
                button.innerHTML = '❌';
                button.style.backgroundColor = '#f44336';
                console.error("Failed to send data to server:", response.statusText);
            }
        });
    }

    // Settings popup
    function showSettings() {
        const settingsPopup = document.createElement('div');
        settingsPopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: Arial, sans-serif;
            width: 600px;
            height: 600px;
            overflow-y: auto;
        `;
        settingsPopup.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #333; text-align: center;">设置</h2>
            <div style="display: flex; margin-bottom: 20px;">
                <button id="settingsTab" style="flex: 1; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">常规设置</button>
                <button id="addRecordTab" style="flex: 1; padding: 10px; background-color: #ddd; color: black; border: none; cursor: pointer;">添加记录</button>
                <button id="serverConfigTab" style="flex: 1; padding: 10px; background-color: #ddd; color: black; border: none; cursor: pointer;">服务器配置</button>
                <button id="importExportTab" style="flex: 1; padding: 10px; background-color: #ddd; color: black; border: none; cursor: pointer;">导入/导出</button>
            </div>
            <div id="settingsContent">
                <div style="margin-bottom: 15px;">
                    <label for="account" style="display: inline-block; width: 100px; text-align: left; color: #666;">账户:</label>
                    <input type="text" id="account" value="${settings.account}" style="width: calc(100% - 110px); padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="accessToken" style="display: inline-block; width: 100px; text-align: left; color: #666;">访问令牌:</label>
                    <input type="text" id="accessToken" value="${settings.accessToken}" style="width: calc(100% - 110px); padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; color: #666;">
                        <input type="checkbox" id="debugMode" ${settings.debugMode ? 'checked' : ''} style="margin-right: 5px;">
                        调试模式
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; color: #666;">
                        <input type="checkbox" id="showFloatingButton" ${settings.showFloatingButton ? 'checked' : ''} style="margin-right: 5px;">
                        显示浮动按钮
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="hiddenUrls" style="display: block; margin-bottom: 5px; color: #666;">隐藏按钮的 URL (每行一个):</label>
                    <div style="display: flex; align-items: center;">
                        <textarea id="hiddenUrls" style="flex-grow: 1; height: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${settings.hiddenUrls.join('\n')}</textarea>
                        <button id="addCurrentUrl" style="margin-left: 10px; padding: 8px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">添加当前URL</button>
                    </div>
                </div>
            </div>
            <div id="addRecordContent" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <label for="bulkInput" style="display: block; margin-bottom: 5px; color: #666;">粘贴标题和 URL (每行一个):</label>
                    <textarea id="bulkInput" style="width: 100%; height: 150px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;" placeholder="示例格式：
网页标题1
https://www.example1.com
网页标题2
https://www.example2.com"></textarea>
                </div>
                <button id="addBulkRecords" style="background-color: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%;">添加记录</button>
            </div>
            <div id="serverConfigContent" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <label for="serverUrl" style="display: inline-block; width: 100px; text-align: left; color: #666;">服务器 URL:</label>
                    <textarea id="serverUrl" style="width: calc(100% - 110px); height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${settings.serverUrl}</textarea>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="registerUrl" style="display: inline-block; width: 100px; text-align: left; color: #666;">注册 URL:</label>
                    <textarea id="registerUrl" style="width: calc(100% - 110px); height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${settings.registerUrl}</textarea>
                </div>
            </div>
            <div id="importExportContent" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <input type="file" id="importFile" accept=".json" style="display: none;">
                    <button id="importButton" style="background-color: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 10px;">选择文件导入配置</button>
                    <button id="exportButton" style="background-color: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%;">导出配置到文件</button>
                </div>
                <div id="importResult" style="margin-top: 15px; color: #666;"></div>
            </div>
            <div style="text-align: right; margin-top: 20px;">
                <button id="saveSettings" style="background-color: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-right: 10px;">保存</button>
                <button id="closeSettings" style="background-color: #f44336; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
        `;
        document.body.appendChild(settingsPopup);

        const settingsTab = document.getElementById('settingsTab');
        const addRecordTab = document.getElementById('addRecordTab');
        const serverConfigTab = document.getElementById('serverConfigTab');
        const importExportTab = document.getElementById('importExportTab');
        const settingsContent = document.getElementById('settingsContent');
        const addRecordContent = document.getElementById('addRecordContent');
        const serverConfigContent = document.getElementById('serverConfigContent');
        const importExportContent = document.getElementById('importExportContent');

        function setActiveTab(tab, content) {
            [settingsTab, addRecordTab, serverConfigTab, importExportTab].forEach(t => {
                t.style.backgroundColor = '#ddd';
                t.style.color = 'black';
            });
            [settingsContent, addRecordContent, serverConfigContent, importExportContent].forEach(c => c.style.display = 'none');
            tab.style.backgroundColor = '#4CAF50';
            tab.style.color = 'white';
            content.style.display = 'block';
        }

        settingsTab.addEventListener('click', () => setActiveTab(settingsTab, settingsContent));
        addRecordTab.addEventListener('click', () => setActiveTab(addRecordTab, addRecordContent));
        serverConfigTab.addEventListener('click', () => setActiveTab(serverConfigTab, serverConfigContent));
        importExportTab.addEventListener('click', () => setActiveTab(importExportTab, importExportContent));


document.getElementById('addCurrentUrl').addEventListener('click', function() {
            const currentUrl = window.location.href;
            const hiddenUrlsTextarea = document.getElementById('hiddenUrls');
            hiddenUrlsTextarea.value += (hiddenUrlsTextarea.value ? '\n' : '') + currentUrl;
        });

        document.getElementById('saveSettings').addEventListener('click', function() {
            settings.account = document.getElementById('account').value;
            settings.accessToken = document.getElementById('accessToken').value;
            settings.serverUrl = document.getElementById('serverUrl').value;
            settings.registerUrl = document.getElementById('registerUrl').value;
            settings.debugMode = document.getElementById('debugMode').checked;
            settings.showFloatingButton = document.getElementById('showFloatingButton').checked;
            settings.hiddenUrls = document.getElementById('hiddenUrls').value.split('\n').map(url => url.trim()).filter(url => url);
            GM_setValue('settings', settings);
            button.style.display = shouldShowButton() ? 'block' : 'none';
            settingsPopup.remove();
        });

        document.getElementById('closeSettings').addEventListener('click', function() {
            settingsPopup.remove();
        });

        document.getElementById('addBulkRecords').addEventListener('click', function() {
            const bulkInput = document.getElementById('bulkInput').value;
            const lines = bulkInput.split('\n');
            for (let i = 0; i < lines.length; i += 2) {
                const title = lines[i].trim();
                const url = lines[i + 1] ? lines[i + 1].trim() : '';
                if (title && url) {
                    sendDataToServer(title, url);
                }
            }
            document.getElementById('bulkInput').value = '';
            alert('记录添加成功！');
        });

        // Updated import/export functionality
        document.getElementById('importButton').addEventListener('click', function() {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedSettings = JSON.parse(e.target.result);
                        Object.assign(settings, importedSettings);
                        GM_setValue('settings', settings);
                        document.getElementById('importResult').textContent = '配置导入成功！';
                        setTimeout(() => {
                            settingsPopup.remove();
                            showSettings(); // Refresh the settings popup
                        }, 1500);
                    } catch (error) {
                        document.getElementById('importResult').textContent = '导入失败：无效的 JSON 格式';
                    }
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('exportButton').addEventListener('click', function() {
            const configData = JSON.stringify(settings, null, 2);
            const blob = new Blob([configData], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'smart-bookmark-manager-config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Right-click menu for settings
    button.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSettings();
    });

    // Register menu command for Tampermonkey
    GM_registerMenuCommand("设置", showSettings);

    // Reset button state when the page is about to unload
    window.addEventListener('beforeunload', function() {
        button.innerHTML = '📋';
        button.style.backgroundColor = '#4CAF50';
    });
})();