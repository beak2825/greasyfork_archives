// ==UserScript==
// @name         CD2离线
// @namespace    CD2
// @version      0.1
// @description  在磁力链接后面添加一个CD2离线按钮，点击按钮调用指定HTTP请求，并通过气泡提醒显示结果。
// @author       中药铺
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/474326/CD2%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/474326/CD2%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSettingsUI() {
        const settingsContainer = document.createElement('div');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.bottom = '20px';
        settingsContainer.style.right = '20px';
        settingsContainer.style.padding = '10px';
        settingsContainer.style.backgroundColor = '#fff';
        settingsContainer.style.border = '1px solid #ccc';
        settingsContainer.style.borderRadius = '5px';
        settingsContainer.style.zIndex = '9999';

        settingsContainer.innerHTML = `
            <label>CD2Host:</label>
            <input type="text" id="cd2HostInput" value="${GM_getValue('CD2Host', '')}">
            <br>
            <label>目标存储文件夹:</label>
            <input type="text" id="toFolderInput" value="${GM_getValue('toFolder', '')}">
            <br>
            <label>认证token:</label>
            <input type="text" id="tokenInput" value="${GM_getValue('token', '')}">
            <br>
            <button id="saveSettingsBtn">保存设置</button>
        `;

        document.body.appendChild(settingsContainer);

        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        saveSettingsBtn.addEventListener('click', () => {
            const cd2HostInput = document.getElementById('cd2HostInput');
            const toFolderInput = document.getElementById('toFolderInput');
            const tokenInput = document.getElementById('tokenInput');

            GM_setValue('CD2Host', cd2HostInput.value);
            GM_setValue('toFolder', toFolderInput.value);
            GM_setValue('token', tokenInput.value);
            settingsContainer.style.display = 'none';
            addOfflineButton();
        });
    }

    function addOfflineButton() {
        const CD2Host = GM_getValue('CD2Host', '');
        const toFolder = GM_getValue('toFolder', '');
        const token = GM_getValue('token', '');

        const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
        for (const link of magnetLinks) {
            const btn = document.createElement('button');
            btn.textContent = 'CD2离线';
            btn.style.marginLeft = '5px';
            btn.addEventListener('click', () => {
                const magnetUrl = link.href;
                const data = {
                    "urls": magnetUrl,
                    "toFolder": toFolder
                };
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${token}`
                    },
                    data: JSON.stringify(data),
                    url: `${CD2Host}/api/AddOfflineFiles`
                };
                console.log(magnetUrl)
                console.log(options)

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: options.url,
                    headers: options.headers,
                    data: JSON.stringify(data),
                    onload: function(response) {
                        const result = JSON.parse(response.responseText);
                        if (result.success) {
                            showNotification('成功添加到CD2离线任务！');
                        } else {
                            showNotification(`添加到CD2离线任务失败：${result.errorMessage}`);
                        }
                    },
                    onerror: function(error) {
                        showNotification('网络请求失败，请稍后重试！');
                    }
                });
            });

            link.parentNode.insertBefore(btn, link.nextSibling);
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // 添加设置菜单
    GM_registerMenuCommand('设置CD2离线脚本', () => {
        const settingsContainer = document.querySelector('div[style*="z-index: 9999"]');
        if (settingsContainer) {
            settingsContainer.style.display = 'block';
        } else {
            addSettingsUI();
        }
    });

    // Add the CD2离线按钮 on page load
    addOfflineButton();
    // 5秒 后在执行一次
    setTimeout(addOfflineButton, 5000);
})();
