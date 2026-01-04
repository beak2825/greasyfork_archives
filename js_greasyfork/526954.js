// ==UserScript==
// @name         京东自营过滤
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在京东搜索页面添加自营与非自营商品过滤选项
// @author       遥不可及灬
// @match        https://search.jd.com/Search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526954/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/526954/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建单选按钮
    const filterContainer = document.createElement('div');
    filterContainer.style.marginBottom = '10px';
    filterContainer.style.padding = '10px';
    filterContainer.style.backgroundColor = '#f5f5f5';
    filterContainer.style.borderBottom = '1px solid #ddd';
    filterContainer.innerHTML = `
        <label><input type="radio" name="filter" value="all" checked> 全部</label>
        <label><input type="radio" name="filter" value="self"> 自营</label>
        <label><input type="radio" name="filter" value="non-self"> 非自营</label>
    `;

    // 将单选按钮插入到搜索结果列表的顶部
    const searchResultContainer = document.querySelector('.m-list');
    if (searchResultContainer) {
        searchResultContainer.insertBefore(filterContainer, searchResultContainer.firstChild);
    }

    // 过滤函数
    function filterItems() {
        const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
        const items = document.querySelectorAll('.gl-item');

        items.forEach(item => {
            const contactButton = item.querySelector('.p-shop b');
            const isSelf = contactButton && contactButton.classList.contains('im-02');

            if (selectedFilter === 'all' ||
                (selectedFilter === 'self' && isSelf) ||
                (selectedFilter === 'non-self' && !isSelf)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 监听单选按钮变化
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', filterItems);
    });

    // 监听页面滚动事件，以处理懒加载的商品
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => {
                filterItems();
                isScrolling = false;
            }, 200); // 200ms 延迟，避免频繁触发
        }
    });

    // 初始过滤
    filterItems();
})();