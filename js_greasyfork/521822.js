// ==UserScript==
// @name         自动点击疾病检索链接并保存每10条数据到Excel
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  自动点击疾病检索页面的所有链接，提取页面<strong>标签内容的键值对，并每10条数据保存到一个Excel文件。
// @author       zxm
// @match        *://www.cdc.zj.cn/jbjx/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521822/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%96%BE%E7%97%85%E6%A3%80%E7%B4%A2%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%BF%9D%E5%AD%98%E6%AF%8F10%E6%9D%A1%E6%95%B0%E6%8D%AE%E5%88%B0Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/521822/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%96%BE%E7%97%85%E6%A3%80%E7%B4%A2%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%BF%9D%E5%AD%98%E6%AF%8F10%E6%9D%A1%E6%95%B0%E6%8D%AE%E5%88%B0Excel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const mainPageUrl = 'https://www.cdc.zj.cn/jbjx/';
    let links = [];
    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    let allPairs = [];  // 累积当前批次的数据
    let batchCounter = 0; // 用于命名每个文件的计数器

    const initScript = () => {
        if (window.location.href !== mainPageUrl) {
            setTimeout(() => {
                window.location.href = mainPageUrl;
            }, 1000); // 避免频繁跳转，增加延迟时间
            return;
        }

        links = Array.from(document.querySelectorAll('.list_r a')).map(link => link.href);
        console.log("找到链接:", links);

        if (links.length === 0) {
            console.log("没有找到任何链接");
            return;
        }

        localStorage.setItem('links', JSON.stringify(links));
        clickNextLink();
    };

    const clickNextLink = () => {
        if (links.length === 0) {
            links = JSON.parse(localStorage.getItem('links')) || [];
        }

        if (currentIndex >= links.length) {
            console.log("所有链接已处理完");
            localStorage.removeItem('currentIndex');
            if (allPairs.length > 0) {
                savePairsToExcel(allPairs);  // 保存最后的剩余数据
            }
            return;
        }

        const nextLink = links[currentIndex];
        console.log(`点击链接 (${currentIndex + 1}/${links.length}): ${nextLink}`);
        currentIndex++;
        localStorage.setItem('currentIndex', currentIndex);

        window.location.href = nextLink;
    };

    const savePairsToExcel = (pairs) => {
        if (pairs.length > 0) {
            console.log(`保存当前批次数据，包含 ${pairs.length} 个键值对`);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(pairs);
            XLSX.utils.book_append_sheet(wb, ws, "键值对");
            XLSX.writeFile(wb, `key_value_pairs_batch_${++batchCounter}.xlsx`); // 按批次编号保存文件
        }
    };

    const printStrongTags = () => {
        const pairs = [];

        // 提取页面中所有 <strong> 标签的数据
        document.querySelectorAll('strong').forEach(function(strong) {
            const currentKey = strong.textContent.trim();
            const currentValue = strong.closest('p')?.nextElementSibling?.textContent.replace(/\s+/g, ' ').trim();

            if (currentKey && currentValue) {
                pairs.push({ key: currentKey, value: currentValue });
            }
        });

        if (pairs.length > 0) {
            console.log(`在当前页面找到 ${pairs.length} 对键值`);
            allPairs = allPairs.concat(pairs);  // 累积数据
        } else {
            console.log("当前页面没有找到键值对");
        }

        // 每累积10条数据保存一次
        if (allPairs.length >= 10) {
            savePairsToExcel(allPairs);
            allPairs = [];  // 清空已保存的数据
        }

        // 页面处理完成后，跳回主页面
        setTimeout(() => {
            window.location.href = mainPageUrl;
        }, 2000); // 等待 2 秒后跳转回主页面
    };

    window.addEventListener('load', () => {
        if (window.location.href === mainPageUrl) {
            initScript();
        } else {
            printStrongTags();
        }
    });
})();
