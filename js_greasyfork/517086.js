// ==UserScript==
// @name         网站访问时间限制器
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  限制访问某些网站的时间，并提供管理功能
// @author       Mission521
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517086/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/517086/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const restrictDuration = 30 * 60 * 1000; // 30分钟
    const allowDuration = 30 * 60 * 1000; // 30分钟
    const sitesKey = 'restricted_sites';
    const PASSWORD = "Tang2251022."; // 请设置你的密码

    function getSites() {
        return GM_getValue(sitesKey, []);
    }

    function saveSites(sites) {
        GM_setValue(sitesKey, sites);
    }

    function isRestricted(url) {
        const sites = getSites();
        return sites.some(site => url.includes(site));
    }

    function showMaintenanceMessage(remainingTime) {
        document.body.innerHTML = ''; // 清空页面内容
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.width = '100%';
        message.style.height = '100%';
        message.style.backgroundColor = 'white';
        message.style.color = 'red';
        message.style.fontSize = '30px';
        message.style.display = 'flex';
        message.style.flexDirection = 'column';
        message.style.alignItems = 'center';
        message.style.justifyContent = 'center';

        const messageText = document.createElement('div');
        messageText.innerHTML = '当前网络正在维护，请稍后再试...';
        const timerText = document.createElement('div');
        timerText.id = 'timerText';
        message.appendChild(messageText);
        message.appendChild(timerText);
        document.body.appendChild(message);

        startCountdown(remainingTime, timerText);
    }

    function startCountdown(remainingTime, timerText) {
        const interval = setInterval(() => {
            remainingTime -= 1000;
            const seconds = Math.max(Math.floor(remainingTime / 1000), 0);
            timerText.innerHTML = `剩余时间: ${seconds} 秒`;
            if (remainingTime <= 0) {
                clearInterval(interval);
                timerText.innerHTML = '可以访问该网站。';
            }
        }, 1000);
    }

    function manageAccess(url) {
        let currentTime = Date.now();
        let accessInfo = GM_getValue(url, { lastAccess: 0, restricted: false });

        const nextSwitchTime = accessInfo.lastAccess + (accessInfo.restricted ? allowDuration : restrictDuration);
        let previousState = accessInfo.restricted; // 记录之前的状态

        if (accessInfo.restricted) {
            // 当前在封禁状态，检查是否已经到了解禁时间
            if (currentTime >= nextSwitchTime) {
                // 解除封禁状态，重置时间
                accessInfo.restricted = false;
                accessInfo.lastAccess = currentTime;
                GM_setValue(url, accessInfo);
                console.log(`当前状态: 可以访问。下次转换时间: ${new Date(nextSwitchTime)}`);
            } else {
                // 仍处于封禁状态，保持封禁
                const remainingTime = nextSwitchTime - currentTime;
                showMaintenanceMessage(remainingTime);
            }
        } else {
            // 当前不在封禁状态，检查是否需要进入封禁
            if (currentTime >= nextSwitchTime) {
                // 进入封禁状态，并记录时间
                accessInfo.restricted = true;
                accessInfo.lastAccess = currentTime;
                GM_setValue(url, accessInfo);
                const remainingTime = allowDuration;
                showMaintenanceMessage(remainingTime);
                console.log(`当前状态: 禁止访问。下次转换时间: ${new Date(nextSwitchTime)}`);
            }
        }

        // 在状态变化时输出信息
        if (accessInfo.restricted !== previousState) {
            console.log(`当前状态: ${accessInfo.restricted ? '禁止访问' : '可以访问'}。下次转换时间: ${new Date(nextSwitchTime)}`);
        }
    }

    function checkAccess() {
        const currentUrl = window.location.href;
        if (isRestricted(currentUrl)) {
            manageAccess(currentUrl);
        }
    }

    function openManagementUI() {
        const sites = getSites();
        const siteList = sites.map((site, index) => `${index + 1}. ${site}`).join('\n');
        const newSite = prompt(`当前限制的网站:\n${siteList}\n\n添加新网站（输入网址）或删除现有网站（输入序号）:`);

        if (newSite) {
            const num = parseInt(newSite);
            if (!isNaN(num) && num > 0 && num <= sites.length) {
                const password = prompt('请输入密码以删除该网站:');
                if (password === PASSWORD) {
                    sites.splice(num - 1, 1);
                    saveSites(sites);
                    alert('网站已删除');
                } else {
                    alert('密码错误');
                }
            } else {
                if (!sites.includes(newSite)) {
                    sites.push(newSite);
                    saveSites(sites);
                    alert('网站已添加');
                } else {
                    alert('该网站已在限制列表中');
                }
            }
        }
    }

    function addCurrentPageToBlacklist() {
        const currentUrl = window.location.href;
        const sites = getSites();

        if (!sites.includes(currentUrl)) {
            sites.push(currentUrl);
            saveSites(sites);
            alert('当前页面已添加到黑名单');
        } else {
            alert('当前页面已在黑名单中');
        }
    }

    function removeCurrentPageFromBlacklist() {
        const currentUrl = window.location.href;
        const sites = getSites();

        if (sites.includes(currentUrl)) {
            const confirmMessage = `确认要移除网址: ${currentUrl} 吗？（输入密码以删除）`;
            const password = prompt(confirmMessage);
            if (password === 'your_password') {
                const index = sites.indexOf(currentUrl);
                sites.splice(index, 1);
                saveSites(sites);
                alert('当前页面已从黑名单中移除');
            } else {
                alert('密码错误');
            }
        } else {
            alert('当前页面不在黑名单中');
        }
    }

    GM_registerMenuCommand("管理网站限制", openManagementUI);
    GM_registerMenuCommand("添加当前页到黑名单", addCurrentPageToBlacklist);
    GM_registerMenuCommand("移除当前页从黑名单", removeCurrentPageFromBlacklist);

    setInterval(checkAccess, 1000); // 每秒检查一次访问状态

})();
