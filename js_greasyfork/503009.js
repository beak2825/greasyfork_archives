// ==UserScript==
// @name         Moji词典连携potplayer关键词搜索
// @name_en      Potplayer Word Searching Auto Search With Mojidict
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  每0.5秒检测一次url，填入搜索框并进行搜索
// @author       得翛&ChatGPT-4o
// @match        *://www.mojidict.com/search?*
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/503009/Moji%E8%AF%8D%E5%85%B8%E8%BF%9E%E6%90%BApotplayer%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503009/Moji%E8%AF%8D%E5%85%B8%E8%BF%9E%E6%90%BApotplayer%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个定时器来每0.5秒检测一次
    const interval = setInterval(() => {
        // 获取当前URL的查询参数
        const urlParams = new URLSearchParams(window.location.search);

    // 提取查询参数中以 A000 开头的键的值 search?=A000[搜索文字]=null
    const queryKey = [...urlParams.keys()].find(key => key.startsWith('A000'));
    const query = queryKey ? decodeURIComponent(queryKey.replace('A000[', '').replace(']', '')) : null;

        if (query) {
            // 找到搜索框的元素
            const searchInput = document.getElementById('input-init-searchbar');

            if (searchInput) {
                // 将提取的内容填入搜索框
                searchInput.value = query;

                // 触发输入事件，以便激活搜索
                const event = new Event('input', { bubbles: true });
                searchInput.dispatchEvent(event);

                // 尝试找到并点击搜索按钮
                const searchButton = document.querySelector('.iconic-menu-search');
                if (searchButton) {
                    searchButton.click();
                } else {
                    // 如果找不到按钮，则尝试触发 form 的提交
                    const form = searchInput.closest('form');
                    if (form) {
                        form.submit();
                    }
                }

                // 成功填入内容后停止定时器
                clearInterval(interval);
            }
        }
    }, 500); // 每0.5秒检测一次
})();
