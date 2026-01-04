// ==UserScript==
// @name         WX-text
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/mission/6293/label*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/498785/WX-text.user.js
// @updateURL https://update.greasyfork.org/scripts/498785/WX-text.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义所有可能的XPath
    const xpaths = {
        '质检合格': {
            标注时间: 'XPath_质检合格_标注时间',
            工单id: 'XPath_质检合格_工单id',
            标注员: 'XPath_质检合格_标注员',
            质检员: 'XPath_质检合格_质检员',
            纠错类型: 'XPath_质检合格_纠错类型',
            错误原因: 'XPath_质检合格_错误原因',
            审核结果: 'XPath_质检合格_审核结果',
            当前状态: '质检合格',
            质检时间: 'XPath_质检合格_质检时间'
        },
        '不合格待确认': {
            标注时间: 'XPath_不合格待确认_标注时间',
            工单id: 'XPath_不合格待确认_工单id',
            标注员: 'XPath_不合格待确认_标注员',
            质检员: 'XPath_不合格待确认_质检员',
            纠错类型: 'XPath_不合格待确认_纠错类型',
            错误原因: 'XPath_不合格待确认_错误原因',
            审核结果: 'XPath_不合格待确认_审核结果',
            当前状态: '不合格待确认',
            质检时间: 'XPath_不合格待确认_质检时间'
        },
        '不合格已确认': {
            标注时间: 'XPath_不合格已确认_标注时间',
            工单id: 'XPath_不合格已确认_工单id',
            标注员: 'XPath_不合格已确认_标注员',
            质检员: 'XPath_不合格已确认_质检员',
            纠错类型: 'XPath_不合格已确认_纠错类型',
            错误原因: 'XPath_不合格已确认_错误原因',
            审核结果: 'XPath_不合格已确认_审核结果',
            当前状态: '不合格已确认',
            质检时间: 'XPath_不合格已确认_质检时间'
        },
        '申诉待处理': {
            标注时间: 'XPath_申诉待处理_标注时间',
            工单id: 'XPath_申诉待处理_工单id',
            标注员: 'XPath_申诉待处理_标注员',
            质检员: 'XPath_申诉待处理_质检员',
            纠错类型: 'XPath_申诉待处理_纠错类型',
            错误原因: 'XPath_申诉待处理_错误原因',
            审核结果: 'XPath_申诉待处理_审核结果',
            当前状态: '申诉待处理',
            质检时间: 'XPath_申诉待处理_质检时间'
        },
        '申诉失败': {
            标注时间: 'XPath_申诉失败_标注时间',
            工单id: 'XPath_申诉失败_工单id',
            标注员: 'XPath_申诉失败_标注员',
            质检员: 'XPath_申诉失败_质检员',
            纠错类型: 'XPath_申诉失败_纠错类型',
            错误原因: 'XPath_申诉失败_错误原因',
            审核结果: 'XPath_申诉失败_审核结果',
            当前状态: '申诉失败',
            质检时间: 'XPath_申诉失败_质检时间'
        },
        '申诉成功': {
            标注时间: 'XPath_申诉成功_标注时间',
            工单id: 'XPath_申诉成功_工单id',
            标注员: 'XPath_申诉成功_标注员',
            质检员: 'XPath_申诉成功_质检员',
            纠错类型: 'XPath_申诉成功_纠错类型',
            错误原因: 'XPath_申诉成功_错误原因',
            审核结果: 'XPath_申诉成功_审核结果',
            当前状态: '申诉成功',
            质检时间: 'XPath_申诉成功_质检时间'
        }
    };

    // 动态等待某个元素加载完成
    async function waitForElement(xpath, timeout = 30000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // 每0.5秒检查一次
        }
        throw new Error(`Timeout waiting for element with XPath: ${xpath}`);
    }

    // 获取页面中的目标元素
    async function getData() {
        console.log('使用XPath获取数据');
        let data = {};
        try {
            // 获取当前状态
            const 当前状态 = document.evaluate('/html/body/当前状态的XPath', document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
            data['当前状态'] = 当前状态;

            // 使用当前状态选择合适的XPath
            for (let key in xpaths[当前状态]) {
                if (key !== '当前状态') {
                    try {
                        await waitForElement(xpaths[当前状态][key]);
                        const value = document.evaluate(xpaths[当前状态][key], document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                        data[key] = value || '';
                    } catch (err) {
                        console.warn(`Failed to get ${key} for status ${当前状态}: ${err.message}`);
                        data[key] = '';
                    }
                }
            }

            // 输出提取的数据到控制台
            console.log(`提取的数据: `, data);

        } catch (err) {
            console.error('获取数据时出错: ', err);
        }
        return data;
    }

    // 将数据转换为 CSV 格式
    function convertToCSV(data) {
        const headers = Object.keys(data);
        const rows = headers.map(header => data[header]).join(',');
        const csv = [headers.join(','), rows].join('\n');
        console.log(`CSV 内容: \n${csv}`);
        return csv;
    }

    // 触发 CSV 文件下载
    function downloadCSV(data) {
        const csvContent = convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('CSV 文件已下载');
    }

    // 跳转到指定页码
    async function goToPage(pageNumber) {
        let pageButton;
        if (pageNumber <= 7) {
            pageButton = document.querySelector(`li.number:nth-child(${pageNumber + 1})`);
        } else {
            // 当页码为8或以上时，使用不同的选择器
            pageButton = document.querySelector(`li.number:nth-child(5)`);
            const nextButton = document.querySelector(`li.number:nth-child(6)`);
            if (pageButton) {
                pageButton.click();
                console.log(`跳转到第 ${pageNumber} 页`);
                await waitForElement('目标元素的XPath');
            }
            if (nextButton) {
                nextButton.click();
                console.log(`跳转到第 ${pageNumber + 1} 页`);
                await waitForElement('目标元素的XPath');
            }
            return;
        }
        if (pageButton) {
            pageButton.click();
            console.log(`跳转到第 ${pageNumber} 页`);
            await waitForElement('目标元素的XPath');
        } else {
            console.log(`找不到第 ${pageNumber} 页的按钮`);
        }
    }

    // 主函数
    async function main() {
        let data = [];
        const numPages = 20; // 设置要获取的页数，可以根据需要调整
        for (let i = 1; i <= numPages; i++) {
            console.log(`处理第 ${i} 页`);
            await goToPage(i); // 跳转到指定页码
            await new Promise(resolve => setTimeout(resolve, 3000)); // 等待页面加载完成

            // 获取数据并存入数组
            const pageData = await getData();
            data.push(pageData);
        }
        downloadCSV(data); // 下载CSV文件
    }

    // 在页面上添加按钮以触发数据提取和下载
    function addButton() {
        const button = document.createElement('button');
        button.textContent = '导出数据';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.onclick = () => {
            main(); // 点击按钮时执行主函数
        };

        document.body.appendChild(button);
        console.log('导出按钮已添加');
    }

    // 初始化
    function init() {
        addButton(); // 添加导出按钮
    }

    // 等待页面加载完成后执行初始化
    window.addEventListener('load', init);

})();
