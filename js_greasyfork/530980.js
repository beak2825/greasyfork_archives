// ==UserScript==
// @name         币圈KOL劣迹标记 - X(Twitter)
// @namespace    http://tampermonkey.net/
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB7ElEQVR4Ae1XMZLCMAwUdw0ldJQ8ATpKnkBJByUd8ALyA/gBdJTQUtHS8QT4AaRM5ctmThmfogQ75CYNmhGTbGJr45Vk0yAiQzXaF9VsHwIZAofDgYwxqo9GI/K16/X6cqyxvdVqmdvtZh6PhwmCIHXcw7vdrpFj8ny9XhsYxhe8lwWHw2EycLFYpNh0Ok2w8/nsFHy1WrkE1wnAN5tNMkGv10ux3W6XIab5fD5P3ovldCGrP2Ap4LiW8uRJAcIwe1wpArYU0FJimhQgxaQ9cqX4BZYCgSVmS8HBfRP1JQEsY1xKGSmAcTC+l0QrIWDraicVMBBA4O1265ScpQnAMbkMwphjub1HAI7EkxoDK7n0/gQQGATsCmDMo+z++Hf8E5CjPZ9PiqKIZrMZhWFIl8slxcbjMTWbTTqdTuRrXoz5i2WXRIL+WxWw2+Uml13rnJUT4K9E9nMFaF3SxiojoO1u2rJzl4z3/+oIcHBMLiUp2rDe3ozg+BIYtNee87KjGzLGndPx7JD/0K7xog2Gl30ymaSY1jm9CPhsrXnnBK1zOhHgCWWtF7l2TtA6p3S1E+73exoMBrRcLul4PJKL3e93arfbSUeMA1O/36eYPHU6nWQu7pyaqRlfZnezV05anhSN34va7PPXrHYCP+VaTG3LBV1KAAAAAElFTkSuQmCC
// @version      1.3
// @description  在Twitter/X上标记有劣迹的加密货币KOL，并实时显示其劣迹指数(0-100分)和不良行为记录。整合公共数据和本地自定义功能，帮助用户识别高风险KOL，避免投资陷阱。支持证据查看、数据更新和自定义标记功能。
// @author       @mr96_0x0 (TG: @Mr96_me)
// @license      GNU General Public License v3.0 or later
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/530980/%E5%B8%81%E5%9C%88KOL%E5%8A%A3%E8%BF%B9%E6%A0%87%E8%AE%B0%20-%20X%28Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530980/%E5%B8%81%E5%9C%88KOL%E5%8A%A3%E8%BF%B9%E6%A0%87%E8%AE%B0%20-%20X%28Twitter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const developerInfo = {
        twitter: "@mr96_0x0",
        telegram: "@Mr96_me"
    };

    const PUBLIC_DATA_URL = "https://gist.githubusercontent.com/Mr96s/b05aa6971cea6407bcb00621b6c20197/raw/cae13b5bc4003a482133a74cee1ea034e4bbc253/kol-data.json";

    const indexColors = {
        0:  { bg: "#e0e0e0", text: "#000000", emoji: "✅" }, // 0-9
        10: { bg: "#ccffcc", text: "#000000", emoji: "🔍" }, // 10-19
        20: { bg: "#99ff99", text: "#000000", emoji: "🔍" }, // 20-29
        30: { bg: "#ffff99", text: "#000000", emoji: "⚠️" }, // 30-39
        40: { bg: "#ffeb3b", text: "#000000", emoji: "⚠️" }, // 40-49
        50: { bg: "#ffcc00", text: "#000000", emoji: "⚠️" }, // 50-59
        60: { bg: "#ff9800", text: "#ffffff", emoji: "🚨" }, // 60-69
        70: { bg: "#ff5722", text: "#ffffff", emoji: "🚨" }, // 70-79
        80: { bg: "#f44336", text: "#ffffff", emoji: "☠️" }, // 80-89
        90: { bg: "#d32f2f", text: "#ffffff", emoji: "☠️" } // 90-100
    };

    function getColorConfig(index) {
        const tier = Math.min(Math.floor(index / 10) * 10, 90);
        return indexColors[tier] || indexColors[50];
    }

    let badKOLs = {};
    let usePublicData = GM_getValue('usePublicData', true);
    let useLocalData = GM_getValue('useLocalData', true);

    function loadData() {
        const publicData = GM_getValue('publicData', {});
        const localData = GM_getValue('localData', {});

        badKOLs = {};
        if (usePublicData) Object.assign(badKOLs, publicData);
        if (useLocalData) Object.assign(badKOLs, localData);

        checkForKOLs();
    }

    function fetchPublicData() {
        if (!usePublicData) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: PUBLIC_DATA_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    GM_setValue('publicData', data);
                    loadData();
                } catch (e) {
                    console.error("Failed to parse public data:", e);
                }
            },
            onerror: function(error) {
                console.error("Failed to fetch public data:", error);
            }
        });
    }

    const observer = new MutationObserver(checkForKOLs);
    observer.observe(document.body, { childList: true, subtree: true });

    function checkForKOLs() {
        const profileHeader = document.querySelector('[data-testid="UserName"]');
        if (profileHeader) {
            const screenName = document.querySelector('[data-testid="UserName"] div:nth-child(2) div span')?.textContent;
            if (screenName && badKOLs[screenName]) {
                addWarningBadge(profileHeader, badKOLs[screenName], true, screenName);
            }
        }

        document.querySelectorAll('[data-testid="tweet"]').forEach(tweet => {
            const authorLink = tweet.querySelector('a[role="link"][tabindex="-1"]');
            if (authorLink) {
                const author = authorLink.getAttribute('href')?.slice(1);
                if (author && badKOLs[author]) {
                    addWarningBadge(tweet, badKOLs[author], false, author);
                }
            }
        });
    }

    function addWarningBadge(element, kolData, isProfile, accountName) {
        if (element.querySelector('.kol-warning-badge')) return;

        const colorConfig = getColorConfig(kolData.index);
        const badgeSize = isProfile ? '16px' : '12px';

        const badge = document.createElement('div');
        badge.className = 'kol-warning-badge';
        badge.innerHTML = `
            <div style="
                background: ${colorConfig.bg};
                color: ${colorConfig.text};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-left: 8px;
                cursor: pointer;
                font-size: ${badgeSize};
                line-height: 1;
                white-space: nowrap;
            ">
                ${colorConfig.emoji}劣迹指数：${kolData.index}
            </div>
        `;

        badge.onclick = (e) => {
            e.stopPropagation();
            showKolDetails(kolData, accountName, element);
        };

        if (isProfile) {
            const nameElement = element.querySelector('div:nth-child(2) div span');
            if (nameElement) nameElement.parentNode.appendChild(badge);
        } else {
            const authorContainer = element.querySelector('[data-testid="User-Name"]');
            if (authorContainer) authorContainer.appendChild(badge);
        }
    }

    function showKolDetails(kolData, accountName, badgeElement) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.7); display: flex;
            justify-content: center; align-items: center; z-index: 9999;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background-color: #15202b; color: #ffffff; padding: 20px;
            border-radius: 12px; max-width: 500px; width: 90%;
            max-height: 80vh; overflow-y: auto;
        `;

        const colorConfig = getColorConfig(kolData.index);
        let displayName = null;

        const profileNameElement = document.querySelector('[data-testid="UserName"] div:first-child span');
        if (badgeElement.closest('[data-testid="UserName"]')) {
            displayName = profileNameElement ? profileNameElement.textContent : null;
        } else {
            const tweetElement = badgeElement.closest('[data-testid="tweet"]');
            if (tweetElement) {
                const tweetNameElement = tweetElement.querySelector('[data-testid="User-Name"] a div span');
                displayName = tweetNameElement ? tweetNameElement.textContent : null;
            } else {
                displayName = profileNameElement ? profileNameElement.textContent : null;
            }
        }

        const finalName = displayName || `@${accountName}`;

        const title = document.createElement('h2');
        title.textContent = `⚠️ 【${finalName}】 的 劣迹指数 (${kolData.index})`;
        title.style.cssText = `margin-top: 0; color: ${colorConfig.bg};`;
        content.appendChild(title);

        const recordsTitle = document.createElement('h3');
        recordsTitle.textContent = '劣迹记录:';
        recordsTitle.style.marginBottom = '8px';
        content.appendChild(recordsTitle);

        const recordsList = document.createElement('ul');
        recordsList.style.cssText = 'padding-left: 20px; margin-top: 0;';

        kolData.records.forEach(record => {
            const recordItem = document.createElement('li');
            recordItem.style.marginBottom = '12px';

            const reason = document.createElement('div');
            reason.textContent = record.reason;
            reason.style.marginBottom = '4px';
            recordItem.appendChild(reason);

            if (record.date && record.date.trim()) {
                const date = document.createElement('div');
                date.textContent = `时间: ${record.date}`;
                date.style.cssText = 'font-size: 0.9em; color: #8899a6; margin-bottom: 4px;';
                recordItem.appendChild(date);
            }

            if (record.proof && record.proof.trim()) {
                const proofLink = document.createElement('a');
                proofLink.href = record.proof;
                proofLink.textContent = '查看详情 →';
                proofLink.target = '_blank';
                proofLink.style.cssText = 'color: #1da1f2; text-decoration: none; font-size: 0.9em;';
                recordItem.appendChild(proofLink);
            }

            recordsList.appendChild(recordItem);
        });
        content.appendChild(recordsList);

        const feedbackSection = document.createElement('div');
        feedbackSection.style.cssText = 'margin-top: 20px; padding-top: 15px; border-top: 1px solid #38444d;';
        feedbackSection.innerHTML = `
            <h4 style="margin-bottom: 8px;">📢 反馈与申诉</h4>
            <p style="margin-bottom: 8px; font-size: 0.9em;">1.🌟欢迎提交线索！共建币圈透明社区</p>
            <p style="margin-bottom: 8px; font-size: 0.9em;">2.🗃️数据来源由程序爬取公开信息或用户提交，如您认为标记信息有误，可提交申诉。</p>
            <h4 style="margin-bottom: 8px;">📬 请通过以下方式提交线索或申诉:</h4>
            <a href="https://twitter.com/${developerInfo.twitter}" target="_blank" style="display: block; color: #1da1f2; text-decoration: none; font-size: 0.9em; margin-bottom: 4px;">🐦 Twitter: ${developerInfo.twitter}</a>
            <a href="https://t.me/${developerInfo.telegram.replace('@', '')}" target="_blank" style="display: block; color: #1da1f2; text-decoration: none; font-size: 0.9em;">📨 Telegram: ${developerInfo.telegram}</a>
        `;
        content.appendChild(feedbackSection);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = 'margin-top: 15px; padding: 8px 16px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
        closeButton.onclick = () => document.body.removeChild(modal);
        content.appendChild(closeButton);

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };
    }

    function showLocalDataEditor() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.7); display: flex;
            justify-content: center; align-items: center; z-index: 9999;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background-color: #15202b; color: #ffffff; padding: 20px;
            border-radius: 12px; max-width: 600px; width: 90%;
            max-height: 80vh; overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = '✏️ 编辑本地KOL记录';
        title.style.cssText = 'margin-top: 0; color: #1da1f2;';
        content.appendChild(title);

        const localData = GM_getValue('localData', {});
        const form = document.createElement('div');
        form.innerHTML = `
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">KOL用户名 (不含@):</label>
                <input id="username" type="text" style="width: 100%; padding: 6px; background-color: #253341; color: #ffffff; border: 1px solid #38444d; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">劣迹指数 (0-100):</label>
                <input id="index" type="number" min="0" max="100" value="50" style="width: 100%; padding: 6px; background-color: #253341; color: #ffffff; border: 1px solid #38444d; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">劣迹原因:</label>
                <input id="reason" type="text" style="width: 100%; padding: 6px; background-color: #253341; color: #ffffff; border: 1px solid #38444d; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">证据链接 (可选):</label>
                <input id="proof" type="text" style="width: 100%; padding: 6px; background-color: #253341; color: #ffffff; border: 1px solid #38444d; border-radius: 4px;" placeholder="https://...">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">日期 (可选):</label>
                <input id="date" type="date" style="width: 100%; padding: 6px; background-color: #253341; color: #ffffff; border: 1px solid #38444d; border-radius: 4px;" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <button id="addRecord" style="padding: 6px 12px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer;">添加记录</button>
        `;

        content.appendChild(form);

        const usernameInput = form.querySelector('#username');
        const indexInput = form.querySelector('#index');
        const reasonInput = form.querySelector('#reason');
        const proofInput = form.querySelector('#proof');
        const dateInput = form.querySelector('#date');
        const addButton = form.querySelector('#addRecord');

        addButton.onclick = () => {
            const username = usernameInput.value.trim();
            const index = parseInt(indexInput.value);
            const reason = reasonInput.value.trim();

            if (!username || !reason) {
                alert('用户名和劣迹原因不能为空');
                return;
            }
            if (isNaN(index) || index < 0 || index > 100) {
                alert('劣迹指数必须在 0-100 之间');
                return;
            }

            if (!localData[username]) {
                localData[username] = { index: index, records: [] };
            } else {
                localData[username].index = index;
            }

            localData[username].records.push({
                reason: reason,
                proof: proofInput.value.trim() || '',
                date: dateInput.value.trim() || ''
            });

            GM_setValue('localData', localData);
            loadData();
            alert(`已添加 ${username} 的记录`);
            usernameInput.value = '';
            reasonInput.value = '';
            proofInput.value = '';
            updateRecordsList(recordsList, localData);
        };

        const recordsSection = document.createElement('div');
        recordsSection.style.marginTop = '20px';
        recordsSection.innerHTML = '<h3 style="margin-bottom: 8px;">已有本地记录</h3>';
        const recordsList = document.createElement('ul');
        recordsList.style.cssText = 'padding-left: 20px; margin-top: 0;';
        updateRecordsList(recordsList, localData);
        recordsSection.appendChild(recordsList);
        content.appendChild(recordsSection);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = 'margin-top: 15px; padding: 8px 16px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
        closeButton.onclick = () => document.body.removeChild(modal);
        content.appendChild(closeButton);

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };
    }

    function updateRecordsList(recordsList, localData) {
        recordsList.innerHTML = '';
        for (const [username, data] of Object.entries(localData)) {
            data.records.forEach((record, index) => {
                const li = document.createElement('li');
                li.style.cssText = 'margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;';
                let recordText = `${username} (${data.index}): ${record.reason}`;
                if (record.date && record.date.trim()) recordText += ` - ${record.date}`;
                li.innerHTML = `
                    <span>${recordText}</span>
                    <button style="padding: 4px 8px; background-color: #ff3b30; color: white; border: none; border-radius: 4px; cursor: pointer;">删除</button>
                `;
                li.querySelector('button').onclick = () => {
                    data.records.splice(index, 1);
                    if (data.records.length === 0) delete localData[username];
                    GM_setValue('localData', localData);
                    loadData();
                    updateRecordsList(recordsList, localData);
                };
                recordsList.appendChild(li);
            });
        }
    }

    // 设置界面
    function showSettings() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.7); display: flex;
            justify-content: center; align-items: center; z-index: 9999;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background-color: #15202b; color: #ffffff; padding: 20px;
            border-radius: 12px; max-width: 600px; width: 90%;
            max-height: 80vh; overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = '⚙️ 设置';
        title.style.cssText = 'margin-top: 0; color: #1da1f2;';
        content.appendChild(title);

        const dataSourceSection = document.createElement('div');
        dataSourceSection.innerHTML = `
            <h3 style="margin-bottom: 8px;">数据源设置</h3>
            <label style="display: block; margin-bottom: 8px;">
                <input type="checkbox" id="usePublicData" ${usePublicData ? 'checked' : ''}> 使用公共数据
            </label>
            <label style="display: block; margin-bottom: 8px;">
                <input type="checkbox" id="useLocalData" ${useLocalData ? 'checked' : ''}> 使用本地数据
            </label>
            <button id="saveDataSource" style="padding: 6px 12px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
        `;
        content.appendChild(dataSourceSection);

        const publicCheckbox = dataSourceSection.querySelector('#usePublicData');
        const localCheckbox = dataSourceSection.querySelector('#useLocalData');
        const saveButton = dataSourceSection.querySelector('#saveDataSource');
        saveButton.onclick = () => {
            usePublicData = publicCheckbox.checked;
            useLocalData = localCheckbox.checked;
            GM_setValue('usePublicData', usePublicData);
            GM_setValue('useLocalData', useLocalData);
            loadData();
            alert('数据源设置已保存');
        };

        const localDataSection = document.createElement('div');
        localDataSection.style.marginTop = '20px';
        localDataSection.innerHTML = `
            <h3 style="margin-bottom: 8px;">本地数据管理</h3>
            <button id="editLocalData" style="padding: 6px 12px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">编辑本地数据</button>
            <button id="clearLocalData" style="padding: 6px 12px; background-color: #ff3b30; color: white; border: none; border-radius: 4px; cursor: pointer;">清空本地数据</button>
        `;
        localDataSection.querySelector('#editLocalData').onclick = showLocalDataEditor;
        localDataSection.querySelector('#clearLocalData').onclick = () => {
            if (confirm('确定清空本地数据吗？')) {
                GM_setValue('localData', {});
                loadData();
                alert('本地数据已清空');
            }
        };
        content.appendChild(localDataSection);

        const devInfoSection = document.createElement('div');
        devInfoSection.style.cssText = 'margin-top: 20px; padding-top: 15px; border-top: 1px solid #38444d;';
        devInfoSection.innerHTML = `
            <h3 style="margin-bottom: 8px;">开发者信息</h3>
            <p style="margin-bottom: 8px; font-size: 0.9em;">Twitter: <a href="https://twitter.com/${developerInfo.twitter}" target="_blank" style="color: #1da1f2; text-decoration: none;">${developerInfo.twitter}</a></p>
            <p style="margin-bottom: 8px; font-size: 0.9em;">Telegram: <a href="https://t.me/${developerInfo.telegram.replace('@', '')}" target="_blank" style="color: #1da1f2; text-decoration: none;">${developerInfo.telegram}</a></p>
        `;
        content.appendChild(devInfoSection);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = 'margin-top: 15px; padding: 8px 16px; background-color: #1da1f2; color: white; border: none; border-radius: 4px; cursor: pointer;';
        closeButton.onclick = () => document.body.removeChild(modal);
        content.appendChild(closeButton);

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };
    }

    // 初始化菜单命令
    GM_registerMenuCommand('⚙️ 打开设置', showSettings);
    GM_registerMenuCommand('🔄 更新公共数据', () => {
        fetchPublicData();
        alert('正在更新公共数据...');
    });

    // 初始化
    loadData();
    fetchPublicData();
    setInterval(fetchPublicData, 24 * 60 * 60 * 1000); // 每24小时更新一次公共数据
})();