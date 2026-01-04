// ==UserScript==
// @name         淘宝店铺导出id
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动抓取所有页面数据并导出到txt
// @author       menkeng
// @match        https://*.taobao.com/category.htm?*
// @match        https://*.taobao.com/search.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491195/%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%E5%AF%BC%E5%87%BAid.user.js
// @updateURL https://update.greasyfork.org/scripts/491195/%E6%B7%98%E5%AE%9D%E5%BA%97%E9%93%BA%E5%AF%BC%E5%87%BAid.meta.js
// ==/UserScript==

'use strict';

function addButton(text, onClickFunction) {
    let button = document.createElement('button');
    button.innerText = text;
    button.onclick = onClickFunction;
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = text === '开始爬取' ? '180px' : (text === '清除数据' ? '90px' : '10px');
    document.body.appendChild(button);
}

function clearData() {
    localStorage.removeItem('exportedData');
    localStorage.removeItem('isScraping');
    alert('数据已清除');
}

function exportData() {
    let data = localStorage.getItem('exportedData');
    if (data) {
        let csvContent = "data:text/csv;charset=utf-8," + data;
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        let shopNameLinkElement = document.querySelector(".shop-name-link");
        let shopNameElement = document.querySelector(".shop-name");

        let fileName = "exportedData.txt"; // 默认文件名
        if (shopNameLinkElement) {
            fileName = shopNameLinkElement.innerText + ".txt";
        } else if (shopNameElement) {
            fileName = shopNameElement.innerText + ".txt";
        }

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('没有数据可导出');
    }
    localStorage.removeItem('isScraping');
}


function goToNextPage() {
    let nextPageButton = document.querySelector(".pagination.pagination-mini a:last-child");
    if (nextPageButton && !nextPageButton.classList.contains("disabled")) {
        nextPageButton.click();
    } else {
        exportData(); // 没有更多页面时导出数据
    }
}

function storeData() {
    var rows = document.querySelectorAll("dl.item");
    var existingData = localStorage.getItem('exportedData') || '';
    if (existingData && !existingData.endsWith('\n')) {
        existingData += '\n';
    }
    var newData = '';
    var uniqueIds = new Set(existingData.split('\n').map(line => line.split('=')[1])); 

    rows.forEach(function (row) {
        var id = row.getAttribute("data-id");
        if (!uniqueIds.has(id)) {
            uniqueIds.add(id); 
            newData += `https://item.taobao.com/item.htm?id=${id}\n`; 
        }
    });

    localStorage.setItem('exportedData', existingData + newData.trim());

    goToNextPage();
}




function startScraping() {
    localStorage.setItem('isScraping', 'true');
    storeData();
}

// 重新加载页面时检查是否需要继续爬取
function checkIfScraping() {
    if (localStorage.getItem('isScraping') === 'true') {
        setTimeout(storeData, 3000);
    }
}
const regex = /item\.htm\?id=(\d+)/;
addButton('清除数据', clearData);
addButton('导出数据', exportData);
addButton('开始爬取', startScraping);

// 检查是否继续爬取
checkIfScraping();