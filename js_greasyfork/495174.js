// ==UserScript==
// @name         绩点计算
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  吉大绩点自定义计算，进入教务成绩查询，选择全部成绩，右下角显示100或者200
// @author       xxxxzui
// @match        https://iedu.jlu.edu.cn/jwapp/sys/cjcx/*
// @match        https://vpn.jlu.edu.cn/https/*/jwapp/sys/cjcx/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495174/%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/495174/%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cau() {
        const b = document.getElementById('pinnedtableqb-index-table').rows;
        const ans = []; // 初始化二维数组

        // 遍历每个 <tr> 元素
        for (let i = 0; i < b.length; i++) {
            const tr = b[i]; // 获取当前的 <tr> 元素
            const row = []; // 初始化当前行数组
            const tdElements = tr.getElementsByTagName("td");

            // 遍历每个 <td> 元素并获取内容
            for (let j = 0; j < tdElements.length; j++) {
                const td = tdElements[j];
                const tdContent = getTDContent(td);
                row.push(tdContent);
            }

            ans.push(row);
        }

        const result = [];
        for (let i = 0; i < ans.length; i++) {
            const tem = [];
            tem[0] = ans[i][3];
            tem[1] = ans[i][7];
            tem[2] = ans[i][8];
            tem[3] = ans[i][1];
            tem[4] = ans[i][13];
            result[i] = tem;
        }

        return result;

        // 递归函数用于获取 <td> 元素的内容
        function getTDContent(td) {
            let content = ""; // 初始化内容字符串
            for (let k = 0; k < td.childNodes.length; k++) {
                const node = td.childNodes[k]; // 获取当前子节点
                if (node.nodeType === Node.TEXT_NODE) {
                    content += node.textContent.trim();
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    content += getTDContent(node);
                }
            }
            return content;
        }
    }

    // 创建按钮
    const createButton = (id, text, onClick) => {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    };

    // 初始化界面
    const initUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        container.style.maxHeight = '400px';
        container.style.width = '600px';
        container.style.overflowY = 'auto';
        container.style.resize = 'both';
        container.id = 'popupContainer';

        // 使界面可拖动
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'default';
        });

        const popupTable = document.createElement('table');
        popupTable.id = 'popupTable';
        popupTable.style.width = '100%';
        popupTable.style.borderCollapse = 'collapse';
        popupTable.style.border = '1px solid #ddd'; // 增加表格边框

        const resultContainer = document.createElement('div');
        resultContainer.id = 'resultContainer';

        const buttons = [
            { id: 'sendMessageBtn', text: '获取成绩', onClick: fetchResults },
            { id: 'calculateBtn', text: '计算', onClick: calculateGPA },
            { id: 'compulsoryBtn', text: '必修', onClick: () => toggleRowsByProperty('必修') },
            { id: 'electiveBtn', text: '选修', onClick: () => toggleRowsByProperty('选修') },
            { id: 'limitedBtn', text: '限选', onClick: () => toggleRowsByProperty('限选') }
        ];

        buttons.forEach(button => container.appendChild(createButton(button.id, button.text, button.onClick)));
        container.appendChild(popupTable);
        container.appendChild(resultContainer);
        document.body.appendChild(container);

        // 添加提示信息
        const instruction = document.createElement('div');
        instruction.id = 'instruction';
        instruction.textContent = '请在成绩查询页面内选择【全部】，并将右下角的显示条数更改为100或200';
        instruction.style.marginTop = '10px';
        instruction.style.color = 'red';
        container.appendChild(instruction);
    };

    const fetchResults = () => {
        const data = cau();
        if (data.length === 0) {
            document.getElementById('instruction').style.display = 'block';
        } else {
            document.getElementById('instruction').style.display = 'none';
            displayData(data);
        }
    };

    const displayData = (data) => {
        const popupTable = document.getElementById('popupTable');
        popupTable.innerHTML = ''; // 清空表格

        // 创建表头
        const headerRow = popupTable.insertRow();
        ['科目', '性质', '学分', '分数', '绩点', '选择'].forEach(item => {
            const th = document.createElement('th');
            th.textContent = item;
            th.style.border = '1px solid #ddd'; // 增加表格边框
            headerRow.appendChild(th);
        });

        data.forEach(item => {
            const row = popupTable.insertRow();
            item.forEach(cellData => {
                const cell = row.insertCell();
                cell.textContent = cellData;
                cell.style.border = '1px solid #ddd'; // 增加表格边框
            });
            const checkboxCell = row.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('checkbox');
            checkboxCell.appendChild(checkbox);
            checkboxCell.style.border = '1px solid #ddd'; // 增加表格边框
        });
    };

    const toggleRowsByProperty = (property) => {
        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            const row = checkbox.parentNode.parentNode;
            const propertyCell = row.cells[1];
            if (propertyCell.textContent === property) {
                checkbox.checked = !checkbox.checked;
            }
        });
    };

    const calculateGPA = () => {
        const checkedCheckboxes = document.querySelectorAll('.checkbox:checked');
        const selectedCoursesCount = checkedCheckboxes.length;
        let totalCredits = 0;
        let totalGradePoints = 0;

        checkedCheckboxes.forEach(checkbox => {
            const row = checkbox.parentNode.parentNode;
            const credits = parseFloat(row.cells[2].textContent);
            const gradePoints = parseFloat(row.cells[4].textContent);

            totalCredits += credits;
            totalGradePoints += credits * gradePoints;
        });

        const averageGPA = totalGradePoints / totalCredits;
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = `
            <p>选择了 ${selectedCoursesCount} 门课程</p>
            <p>总学分: ${totalCredits}</p>
            <p>总绩点: ${totalGradePoints}</p>
            <p>平均绩点: ${averageGPA.toFixed(2)}</p>
        `;
    };

    // 初始化界面
    initUI();
})();
