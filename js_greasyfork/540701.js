// ==UserScript==
// @name         Twitter/X 搜索日期快捷按钮
// @namespace    http://tampermonkey.net/
// @version      2025-06-25
// @description  在 Twitter/X 搜索框下方添加日期筛选快捷按钮
// @author       Kai(kai@thekaiway.com)
// @license      MIT
// @match        https://x.com/explore
// @match        https://x.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540701/TwitterX%20%E6%90%9C%E7%B4%A2%E6%97%A5%E6%9C%9F%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/540701/TwitterX%20%E6%90%9C%E7%B4%A2%E6%97%A5%E6%9C%9F%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试开关
    const DEBUG = false;
    const log = (...args) => DEBUG && console.log(...args);

    log('[日期快捷按钮] 脚本已加载');

    // 获取格式化日期
    function getFormattedDate(daysAgo = 0) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    }

    // 获取上周的起止日期
    function getLastWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - dayOfWeek - 7);
        const lastSaturday = new Date(lastSunday);
        lastSaturday.setDate(lastSunday.getDate() + 6);
        return {
            since: lastSunday.toISOString().split('T')[0],
            until: lastSaturday.toISOString().split('T')[0]
        };
    }

    // 获取上个月的起止日期
    function getLastMonthDates() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
            since: firstDay.toISOString().split('T')[0],
            until: lastDay.toISOString().split('T')[0]
        };
    }

    // 获取去年的起止日期
    function getLastYearDates() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear() - 1, 0, 1);
        const lastDay = new Date(today.getFullYear() - 1, 11, 31);
        return {
            since: firstDay.toISOString().split('T')[0],
            until: lastDay.toISOString().split('T')[0]
        };
    }

    // 创建快捷按钮容器
    function createShortcutButtons() {
        log('[日期快捷按钮] 创建按钮容器');

        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px 16px;
            border-bottom: 1px solid rgb(239, 243, 244);
            background: white;
        `;
        container.id = 'date-shortcuts-container';

        // 按钮配置
        const buttons = [
            { text: '今天', days: 0 },
            { text: '7天内', days: 7 },
            { text: '30天内', days: 30 },
            { text: '上周', type: 'lastWeek' },
            { text: '上个月', type: 'lastMonth' },
            { text: '去年', type: 'lastYear' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 6px 12px;
                border-radius: 9999px;
                border: 1px solid rgb(207, 217, 222);
                background: white;
                color: rgb(15, 20, 25);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            `;

            // 悬停效果
            button.onmouseover = () => {
                button.style.background = 'rgb(247, 249, 249)';
            };
            button.onmouseout = () => {
                button.style.background = 'white';
            };

            // 点击事件
            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const searchInput = document.querySelector('[data-testid="SearchBox_Search_Input"]');
                if (!searchInput) {
                    log('[日期快捷按钮] 未找到搜索输入框');
                    return;
                }

                const currentValue = searchInput.value.trim();
                log(`[日期快捷按钮] 输入框当前值: "${currentValue}"`);

                // 移除已有的 since: 和 until: 参数
                let cleanedValue = currentValue.replace(/\s*since:\S+/g, '').replace(/\s*until:\S+/g, '').trim();

                let newQuery;
                if (btn.days !== undefined) {
                    // 原有的按钮逻辑（只有 since）
                    const dateStr = getFormattedDate(btn.days);
                    newQuery = cleanedValue + ` since:${dateStr}`;
                } else if (btn.type) {
                    // 新按钮逻辑（有 since 和 until）
                    let dates;
                    switch (btn.type) {
                        case 'lastWeek':
                            dates = getLastWeekDates();
                            break;
                        case 'lastMonth':
                            dates = getLastMonthDates();
                            break;
                        case 'lastYear':
                            dates = getLastYearDates();
                            break;
                    }
                    newQuery = cleanedValue + ` since:${dates.since} until:${dates.until}`;
                }

                // 更新 URL 参数
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set('q', newQuery.trim());

                // 构建新 URL
                const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

                log(`[日期快捷按钮] 导航到: ${newUrl}`);

                // 导航到新 URL
                window.location.href = newUrl;
            };

            container.appendChild(button);
        });

        return container;
    }

    // 插入快捷按钮到 dropdown
    function insertShortcuts() {
        // 查找 dropdown
        const dropdown = document.querySelector('[id^="typeaheadDropdown"]');
        if (!dropdown) {
            log('[日期快捷按钮] 未找到 dropdown');
            return;
        }

        // 检查是否已插入
        if (dropdown.querySelector('#date-shortcuts-container')) {
            log('[日期快捷按钮] 快捷按钮已存在');
            return;
        }

        log('[日期快捷按钮] 找到 dropdown，准备插入按钮');

        // 创建并插入按钮容器到顶部
        const shortcuts = createShortcutButtons();
        dropdown.prepend(shortcuts);

        log('[日期快捷按钮] 按钮插入成功');
    }

    // 监听搜索框点击
    function setupSearchBoxListener() {
        const searchInput = document.querySelector('[data-testid="SearchBox_Search_Input"]');
        if (!searchInput) {
            log('[日期快捷按钮] 未找到搜索框，稍后重试');
            setTimeout(setupSearchBoxListener, 1000);
            return;
        }

        log('[日期快捷按钮] 找到搜索框，添加监听器');

        // 移除旧的监听器（如果存在）
        searchInput.removeEventListener('click', handleSearchClick);
        searchInput.removeEventListener('focus', handleSearchClick);
        searchInput.removeEventListener('keydown', handleSearchSubmit);

        // 添加新的监听器
        searchInput.addEventListener('click', handleSearchClick);
        searchInput.addEventListener('focus', handleSearchClick);
        
        // 监听回车键，确保 URL 参数与输入框内容同步
        searchInput.addEventListener('keydown', handleSearchSubmit);

        // 监听 DOM 变化，以便在 dropdown 出现时插入按钮
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.id && node.id.includes('typeaheadDropdown')) {
                        log('[日期快捷按钮] 检测到 dropdown 创建');
                        setTimeout(insertShortcuts, 50);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理搜索框点击事件
    function handleSearchClick() {
        log('[日期快捷按钮] 搜索框被点击');
        // 延迟执行以等待 dropdown 创建
        setTimeout(insertShortcuts, 100);
    }

    // 处理搜索框回车提交
    function handleSearchSubmit(e) {
        if (e.key === 'Enter') {
            log('[日期快捷按钮] 检测到回车键');
            
            const searchInput = e.target;
            const currentValue = searchInput.value.trim();
            
            // 如果输入框为空，导航到 explore 页面
            if (!currentValue) {
                e.preventDefault();
                window.location.href = '/explore';
                return;
            }
            
            // 阻止默认行为，手动处理导航
            e.preventDefault();
            
            // 更新 URL 参数
            const urlParams = new URLSearchParams();
            urlParams.set('q', currentValue);
            urlParams.set('src', 'typed_query');
            
            // 构建新 URL
            const newUrl = `/search?${urlParams.toString()}`;
            
            log(`[日期快捷按钮] 手动导航到: ${newUrl}`);
            
            // 导航到新 URL
            window.location.href = newUrl;
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSearchBoxListener);
    } else {
        setupSearchBoxListener();
    }

    // 处理页面导航（Twitter 是 SPA）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            log('[日期快捷按钮] 页面导航，重新初始化');
            setTimeout(setupSearchBoxListener, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();