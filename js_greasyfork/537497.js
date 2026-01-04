// ==UserScript==
// @name         AppsFlyer Cohort Date Range URL Setter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically set the date range in AppsFlyer Cohort Overview page to the last 7 days via URL hash parameters only.
// @author       YourName
// @match        https://hq1.appsflyer.com/cohort/overview*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/537497/AppsFlyer%20Cohort%20Date%20Range%20URL%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/537497/AppsFlyer%20Cohort%20Date%20Range%20URL%20Setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：格式化日期为 "YYYY-MM-DD" 格式（例如 "2025-05-28"）
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需加 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 函数：解析哈希部分的查询参数
    function parseHashParams(hash) {
        const params = new URLSearchParams();
        if (hash && hash.includes('/')) {
            const hashQuery = hash.split('/')[1] || '';
            hashQuery.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key && value) {
                    params.set(key, value);
                }
            });
        }
        return params;
    }

    // 函数：构建带有日期范围参数的新 URL（仅哈希部分）
    function buildNewUrl(startDate, endDate) {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        // 解析哈希部分的参数
        const hash = url.hash || '';
        const hashParams = parseHashParams(hash);
        if (hashParams.has('start') && hashParams.has('end')) {
            console.log('Hash already contains date range parameters, skipping.');
            return null;
        }

        // 设置哈希部分的日期范围参数
        hashParams.set('start', startDate);
        hashParams.set('end', endDate);

        // 构建新的哈希部分
        let newHash = '#/';
        const hashParamStrings = [];
        hashParams.forEach((value, key) => {
            hashParamStrings.push(`${key}=${value}`);
        });
        newHash += hashParamStrings.join('&');
        url.hash = newHash;

        // 移除查询字符串中的冗余参数（如 start, end, redirected）
        const queryParams = url.searchParams;
        queryParams.delete('start');
        queryParams.delete('end');
        queryParams.delete('redirected');

        // 返回新 URL
        return url.toString();
    }

    // 主函数：计算日期范围并重定向
    function setDateRangeViaUrl() {
        // 计算最近 7 天的日期范围
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 7); // 最近 7 天

        const startFormatted = formatDate(pastDate);
        const endFormatted = formatDate(today);
        console.log(`Setting date range via URL hash: start=${startFormatted}, end=${endFormatted}`);

        // 构建新 URL
        const newUrl = buildNewUrl(startFormatted, endFormatted);
        if (newUrl) {
            console.log(`Redirecting to new URL with date range in hash only: ${newUrl}`);
            // 使用 replace 避免创建新的历史记录，防止后退时重复重定向
            window.location.replace(newUrl);
        } else {
            console.log('No redirection needed.');
        }
    }

    // 页面加载时执行
    window.addEventListener('load', function() {
        console.log('Page loaded, checking URL for date range parameters...');
        setDateRangeViaUrl();
    });

    // 额外的延迟执行，确保动态内容加载完成后再检查
    setTimeout(setDateRangeViaUrl, 1000); // 1 秒延迟
})();
