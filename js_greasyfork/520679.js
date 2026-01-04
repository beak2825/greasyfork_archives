// ==UserScript==
// @name         Amazon 关键词 ASIN 定位器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  查找指定ASIN，并计算它是第几个带有“加入购物车”按钮的商品，支持下拉框选择已存储ASIN，添加自定义标签和删除
// @author       ciaociao
// @match        https://www.amazon.com/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520679/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%AE%9A%E4%BD%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520679/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%AE%9A%E4%BD%8D%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建输入框、标签框和按钮
    const asinInput = document.createElement('div');
    asinInput.innerHTML = `
        <div style="position:fixed; top:10px; right:10px; background:white; border:1px solid #ccc; padding:10px; z-index:10000;">
            <label for="asinSelect">1.选择ASIN: </label>
            <select id="asinSelect" style="width:200px;">
                <option value="">-- 选择一个ASIN --</option>
            </select>
            <br>
            <label for="asinInput">2.输入ASIN: </label>
            <input type="text" id="asinInput" style="width:150px;" />
            <br>
            <label for="asinLabel">添加备注: </label>
            <input type="text" id="asinLabel" style="width:150px;" placeholder="输入备注 (可选)" />
            <br>
            <button id="startSearch">搜索</button>
            <button id="clearStorage">清空已保存的ASIN</button>
        </div>
    `;
    document.body.appendChild(asinInput);

    // 状态变量
    let targetASIN = '';
    let currentPage = 1;

    // 从localStorage加载之前保存的ASIN及标签
    loadSavedASINs();

    // 选择ASIN或手动输入ASIN后更新ASIN变量
    document.getElementById('asinSelect').addEventListener('change', updateASIN);
    document.getElementById('asinInput').addEventListener('input', updateASIN);
    document.getElementById('asinLabel').addEventListener('input', updateLabel);

    // 更新ASIN和标签
    function updateASIN() {
        targetASIN = document.getElementById('asinSelect').value.trim() || document.getElementById('asinInput').value.trim();
    }

    function updateLabel() {
        // 标签动态更新，无需立即做其他操作
    }

    // 点击“开始搜索”按钮的事件监听器
    document.getElementById('startSearch').addEventListener('click', () => {
        if (!targetASIN) {
            alert('请输入有效的ASIN！');
            return;
        }

        currentPage = 1;
        searchASIN();

        // 获取标签并存储ASIN
        const label = document.getElementById('asinLabel').value.trim() || '未命名';
        saveASIN(targetASIN, label);
    });

    // 搜索ASIN并判断其在所有有效商品中的自然位
    function searchASIN() {
        // 获取页面所有商品块（含data-asin的div）
        const productDivs = document.querySelectorAll('div[data-asin]');
        let naturalPosition = 0; // 记录自然位
        let foundASIN = false; // 标记是否找到目标ASIN

        // 遍历所有商品块
        for (const div of productDivs) {
            const asin = div.getAttribute('data-asin');
            const addToCartButton = div.querySelector('span.a-button-inner button.a-button-text'); // 查找“加入购物车”按钮

            // 过滤掉没有实际ASIN或没有“加入购物车”按钮的商品
            if (asin && asin !== '' && addToCartButton) {
                naturalPosition++; // 有有效ASIN且带有“加入购物车”按钮的商品计入自然位

                // 判断是否为目标ASIN
                if (asin === targetASIN) {
                    div.style.border = '3px solid red'; // 高亮目标ASIN商品
                    div.scrollIntoView({ behavior: 'smooth', block: 'center' }); // 滚动到目标商品

                    alert(`找到目标ASIN: ${targetASIN}\n它是在第${currentPage}页,第 ${naturalPosition} 个自然位`);
                    foundASIN = true;
                    break;
                }
            }
        }

        // 如果目标ASIN没有在当前页面找到，则翻页
        if (!foundASIN) {
            const nextPageButton = document.querySelector('a.s-pagination-next');
            if (nextPageButton) {
                currentPage++;
                nextPageButton.click();

                // 延迟执行，等待新页面加载
                setTimeout(() => {
                    searchASIN();
                }, 4000); // 等待4秒，视网络速度可调节
            } else {
                alert(`搜索完成，共${currentPage}页，未找到目标ASIN: ${targetASIN}`);
            }
        }
    }

    // 加载并显示已保存的ASIN及标签
    function loadSavedASINs() {
        const savedASINs = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        const asinSelect = document.getElementById('asinSelect');

        savedASINs.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.asin;
            option.textContent = `${item.asin} - ${item.label}`;
            option.dataset.label = item.label; // 存储标签信息
            asinSelect.appendChild(option);
        });
    }

    // 存储ASIN和标签到localStorage
    function saveASIN(asin, label) {
        const savedASINs = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        // 如果ASIN不存在，则保存新ASIN及其标签
        if (!savedASINs.some(item => item.asin === asin)) {
            savedASINs.push({ asin, label });
            localStorage.setItem('savedASINs', JSON.stringify(savedASINs));

            // 更新下拉框
            const option = document.createElement('option');
            option.value = asin;
            option.textContent = `${asin} - ${label}`;
            option.dataset.label = label;
            document.getElementById('asinSelect').appendChild(option);
        }
    }

    // 删除已保存的ASIN
    function deleteASIN(asin) {
        const savedASINs = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        const updatedASINs = savedASINs.filter(item => item.asin !== asin);
        localStorage.setItem('savedASINs', JSON.stringify(updatedASINs));

        // 更新下拉框
        const asinSelect = document.getElementById('asinSelect');
        const optionToDelete = Array.from(asinSelect.options).find(option => option.value === asin);
        if (optionToDelete) {
            asinSelect.removeChild(optionToDelete);
        }
    }

    // 清空所有已保存的ASIN
    document.getElementById('clearStorage').addEventListener('click', () => {
        localStorage.removeItem('savedASINs');
        loadSavedASINs(); // 更新下拉框显示
        alert('所有已保存的ASIN已清空！');
    });

})();
