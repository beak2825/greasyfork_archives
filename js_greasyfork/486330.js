// ==UserScript==
// @name         hidemy.io export/copy IP:PORT to json,excel,plain text
// @namespace    HashCrusher
// @version      1.0
// @description  copy ip:port to clipboard or export to txt, export ip table to excel, ip table copy/export to json
// @author       HashCrusher
// @match        https://hidemy.io/*/proxy-list/*
// @match        https://hidemy.name/*/proxy-list/*
// @match        https://hidemyna.me/*/proxy-list/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hidemy.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486330/hidemyio%20exportcopy%20IP%3APORT%20to%20json%2Cexcel%2Cplain%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/486330/hidemyio%20exportcopy%20IP%3APORT%20to%20json%2Cexcel%2Cplain%20text.meta.js
// ==/UserScript==

(function () {
    'use strict';

     var mainMenu = document.querySelector('.main_menu');
        if (mainMenu) {
            mainMenu.style.marginLeft = '-170px';
        }

    window.addEventListener('load', function() {
        removeElement('a.btn_1.pay_access_btn[href="/en/order/vpn/"]');
        removeElement('a.logo[href="/en/"][aria-label="logo"]');
        removeElement('li a[itemprop="url"][href="/en/vpn/"]');
    });

    function removeElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    }

    var xlsxScript = document.createElement('script');
    xlsxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js';
    document.head.appendChild(xlsxScript);

    var style = document.createElement('style');
    style.textContent = `
        button:hover {
            filter: grayscale(80%);
        }
    `;
    document.head.appendChild(style);

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function exportToTextFile(text, fileName) {
        const fullFileName = `${fileName}.txt`;
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fullFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function exportToExcel(tableData, fileName) {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    function exportToJSON(tableData, fileName) {
        const jsonContent = JSON.stringify(tableData, null, 2);
        const fullFileName = `${fileName}.json`;
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fullFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function extractAndCopyOrExportIPPort(mode) {
        const ipPortList = [];
        const tableRows = document.querySelectorAll('table tbody tr');

        tableRows.forEach((row) => {
            const ip = row.querySelector('td:nth-child(1)').textContent.trim();
            const port = row.querySelector('td:nth-child(2)').textContent.trim();
            const ipPort = `${ip}:${port}`;
            ipPortList.push(ipPort);
        });

        const ipPortString = ipPortList.join('\n');

        if (mode === 'copy') {
            copyToClipboard(ipPortString);
        } else if (mode === 'export') {
            const fileName = prompt('Enter the file name (without extension):', 'ip_port_list');
            if (fileName) {
                exportToTextFile(ipPortString, fileName);
                alert(`IP:Port from table exported to ${fileName}.txt!`);
            } else {
                // Handle cancel or empty fileName
            }
        } else if (mode === 'excel') {
            const tableData = [];
            tableRows.forEach((row) => {
                const rowData = {
                    'IP address': row.querySelector('td:nth-child(1)').textContent.trim(),
                    'Port': row.querySelector('td:nth-child(2)').textContent.trim(),
                    'Country, City': row.querySelector('td:nth-child(3)').textContent.trim(),
                    'Speed': row.querySelector('td:nth-child(4) .bar p').textContent.trim(),
                    'Type': row.querySelector('td:nth-child(5)').textContent.trim(),
                    'Anonymity': row.querySelector('td:nth-child(6)').textContent.trim(),
                };
                tableData.push(rowData);
            });

            const fileName = prompt('Enter the file name (without extension):', 'ip_port_list');
            if (fileName) {
                exportToExcel(tableData, fileName);
                alert(`IP table exported to ${fileName}.xlsx!`);
            } else {
                // Handle cancel or empty fileName
            }
        } else if (mode === 'json') {
            const tableData = [];
            tableRows.forEach((row) => {
                const rowData = {
                    'IP address': row.querySelector('td:nth-child(1)').textContent.trim(),
                    'Port': row.querySelector('td:nth-child(2)').textContent.trim(),
                    'Location': row.querySelector('td:nth-child(3)').textContent.trim(),
                    'Speed': row.querySelector('td:nth-child(4) .bar p').textContent.trim(),
                    'Type': row.querySelector('td:nth-child(5)').textContent.trim(),
                    'Anonymity': row.querySelector('td:nth-child(6)').textContent.trim(),
                };
                tableData.push(rowData);
            });

            const fileName = prompt('Enter the file name (without extension):', 'ip_port_list');
            if (fileName) {
                exportToJSON(tableData, fileName);
                alert(`IP table exported to ${fileName}.json!`);
            } else {
                // Handle cancel or empty fileName
            }
        } else if (mode === 'copyJSON') {
            const tableData = [];
            tableRows.forEach((row) => {
                const rowData = {
                    'IP address': row.querySelector('td:nth-child(1)').textContent.trim(),
                    'Port': row.querySelector('td:nth-child(2)').textContent.trim(),
                    'Location': row.querySelector('td:nth-child(3)').textContent.trim(),
                    'Speed': row.querySelector('td:nth-child(4) .bar p').textContent.trim(),
                    'Type': row.querySelector('td:nth-child(5)').textContent.trim(),
                    'Anonymity': row.querySelector('td:nth-child(6)').textContent.trim(),
                };
                tableData.push(rowData);
            });

            copyToClipboard(JSON.stringify(tableData, null, 2));
        }
    }

    function addButton(mode, buttonText) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.position = 'relative';
        button.style.padding = '10px 15px';
        button.style.textDecoration = 'none';
        button.style.borderRadius = '8px';
        button.style.transition = '.5s';
        button.style.left = '100px';
        button.style.background =
            'linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4)';
        button.style.backgroundSize = '400%';
        button.style.animation = 'rainbow 8s linear infinite';
        button.style.display = 'inline-block';
        button.style.marginRight = '10px';
        button.addEventListener('click', () => extractAndCopyOrExportIPPort(mode));

        const innerElement = document.querySelector('.inner');
        if (innerElement) {
            innerElement.appendChild(button);
        } else {
          
        }
    }

    addButton('copy', 'Copy IP:PORT to Clipboard');
    addButton('export', 'Export IP:PORT in TXT');
    addButton('excel', 'Export Table to EXCEL');
    addButton('json', 'Export Table to JSON');
    addButton('copyJSON', 'Copy Table as JSON');
})();