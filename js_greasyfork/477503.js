// ==UserScript==
// @name         补天WEB导出
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  用于联通补天WEB
// @license      MIT
// @author       DG_xinchuang
// @match        https://10.242.33.155/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=33.155
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477503/%E8%A1%A5%E5%A4%A9WEB%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477503/%E8%A1%A5%E5%A4%A9WEB%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 从JSON中提取数据
    function jsonToCsv(jsonData) {
        if (!jsonData || !jsonData.data || !jsonData.data.data || jsonData.data.data.length === 0) {
            console.error("Invalid jsonData structure");
            return "";
        }

        const data = jsonData.data.data[0];
        if (!data) {
            console.error("No data found in jsonData");
            return "";
        }

        // 使用 fields.columns 替代原来的 columns
        const columns = data.fields.columns;
        const rows = data.data;
        if (!columns) {
            console.error("No columns found in jsonData");
            return "";
        }
        if (!rows) {
            console.error("No rows found in jsonData");
            return columns.join(",") + "\n";
        }

        let csvContent = columns.join(",") + "\n";
        for (let row of rows) {
            let csvRow = [];
            for (let col of columns) {
                let value = row[col];
                if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
                    if (value.toString().length > 9) {
                        value = "'" + value;
                    }
                }
                csvRow.push(value);
            }
            csvContent += csvRow.join(",") + "\n";
        }
        return csvContent;
    }



    // 生成文件名
    function getFileName(tabName) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();

        return `${tabName}_${year}年${month}月${day}日${hour}点${minute}分.csv`;
    }

    // 下载到本地
    function downloadData(data, filename, type = "text/plain") {
        const blob = new Blob([data], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    // 添加按钮
    function addButton(responseData,tabName) {
        const existingButton = document.getElementById('exportCsvButton');
        if (existingButton) {
            existingButton.remove();
        }
        let originalButton = document.querySelector("#root > div > section > div.ant-layout > main > div > div > div.ant-tabs-nav > div.ant-tabs-nav-wrap > div > button");

        if (originalButton) {
            let clonedButton = originalButton.cloneNode(true);
            clonedButton.id = 'exportCsvButton';
            clonedButton.innerText = '导出CSV表格';
            clonedButton.addEventListener('click', function() {
                if (responseData) {
                    const csvData = jsonToCsv(responseData);
                    const filename = getFileName(tabName);
                    downloadData(csvData, filename, 'text/csv');
                } else {
                    alert('没有数据可以下载！');
                }
            });
            originalButton.parentNode.insertBefore(clonedButton, originalButton.nextSibling);
        }
    }

    // 请求捕获
    var targetURL = 'https://10.242.33.155/api/data/batch-exec/batch-sql-execution';
    var originalFetch = window.fetch;
    window.fetch = function(input, init) {
        return originalFetch(input, init).then(function(response) {
            if (response.url === targetURL) {
                return response.clone().text().then(function(text) {
                    console.log('已成功获取');
                    var responseData = JSON.parse(text);
                    let tabName = responseData.data.data[0].tabName
                    addButton(responseData,tabName);
                    return response;
                })
            } else {
                return response;
            }
        });
    };
})();