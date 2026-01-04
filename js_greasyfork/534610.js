// ==UserScript==
// @name         GPUZ网站显卡型号实时搜索筛选器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  通过缓存下拉选项元素提高性能
// @author       Kukous
// @match        https://www.techpowerup.com/vgabios/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534610/GPUZ%E7%BD%91%E7%AB%99%E6%98%BE%E5%8D%A1%E5%9E%8B%E5%8F%B7%E5%AE%9E%E6%97%B6%E6%90%9C%E7%B4%A2%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534610/GPUZ%E7%BD%91%E7%AB%99%E6%98%BE%E5%8D%A1%E5%9E%8B%E5%8F%B7%E5%AE%9E%E6%97%B6%E6%90%9C%E7%B4%A2%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function () {
        // 找到目标下拉框（根据你的页面实际情况修改选择器）
        const selectElement = document.getElementById('model');
        if (!selectElement) return;

        // 重新组织DOM结构
        selectElement.style.display = 'none'; // 隐藏原始下拉框

        // 创建搜索输入框
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '输入显卡型号搜索...';

        // 创建自定义下拉容器
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.position = 'relative';
        dropdownContainer.style.display = 'inline-block';
        dropdownContainer.style.width = '100%';

        // 创建下拉菜单
        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.zIndex = '999';
        dropdownMenu.style.width = '100%';
        dropdownMenu.style.maxHeight = '300px';
        dropdownMenu.style.overflowY = 'auto';
        dropdownMenu.style.backgroundColor = '#fff';
        dropdownMenu.style.border = '1px solid #ddd';
        dropdownMenu.style.borderRadius = '4px';
        dropdownMenu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';


        selectElement.parentNode.insertBefore(dropdownContainer, selectElement);
        dropdownContainer.appendChild(searchInput);
        dropdownContainer.appendChild(dropdownMenu);

        // 存储所有原始选项和对应的DOM元素
        const optionElements = new Map();

        // 预先创建所有选项元素并缓存
        function initializeDropdownItems() {
            dropdownMenu.innerHTML = '';

            // 创建"没有结果"提示元素
            const noResultsItem = document.createElement('div');
            noResultsItem.textContent = '没有找到匹配的型号';
            noResultsItem.style.padding = '8px';
            noResultsItem.style.color = '#999';
            noResultsItem.style.display = 'none';
            dropdownMenu.appendChild(noResultsItem);
            optionElements.set('no-results', noResultsItem);

            // 创建所有选项元素并缓存
            Array.from(selectElement.options).forEach(option => {
                const item = document.createElement('div');
                item.textContent = option.text;
                item.style.padding = '8px';
                item.style.cursor = 'pointer';
                item.style.display = 'none'; // 初始隐藏

                // 存储原始option信息
                item.dataset.value = option.value;
                item.dataset.text = option.text;

                item.addEventListener('click', function () {
                    searchInput.value = option.text;
                    selectElement.value = option.value;
                    dropdownMenu.style.display = 'none';

                    // 触发原始下拉框的change事件
                    const event = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(event);
                });

                item.addEventListener('mouseover', function () {
                    item.style.backgroundColor = '#f5f5f5';
                });

                item.addEventListener('mouseout', function () {
                    item.style.backgroundColor = '';
                });

                dropdownMenu.appendChild(item);
                optionElements.set(option.value, item);
            });
        }

        // 更新下拉菜单显示状态
        function updateDropdownItems(searchTerm = '') {
            let hasVisibleItems = false;
            const searchLower = searchTerm.toLowerCase();

            // 遍历所有缓存选项
            optionElements.forEach((item, key) => {
                if (key === 'no-results') return;

                const text = item.dataset.text.toLowerCase();
                const isMatch = searchLower === '' || text.includes(searchLower);

                if (isMatch) {
                    item.style.display = '';
                    hasVisibleItems = true;

                    // 高亮匹配部分
                    if (searchTerm) {
                        const regex = new RegExp(searchTerm, 'gi');
                        item.innerHTML = item.dataset.text.replace(regex, match => `<strong>${match}</strong>`);
                    } else {
                        item.innerHTML = item.dataset.text;
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            // 显示/隐藏"没有结果"提示
            const noResultsItem = optionElements.get('no-results');
            noResultsItem.style.display = hasVisibleItems ? 'none' : '';
        }

        // 输入时实时筛选
        searchInput.addEventListener('input', function () {
            updateDropdownItems(this.value);
            dropdownMenu.style.display = 'block';
        });

        // 点击输入框显示所有选项
        searchInput.addEventListener('focus', function () {
            updateDropdownItems(this.value);
            dropdownMenu.style.display = 'block';
        });

        // 点击页面其他位置隐藏下拉菜单
        document.addEventListener('click', function (e) {
            if (!dropdownContainer.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });

        // 键盘导航支持
        searchInput.addEventListener('keydown', function (e) {
            const visibleItems = Array.from(dropdownMenu.querySelectorAll('div'))
                .filter(item => item.style.display !== 'none' && item !== optionElements.get('no-results'));

            if (visibleItems.length === 0) return;

            let currentIndex = -1;

            // 找到当前选中项
            visibleItems.forEach((item, index) => {
                if (item.style.backgroundColor === 'rgb(245, 245, 245)') {
                    currentIndex = index;
                }
            });

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % visibleItems.length;
                visibleItems.forEach(item => item.style.backgroundColor = '');
                visibleItems[nextIndex].style.backgroundColor = '#f5f5f5';
                visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                visibleItems.forEach(item => item.style.backgroundColor = '');
                visibleItems[prevIndex].style.backgroundColor = '#f5f5f5';
                visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter' && currentIndex >= 0) {
                e.preventDefault();
                visibleItems[currentIndex].click();
            } else if (e.key === 'Escape') {
                dropdownMenu.style.display = 'none';
            }
        });

        // 初始化下拉菜单
        initializeDropdownItems();
        updateDropdownItems(); // 初始显示所有选项
    });
})();