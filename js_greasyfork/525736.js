// ==UserScript==
// @name         ExHentai 多功能按钮
// @namespace    https://exhentai.org/
// @version      1.1
// @description  在搜索栏旁添加按钮，点击后在搜索内容后自动加 " l:chinese$" 并执行搜索
// @author       RandomGuy
// @match        *://exhentai.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525736/ExHentai%20%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525736/ExHentai%20%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取搜索栏
    const searchBar = document.querySelector('input[name="f_search"]');
    if (!searchBar) return;

    // 获取搜索表单
    const searchForm = searchBar.closest('form');
    if (!searchForm) return;

    // 创建添加筛选条件按钮的通用函数
    function createButton(text, searchSuffix) {
        const container = document.createElement('span');
        container.style.marginLeft = '10px';

        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '5px';
        button.style.cursor = 'pointer';

        // 添加筛选条件
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (!searchBar.value.includes(searchSuffix)) {
                searchBar.value += ' ' + searchSuffix;
            }
            searchForm.submit();
        });

        // 删除单个筛选条件按钮
        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.style.marginLeft = '5px';
        removeButton.style.padding = '3px';
        removeButton.style.cursor = 'pointer';

        removeButton.addEventListener('click', (event) => {
            event.preventDefault();
            searchBar.value = searchBar.value.replace(searchSuffix, '').trim();
            searchForm.submit();
        });

        container.appendChild(button);
        container.appendChild(removeButton);
        return container;
    }

    // 创建按钮 - 只保留画师标签
    const clearTagsWithArtistButton = document.createElement('button');
    clearTagsWithArtistButton.textContent = '🧹 只留画师';
    clearTagsWithArtistButton.style.marginLeft = '10px';
    clearTagsWithArtistButton.style.padding = '5px';
    clearTagsWithArtistButton.style.cursor = 'pointer';

    clearTagsWithArtistButton.addEventListener('click', (event) => {
        event.preventDefault();

        // 正则匹配所有 artist:"XXXX" 或 artist:"XXXX XXXX" 格式的标签
        const tags = searchBar.value.match(/artist:"[^"]*"/g) || [];

        // 重新设置搜索栏的内容，只保留匹配到的 artist:"..." 标签
        searchBar.value = tags.join(' ').trim();
        searchForm.submit();
    });

    // 创建按钮 - 添加筛选条件
    const chineseButton = createButton('🔍 搜索中文', 'l:chinese$');
    const uncensoredButton = createButton('🔞 无修正', 'o:uncensored$');
    const excludeTankoubonButton = createButton('🚫 排除单行本', '-o:tankoubon$');
    const fullColorButton = createButton('🎨 全彩', 'o:full color$');

    // 将所有按钮插入到搜索栏旁
    searchBar.parentNode.appendChild(chineseButton);
    searchBar.parentNode.appendChild(uncensoredButton);
    searchBar.parentNode.appendChild(excludeTankoubonButton);
    searchBar.parentNode.appendChild(fullColorButton);
    searchBar.parentNode.appendChild(clearTagsWithArtistButton);
})();
