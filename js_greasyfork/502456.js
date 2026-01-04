// ==UserScript==
// @name         立创商城bom匹配结果排序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Supported by GPT
// @author       tumuyan
// @match        https://bom.szlcsc.com/member/eda/search.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502456/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8Ebom%E5%8C%B9%E9%85%8D%E7%BB%93%E6%9E%9C%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502456/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8Ebom%E5%8C%B9%E9%85%8D%E7%BB%93%E6%9E%9C%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建悬浮窗
    const floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '10px';
    floatingDiv.style.left = '10px'; // 改为左上角
    floatingDiv.style.backgroundColor = 'white';
    floatingDiv.style.border = '1px solid #ccc';
    floatingDiv.style.padding = '10px';
    floatingDiv.style.zIndex = '16777271';
    floatingDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    // 添加提示文本
    const label = document.createElement('label');
    label.innerText = '排序方式: ';
    floatingDiv.appendChild(label);

    // 创建下拉菜单
    const select = document.createElement('select');
    const options = ['品牌', '名称', '封装', '广东仓', '江苏仓', '交期','MOQ'];

    // 默认第一个选项为空
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = '请选择';
    select.appendChild(defaultOption);

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        select.appendChild(opt);
    });

    // 处理选择变化
    select.addEventListener('change', function() {
        const orderby = select.value ? select.value + '：' : '';
        highlightSelectedOption(select);
        if (orderby) {
            sortTable(orderby);
        }
    });

    floatingDiv.appendChild(select);
    document.body.appendChild(floatingDiv);

    // 高亮选中的选项
    function highlightSelectedOption(selectElement) {
        Array.from(selectElement.options).forEach(option => {
            option.style.backgroundColor = option.selected ? '#d3d3d3' : '';
        });
    }

    // 排序表格
    function sortTable(orderby) {
        const rows = Array.from(document.querySelectorAll('tr.el-table__row'));
        rows.sort((a, b) => {
            const textA = getTextAfterLabel(a, orderby.replace('：', ''));
            const textB = getTextAfterLabel(b, orderby.replace('：', ''));
            const numA = parseFloat(textA);
            const numB = parseFloat(textB);

            // 如果都可以解析为正数，优先按数值排序
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            } else if (!isNaN(numA)) {
                return -1; // numA 是数值，排在前面
            } else if (!isNaN(numB)) {
                return 1; // numB 是数值，排在前面
            } else {
                return textA.localeCompare(textB); // 否则按文本排序
            }
        });

        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = '';
            rows.forEach(row => {
                tableBody.appendChild(row);
            });
        }
    }

    // 获取指定元素之后的文本
    function getTextAfterLabel(row, label) {
        const cells = row.querySelectorAll('td');
        for (let cell of cells) {
            if (cell.textContent.includes(label + '：')) {
                const text = cell.textContent.split(label + '：')[1];
                return text ? text.trim() : '';
            }
        }
        return '';
    }

    // 页面重载时恢复为第一个选项
    window.addEventListener('load', () => {
        select.selectedIndex = 0; // 恢复为第一个选项
        highlightSelectedOption(select);
    });
})();