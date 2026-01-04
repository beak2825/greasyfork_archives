// ==UserScript==
// @name         Import Export Data
// @namespace    https://github.com/Adachi-Git
// @version      1.01
// @description  Import and export data using localForage in Tampermonkey script
// @author       Adachi
// @match        https://u2.dmhy.org/offers.php
// @match        https://u2.dmhy.org/torrents.php*
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490476/Import%20Export%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/490476/Import%20Export%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置并发操作的上限
    const MAX_CONCURRENT_OPERATIONS = 5;

    // 创建导入按钮
    const importButton = document.createElement('input');
    importButton.type = 'file';
    importButton.style.position = 'fixed';
    importButton.style.top = '10px';
    importButton.style.left = '10px';
    document.body.appendChild(importButton);

    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Data';
    exportButton.style.position = 'fixed';
    exportButton.style.top = '40px';
    exportButton.style.left = '10px';
    document.body.appendChild(exportButton);

    // 点击导入按钮时触发事件
    importButton.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const data = await readFile(file);
            await importDataConcurrently(data);
            alert('Data imported successfully!');
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Error importing data. See console for details.');
        }
    });

    // 点击导出按钮时触发事件
    exportButton.addEventListener('click', async function() {
        try {
            const data = await exportData();
            downloadData(data);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error exporting data. See console for details.');
        }
    });

    // 读取文件并返回数据
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }

    // 并发导入数据到 IndexedDB
    async function importDataConcurrently(data) {
        const jsonData = JSON.parse(data);
        const keys = Object.keys(jsonData);

        // 切割任务，以 MAX_CONCURRENT_OPERATIONS 为一组进行并发操作
        const chunks = [];
        for (let i = 0; i < keys.length; i += MAX_CONCURRENT_OPERATIONS) {
            chunks.push(keys.slice(i, i + MAX_CONCURRENT_OPERATIONS));
        }

        // 对每个组进行并发操作
        for (const chunk of chunks) {
            await Promise.all(chunk.map(async (key) => {
                await localforage.setItem(key, jsonData[key]);
            }));
        }
    }

    // 导出数据
    async function exportData() {
        const keys = await localforage.keys();
        const data = {};
        for (const key of keys) {
            data[key] = await localforage.getItem(key);
        }
        return JSON.stringify(data, null, 2);
    }

    // 下载数据为 JSON 文件
    function downloadData(data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'indexedDB_data.json';
        link.click();
    }
})();
