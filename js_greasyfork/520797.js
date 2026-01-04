// ==UserScript==
// @name         Amazon 关键词 ASIN 定位器 广告位自然位统计
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  查找指定ASIN，并区分自然位和广告位，支持备注存储与历史选择
// @author       ciaociao
// @match        https://www.amazon.com/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520797/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%AE%9A%E4%BD%8D%E5%99%A8%20%E5%B9%BF%E5%91%8A%E4%BD%8D%E8%87%AA%E7%84%B6%E4%BD%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520797/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20ASIN%20%E5%AE%9A%E4%BD%8D%E5%99%A8%20%E5%B9%BF%E5%91%8A%E4%BD%8D%E8%87%AA%E7%84%B6%E4%BD%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建输入框、下拉框和按钮
    const ui = `
        <div style="position:fixed; top:10px; right:10px; background:white; border:1px solid #ccc; padding:10px; z-index:10000;">
            <label for="asinSelect">1.选择ASIN: </label>
            <select id="asinSelect" style="width:200px;"></select>
            <br>
            <label for="asinInput">2.输入ASIN: </label>
            <input type="text" id="asinInput" style="width:150px;" />
            <br>
            <label for="asinLabel">添加备注: </label>
            <input type="text" id="asinLabel" style="width:150px;" placeholder="备注 (可选)" />
            <br>
            <button id="startSearch">开始搜索</button>
            <button id="clearStorage">清空历史</button>
        </div>`;

    const container = document.createElement('div');
    container.innerHTML = ui;
    document.body.appendChild(container);

    let targetASIN = '';
    let currentPage = 1;
    let results = { natural: null, sponsored: null };

    loadSavedASINs();

    // 事件绑定
    document.getElementById('asinSelect').addEventListener('change', updateASIN);
    document.getElementById('asinInput').addEventListener('input', updateASIN);
    document.getElementById('startSearch').addEventListener('click', startSearch);
    document.getElementById('clearStorage').addEventListener('click', clearStorage);

    function updateASIN() {
        targetASIN = document.getElementById('asinSelect').value || document.getElementById('asinInput').value.trim();
    }

    function startSearch() {
        if (!targetASIN) return alert('请输入有效的ASIN！');
        results = { natural: null, sponsored: null };
        currentPage = 1;
        saveASIN(targetASIN, document.getElementById('asinLabel').value.trim());
        searchPage();
    }

    function searchPage() {
        const products = document.querySelectorAll('div[data-asin]');
        let naturalIndex = 0, sponsoredIndex = 0;

        for (const div of products) {
            const asin = div.getAttribute('data-asin');
            const isSponsored = div.querySelector('.s-sponsored-label') !== null;
            const addToCart = div.querySelector('span.a-button-inner button.a-button-text');

            if (asin && addToCart) {
                if (isSponsored) sponsoredIndex++;
                else naturalIndex++;

                if (asin === targetASIN) {
                    if (isSponsored && !results.sponsored) {
                        results.sponsored = { page: currentPage, position: sponsoredIndex };
                    } else if (!isSponsored && !results.natural) {
                        results.natural = { page: currentPage, position: naturalIndex };
                    }
                }
            }
        }

        if (results.natural && results.sponsored) {
            showResults();
        } else if (currentPage < 5) {
            const nextPage = document.querySelector('a.s-pagination-next');
            if (nextPage) {
                currentPage++;
                nextPage.click();
                setTimeout(searchPage, 4000);
            } else {
                showResults();
            }
        } else {
            showResults();
        }
    }

    function showResults() {
        let message = `搜索完成：\n`;
        if (results.natural) {
            message += `自然位: 第 ${results.natural.page} 页，第 ${results.natural.position} 个位置\n`;
        } else {
            message += `自然位: 未找到\n`;
        }
        if (results.sponsored) {
            message += `广告位: 第 ${results.sponsored.page} 页，第 ${results.sponsored.position} 个位置\n`;
        } else {
            message += `广告位: 未找到\n`;
        }
        alert(message);
    }

    // 保存ASIN到localStorage
    function saveASIN(asin, label) {
        const saved = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        if (!saved.some(item => item.asin === asin)) {
            saved.push({ asin, label: label || '未命名' });
            localStorage.setItem('savedASINs', JSON.stringify(saved));
            updateASINDropdown();
        }
    }

    function loadSavedASINs() {
        updateASINDropdown();
    }

    function updateASINDropdown() {
        const asinSelect = document.getElementById('asinSelect');
        asinSelect.innerHTML = '<option value="">-- 选择已保存ASIN --</option>';
        const saved = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        saved.forEach(item => {
            const option = document.createElement('option');
            option.value = item.asin;
            option.textContent = `${item.asin} - ${item.label}`;
            asinSelect.appendChild(option);
        });
    }

    function clearStorage() {
        localStorage.removeItem('savedASINs');
        updateASINDropdown();
        alert('已清空保存的ASIN历史记录！');
    }
})();
