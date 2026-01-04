// ==UserScript==
// @name         谷歌地图获客助手（免费）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extracts specified data from a Google Maps page, cleans data, and displays it in a unique table UI with copy and clear functionality.
// @author       Your Name
// @match        https://www.google.com/maps/place/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539716/%E8%B0%B7%E6%AD%8C%E5%9C%B0%E5%9B%BE%E8%8E%B7%E5%AE%A2%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%8D%E8%B4%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539716/%E8%B0%B7%E6%AD%8C%E5%9C%B0%E5%9B%BE%E8%8E%B7%E5%AE%A2%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%8D%E8%B4%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uniqueDataSet = new Set(JSON.parse(localStorage.getItem('uniqueDataSet') || '[]'));

    function saveToLocalStorage() {
        localStorage.setItem('uniqueDataSet', JSON.stringify([...uniqueDataSet]));
    }

    function extractText(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : 'N/A';
    }

    function extractSiblingText(character) {
        const spans = document.querySelectorAll('span');
        for (let span of spans) {
            if (span.textContent.includes(character)) {
                const parentDiv = span.closest('div');
                if (parentDiv) {
                    const siblingDiv = parentDiv.nextElementSibling;
                    if (siblingDiv) {
                        return siblingDiv.textContent.trim();
                    }
                }
            }
        }
        return 'N/A';
    }

    function extractAndStoreData() {
        const selectors = {
            title: 'h1.DUwDvf',
            domain: '.ITvuef div.Io6YTe',
            local: 'div.Io6YTe',
            tel: 'div.kR99db'
        };

        const data = {
            title: extractText(selectors.title),
            domain: extractSiblingText(''),
            local: extractSiblingText(''),
            tel: extractSiblingText(''),
        };

        if (Object.values(data).every(value => value === 'N/A')) {
            return;
        }

        const dataKey = JSON.stringify(data);

        if (!uniqueDataSet.has(dataKey)) {
            uniqueDataSet.add(dataKey);
            saveToLocalStorage();
            updateTableUI();
        }
    }

    function updateTableUI() {
        let tableHtml = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <button id="copy-button" style="padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;font-size: 12px;">
                    复制
                </button>
                <button id="clear-button" style="padding: 5px 10px; background-color: #FF5733; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;font-size: 12px;">
                    清空
                </button>
                <button id="bulk-fetch-button" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;font-size: 12px;">
                    批量自动获取
                </button>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">名称</th>
                        <th style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">域名</th>
                        <th style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">电话</th>
                        <th style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">地址</th>
                    </tr>
                </thead>
                <tbody>
        `;

        uniqueDataSet.forEach(dataKey => {
            const data = JSON.parse(dataKey);
            tableHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">${data.title}</td>
                    <td style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">${data.domain}</td>
                    <td style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">${data.tel}</td>
                    <td style="border: 1px solid #ddd; padding: 4px; white-space: nowrap;">${data.local}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        const container = document.getElementById('data-table-container');
        container.innerHTML = tableHtml;

        document.getElementById('copy-button').onclick = () => {
            const textToCopy = [...uniqueDataSet].map(dataKey => {
                const data = JSON.parse(dataKey);
                return `${data.title}\t${data.domain}\t${data.tel}\t${data.local}`;
            }).join('\n');
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('数据已复制到剪贴板');
            });
        };

        document.getElementById('clear-button').onclick = () => {
            if (confirm('确定要清空所有数据吗？')) {
                uniqueDataSet.clear();
                saveToLocalStorage();
                updateTableUI();
            }
        };

        document.getElementById('bulk-fetch-button').onclick = () => {
            const links = document.querySelectorAll('a.hfpxzc');
            let index = 0;

            function clickNextLink() {
                if (index < links.length) {
                    links[index].click();
                    index++;
                    setTimeout(clickNextLink, 1500); // 0.5秒间隔
                }
            }

            clickNextLink();
        };

        // Add hover effect to buttons
        document.querySelectorAll('button').forEach(button => {
            button.onmouseover = () => button.style.backgroundColor = button.id === 'copy-button' ? '#0056b3' : (button.id === 'clear-button' ? '#c0392b' : '#218838');
            button.onmouseout = () => button.style.backgroundColor = button.id === 'copy-button' ? '#007BFF' : (button.id === 'clear-button' ? '#FF5733' : '#28a745');
        });
    }

    const container = document.createElement('div');
    container.id = 'data-table-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '400px';
    container.style.maxHeight = '300px';
    container.style.overflowY = 'auto';
    container.style.backgroundColor = 'white';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    container.style.zIndex = '1000';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(container);

    updateTableUI();

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                extractAndStoreData();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    extractAndStoreData();

})();
