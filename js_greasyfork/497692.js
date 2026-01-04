// ==UserScript==
// @name         Appstoreconnect一键下载为xlsx付款和财务报告
// @namespace    https://github.com/JoanLeeo/appstoreconnect_payments_and_financial_reports_savetoxlsx
// @version      0.1
// @description  Appstoreconnect 一键下载付款报告为xlsx格式文件
// @author       mr.wendao
// @match        https://appstoreconnect.apple.com/itc/payments_and_financial_reports
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497692/Appstoreconnect%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%B8%BAxlsx%E4%BB%98%E6%AC%BE%E5%92%8C%E8%B4%A2%E5%8A%A1%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/497692/Appstoreconnect%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%B8%BAxlsx%E4%BB%98%E6%AC%BE%E5%92%8C%E8%B4%A2%E5%8A%A1%E6%8A%A5%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    async function downloadAndConvert() {
        var link = document.querySelector('.rightside .actions.flexdist.linkable a');
        if (!link) return;

        var url = link.href;
        var response = await fetch(url);
        var csvData = await response.text();

        // 获取下载文件名字
        var urlParams = new URLSearchParams(link.search);
        var year = urlParams.get('year');
        var month = urlParams.get('month');
        // 保存文件名字
        var fileName = year + month + '.xlsx';

        convertCSVtoXLSX(csvData, fileName);
    }

    function convertCSVtoXLSX(csvData, fileName) {
        // 使用 PapaParse 解析 CSV 数据
        const parsedData = Papa.parse(csvData, {skipEmptyLines: false});
        if (parsedData.errors.length > 0) {
            console.error('Error parsing CSV:', parsedData.errors);
            return;
        }

        // 创建工作表（worksheet）
        const worksheet = XLSX.utils.aoa_to_sheet(parsedData.data);

        // 估算字符串宽度的函数，以 Excel 列宽单位为基准
        function getWidth(str) {
            const fontWidth = 7; // 假设一个字符的宽度为 7 像素
            const pixelWidth = str.split('').reduce((sum, char) => {
                const code = char.charCodeAt(0);
                if (code >= 0x4e00 && code <= 0x9fff) {
                    return sum + 14; // 中文字符的宽度较宽，设为 14 像素
                } else if (code > 127) {
                    return sum + 10; // 非 ASCII 字符的宽度设为 10 像素
                } else {
                    return sum + fontWidth; // ASCII 字符的宽度设为 7 像素
                }
            }, 0);
            const excelWidth = Math.ceil(pixelWidth / fontWidth);
            return Math.max(10, Math.min(50, excelWidth)); // 设置最小和最大宽度
        }

        // 根据内容长度计算每列的宽度
        const colWidths = parsedData.data[0].map((_, colIndex) => {
            let maxWidth = 10; // 设置默认最小宽度
            parsedData.data.forEach(row => {
                const cellValue = row[colIndex] || '';

                const cellLength = getWidth(cellValue.toString());
                // console.log('cellValue', cellValue, 'cellLength', cellLength);
                if (cellLength > maxWidth) {
                    maxWidth = cellLength;
                }
            });
            return {wch: maxWidth};
        });
        // console.log('colWidths', colWidths);

        // 将计算得到的列宽设置到工作表中
        worksheet['!cols'] = colWidths;

        // 创建新的工作簿（workbook）并添加工作表
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 将工作簿写入数组并创建 Blob 对象
        const xlsxFile = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const blob = new Blob([xlsxFile], {type: 'application/octet-stream'});

        // 创建下载链接并下载文件
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }


    // 获取需要监控的父节点
    const parentObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                // console.log("检测。。。")
                if (node.nodeType === Node.ELEMENT_NODE) {

                    // 判断node下是否有需要监控的节点
                    let aim_node = node.querySelector('.rightside .actions.flexdist.linkable');
                    if (aim_node) {
                        // console.log('aim_node', aim_node);
                        // 获取aim_node的父节点
                        const parentNode = aim_node.parentNode;
                        parentNode.style = 'display: flex;';

                        const button_node = parentNode.querySelector('button');
                        if (!button_node) {
                            // 添加一个下载按钮
                            const button = document.createElement('button');
                            button.innerHTML = 'Download as XLSX';
                            button.addEventListener('click', downloadAndConvert);
                            parentNode.insertBefore(button, aim_node);
                        }
                    }
                }
            });
        });
    });

    // 监听
    parentObserver.observe(document.body, {
        childList: true,
        subtree: true // 监控所有子节点的变化
    });

})();