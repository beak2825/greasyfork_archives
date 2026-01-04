// ==UserScript==
// @name         网络青少年模式
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  用于屏蔽指定的网站，健康绿色上网，1、防止接触不良内容：屏蔽不适合儿童和青少年的网站，如色情、暴力、赌博等，保护他们的身心健康。2、防止网络欺凌：减少孩子们接触到可能存在网络欺凌的网站和社交平台，降低他们受到伤害的风险。3、防止沉迷：屏蔽游戏和社交媒体网站，帮助儿童专注于学业和其他有益的活动。
// @author       wll
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/508230/%E7%BD%91%E7%BB%9C%E9%9D%92%E5%B0%91%E5%B9%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/508230/%E7%BD%91%E7%BB%9C%E9%9D%92%E5%B0%91%E5%B9%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BLACKLIST_KEY = 'blacklist';
    const MAINTENANCE_MESSAGE = '当前网站维修中，请稍后再试...';

    // 读取黑名单
    function getBlacklist() {
        return JSON.parse(GM_getValue(BLACKLIST_KEY, '[]'));
    }

    // 保存黑名单
    function setBlacklist(blacklist) {
        GM_setValue(BLACKLIST_KEY, JSON.stringify(blacklist));
    }

    // 检查当前网站是否在黑名单中
    function isSiteInBlacklist() {
        const blacklist = getBlacklist();
        const currentHost = window.location.host;
        return blacklist.includes(currentHost);
    }

    // 添加当前网站到黑名单
    function addCurrentSiteToBlacklist() {
        const blacklist = getBlacklist();
        const currentHost = window.location.host;
        if (!blacklist.includes(currentHost)) {
            blacklist.push(currentHost);
            setBlacklist(blacklist);
            showRefreshMessage(`${currentHost} 已加入黑名单，页面将在3秒后刷新...`);
            refreshWithDelay();
        } else {
            showTemporaryMessage(`${currentHost} 已在黑名单中`);
        }
    }

    // 移除当前网站从黑名单
    function removeCurrentSiteFromBlacklist() {
        const blacklist = getBlacklist();
        const currentHost = window.location.host;
        const index = blacklist.indexOf(currentHost);
        if (index > -1) {
            blacklist.splice(index, 1);
            setBlacklist(blacklist);
            showRefreshMessage(`${currentHost} 已从黑名单中移除，页面将在3秒后刷新...`);
            refreshWithDelay();
        } else {
            showTemporaryMessage(`${currentHost} 不在黑名单中`);
        }
    }

    // 显示临时提示信息
    function showTemporaryMessage(message) {
        const tempMessage = document.createElement('div');
        tempMessage.style.position = 'fixed';
        tempMessage.style.top = '50%';
        tempMessage.style.left = '50%';
        tempMessage.style.transform = 'translate(-50%, -50%)';
        tempMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tempMessage.style.color = 'white';
        tempMessage.style.padding = '20px';
        tempMessage.style.borderRadius = '10px';
        tempMessage.style.fontSize = '24px';
        tempMessage.style.zIndex = 100000; // 提升 z-index 确保在最顶层
        tempMessage.textContent = message;
        document.body.appendChild(tempMessage);

        setTimeout(() => {
            document.body.removeChild(tempMessage);
        }, 3000); // 3秒后自动消失
    }

    // 显示刷新提示
    function showRefreshMessage(message) {
        const refreshMessage = document.createElement('div');
        refreshMessage.style.position = 'fixed';
        refreshMessage.style.top = '50%';
        refreshMessage.style.left = '50%';
        refreshMessage.style.transform = 'translate(-50%, -50%)';
        refreshMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        refreshMessage.style.color = 'white';
        refreshMessage.style.padding = '20px';
        refreshMessage.style.borderRadius = '10px';
        refreshMessage.style.fontSize = '18px';
        refreshMessage.style.zIndex = 100000; // 提升 z-index 确保在最顶层
        refreshMessage.textContent = message;
        document.body.appendChild(refreshMessage);
    }

    // 延迟刷新页面
    function refreshWithDelay() {
        let countdown = 3;
        const interval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(interval);
                location.reload();
            }
        }, 1000); // 每秒更新一次倒计时
    }

    // 显示管理黑名单的页面
    function showBlacklistManager() {
        const blacklist = getBlacklist();
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10%';
        container.style.left = '10%';
        container.style.width = '80%';
        container.style.height = '80%';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #000';
        container.style.zIndex = 10000;
        container.style.padding = '20px';
        container.style.overflowY = 'auto';
        container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        container.style.borderRadius = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.padding = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            container.remove();
        };

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '20px';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['序号', '网站', '操作'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.border = '1px solid #000';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f0f0f0';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        blacklist.forEach((site, index) => {
            const row = document.createElement('tr');

            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            numberCell.style.border = '1px solid #000';
            numberCell.style.padding = '8px';
            numberCell.style.textAlign = 'center';
            row.appendChild(numberCell);

            const siteCell = document.createElement('td');
            siteCell.textContent = site;
            siteCell.style.border = '1px solid #000';
            siteCell.style.padding = '8px';
            siteCell.style.textAlign = 'center';
            row.appendChild(siteCell);

            const actionCell = document.createElement('td');
            actionCell.style.border = '1px solid #000';
            actionCell.style.padding = '8px';
            actionCell.style.textAlign = 'center';

            const editButton = document.createElement('button');
            editButton.textContent = '编辑';
            editButton.style.backgroundColor = '#4CAF50';
            editButton.style.color = 'white';
            editButton.style.border = 'none';
            editButton.style.borderRadius = '5px';
            editButton.style.padding = '5px 10px';
            editButton.style.marginRight = '5px';
            editButton.style.cursor = 'pointer';
            editButton.onclick = () => {
                const newSite = prompt('请输入新的网站地址:', site);
                if (newSite) {
                    blacklist[index] = newSite;
                    setBlacklist(blacklist);
                    container.remove();
                    showBlacklistManager();
                }
            };
            actionCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => {
                blacklist.splice(index, 1);
                setBlacklist(blacklist);
                container.remove();
                showBlacklistManager();
            };
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        const addButton = document.createElement('button');
        addButton.textContent = '添加新网站';
        addButton.style.display = 'block';
        addButton.style.margin = '0 auto 20px auto';
        addButton.style.backgroundColor = '#2196F3';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '5px';
        addButton.style.padding = '10px';
        addButton.style.cursor = 'pointer';
        addButton.onclick = () => {
            const newSite = prompt('请输入要加入黑名单的站点:');
            if (newSite && !blacklist.includes(newSite)) {
                blacklist.push(newSite);
                setBlacklist(blacklist);
                container.remove();
                showBlacklistManager();
                showTemporaryMessage(`${newSite} 已加入黑名单`);
            } else if (newSite) {
                showTemporaryMessage(`${newSite} 已在黑名单中`);
            }
        };

        const addCurrentButton = document.createElement('button');
        addCurrentButton.textContent = '添加当前网站到黑名单';
        addCurrentButton.style.display = 'block';
        addCurrentButton.style.margin = '0 auto 20px auto';
        addCurrentButton.style.backgroundColor = '#2196F3';
        addCurrentButton.style.color = 'white';
        addCurrentButton.style.border = 'none';
        addCurrentButton.style.borderRadius = '5px';
        addCurrentButton.style.padding = '10px';
        addCurrentButton.style.cursor = 'pointer';
        addCurrentButton.onclick = () => {
            addCurrentSiteToBlacklist();
            container.remove();
            showBlacklistManager();
        };

        const removeCurrentButton = document.createElement('button');
        removeCurrentButton.textContent = '移出当前网站黑名单';
        removeCurrentButton.style.display = 'block';
        removeCurrentButton.style.margin = '0 auto 20px auto';
        removeCurrentButton.style.backgroundColor = '#f44336';
        removeCurrentButton.style.color = 'white';
        removeCurrentButton.style.border = 'none';
        removeCurrentButton.style.borderRadius = '5px';
        removeCurrentButton.style.padding = '10px';
        removeCurrentButton.style.cursor = 'pointer';
        removeCurrentButton.onclick = () => {
            removeCurrentSiteFromBlacklist();
            container.remove();
            showBlacklistManager();
        };

        container.appendChild(closeButton);
        container.appendChild(table);
        container.appendChild(addButton);
        container.appendChild(addCurrentButton);
        container.appendChild(removeCurrentButton);
        document.body.appendChild(container);
    }

    // 注册菜单命令
    GM_registerMenuCommand('添加当前网站到黑名单', addCurrentSiteToBlacklist);
    GM_registerMenuCommand('移出当前网站黑名单', removeCurrentSiteFromBlacklist);
    GM_registerMenuCommand('管理黑名单', showBlacklistManager);

    // 如果当前网站在黑名单中，显示维护提示并禁止访问
    if (isSiteInBlacklist()) {
        const maintenanceContainer = document.createElement('div');
        maintenanceContainer.style.position = 'fixed';
        maintenanceContainer.style.top = '0';
        maintenanceContainer.style.left = '0';
        maintenanceContainer.style.width = '100%';
        maintenanceContainer.style.height = '100%';
        maintenanceContainer.style.backgroundColor = '#f0f0f0';
        maintenanceContainer.style.zIndex = '9999';
        maintenanceContainer.style.display = 'flex';
        maintenanceContainer.style.justifyContent = 'center';
        maintenanceContainer.style.alignItems = 'center';
        maintenanceContainer.style.flexDirection = 'column';
        maintenanceContainer.innerHTML = `
            <div style="text-align:center; font-size:24px; color:red; margin-bottom:20px;">${MAINTENANCE_MESSAGE}</div>
        `;

        document.body.innerHTML = '';
        document.body.appendChild(maintenanceContainer);

        window.stop();
    }
})();
