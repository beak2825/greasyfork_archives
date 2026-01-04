// ==UserScript==
// @name         BUFF磨损价格快捷筛选
// @namespace    http://tampermonkey.net/
// @version      2
// @description  在 Buff 页面中添加过滤和刷新功能，根据指定范围过滤包含磨损的商品并刷新页面以更新列表。
//               可以保存和快速应用之前保存的筛选器格式。
// @author       Your Name
// @match        https://buff.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463041/BUFF%E7%A3%A8%E6%8D%9F%E4%BB%B7%E6%A0%BC%E5%BF%AB%E6%8D%B7%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463041/BUFF%E7%A3%A8%E6%8D%9F%E4%BB%B7%E6%A0%BC%E5%BF%AB%E6%8D%B7%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建筛选器UI
    var filterDiv = document.createElement('div');
    filterDiv.style.position = 'fixed';
    filterDiv.style.top = '50%';
    filterDiv.style.left = '0';
    filterDiv.style.transform = 'translate(0, -50%)';
    filterDiv.style.width = '120px';
    filterDiv.style.padding = '10px';
    filterDiv.style.background = 'white';
    filterDiv.style.border = '1px solid black';
    filterDiv.style.zIndex = '9999';
    filterDiv.innerHTML = `
        <label for="min-paintwear">最小磨损:</label>
        <input type="number" id="min-paintwear" min="0" max="1" step="0.001" value="0">
        <br><br>
        <label for="max-paintwear">最大磨损:</label>
        <input type="number" id="max-paintwear" min="0" max="1" step="0.001">
        <br><br>
        <label for="max-price">最大价:</label>
        <input type="number" id="max-price" min="0" step="0.01">
        <br><br>
        <button id="apply-filter">应用</button>
        <br><br>
        <label for="save-format">保存格式名称:</label>
        <input type="text" id="save-format">
        <button id="save-filter">保存筛选器格式</button>
        <br><br>
        <select id="saved-formats"><option value="">选择保存的筛选器格式</option></select>
        <br><br>
        <button id="delete-filter">删除已保存的筛选器格式</button>
    `;
    document.body.appendChild(filterDiv);

    // 获取商品列表和筛选器元素
    var productList = document.querySelectorAll('.items-list li');
    var minPaintwear = document.querySelector('#min-paintwear');
    var maxPaintwear = document.querySelector('#max-paintwear');
    var maxPrice = document.querySelector('#max-price');
    var applyFilterBtn = document.querySelector('#apply-filter');
    var saveFormatInput = document.querySelector('#save-format');
    var saveFilterBtn = document.querySelector('#save-filter');
    var savedFormatsSelect = document.querySelector('#saved-formats');
    var deleteFilterBtn = document.querySelector('#delete-filter');

    // 过滤函数
    function filterProducts() {
        var queryParams = new URLSearchParams(location.search);
        queryParams.set('min_paintwear', minPaintwear.value);
        queryParams.set('max_paintwear', maxPaintwear.value);
        queryParams.set('max_price', maxPrice.value);
        queryParams.set('page_num', '1');
        location.href = location.pathname + '?from=market#' + 'tab=selling&' + queryParams.toString();
    }

    // 添加筛选器事件监听器
    applyFilterBtn.addEventListener('click', function(event) {
        filterProducts();
    });

    // 保存筛选器格式到本地存储事件监听器
    saveFilterBtn.addEventListener('click', function(event) {
        var saveFormat = saveFormatInput.value.trim();
        if (saveFormat !== '') {
            var filters = {
                min_paintwear: minPaintwear.value,
                max_paintwear: maxPaintwear.value,
                max_price: maxPrice.value
            };
            var savedFormats = JSON.parse(localStorage.getItem('buff-formats') || '[]');
            // 检查是否已经存在相同名称的格式，如果是，则先删除之前的格式
            for (var i = 0; i < savedFormats.length; i++) {
                if (savedFormats[i].name === saveFormat) {
                    savedFormats.splice(i, 1);
                    break;
                }
            }
            savedFormats.push({name: saveFormat, filters: filters});
            localStorage.setItem('buff-formats', JSON.stringify(savedFormats));
            alert('已保存格式：' + saveFormat);
            updateSavedFormatsSelect();
        } else {
            alert('请输入保存格式！');
        }
    });

    // 更新保存的格式下拉框并对保存的筛选器格式进行排列
    function updateSavedFormatsSelect() {
        savedFormatsSelect.innerHTML = '<option value="">选择保存的筛选器格式</option>';
        var savedFormats = JSON.parse(localStorage.getItem('buff-formats') || '[]');
        savedFormats.sort(function(a, b) { // 按名称升序排序
            return a.name.localeCompare(b.name);
        });
        savedFormats.forEach(function(format) { // 添加选项到下拉框中
            var option = document.createElement('option');
            option.setAttribute('value', format.name);
            option.innerText = format.name;
            savedFormatsSelect.appendChild(option);
        });
    }

    // 应用保存的格式事件监听器
    savedFormatsSelect.addEventListener('change', function(event) {
        var selectedFormat = event.target.value;
        if (selectedFormat !== '') {
            var savedFormats = JSON.parse(localStorage.getItem('buff-formats') || '[]');
            var savedFormat = savedFormats.find(function(format) {
                return format.name === selectedFormat;
            });
            if (savedFormat) {
                minPaintwear.value = savedFormat.filters.min_paintwear;
                maxPaintwear.value = savedFormat.filters.max_paintwear;
                maxPrice.value = savedFormat.filters.max_price;
                filterProducts();
            }
        }
    });

    // 删除保存的筛选器格式事件监听器
    deleteFilterBtn.addEventListener('click', function(event) {
        var selectedFormat = savedFormatsSelect.value;
        if (selectedFormat !== '') {
            var savedFormats = JSON.parse(localStorage.getItem('buff-formats') || '[]');
            var updatedFormats = savedFormats.filter(function(format) {
                return format.name !== selectedFormat;
            });
            localStorage.setItem('buff-formats', JSON.stringify(updatedFormats));
            alert('已删除格式：' + selectedFormat);
            updateSavedFormatsSelect();
        } else {
            alert('请先选择要删除的筛选器格式！');
        }
    });

    // 恢复编辑中的筛选器格式
    var editingFormat = localStorage.getItem('editing-format');
    if (editingFormat) {
        var savedFormats = JSON.parse(localStorage.getItem('buff-formats') || '[]');
        var savedFormat = savedFormats.find(function(format) {
            return format.name === editingFormat;
        });
        if (savedFormat) {
            minPaintwear.value = savedFormat.filters.min_paintwear;
            maxPaintwear.value = savedFormat.filters.max_paintwear;
            maxPrice.value = savedFormat.filters.max_price;
        }
    }

    // 初始化保存的格式下拉框
    updateSavedFormatsSelect();
})();