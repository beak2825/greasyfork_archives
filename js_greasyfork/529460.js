// ==UserScript==
// @name         [LINUX DO] 🚫 屏蔽含有指定：类别、标签和标题关键词 的话题 [20250124] Fixing 0
// @namespace    0_V userscripts/[LINUX DO] 🚫 屏蔽含有指定：类别、标签和标题关键词 的话题
// @version      [20250124] Fixing 0
// @license MIT
// @description  功能：1️⃣自定义配置；2️⃣适配搜索页；3️⃣无需手动刷新，配置更新后立即生效；4️⃣支持从账号的偏好设置中，导入类别、标签设置；5️⃣未登录时，屏蔽功能依然有效；6️⃣支持从侧边栏导入标题关键词；7️⃣支持通过文件 导入/导出脚本的全部设置；8️⃣支持正则表达式过滤；[修复]搜索结果页空白
// @update-log   通过对表格行使用visibility:collapse（或对Safari、非<tr>使用绝对定位）实现“软隐藏”，解决搜索结果空白问题。
// @author       0_V
// @match        https://linux.do/*
//
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
//
// @icon data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGlnaHRTYWJlckdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjM2IwMDAwIiBzdG9wLW9wYWNpdHk9IjAuNyIvPgogICAgICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM4YjAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM2IwMDAwIiBzdG9wLW9wYWNpdHk9IjAuNyIvPgogICAgICA8L2xpbmVhckdyYWRpZW50PgoKICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJtZXRhbFRleHR1cmUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxYTFhMWEiLz4KICAgICAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMmMyYzJjIi8+CiAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxYTFhMWEiLz4KICAgICAgPC9saW5lYXJHcmFkaWVudD4KCiAgICAgIDxmaWx0ZXIgaWQ9ImxpZ2h0c2FiZXJHbG93Ij4KICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUiIC8+CiAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMSAwIDAgMCAwLjYKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCAxIDAgMCAwCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgMCAxIDAgMAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwIDAgMCAwLjcgMCIvPgogICAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CgogIDxjbGlwUGF0aCBpZD0iYSI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNDciLz48L2NsaXBQYXRoPgogIDxjaXJjbGUgZmlsbD0iI2YwZjBmMCIgY3g9IjYwIiBjeT0iNjAiIHI9IjUwIi8+CiAgPHJlY3QgZmlsbD0iIzFjMWMxZSIgY2xpcC1wYXRoPSJ1cmwoI2EpIiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiLz4KICA8cmVjdCBmaWxsPSIjZjBmMGYwIiBjbGlwLXBhdGg9InVybCgjYSkiIHg9IjEwIiB5PSI0MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI0MCIvPgogIDxyZWN0IGZpbGw9IiNmZmIwMDMiIGNsaXAtcGF0aD0idXJsKCNhKSIgeD0iMTAiIHk9IjgwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIi8+CgogIDxnIHRyYW5zZm9ybT0icm90YXRlKDQ1IDYwIDYwKSI+CiAgICAgIDxnPgogICAgICAgICAgPHBhdGggCiAgICAgICAgICAgICAgZD0iTTU3LDE1IAogICAgICAgICAgICAgICBMNjMsMTUgCiAgICAgICAgICAgICAgIEw2MywzMCAKICAgICAgICAgICAgICAgUTYxLDMxIDU5LDMwIAogICAgICAgICAgICAgICBMNTcsMzAgWiIgCiAgICAgICAgICAgICAgZmlsbD0idXJsKCNtZXRhbFRleHR1cmUpIiAKICAgICAgICAgICAgICBzdHJva2U9IiMwMDAiIAogICAgICAgICAgICAgIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgICAgICAgICAKICAgICAgICAgIDxwYXRoIAogICAgICAgICAgICAgIGQ9Ik01Ni41LDE1LjUgTDU3LjUsMTUuNSBMNTcuNSwyOS41IEw1Ni41LDI5LjUgWiIgCiAgICAgICAgICAgICAgZmlsbD0iIzExMSIvPgogICAgICAgICAgPHBhdGggCiAgICAgICAgICAgICAgZD0iTTYzLjUsMTUuNSBMNjIuNSwxNS41IEw2Mi41LDI5LjUgTDYzLjUsMjkuNSBaIiAKICAgICAgICAgICAgICBmaWxsPSIjMTExIi8+CiAgICAgICAgICAKICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwIDIyKSI+CiAgICAgICAgICAgICAgPGNpcmNsZSAKICAgICAgICAgICAgICAgICAgY3g9IjAiIAogICAgICAgICAgICAgICAgICBjeT0iLTIiIAogICAgICAgICAgICAgICAgICByPSIxLjUiIAogICAgICAgICAgICAgICAgICBmaWxsPSIjMjIyIiAKICAgICAgICAgICAgICAgICAgc3Ryb2tlPSIjMDAwIiAKICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPSIwLjMiLz4KICAgICAgICAgICAgICAKICAgICAgICAgICAgICA8Y2lyY2xlIAogICAgICAgICAgICAgICAgICBjeD0iLTIiIAogICAgICAgICAgICAgICAgICBjeT0iMCIgCiAgICAgICAgICAgICAgICAgIHI9IjAuOCIgCiAgICAgICAgICAgICAgICAgIGZpbGw9IiMzMzMiLz4KICAgICAgICAgICAgICA8Y2lyY2xlIAogICAgICAgICAgICAgICAgICBjeD0iMiIgCiAgICAgICAgICAgICAgICAgIGN5PSIwIiAKICAgICAgICAgICAgICAgICAgcj0iMC44IiAKICAgICAgICAgICAgICAgICAgZmlsbD0iIzMzMyIvPgogICAgICAgICAgPC9nPgogICAgICAgICAgCiAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MCAzMikiPgogICAgICAgICAgICAgIDxyZWN0IAogICAgICAgICAgICAgICAgICB4PSItMy41IiAKICAgICAgICAgICAgICAgICAgeT0iMCIgCiAgICAgICAgICAgICAgICAgIHdpZHRoPSI3IiAKICAgICAgICAgICAgICAgICAgaGVpZ2h0PSIyIiAKICAgICAgICAgICAgICAgICAgZmlsbD0iIzFjMWMxYyIgCiAgICAgICAgICAgICAgICAgIHJ4PSIwLjUiIAogICAgICAgICAgICAgICAgICByeT0iMC41Ii8+CiAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgPGNpcmNsZSAKICAgICAgICAgICAgICAgICAgY3g9Ii0yIiAKICAgICAgICAgICAgICAgICAgY3k9IjEiIAogICAgICAgICAgICAgICAgICByPSIwLjUiIAogICAgICAgICAgICAgICAgICBmaWxsPSIjNDQ0Ii8+CiAgICAgICAgICAgICAgPGNpcmNsZSAKICAgICAgICAgICAgICAgICAgY3g9IjIiIAogICAgICAgICAgICAgICAgICBjeT0iMSIgCiAgICAgICAgICAgICAgICAgIHI9IjAuNSIgCiAgICAgICAgICAgICAgICAgIGZpbGw9IiM0NDQiLz4KICAgICAgICAgIDwvZz4KCiAgICAgICAgICA8Zz4KICAgICAgICAgICAgICA8cmVjdCAKICAgICAgICAgICAgICAgICAgeD0iNTkiIAogICAgICAgICAgICAgICAgICB5PSIxMyIgCiAgICAgICAgICAgICAgICAgIHdpZHRoPSIyIiAKICAgICAgICAgICAgICAgICAgaGVpZ2h0PSIxIiAKICAgICAgICAgICAgICAgICAgZmlsbD0iIzExMSIgCiAgICAgICAgICAgICAgICAgIHJ4PSIwLjMiIAogICAgICAgICAgICAgICAgICByeT0iMC4zIi8+CiAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgPHJlY3QgCiAgICAgICAgICAgICAgICAgIHg9IjU5IiAKICAgICAgICAgICAgICAgICAgeT0iMzQiIAogICAgICAgICAgICAgICAgICB3aWR0aD0iMiIgCiAgICAgICAgICAgICAgICAgIGhlaWdodD0iMSIgCiAgICAgICAgICAgICAgICAgIGZpbGw9IiMyMjIiIAogICAgICAgICAgICAgICAgICByeD0iMC4zIiAKICAgICAgICAgICAgICAgICAgcnk9IjAuMyIvPgogICAgICAgICAgPC9nPgogICAgICA8L2c+CgogICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDM1KSI+CiAgICAgICAgICA8cGF0aCAKICAgICAgICAgICAgICBkPSJNNTUsMCBMNjUsMCBMNjUsNjUgTDU1LDY1IFoiIAogICAgICAgICAgICAgIGZpbGw9InVybCgjbGlnaHRTYWJlckdyYWRpZW50KSIgCiAgICAgICAgICAgICAgZmlsdGVyPSJ1cmwoI2xpZ2h0c2FiZXJHbG93KSI+CiAgICAgICAgICAgICAgPGFuaW1hdGUgCiAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU9ImQiIAogICAgICAgICAgICAgICAgICB2YWx1ZXM9Ik01NSwwIEw2NSwwIEw2NSw2NSBMNTUsNjUgWjsKICAgICAgICAgICAgICAgICAgICAgICAgICBNNTMsMCBMNjcsMCBMNjcsNjUgTDUzLDY1IFo7CiAgICAgICAgICAgICAgICAgICAgICAgICAgTTU1LDAgTDY1LDAgTDY1LDY1IEw1NSw2NSBaIiAKICAgICAgICAgICAgICAgICAgZHVyPSIycyIgCiAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICAgICAgICA8L3BhdGg+CiAgICAgIDwvZz4KICA8L2c+CgogIDxjaXJjbGUgCiAgICAgIGN4PSI2MCIgCiAgICAgIGN5PSI2MCIgCiAgICAgIHI9IjU1IiAKICAgICAgZmlsbD0ibm9uZSIgCiAgICAgIHN0cm9rZT0iI2ZmMDAwMCIgCiAgICAgIHN0cm9rZS13aWR0aD0iNiIgCiAgICAgIHN0cm9rZS1kYXNoYXJyYXk9IjE1IDEwIj4KICAgICAgPGFuaW1hdGUgCiAgICAgICAgICBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgCiAgICAgICAgICB2YWx1ZXM9IjI1OzA7LTI1IiAKICAgICAgICAgIGR1cj0iMnMiIAogICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICA8L2NpcmNsZT4KPC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/529460/%5BLINUX%20DO%5D%20%F0%9F%9A%AB%20%E5%B1%8F%E8%94%BD%E5%90%AB%E6%9C%89%E6%8C%87%E5%AE%9A%EF%BC%9A%E7%B1%BB%E5%88%AB%E3%80%81%E6%A0%87%E7%AD%BE%E5%92%8C%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%20%E7%9A%84%E8%AF%9D%E9%A2%98%20%5B20250124%5D%20Fixing%200.user.js
// @updateURL https://update.greasyfork.org/scripts/529460/%5BLINUX%20DO%5D%20%F0%9F%9A%AB%20%E5%B1%8F%E8%94%BD%E5%90%AB%E6%9C%89%E6%8C%87%E5%AE%9A%EF%BC%9A%E7%B1%BB%E5%88%AB%E3%80%81%E6%A0%87%E7%AD%BE%E5%92%8C%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%20%E7%9A%84%E8%AF%9D%E9%A2%98%20%5B20250124%5D%20Fixing%200.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // ========== 默认数据区 ==========
    // ================================

    // 默认屏蔽的类别、标签和标题关键词列表
    let blockedTitles = [];
    let blockedCategories = [];
    let blockedTtags = [];

    // 正则表达式存储
    let titleRegexList = [];
    let categoryRegexList = [];
    let tagRegexList = [];

    // 常用正则表达式预设
    const regexPresets = {
        '1️⃣ 包含 [特定词]': '.*(word1|word2|word3).*',
        '2️⃣ 以 [特定词] 开头': '^(start1|start2|start3)',
        '3️⃣ 以 [特定词] 结尾': '(end1|end2|end3)'
    };

    // 新增 Safari 判断
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // ================================
    // ========== 软隐藏关键逻辑 ========
    // ================================

    function softHideElement(elem) {
        if (!elem) return;

        // 如果是表格行：
        if (elem.tagName === 'TR') {
            if (isSafari) {
                // Safari - 用绝对定位脱离文档流
                elem.style.visibility = 'hidden';
                elem.style.position = 'absolute';
                elem.style.left = '-9999px';
                elem.style.opacity = '0';
                elem.style.height = '0px';
                elem.style.overflow = 'hidden';
            } else {
                // 其他浏览器：使用 visibility: collapse
                elem.style.visibility = 'collapse';
                elem.style.height = '';
                elem.style.overflow = '';
                elem.style.opacity = '';
            }
        } else {
            // [MODIFIED] 非 <tr> 的软隐藏：统一采用绝对定位移除文档流，防止搜索结果页出现空白
            elem.style.visibility = 'hidden';
            elem.style.position = 'absolute';
            elem.style.left = '-9999px';
            elem.style.opacity = '0';
            elem.style.height = '0px';
            elem.style.overflow = 'hidden';
        }
    }

    function unhideElement(elem) {
        if (!elem) return;
        // 恢复样式
        if (elem.tagName === 'TR') {
            if (isSafari) {
                elem.style.visibility = '';
                elem.style.position = '';
                elem.style.left = '';
                elem.style.opacity = '';
                elem.style.height = '';
                elem.style.overflow = '';
            } else {
                elem.style.visibility = '';
            }
        } else {
            elem.style.visibility = '';
            elem.style.position = '';
            elem.style.left = '';
            elem.style.opacity = '';
            elem.style.height = '';
            elem.style.overflow = '';
        }
    }

    // ================================
    // ========== 辅助工具方法 =========
    // ================================

    function showNotification(message, type = 'success') {
        const notificationPanel = document.getElementById('notificationPanel');
        if (!notificationPanel) return;

        notificationPanel.textContent = message;
        notificationPanel.className = 'show';

        switch (type) {
            case 'success':
                notificationPanel.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notificationPanel.style.backgroundColor = '#dc3545';
                break;
            case 'info':
                notificationPanel.style.backgroundColor = '#17a2b8';
                break;
        }

        setTimeout(() => {
            notificationPanel.className = '';
        }, 3000);
    }

    function getUsernameFromUrl() {
        const urlRegex = /https:\/\/linux\.do\/u\/([^\/]+)/;
        const match = window.location.href.match(urlRegex);
        return match ? match[1] : null;
    }

    // ================================
    // ========== 设置相关方法 =========
    // ================================

    function loadSettings() {
        console.log('Loading settings...');
        blockedTitles = GM_getValue('blockedTitles', []);
        blockedCategories = GM_getValue('blockedCategories', []);
        blockedTtags = GM_getValue('blockedTtags', []);

        blockedTitles = Array.isArray(blockedTitles) ? blockedTitles : [];
        blockedCategories = Array.isArray(blockedCategories) ? blockedCategories : [];
        blockedTtags = Array.isArray(blockedTtags) ? blockedTtags : [];

        try {
            titleRegexList = GM_getValue('titleRegexList', []).map(pattern => new RegExp(pattern));
            categoryRegexList = GM_getValue('categoryRegexList', []).map(pattern => new RegExp(pattern));
            tagRegexList = GM_getValue('tagRegexList', []).map(pattern => new RegExp(pattern));
        } catch (error) {
            console.error('Error loading regex patterns:', error);
            titleRegexList = [];
            categoryRegexList = [];
            tagRegexList = [];
        }

        console.log('Loaded blocked titles:', blockedTitles);
        console.log('Loaded blocked categories:', blockedCategories);
        console.log('Loaded blocked ttags:', blockedTtags);
        console.log('Loaded title regex:', titleRegexList);
        console.log('Loaded category regex:', categoryRegexList);
        console.log('Loaded tag regex:', tagRegexList);
    }

    function saveRegexSettings(type) {
        const container = document.getElementById(`${type}RegexContainer`);
        if (!container) return;

        const patterns = Array.from(container.querySelectorAll('.regex-text'))
            .map(input => input.value)
            .filter(Boolean);

        try {
            const compiledRegexList = patterns.map(pattern => new RegExp(pattern));

            switch(type) {
                case 'title':
                    titleRegexList = compiledRegexList;
                    GM_setValue('titleRegexList', patterns);
                    break;
                case 'category':
                    categoryRegexList = compiledRegexList;
                    GM_setValue('categoryRegexList', patterns);
                    break;
                case 'tag':
                    tagRegexList = compiledRegexList;
                    GM_setValue('tagRegexList', patterns);
                    break;
            }

            resetAndReapplyFilter();
            showNotification('正则表达式设置已保存！', 'success');
        } catch (error) {
            console.error('保存正则表达式时发生错误:', error);
            showNotification('保存正则表达式时发生错误！', 'error');
        }
    }

    function saveTitleKeywords() {
        let hasChanges = false;
        let errorOccurred = false;

        try {
            const titlesElement = document.getElementById('titles');
            if (titlesElement) {
                let newBlockedTitles = titlesElement.value
                    .split(',')
                    .map(title => title.trim())
                    .filter(Boolean);

                if (JSON.stringify(newBlockedTitles) !== JSON.stringify(blockedTitles)) {
                    blockedTitles = newBlockedTitles;
                    GM_setValue('blockedTitles', blockedTitles);
                    hasChanges = true;
                }
            }

            const container = document.getElementById('titleRegexContainer');
            if (container) {
                const patterns = Array.from(container.querySelectorAll('.regex-text'))
                    .map(input => input.value)
                    .filter(Boolean);

                const currentPatterns = titleRegexList.map(r => r.source);
                if (JSON.stringify(patterns) !== JSON.stringify(currentPatterns)) {
                    titleRegexList = patterns.map(pattern => new RegExp(pattern));
                    GM_setValue('titleRegexList', patterns);
                    hasChanges = true;
                }
            }
        } catch (error) {
            console.error("保存标题关键词时发生错误:", error);
            errorOccurred = true;
        }

        if (errorOccurred) {
            showNotification('保存标题关键词时发生错误，请重试！', 'error');
        } else if (hasChanges) {
            loadSettings();
            resetAndReapplyFilter();
            showNotification('标题关键词已成功更新！', 'success');
        } else {
            showNotification('标题关键词无变化！', 'info');
        }
    }

    function saveCategories() {
        let hasChanges = false;
        let errorOccurred = false;

        try {
            const categoriesElement = document.getElementById('categories');
            if (categoriesElement) {
                let newBlockedCategories = categoriesElement.value
                    .split(',')
                    .map(category => category.trim())
                    .filter(Boolean);

                if (JSON.stringify(newBlockedCategories) !== JSON.stringify(blockedCategories)) {
                    blockedCategories = newBlockedCategories;
                    GM_setValue('blockedCategories', blockedCategories);
                    hasChanges = true;
                }
            }

            const container = document.getElementById('categoryRegexContainer');
            if (container) {
                const patterns = Array.from(container.querySelectorAll('.regex-text'))
                    .map(input => input.value)
                    .filter(Boolean);

                const currentPatterns = categoryRegexList.map(r => r.source);
                if (JSON.stringify(patterns) !== JSON.stringify(currentPatterns)) {
                    categoryRegexList = patterns.map(pattern => new RegExp(pattern));
                    GM_setValue('categoryRegexList', patterns);
                    hasChanges = true;
                }
            }
        } catch (error) {
            console.error("保存类别时发生错误:", error);
            errorOccurred = true;
        }

        if (errorOccurred) {
            showNotification('保存类别时发生错误，请重试！', 'error');
        } else if (hasChanges) {
            loadSettings();
            resetAndReapplyFilter();
            showNotification('类别已成功更新！', 'success');
        } else {
            showNotification('类别无变化！', 'info');
        }
    }

    function saveTtags() {
        let hasChanges = false;
        let errorOccurred = false;

        try {
            const tagsElement = document.getElementById('ttags');
            if (tagsElement) {
                let newBlockedTtags = tagsElement.value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(Boolean);

                if (JSON.stringify(newBlockedTtags) !== JSON.stringify(blockedTtags)) {
                    blockedTtags = newBlockedTtags;
                    GM_setValue('blockedTtags', blockedTtags);
                    hasChanges = true;
                }
            }

            const container = document.getElementById('tagRegexContainer');
            if (container) {
                const patterns = Array.from(container.querySelectorAll('.regex-text'))
                    .map(input => input.value)
                    .filter(Boolean);

                const currentPatterns = tagRegexList.map(r => r.source);
                if (JSON.stringify(patterns) !== JSON.stringify(currentPatterns)) {
                    tagRegexList = patterns.map(pattern => new RegExp(pattern));
                    GM_setValue('tagRegexList', patterns);
                    hasChanges = true;
                }
            }
        } catch (error) {
            console.error("保存标签时发生错误:", error);
            errorOccurred = true;
        }

        if (errorOccurred) {
            showNotification('保存标签时发生错误，请重试！', 'error');
        } else if (hasChanges) {
            loadSettings();
            resetAndReapplyFilter();
            showNotification('标签已成功更新！', 'success');
        } else {
            showNotification('标签无变化！', 'info');
        }
    }

    // ================================
    // ========== 导入/导出相关 =========
    // ================================

    function exportSettings() {
        const settings = {
            blockedTitles: GM_getValue('blockedTitles', []),
            blockedCategories: GM_getValue('blockedCategories', []),
            blockedTtags: GM_getValue('blockedTtags', []),
            titleRegexList: GM_getValue('titleRegexList', []),
            categoryRegexList: GM_getValue('categoryRegexList', []),
            tagRegexList: GM_getValue('tagRegexList', [])
        };

        const blob = new Blob([JSON.stringify(settings, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linux_do_content_filter_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('设置已成功导出！', 'success');
    }

    function importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                GM_setValue('blockedTitles', settings.blockedTitles || []);
                GM_setValue('blockedCategories', settings.blockedCategories || []);
                GM_setValue('blockedTtags', settings.blockedTtags || []);
                GM_setValue('titleRegexList', settings.titleRegexList || []);
                GM_setValue('categoryRegexList', settings.categoryRegexList || []);
                GM_setValue('tagRegexList', settings.tagRegexList || []);

                loadSettings();
                resetAndReapplyFilter();
                showNotification('设置已成功导入！', 'success');

                const dialog = document.getElementById('settingsDialog');
                if (dialog) {
                    document.getElementById('titles').value = blockedTitles.join(', ');
                    document.getElementById('categories').value = blockedCategories.join(', ');
                    document.getElementById('ttags').value = blockedTtags.join(', ');
                    initRegexInputs('title');
                    initRegexInputs('category');
                    initRegexInputs('tag');
                }
            } catch (error) {
                console.error('导入设置时发生错误:', error);
                showNotification('导入设置失败，请检查文件格式！', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ================================
    // ========== 导入功能相关 ==========
    // ================================

    function importTitleKeywords() {
        const sidebarSection = document.querySelector('li[data-list-item-name="标题关键词"]');
        if (!sidebarSection) {
            showNotification('未找到标题关键词侧边栏。请确保侧边栏已展开并包含"标题关键词"部分！', 'error');
            return;
        }

        const linkElement = sidebarSection.querySelector('a');
        if (!linkElement) {
            showNotification('在侧边栏中未找到标题关键词链接！', 'error');
            return;
        }

        const hrefValue = linkElement.getAttribute('href');
        if (!hrefValue) {
            showNotification('标题关键词链接为空！', 'error');
            return;
        }

        const newKeywords = hrefValue.split(',').map(keyword => keyword.trim()).filter(Boolean);
        const updatedKeywords = [...new Set([...blockedTitles, ...newKeywords])];

        if (JSON.stringify(updatedKeywords) !== JSON.stringify(blockedTitles)) {
            GM_setValue('blockedTitles', updatedKeywords);
            blockedTitles = updatedKeywords;
            resetAndReapplyFilter();
            showNotification(`成功导入 ${newKeywords.length} 个新的标题关键词！`, 'success');
            setTimeout(() => {
                closeDialog();
                showSettingsDialog();
                showNotification('设置弹窗已自动刷新！', 'success');
            }, 1000);
        } else {
            showNotification('标题关键词已是最新！', 'info');
        }
    }

    function importCategoriesFromPage() {
        if (!importCheck()) return;

        let hasChanges = false;
        const mutedCategories = document.querySelector('.tracking-controls__muted-categories .select-kit.multi-select.category-selector.has-selection');

        if (mutedCategories) {
            const newCategories = mutedCategories.querySelector('summary').dataset.name
                .split(',')
                .map(category => category.trim())
                .filter(Boolean);

            const updatedCategories = [...new Set([...blockedCategories, ...newCategories])];
            if (JSON.stringify(updatedCategories) !== JSON.stringify(blockedCategories)) {
                blockedCategories = updatedCategories;
                GM_setValue('blockedCategories', blockedCategories);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            resetAndReapplyFilter();
            showNotification('成功导入类别！', 'success');
            setTimeout(() => {
                closeDialog();
                showSettingsDialog();
                showNotification('设置弹窗已自动刷新！', 'success');
            }, 1000);
        } else {
            showNotification('类别已是最新！', 'info');
        }
    }

    function importTagsFromPage() {
        if (!importCheck()) return;

        let hasChanges = false;
        const mutedTtags = document.querySelector('.tracking-controls__muted-tags .select-kit-header');

        if (mutedTtags) {
            const newTtags = mutedTtags.dataset.name
                .replace(/^"|"$/g, '')
                .split(',')
                .map(tag => tag.trim().replace(/^"|"$/g, ''))
                .filter(Boolean);

            const updatedTtags = [...new Set([...blockedTtags, ...newTtags])];
            if (JSON.stringify(updatedTtags) !== JSON.stringify(blockedTtags)) {
                blockedTtags = updatedTtags;
                GM_setValue('blockedTtags', blockedTtags);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            resetAndReapplyFilter();
            showNotification('成功导入标签！', 'success');
            setTimeout(() => {
                closeDialog();
                showSettingsDialog();
                showNotification('设置弹窗已自动刷新！', 'success');
            }, 1000);
        } else {
            showNotification('标签已是最新！', 'info');
        }
    }

    function importCheck() {
        const currentUrl = window.location.href;
        const settingsUrlRegex = /https:\/\/linux\.do\/u\/([^\/]+)\/preferences\/tracking/;
        const match = currentUrl.match(settingsUrlRegex);

        if (match) {
            const settingsPage = document.querySelector('.user-preferences__tracking-categories-tags-wrapper');
            if (!settingsPage) {
                showNotification('无法找到设置内容，请确保您在正确的[⚙️偏好设置][⚙️跟踪]页！', 'error');
                return false;
            }
            return true;
        } else {
            const username = getUsernameFromUrl();
            if (username) {
                if (confirm('跳转至[⚙️偏好设置->跟踪]页？')) {
                    window.location.href = `https://linux.do/u/${username}/preferences/tracking`;
                }
            } else {
                showNotification('请先前往[⚙️偏好设置]页！', 'error');
            }
            return false;
        }
    }

    // ================================
    // ========== 过滤逻辑核心 =========
    // ================================

    function shouldBlockTitle(title) {
        if (!title) return false;
        const lowerTitle = title.toLowerCase();
        return blockedTitles.some(keyword => lowerTitle.includes(keyword.toLowerCase())) ||
               titleRegexList.some(regex => regex && regex.test(title));
    }

    function shouldBlockCategory(category) {
        if (!category) return false;
        return blockedCategories.includes(category) ||
               categoryRegexList.some(regex => regex && regex.test(category));
    }

    function shouldBlockTag(tag) {
        if (!tag) return false;
        return blockedTtags.includes(tag) ||
               tagRegexList.some(regex => regex && regex.test(tag));
    }

    function filterPosts() {
        const rows = document.querySelectorAll('tr.topic-list-item');
        rows.forEach(row => {
            unhideElement(row);

            const categoryElement = row.querySelector('div.link-bottom-line a.badge-category__wrapper span.badge-category__name');
            const tagElement = row.querySelector('div.link-bottom-line .discourse-tags');
            const titleElement = row.querySelector('a.title');

            if (shouldHideElement(categoryElement, tagElement, titleElement)) {
                softHideElement(row);
            }
        });
    }

    function filterSearchResults() {
        const results = document.querySelectorAll('.fps-result');
        results.forEach(result => {
            unhideElement(result);

            const categoryElement = result.querySelector('.search-category .badge-category__name');
            const tagElement = result.querySelector('.discourse-tags');
            const titleElement = result.querySelector('.topic-title');

            if (shouldHideElement(categoryElement, tagElement, titleElement)) {
                softHideElement(result);
            }
        });
    }

    function shouldHideElement(categoryElement, tagElement, titleElement) {
        if (categoryElement && shouldBlockCategory(categoryElement.textContent.trim())) {
            return true;
        }
        if (tagElement) {
            const tags = Array.from(tagElement.querySelectorAll('a'))
                .map(t => t.textContent.trim());
            if (tags.some(t => shouldBlockTag(t))) {
                return true;
            }
        }
        if (titleElement && shouldBlockTitle(titleElement.textContent)) {
            return true;
        }
        return false;
    }

    function filterContent() {
        if (window.location.pathname.includes('/search')) {
            filterSearchResults();
        } else {
            filterPosts();
        }
    }

    function resetAndReapplyFilter() {
        document.querySelectorAll('tr.topic-list-item').forEach(row => {
            unhideElement(row);
        });
        document.querySelectorAll('.fps-result').forEach(result => {
            unhideElement(result);
        });
        filterContent();
    }

    // ================================
    // ========== UI & 事件部分 ========
    // ================================

    function showSettingsDialog() {
        loadSettings();
        const overlay = document.createElement('div');
        overlay.id = 'settingsOverlay';
        document.body.appendChild(overlay);

        const dialog = document.createElement('div');
        dialog.id = 'settingsDialog';
        dialog.innerHTML = `
            <h2>⚙️ 屏蔽设置</h2>
            <button id="closeDialog">&times;</button>
            <div class="settings-tabs">
                <div class="settings-tab active" data-tab="titles">标题关键词</div>
                <div class="settings-tab" data-tab="categories">类别</div>
                <div class="settings-tab" data-tab="ttags">标签</div>
                <div class="settings-tab" data-tab="other">...</div>
                <div class="settings-tab" data-tab="importExport">同步</div>
            </div>
            <div class="settings-content active" data-content="titles">
                <div class="settings-subtabs">
                    <div class="settings-subtab active" data-subtab="view-titles">查看</div>
                    <div class="settings-subtab" data-subtab="import-titles">导入</div>
                    <div class="settings-subtab" data-subtab="regex-titles">高级自定义</div>
                </div>
                <div class="settings-subcontent active" data-subcontent="view-titles">
                    <label for="titles">🚫 屏蔽的标题关键词（逗号分隔）：</label>
                    <textarea id="titles">${blockedTitles.join(', ')}</textarea>
                    <button id="saveTitleKeywords" class="actionButton saveButton">保存设置</button>
                </div>
                <div class="settings-subcontent" data-subcontent="import-titles">
                    <label>⤵️ 从侧边栏导入标题关键词：</label>
                    <p>此操作会将侧边栏中的<br>"标题关键词"对应的链接内容,<br>添加到现有列表中！</p>
                    <p>请先在侧边栏中，<br>自定义一个名为"标题关键词"的链接<br>链接的内容，就填你想屏蔽的标题关键词（逗号分隔）<br>例如：音乐, vpn</p>
                    <p>导入时，请确保：<br>侧边栏中的"标题关键词"部分已展开。</p>
                    <button id="importTitleKeywords" class="actionButton">导入关键词</button>
                </div>
                <div class="settings-subcontent" data-subcontent="regex-titles">
                    <label>🔍 标题关键词过滤规则:</label>
                    <div id="titleRegexContainer"></div>
                    <button id="addTitleRegex" class="actionButton">新增规则</button>
                    <div class="regex-help">
                        <p>正则表达式使用说明：</p>
                        <ul>
                            <li>使用 <code>^</code> 匹配行首，<code>$</code> 匹配行尾</li>
                            <li>使用 <code>.</code> 匹配任意字符，<code>*</code> 表示零次或多次匹配</li>
                            <li>使用 <code>[]</code> 匹配字符集，如 <code>[a-z]</code> 匹配小写字母</li>
                            <li>使用 <code>\\b</code> 匹配单词边界</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="settings-content" data-content="categories">
                <div class="settings-subtabs">
                    <div class="settings-subtab active" data-subtab="view-categories">查看</div>
                    <div class="settings-subtab" data-subtab="import-categories">导入</div>
                    <div class="settings-subtab" data-subtab="regex-categories">高级自定义</div>
                </div>
                <div class="settings-subcontent active" data-subcontent="view-categories">
                    <label for="categories">🚫 屏蔽的类别（逗号分隔）：</label>
                    <textarea id="categories">${blockedCategories.join(', ')}</textarea>
                    <button id="saveCategories" class="actionButton saveButton">保存设置</button>
                </div>
                <div class="settings-subcontent" data-subcontent="import-categories">
                    <label>⤵️ 通过论坛账号导入类别：</label>
                    <p>此操作会将导入的类别添加到现有列表中！</p>
                    <p>使用论坛账号来同步！[偏好设置->跟踪]</p>
                    <button id="importCategories" class="actionButton">导入类别</button>
                </div>
                <div class="settings-subcontent" data-subcontent="regex-categories">
                    <label>🔍 类别过滤规则:</label>
                    <div id="categoryRegexContainer"></div>
                    <button id="addCategoryRegex" class="actionButton">新增规则</button>
                    <div class="regex-help">
                        <p>正则表达式使用说明：</p>
                        <ul>
                            <li>使用 <code>^</code> 匹配行首，<code>$</code> 匹配行尾</li>
                            <li>使用 <code>.</code> 匹配任意字符，<code>*</code> 表示零次或多次匹配</li>
                            <li>使用 <code>[]</code> 匹配字符集，如 <code>[a-z]</code> 匹配小写字母</li>
                            <li>使用 <code>\\b</code> 匹配单词边界</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="settings-content" data-content="ttags">
                <div class="settings-subtabs">
                    <div class="settings-subtab active" data-subtab="view-ttags">查看</div>
                    <div class="settings-subtab" data-subtab="import-ttags">导入</div>
                    <div class="settings-subtab" data-subtab="regex-ttags">高级自定义</div>
                </div>
                <div class="settings-subcontent active" data-subcontent="view-ttags">
                    <label for="ttags">🚫 屏蔽的标签（逗号分隔）：</label>
                    <textarea id="ttags">${blockedTtags.join(', ')}</textarea>
                    <button id="saveTtags" class="actionButton saveButton">保存设置</button>
                </div>
                <div class="settings-subcontent" data-subcontent="import-ttags">
                    <label>⤵️ 通过论坛账号导入标签：</label>
                    <p>此操作会将导入的标签添加到现有列表中！</p>
                    <p>使用论坛账号来同步！[偏好设置->跟踪]</p>
                    <button id="importTtags" class="actionButton">导入标签</button>
                </div>
                <div class="settings-subcontent" data-subcontent="regex-ttags">
                    <label>🔍 标签过滤规则:</label>
                    <div id="tagRegexContainer"></div>
                    <button id="addTagRegex" class="actionButton">新增规则</button>
                    <div class="regex-help">
                        <p>正则表达式使用说明：</p>
                        <ul>
                            <li>使用 <code>^</code> 匹配行首，<code>$</code> 匹配行尾</li>
                            <li>使用 <code>.</code> 匹配任意字符，<code>*</code> 表示零次或多次匹配</li>
                            <li>使用 <code>[]</code> 匹配字符集，如 <code>[a-z]</code> 匹配小写字母</li>
                            <li>使用 <code>\\b</code> 匹配单词边界</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="settings-content" data-content="other">
                <div class="settings-subtabs">
                    <div class="settings-subtab active" data-subtab="view-other">查看</div>
                    <div class="settings-subtab" data-subtab="import-other">导入</div>
                </div>
                <div class="settings-subcontent active" data-subcontent="view-other">
                    <label>🚫 屏蔽的...</label>
                    <textarea>还想屏蔽啥？👀</textarea>
                    <button id="saveOther" class="actionButton saveButton">假的保存设置</button>
                </div>
                <div class="settings-subcontent" data-subcontent="import-other">
                    <label>⤵️ 从...导入...：</label>
                    <p>此操作会将...的...添加到现有列表中！</p>
                    <p>请确保...</p>
                    <button id="importOther" class="actionButton">假的导入标签</button>
                </div>
            </div>
            <div class="settings-content" data-content="importExport">
                <div class="settings-subtabs">
                    <div class="settings-subtab active" data-subtab="export">导出</div>
                    <div class="settings-subtab" data-subtab="import">导入</div>
                </div>
                <div class="settings-subcontent active" data-subcontent="export">
                    <label>📤 导出脚本配置：</label>
                    <p>选择一个文件夹，存放当前脚本的配置。</p>
                    <button id="exportSettings" class="actionButton saveButton">导出脚本配置</button>
                </div>
                <div class="settings-subcontent" data-subcontent="import">
                    <label>📥 导入脚本配置：</label>
                    <p>选择一个(之前导出的)脚本配置文件，进行导入。</p>
                    <input type="file" id="importSettingsFile" accept=".json" style="display: none;">
                    <button id="importSettings" class="actionButton">导入脚本配置</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        overlay.style.display = 'block';

        console.log('Displaying blocked categories:', blockedCategories);
        console.log('Displaying blocked tags:', blockedTtags);

        const notificationPanel = document.createElement('div');
        notificationPanel.id = 'notificationPanel';
        document.body.appendChild(notificationPanel);

        document.getElementById('saveTitleKeywords').addEventListener('click', saveTitleKeywords);
        document.getElementById('saveCategories').addEventListener('click', saveCategories);
        document.getElementById('saveTtags').addEventListener('click', saveTtags);

        document.getElementById('importTitleKeywords').addEventListener('click', importTitleKeywords);
        document.getElementById('importCategories').addEventListener('click', importCategoriesFromPage);
        document.getElementById('importTtags').addEventListener('click', importTagsFromPage);

        document.getElementById('closeDialog').addEventListener('click', closeDialog);

        document.getElementById('exportSettings').addEventListener('click', exportSettings);
        document.getElementById('importSettings').addEventListener('click', () => document.getElementById('importSettingsFile').click());
        document.getElementById('importSettingsFile').addEventListener('change', importSettings);

        initTabSwitching();
        initSubtabSwitching();
        initRegexInputs('title');
        initRegexInputs('category');
        initRegexInputs('tag');

        document.getElementById('addTitleRegex').addEventListener('click', () => addRegexInput('title'));
        document.getElementById('addCategoryRegex').addEventListener('click', () => addRegexInput('category'));
        document.getElementById('addTagRegex').addEventListener('click', () => addRegexInput('tag'));
    }

    function closeDialog() {
        const dialog = document.getElementById('settingsDialog');
        const overlay = document.getElementById('settingsOverlay');
        const notificationPanel = document.getElementById('notificationPanel');

        if (dialog) dialog.remove();
        if (overlay) overlay.remove();
        if (notificationPanel) notificationPanel.remove();
    }

    function initTabSwitching() {
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const contents = document.querySelectorAll('.settings-content');
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.content === tab.dataset.tab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    function initSubtabSwitching() {
        const subtabs = document.querySelectorAll('.settings-subtab');
        subtabs.forEach(subtab => {
            subtab.addEventListener('click', () => {
                const parentContent = subtab.closest('.settings-content');
                const siblingSubtabs = parentContent.querySelectorAll('.settings-subtab');
                siblingSubtabs.forEach(t => t.classList.remove('active'));
                subtab.classList.add('active');
                const subcontents = parentContent.querySelectorAll('.settings-subcontent');
                subcontents.forEach(sc => {
                    sc.classList.remove('active');
                    if (sc.dataset.subcontent === subtab.dataset.subtab) {
                        sc.classList.add('active');
                    }
                });
            });
        });
    }

    function initRegexInputs(type) {
        const container = document.getElementById(`${type}RegexContainer`);
        const regexList = type === 'title' ? titleRegexList :
                          (type === 'category' ? categoryRegexList : tagRegexList);

        if (!container) return;
        container.innerHTML = '';
        regexList.forEach(regex => {
            if (regex) {
                addRegexInput(type, regex.source);
            }
        });
    }

    function addRegexInput(type, value = '') {
        const container = document.getElementById(`${type}RegexContainer`);
        if (!container) return;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'regex-input';
        inputGroup.innerHTML = `
            <input type="text"
                   class="regex-text"
                   value="${value}"
                   placeholder="输入正则表达式"
                   aria-label="输入正则表达式">
            <select class="regex-preset" aria-label="过滤规则模版">
                <option value="">🔧 过滤规则模版：</option>
                ${Object.entries(regexPresets)
                    .map(([name, pattern]) =>
                        `<option value="${pattern}">${name}</option>`)
                    .join('')}
            </select>
            <button class="delete-btn" aria-label="删除">删除</button>
        `;
        setupRegexInputEvents(inputGroup, type);
        container.appendChild(inputGroup);

        setTimeout(() => {
            inputGroup.style.opacity = '1';
            inputGroup.style.transform = 'translateX(0)';
        }, 10);
    }

    function setupRegexInputEvents(inputGroup, type) {
        const textInput = inputGroup.querySelector('.regex-text');
        const presetSelect = inputGroup.querySelector('.regex-preset');
        const deleteBtn = inputGroup.querySelector('.delete-btn');

        presetSelect.addEventListener('change', () => {
            textInput.value = presetSelect.value;
            validateAndSaveRegex(textInput, type);
        });

        textInput.addEventListener('input', () => {
            validateAndSaveRegex(textInput, type);
        });

        deleteBtn.addEventListener('click', () => {
            inputGroup.style.opacity = '0';
            inputGroup.style.transform = 'translateX(20px)';
            setTimeout(() => {
                inputGroup.remove();
                saveRegexSettings(type);
            }, 300);
        });
    }

    function validateAndSaveRegex(input, type) {
        removeRegexError(input);
        try {
            if (input.value) {
                new RegExp(input.value);
                input.style.borderColor = '#28a745';
                saveRegexSettings(type);
            } else {
                input.style.borderColor = '#ddd';
            }
        } catch (e) {
            showRegexError(input, '无效的正则表达式');
            input.style.borderColor = '#dc3545';
        }
    }

    function showRegexError(input, message) {
        removeRegexError(input);
        const error = document.createElement('div');
        error.className = 'regex-error';
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    function removeRegexError(input) {
        const errorElement = input.parentElement.querySelector('.regex-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // ================================
    // ========== 优化：统一观察 =========
    // ================================
    let debounceTimer = null;
    function debounceFilter() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            filterContent();
        }, 100);
    }

    function observeDomChanges() {
        const mainContainer = document.querySelector('#main-outlet') || document.body;
        if (!mainContainer) return;

        const observer = new MutationObserver((mutations) => {
            let foundSignificantChange = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    foundSignificantChange = true;
                    break;
                }
            }
            if (foundSignificantChange) {
                debounceFilter();
            }
        });

        observer.observe(mainContainer, {
            childList: true,
            subtree: true
        });
    }

    // ================================
    // ========== 核心初始化 ===========
    // ================================
    function init() {
        loadSettings();
        // 立即尝试过滤一次（可能当前已有页面内容）
        filterContent();
        // 监听 DOM 变动，以后若有新内容出现，马上过滤
        observeDomChanges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 注：以下 popstate/pageshow 在 SPA 下往往不稳定，仅作fallback
    window.addEventListener('popstate', () => {
        console.log('popstate event triggered, re-initializing...');
        init();
    });
    window.addEventListener('pageshow', () => {
        console.log('pageshow event triggered, re-initializing...');
        init();
    });

    // 注册菜单命令，打开设置弹窗
    GM_registerMenuCommand('⚙️ 屏蔽设置', showSettingsDialog);

    // 注入样式
    GM_addStyle(`
        #settingsOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }
        #settingsDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid rgba(137, 207, 240, 0.6);
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            min-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #333;
        }
        #settingsDialog h2 {
            margin: 0 0 20px 0;
            color: #007bff;
            font-size: 24px;
            text-align: center;
        }
        #settingsDialog textarea {
            width: 100%;
            height: 200px;
            overflow-y: auto;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            resize: vertical;
            background: white;
            color: #333;
        }
        #settingsDialog button {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: bold;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        #settingsDialog button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        .actionButton {
            background-color: #007bff;
            position: fixed;
            bottom: 10px;
            right: 40px;
            box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
        }
        .saveButton {
            background-color: #28a745;
        }
        #closeDialog {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            border: none;
            font-size: 24px;
            color: white;
            cursor: pointer;
            padding: 0;
            margin: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        .settings-tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }
        .settings-tab {
            padding: 10px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            font-size: 16px;
            font-weight: bold;
            color: #495057;
        }
        .settings-tab:hover {
            color: #007bff;
        }
        .settings-tab.active {
            color: #007bff;
            border-bottom-color: #007bff;
        }
        .settings-subtabs {
            display: flex;
            justify-content: flex-start;
        }
        .settings-subtab {
            padding: 6px 12px;
            cursor: pointer;
            border: 1px solid #dee2e6;
            border-radius: 15px;
            transition: all 0.3s ease;
            font-size: 14px;
            margin-right: 10px;
            background-color: #f8f9fa;
        }
        .settings-subtab:hover {
            background-color: #e9ecef;
        }
        .settings-subtab.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }
        .settings-content,
        .settings-subcontent {
            display: none;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .settings-content.active,
        .settings-subcontent.active {
            display: block;
        }
        .settings-content label,
        .settings-subcontent label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
            color: #495057;
        }
        .regex-input {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding: 12px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
        }
        .regex-input:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        .regex-input input[type="text"] {
            flex: 1;
            height: 36px;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        .regex-input input[type="text"]:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
            outline: none;
        }
        .regex-input select {
            width: auto;
            min-width: 130px;
            height: 36px;
            padding: 0 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            background-color: white;
            cursor: pointer;
        }
        .regex-input .delete-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            background-color: #dc3545;
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .regex-input .delete-btn:hover {
            background-color: #c82333;
            transform: translateY(-1px);
        }
        .regex-error {
            color: #dc3545;
            font-size: 12px;
            margin-top: 4px;
        }
        .regex-help {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        #notificationPanel {
            position: fixed;
            bottom: 15%;
            left: 45%;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        #notificationPanel.show {
            opacity: 1;
            transform: translateY(0);
        }
        @media (prefers-color-scheme: dark) {
            #settingsDialog {
                background: #2c2c2c;
                color: #e0e0e0;
                border-color: rgba(77, 166, 255, 0.6);
            }
            #settingsDialog h2 {
                color: #4da6ff;
            }
            #settingsDialog textarea,
            #settingsDialog input[type="text"] {
                background: #3a3a3a;
                color: #e0e0e0;
                border-color: #555;
            }
            #closeDialog {
                color: black;
            }
            .settings-tab {
                color: #bbb;
            }
            .settings-tab:hover {
                color: #4da6ff;
            }
            .settings-tab.active {
                color: #4da6ff;
                border-bottom-color: #4da6ff;
            }
            .settings-subtab {
                background-color: #3a3a3a;
                border-color: #555;
                color: #e0e0e0;
            }
            .settings-subtab:hover {
                background-color: #4a4a4a;
            }
            .settings-subtab.active {
                background-color: #4da6ff;
                color: #2c2c2c;
            }
            .settings-content,
            .settings-subcontent {
                background-color: #3a3a3a;
            }
            .settings-content label,
            .settings-subcontent label {
                color: #bbb;
            }
            .regex-help {
                color: #aaa;
            }
            .regex-input {
                background: rgba(255, 255, 255, 0.05);
            }
            .regex-input:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            .regex-input input[type="text"],
            .regex-input select {
                background-color: #3a3a3a;
                border-color: #555;
                color: #e0e0e0;
            }
            .regex-input select option {
                background-color: #2c2c2c;
                color: #e0e0e0;
            }
        }
    `);

})();