// ==UserScript==
// @name         网站访问确认脚本
// @namespace    https://github.com/liucong2013/userscript-site-access-check
// @version      1.8
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAgACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAABgcDBQgE/8QAKxAAAQMEAQQBAwQDAAAAAAAAAQIDBAUGBxEIABIhQRQxMlETFiJhJEKh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAwACBf/EACMRAAEDAwMFAQAAAAAAAAAAAAECAxEABBIhMUEFFFGx8GH/2gAMAwEAAhEDEQA/ANgZfy7k6+8nO8duO0qLAq0GOmRdN0vth1qiMrH8Wm0+Qp9QIPsjYA0QpSONjgFjCqI+fkO+L9u+uOjukVKbXXG1KX7UhCPtH4BKtfnoS4tXz+yePN952l0OTW69X7tqUyohr7ysOhtAdVolDSNqUTo9oUfHno4urmdaiMdR6taUZTt01EFhNMeSVfBdGgpbhH3o2R2dvlewPGla248GTgDEVx7nqllaE90uDGUHxtpwT+b0KV+x8v8AFESLvxBkCq5BsuiJTIr1l12UmRNiQyCVPxngO5OgFK12gaSSQsA60/YF9W5kyzaTfdpTDKpNZjJkxnCNKAPgoUPS0qBSoeikjpM8cMKXRR587LOT6hMduS4WVIXCeWdpZcIJMgfRSzoab+1seNb8JqODiRRIWVMfQVE0i1cgVKHTBvYbZVpX6af6BH/T1JUXUZEQabp1w7cNJdcbwymATJjgnxI44qis2vwOJmZrlxhkEJgY3yLU3a3bFYfT/hxJjoAkQn1HwgE60T4ACSfCiUtezeM2Lrav1zI9HZMhpwJkUyCSlcSE4ryXWtb7vqOzZIRs9vrTIvKybTyFb8m1r1t+FWaVLGnYstoLQT6UPaVD0oEEeiOkCOCto0hS49hZhylaVMdJKqZTLhV8dIP+qApJKRr8k9Sgh2CrcUj9k08pKnUBWJkTuD99oKNeSPJSy+P1oSZk+fGlXLJZUKRRkuAvSHiP4rWkHaGgfKlHW9aG1EDqs4WWXFtXBVLq5r8Ot1O75D1yVWfEdDjbkuQrakBQ9oCQhQ9LSvqexOGuB7IZqS37XdueoVeO5FnVO45BnynmljS0hSvCNj2gBX99IJii5N4G5Oaatyn1e78O3dPS38NlCn5NPkrOgAB9HgNaPhLyU6VpaQekASpOCd/dKoqSoLWNPVf/2Q==
// @description  限制指定主域名及其所有子域名的访问，显示确认页面（无刷新），支持30分钟、今日内和本次会话不再提示，受限列表存储在 GM_Value 中，已确认页面显示倒计时，支持通过菜单添加当前域名到限制列表
// @author       lc cong
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document_start
// @noframes
// @supportURL   https://raw.githubusercontent.com/liucong2013/userscript-site-access-check/refs/heads/main/README.md
// @downloadURL https://update.greasyfork.org/scripts/534187/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E7%A1%AE%E8%AE%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/534187/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E7%A1%AE%E8%AE%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) {
        console.log("脚本在 iframe 中运行，退出。");
        return;
    }

    // --- 配置 ---
    const RESTRICTED_DOMAINS_KEY = 'my_restricted_domains';
    const LOCAL_CONFIRM_KEY_PREFIX = 'confirmed_access_';

    // --- 工具函数 ---

    function getRestrictedBaseDomains() {
        const domainsJson = GM_getValue(RESTRICTED_DOMAINS_KEY, '[]');
        try {
            const domains = JSON.parse(domainsJson);
            return Array.isArray(domains) ? domains : [];
        } catch (e) {
            console.error("解析受限域名列表失败:", e);
            GM_deleteValue(RESTRICTED_DOMAINS_KEY);
            return [];
        }
    }

    function setRestrictedBaseDomains(domainsArray) {
        GM_setValue(RESTRICTED_DOMAINS_KEY, JSON.stringify(domainsArray));
    }

    function getBaseDomain(hostname) {
        if (!hostname) return '';
        const parts = hostname.split('.');
        if (parts.length <= 2) return hostname;
        const secondLast = parts[parts.length - 2];
        const commonTldParts = ['co', 'com', 'org', 'net', 'gov', 'edu', 'ac'];
        if (commonTldParts.includes(secondLast) && parts.length >= 3) {
            return parts.slice(-3).join('.');
        }
        return parts.slice(-2).join('.');
    }

    function findMatchingRestrictedDomain(hostname, restrictedDomains) {
        return restrictedDomains.find(baseDomain =>
            hostname === baseDomain || hostname.endsWith('.' + baseDomain)
        );
    }

    function getEndOfTodayTimestamp() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    }

    function isLocalConfirmedAndNotExpired(domainKey) {
        const storedData = GM_getValue(LOCAL_CONFIRM_KEY_PREFIX + domainKey, null);
        if (!storedData) return false;
        try {
            const { timestamp, expiryType } = JSON.parse(storedData);
            const now = Date.now();
            if (expiryType === '30min') return now < timestamp + 30 * 60 * 1000;
            if (expiryType === '5min') return now < timestamp + 5 * 60 * 1000;
            if (expiryType === 'today') {
                const todayStart = new Date().setHours(0, 0, 0, 0);
                return timestamp >= todayStart && now < getEndOfTodayTimestamp();
            }
            return false;
        } catch (e) {
            console.error("解析确认状态失败:", e);
            GM_deleteValue(LOCAL_CONFIRM_KEY_PREFIX + domainKey);
            return false;
        }
    }

    function setLocalConfirmed(domainKey, expiryType) {
        const confirmInfo = { timestamp: Date.now(), expiryType };
        GM_setValue(LOCAL_CONFIRM_KEY_PREFIX + domainKey, JSON.stringify(confirmInfo));
        return confirmInfo;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        GM_addStyle(`
            #gm-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #333; color: white; padding: 10px 20px; border-radius: 5px; z-index: 999999; font-size: 14px; }
        `);
        toast.id = 'gm-toast';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function showRestrictionOverlay(hostname, domainToConfirm) {
        const overlay = document.createElement('div');
        overlay.id = 'restriction-overlay';

        GM_addStyle(`
            #restriction-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 9999998; display: flex; justify-content: center; align-items: center; font-family: sans-serif; }
            .restriction-container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; max-width: 500px; }
            .restriction-container h1 { color: #d9534f; margin-bottom: 20px; }
            .restriction-container p { color: #555; margin-bottom: 30px; line-height: 1.6; }
            .button-container button { background-color: #5cb85c; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 15px; margin: 5px; transition: background-color 0.3s ease; }
            .button-container button:hover { background-color: #4cae4c; }
        `);

        overlay.innerHTML = `
            <div class="restriction-container">
                <h1>⚠️ 访问受限</h1>
                <p>您正尝试访问的网站 <strong>${hostname}</strong> 已被标记为受限。请确认您希望继续访问，并选择本次确认的有效时长。</p>
                <div class="button-container">
                    <button data-expiry="30min">30分钟内不再提示</button>
                    <button data-expiry="today">今天内不再提示</button>
                    <button data-expiry="5min">允许访问5分钟</button>
                </div>
            </div>
        `;

        overlay.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const expiryType = e.target.dataset.expiry;
                const confirmInfo = setLocalConfirmed(domainToConfirm, expiryType);
                overlay.remove();
                showCountdown(hostname, confirmInfo.expiryType, confirmInfo.timestamp);
            }
        });

        // 等待DOM加载完成再插入
        if (document.body) {
            document.body.appendChild(overlay);
        } else {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay));
        }
    }

    function showCountdown(hostname, expiryType, timestamp) {
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', () => showCountdown(hostname, expiryType, timestamp));
            return;
        }
        GM_addStyle(`
            #restriction-countdown { position: fixed; bottom: 20px; right: 10px; background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; font-size: 12px; z-index: 9999999; box-shadow: 0 1px 4px rgba(0,0,0,0.1); color: black; cursor: pointer; }
        `);
        const countdownDiv = document.createElement('div');
        countdownDiv.id = 'restriction-countdown';
        document.body.appendChild(countdownDiv);

        let intervalId = setInterval(updateCountdown, 1000);
        countdownDiv.addEventListener('dblclick', () => {
            clearInterval(intervalId);
            countdownDiv.remove();
        });

        function formatRemainingTime(ms) {
            if (ms <= 0) return '0s';
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            let parts = [];
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
            return parts.join(' ');
        }

        function updateCountdown() {
            const now = Date.now();
            let remainingTime, expiryLabel;

            if (expiryType === '30min') {
                remainingTime = (timestamp + 30 * 60 * 1000) - now;
                expiryLabel = '剩余';
            } else if (expiryType === '5min') {
                remainingTime = (timestamp + 5 * 60 * 1000) - now;
                expiryLabel = '剩余';
            } else if (expiryType === 'today') {
                remainingTime = getEndOfTodayTimestamp() - now;
                expiryLabel = '今日剩余';
            }

            if (remainingTime <= 0) {
                countdownDiv.textContent = `❌ 确认已过期`;
                clearInterval(intervalId);
                return;
            }
            countdownDiv.textContent = `⏳ ${expiryLabel}: ${formatRemainingTime(remainingTime)}`;
        }
        updateCountdown();
    }

    function addCurrentDomainToRestrictedList() {
        const currentHostname = window.location.hostname;
        if (!currentHostname || currentHostname === 'localhost') {
            showToast("无法获取当前域名或不支持本地地址。");
            return;
        }
        const baseDomain = getBaseDomain(currentHostname);
        const restrictedDomains = getRestrictedBaseDomains();
        if (restrictedDomains.includes(baseDomain)) {
            showToast(`主域名 "${baseDomain}" 已在限制列表中。`);
            return;
        }
        restrictedDomains.push(baseDomain);
        setRestrictedBaseDomains(restrictedDomains);
        showToast(`主域名 "${baseDomain}" 已添加到限制列表。`);
        // 动态更新菜单
        registerMenus(baseDomain);
        // 显示限制（如果当前页面就是刚添加的）
        if (!document.getElementById('restriction-overlay')) {
             showRestrictionOverlay(currentHostname, baseDomain);
        }
    }

    function registerMenus(matchingDomain) {
        // 清除旧菜单，防止重复
        if (window.registeredMenuCommands) {
            window.registeredMenuCommands.forEach(GM_unregisterMenuCommand);
        }
        window.registeredMenuCommands = [];

        let cmd1 = GM_registerMenuCommand("➕ 添加当前主域名到限制列表", addCurrentDomainToRestrictedList);
        window.registeredMenuCommands.push(cmd1);

        if (matchingDomain) {
            let cmd2 = GM_registerMenuCommand(`🗑️ 将主域名 "${matchingDomain}" 从限制列表移除`, () => {
                const currentRestricted = getRestrictedBaseDomains();
                const idx = currentRestricted.indexOf(matchingDomain);
                if (idx !== -1) {
                    currentRestricted.splice(idx, 1);
                    setRestrictedBaseDomains(currentRestricted);
                    showToast(`主域名 "${matchingDomain}" 已从限制列表移除。`);
                    // 动态更新菜单
                    registerMenus(null);
                } else {
                    showToast("错误：在列表中找不到匹配的域名。");
                }
            });
            window.registeredMenuCommands.push(cmd2);
        }
    }


    // --- 主逻辑 ---
    const currentHostname = window.location.hostname;
    const restrictedDomains = getRestrictedBaseDomains();
    const matchingDomain = findMatchingRestrictedDomain(currentHostname, restrictedDomains);

    // 始终注册菜单，以便动态更新
    registerMenus(matchingDomain);

    if (matchingDomain) {
        const confirmationKey = matchingDomain;
        if (!isLocalConfirmedAndNotExpired(confirmationKey)) {
            console.log(`访问 ${currentHostname} (规则: ${matchingDomain}) 受限，显示确认页面。`);
            // 使用 run-at: document_start 时，需要等待DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => showRestrictionOverlay(currentHostname, confirmationKey));
            } else {
                showRestrictionOverlay(currentHostname, confirmationKey);
            }
        } else {
            console.log(`访问 ${currentHostname} (规则: ${matchingDomain}) 已放行。`);
            const localConfirmedData = GM_getValue(LOCAL_CONFIRM_KEY_PREFIX + confirmationKey, null);
            if (localConfirmedData) {
                try {
                    const { expiryType, timestamp } = JSON.parse(localConfirmedData);
                    showCountdown(currentHostname, expiryType, timestamp);
                } catch(e) { /* ignore */ }
            }
        }
    }
})();