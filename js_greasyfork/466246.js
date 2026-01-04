// ==UserScript==
// @name         清理网页标题字符
// @version      3.1
// @author       ChatGPT
// @description  从页面标题中删除指定的字符，脚本菜单里输入需要删除的字符
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/466246/%E6%B8%85%E7%90%86%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/466246/%E6%B8%85%E7%90%86%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let filters = [];

    // 获取用户设置的字符过滤器
    function getConfiguredFilters() {
        let newFilters = prompt('请输入需要删除的字符（用 & 分隔）或留空不做更改:', GM_getValue('filters'));
        if (newFilters === null) { // 用户点击取消按钮
            return GM_getValue('filters');
        }
        return newFilters || '';
    }

    // 将用户定义的过滤器转换为数组并保存到全局变量中
    function updateFilters() {
        filters = getConfiguredFilters().split('&').map(filter => filter.trim());
        GM_setValue('filters', filters.join('&'));
        cleanTitle();
    }

    // 添加“编辑清除字符”选项到油猴脚本菜单中
    GM_registerMenuCommand('清理网页标题字符 - 编辑清除字符', updateFilters);

    // 标题清理函数
    function cleanTitle() {
        let originalTitle = document.title;
        let cleanedTitle = originalTitle;

        for (let i = 0; i < filters.length; i++) {
            cleanedTitle = cleanedTitle.replaceAll(filters[i], '');
        }

        if (originalTitle !== cleanedTitle) {
            document.title = cleanedTitle;
        }
    }

    // 初始化，如果有过滤器就进行标题清理
    filters = GM_getValue('filters') ? GM_getValue('filters').split('&').map(filter => filter.trim()) : [];
    if (filters.length > 0) {
        cleanTitle();
    }

    // 在油猴脚本界面中显示当前过滤器设置
    GM_registerMenuCommand('清理网页标题字符 - 当前过滤器', () => {
        alert(`当前过滤器: ${GM_getValue('filters') || '未设置'}`);
    });
})();
