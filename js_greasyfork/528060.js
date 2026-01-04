// ==UserScript==
// @name         Bangumi随便看看扩展
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  基于超展开对随便看看进行内容扩充
// @author       age
// @match        https://bgm.tv/group/discover
// @match        https://bangumi.tv/group/discover
// @match        https://chii.in/group/discover
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528060/Bangumi%E9%9A%8F%E4%BE%BF%E7%9C%8B%E7%9C%8B%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528060/Bangumi%E9%9A%8F%E4%BE%BF%E7%9C%8B%E7%9C%8B%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const validDomains = ['bgm.tv', 'bangumi.tv', 'chii.in'];
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;

    if (!validDomains.includes(currentDomain) || currentPath !== '/group/discover') {
        return;
    }

    const apiUrl = `https://${currentDomain}/rakuen/topiclist?type=group`;
    // 获取屏蔽用户列表函数
    function getIgnoredUsers() {
        const scripts = document.head.querySelectorAll('script[type="text/javascript"]');
        for (const script of scripts) {
            const scriptContent = script.textContent;
            const match = scriptContent.match(/var data_ignore_users\s*=\s*(\[[^\]]*\]);/);
            if (match) {
                try {
                    return JSON.parse(match[1]);
                } catch (e) {
                    console.error('解析屏蔽用户列表失败:', e);
                    return [];
                }
            }
        }
        return [];
    }

    function createHintRow() {
        const isDark = document.documentElement.dataset.theme === 'dark';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="4" style="
                text-align: center;
                padding: 8px 0;
                color: ${isDark ? '#fff' : '#000'};
                background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                font-size: 1.0em;
                border-bottom: 1px solid ${isDark ? '#444' : '#ddd'};
            ">刚才看到这里 ▼</td>
        `;
        return tr;
    }

    async function fetchRakuenData() {
        try {
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (e) {
            console.error('数据获取失败:', e);
            return null;
        }
    }

    // 时间转换函数
    function parseRelativeTime(timeStr) {
        // 清理字符串
        const cleaned = timeStr
        .replace(/\.\.\./g, '')
        .replace(/ago/gi, '')
        .trim();

        const matches = Array.from(cleaned.matchAll(/(\d+)([mhd])/g));
        if (!matches.length) return new Date();

        const now = new Date();
        matches.forEach(match => {
            const value = parseInt(match[1], 10);
            const unit = match[2];
            switch (unit) {
                case 'd': now.setDate(now.getDate() - value); break;
                case 'h': now.setHours(now.getHours() - value); break;
                case 'm': now.setMinutes(now.getMinutes() - value); break;
            }
        });
        return now;
    }

    function formatTime(date) {
        const pad = n => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    // 创建
    function createTableRow(item) {
        const tr = document.createElement('tr');
        tr.dataset.itemUser = item.userId;

        const tdTitle = document.createElement('td');
        tdTitle.className = item.rowClass;
        const titleLink = document.createElement('a');
        titleLink.href = `/group/topic/${item.topicId}`;
        titleLink.className = 'l';
        titleLink.textContent = item.title;

        const replySpan = document.createElement('small');
        replySpan.className = 'grey';
        replySpan.textContent = ` ${item.replies}`;
        tdTitle.append(titleLink, replySpan);

        // 小组列
        const tdGroup = document.createElement('td');
        tdGroup.className = item.rowClass;
        const groupLink = document.createElement('a');
        groupLink.href = item.groupUrl;
        groupLink.textContent = item.groupName;
        tdGroup.appendChild(groupLink);

        // 用户列
        const tdUser = document.createElement('td');
        tdUser.className = item.rowClass;
        const userLink = document.createElement('a');
        userLink.href = `/user/${item.userId}`;
        userLink.textContent = item.userName;
        tdUser.appendChild(userLink);

        // 实际时间
        const tdTime = document.createElement('td');
        tdTime.className = item.rowClass;
        tdTime.setAttribute('align', 'right');
        const timeSpan = document.createElement('small');
        timeSpan.className = 'grey';
        timeSpan.textContent = formatTime(item.realTime);
        tdTime.appendChild(timeSpan);

        tr.append(tdTitle, tdGroup, tdUser, tdTime);
        return tr;
    }

    // 更新主题数据（点击按钮后加载）
     async function updateTable() {
        try {
            const originalTable = document.querySelector('table.topic_list');
            const apiData = await fetchRakuenData();

            if (!originalTable || !apiData) return;

            const parser = new DOMParser();
            const apiDoc = parser.parseFromString(apiData, 'text/html');
            const apiItems = Array.from(apiDoc.querySelectorAll('#eden_tpc_list > ul > li')).slice(15);

            // 获取屏蔽列表
            const ignoreUsers = getIgnoredUsers();

            // 获取或创建第二个tbody
            const existingTbodies = originalTable.querySelectorAll('tbody');
            let targetTbody = existingTbodies[1];

            if (!targetTbody) {
                targetTbody = document.createElement('tbody');
                if (existingTbodies[0]) {
                    existingTbodies[0].insertAdjacentElement('afterend', targetTbody);
                } else {
                    originalTable.appendChild(targetTbody);
                }
            }

            // 添加提示行
            targetTbody.appendChild(createHintRow());

            // 添加新数据
            apiItems.forEach(li => {
                const userId = li.dataset.itemUser;
                if (ignoreUsers.includes(userId)) {
                    return; // 跳过被屏蔽用户
                }

                const timeElement = li.querySelector('.time');
                const realTime = parseRelativeTime(timeElement.textContent);

                const item = {
                    rowClass: li.classList.contains('line_odd') ? 'odd' : 'even',
                    userId: li.dataset.itemUser,
                    topicId: li.querySelector('a[href^="/rakuen/topic/group"]').href.match(/\/group\/(\d+)/)[1],
                    title: li.querySelector('.title').textContent.trim(),
                    replies: li.querySelector('.grey').textContent,
                    groupUrl: li.querySelector('.row > a').href,
                    groupName: li.querySelector('.row > a').textContent,
                    userName: li.querySelector('.avatar').title,
                    realTime: realTime
                };

                targetTbody.appendChild(createTableRow(item));
            });

        } catch (e) {
            console.error('更新失败:', e);
        }
    }

    // 创建继续加载按钮
    function createContinueButton() {
        const originalTable = document.querySelector('table.topic_list');
        if (!originalTable) return;

        const buttonTbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.style.textAlign = 'center';
        td.style.padding = '8px';

        const button = document.createElement('button');
        button.textContent = '继续加载';
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        button.style.color = isDark ? 'white' : 'black';
        button.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '4px 19px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            updateTable().finally(() => {
                buttonTbody.remove();
            });
        });

        td.appendChild(button);
        tr.appendChild(td);
        buttonTbody.appendChild(tr);
        originalTable.appendChild(buttonTbody);
    }

    window.addEventListener('load', createContinueButton);
})();