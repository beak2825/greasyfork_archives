// ==UserScript==
// @name         聚合引擎快照解析
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  及时雨解析脚本
// @author       You
// @match        https://*.sankuai.com/client/internal/deploy-record/Page*
// @run-at       document-body
// @icon         https://awp-assets.sankuai.com/payfe/keqing-platform-client/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520892/%E8%81%9A%E5%90%88%E5%BC%95%E6%93%8E%E5%BF%AB%E7%85%A7%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/520892/%E8%81%9A%E5%90%88%E5%BC%95%E6%93%8E%E5%BF%AB%E7%85%A7%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const createElement = () => {
        const div = document.createElement('div');
        const button = document.createElement('button');
        const textarea = document.createElement('textarea');

        button.textContent = '进行快照解析';
        setButtonStyle(button);
        setTextareaStyle(textarea);
        setContainerStyle(div);

        div.appendChild(button);
        div.appendChild(textarea);

        document.body.appendChild(div);

        button.addEventListener('click', parseSnapshot);
    };

    const setButtonStyle = (button) => {
        button.style.display = 'block';
        button.style.width = '100px';
        button.style.height = '50px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
    };

    const setTextareaStyle = (textarea) => {
        textarea.style.width = '400px';
        textarea.style.height = '100px';
        textarea.style.border = '1px solid black';
    };

    const setContainerStyle = (div) => {
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.zIndex = 9999;
        div.style.padding = '10px';
    };

    const parseSnapshot = () => {
        if (document.querySelector('#snapshot_parse_container')) {
            return;
        }
        const inputValue = document.querySelector('textarea').value;
        try {
            const obj = JSON.parse(inputValue);
            if (!Array.isArray(obj?.executableRules)) {
                throw new Error('快照找不到合法的可执行分组');
            }
            obj.executableRules = obj.executableRules.map((r, index) => {
                return {
                    index,
                    ruleName: r.ruleName,
                    conditionExpression: r.conditionExpression,
                    action: r.actions?.[0].actionAttrsExpression
                };
            });
            createTable(obj.executableRules);
        } catch (err) {
            alert(err.message);
        }
    };

    const createTable = (dataArray) => {
        console.table(dataArray);

        const container = document.createElement('div');
        setTableContainerStyle(container);

        const closeButton = document.createElement('button');
        setCloseButtonStyle(closeButton, container);

        const tableWrapper = document.createElement('div');
        setTableWrapperStyle(tableWrapper);

        const table = document.createElement('table');
        setTableStyle(table);

        createTableHeader(table);
        createTableContent(table, dataArray);
        container.setAttribute('id', 'snapshot_parse_container');

        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);

        document.querySelector('#app').appendChild(closeButton);
        document.body.appendChild(container);

        makeResizable(container);
        makeDraggable(container);
    };

    const setTableContainerStyle = (container) => {
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '20px';
        container.style.maxWidth = '95vw';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ccc';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.zIndex = '1000';
        container.style.padding = '10px';
        container.style.maxHeight = '95vh';
        container.style.overflowY = 'auto';
        container.style.resize = 'both';
        container.style.overflow = 'auto';
    };

    const setTableWrapperStyle = (wrapper) => {
        wrapper.style.overflowY = 'auto';
        wrapper.style.maxHeight = '80vh';
    };

    const setCloseButtonStyle = (closeButton, container) => {
        closeButton.textContent = '关闭表格';
        closeButton.style.marginBottom = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.position = 'fixed';
        closeButton.style.zIndex = 9999;
        closeButton.style.top = '0';
        closeButton.style.left = '0';
        closeButton.style.background = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.display = 'block';

        closeButton.onclick = function() {
            document.body.removeChild(container);
            document.querySelector('#app').removeChild(closeButton);
        };
    };

    const setTableStyle = (table) => {
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
    };

    const createTableHeader = (table) => {
        const headerRow = document.createElement('tr');
        const headers = ['序号', '分组名称', '规则表达式', '配置内容'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd';
            th.style.padding = '4px';
            th.style.backgroundColor = '#f2f2f2';
            th.style.position = 'sticky';
            th.style.top = '0';
            th.style.background = 'white';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    };

    const createTableContent = (table, dataArray) => {
        dataArray.forEach(item => {
            const row = document.createElement('tr');
            Object.values(item).forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                td.ondblclick = () => {
                    td.contentEditable = true;
                    td.focus();
                };
                td.onblur = () => {
                    td.contentEditable = false;
                };
                row.appendChild(td);
            });
            row.onmouseover = () => row.style.backgroundColor = '#e0e0e0';
            row.onmouseout = () => row.style.backgroundColor = '';
            table.appendChild(row);
        });
    };

    const makeResizable = (element) => {
        element.style.resize = 'both';
        element.style.overflow = 'auto';
    };

    const makeDraggable = (element) => {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            const computedStyle = window.getComputedStyle(element);
            const rightEdge = parseInt(computedStyle.right, 10);
            const bottomEdge = parseInt(computedStyle.bottom, 10);

            // Check if the click is near the resize area (bottom-right corner)
            if (e.offsetX > element.clientWidth - 10 && e.offsetY > element.clientHeight - 10) {
                return; // Don't trigger dragging if resizing
            }

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            element.style.cursor = 'move';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    };

    createElement();
})();
