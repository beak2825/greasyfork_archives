// ==UserScript==
// @name         车辆调度信息提取
// @namespace    车辆调度信息提取
// @version      1.9.1
// @description  提取特定网页的车辆调度信息并实现一键复制功能
// @match        https://ibpm.h3c.com/bpm/rule?wf_num=R_S003_B036*
// @match        https://ibpm.h3c.com/bpm/rule?wf_num=R_S003_B062*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/517705/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517705/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractVehicleDispatchInfo() {
        // 定义提取信息的函数
        const extractTextOrValue = (selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                return '未提供';
            }
            const textContent = element.textContent ? element.textContent.trim() : '';
            const valueContent = element.value ? element.value.trim() : '';
            return textContent || valueContent || '未提供';
        };

        const visitorUnit = extractTextOrValue('#LBDW');
        const customerList = extractTextOrValue('#KHMD');
        const costDept = extractTextOrValue('#SYBM');
        const deptCode = extractTextOrValue('#SYBMBM');
        const industryCode = extractTextOrValue('#SYHYBM');

        let electronicFlowNumber = '未提供';
        const tdElements = document.querySelectorAll('td');

        for (const td of tdElements) {
            // 提取“流程单号”信息
            const match = td.innerHTML.match(/流程单号:(\d{8}-\d{3}-\w+-\w+)/);
            if (match) {
                electronicFlowNumber = match[1];
                break;
            }
        }

        // HTML内容换行处理
        const formatText = (text) => {
            const maxLineLength = 22; // 每行最大字符数
            let lines = [];
            for (let i = 0; i < text.length; i += maxLineLength) {
                lines.push(text.substring(i, i + maxLineLength));
            }
            return lines.join('<br>');
        };

        const formattedVisitorUnit = formatText(visitorUnit);
        const formattedCustomerList = formatText(customerList);
        const formattedCostDept = formatText(costDept);

        const dataTable = `
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: left; margin-top: 10px;">
                <tbody>
                    <tr><th>来客单位</th><td>${formattedVisitorUnit}</td></tr>
                    <tr><th>客户名单</th><td>${formattedCustomerList}</td></tr>
                    <tr><th>电子流编号</th><td>${electronicFlowNumber}</td></tr>
                    <tr><th>费用归口部门</th><td>${formattedCostDept}</td></tr>
                    <tr><th>部门编码</th><td>${deptCode}</td></tr>
                    <tr><th>行业编码</th><td>${industryCode}</td></tr>
                </tbody>
            </table>
        `;

        let displayArea = document.querySelector('#vehicle-info-display');
        if (!displayArea) {
            displayArea = document.createElement('div');
            displayArea.id = 'vehicle-info-display';
            displayArea.style.position = 'fixed';
            displayArea.style.bottom = '10px';
            displayArea.style.right = '10px';
            displayArea.style.backgroundColor = '#ffffff';
            displayArea.style.padding = '10px';
            displayArea.style.border = '1px solid #ddd';
            displayArea.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            displayArea.style.borderRadius = '6px';
            displayArea.style.zIndex = '1000';
            displayArea.style.fontSize = '14px';
            document.body.appendChild(displayArea);
        }

        displayArea.innerHTML = dataTable;

        const copyButton = document.createElement('button');
        copyButton.textContent = '一键复制';
        copyButton.style.marginTop = '10px';
        copyButton.style.padding = '8px 15px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.backgroundColor = '#007BFF';
        copyButton.style.color = '#000000';
        copyButton.style.fontSize = '14px';
        copyButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        displayArea.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const copyText = `${visitorUnit}\t${customerList}\t${electronicFlowNumber}\t${costDept}\t${deptCode}\t${industryCode}`;
            navigator.clipboard.writeText(copyText).then(() => {
                copyButton.textContent = '复制成功!';
                setTimeout(() => {
                    copyButton.textContent = '一键复制';
                }, 2000); // 2秒后恢复文本
            }).catch((err) => {
                console.error('复制失败: ', err);
            });
        });
    }

    if (document.readyState === 'complete') {
        extractVehicleDispatchInfo();
    } else {
        window.addEventListener('load', extractVehicleDispatchInfo, { once: true });
    }
})();