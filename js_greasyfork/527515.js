// ==UserScript==
// @name         夸克项目推广查询
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @license      MIT
// @description  多UID选择查询（列表按钮形式）+合计列+美化浮动窗口+拖动功能！
// @author       PYY
// @match        https://dt.bd.cn/main/quark_list**
// @match        https://csj.sgj.cn/main/sfsjcx**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bd.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527515/%E5%A4%B8%E5%85%8B%E9%A1%B9%E7%9B%AE%E6%8E%A8%E5%B9%BF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527515/%E5%A4%B8%E5%85%8B%E9%A1%B9%E7%9B%AE%E6%8E%A8%E5%B9%BF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uidList = [
        { name: '我想我是海', uid: '100188018441' },
        { name: '夸父资源家', uid: '100742154062' },
    ];

    function createUIDButtons() {
        const container = document.createElement('div');
        container.id = 'quark-uid-selector';
        container.innerHTML = `
            <div class="uid-btn-list">
                ${uidList.map(u => `<button class="uid-btn" data-uid="${u.uid}">${u.name}</button>`).join('')}
            </div>
        `;
        document.body.appendChild(container);

        container.querySelectorAll('.uid-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                triggerQuery(btn.dataset.uid);
            });
        });

        // 默认触发第一个
        setTimeout(() => {
            triggerQuery(uidList[0].uid);
        }, 1000);
    }

    function triggerQuery(uid) {
        const inputElement = document.querySelector('input[placeholder="请输入夸克UID查询"]');
        if (inputElement) {
            inputElement.value = uid;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const submitDiv = document.querySelector('.submit');
        if (submitDiv) {
            submitDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
    }

    function addHeaderColumn() {
        const header = document.querySelector('.row.table_header');
        if (header && !header.querySelector('.custom-total-header')) {
            const headerCell = document.createElement('div');
            headerCell.textContent = '合计';
            headerCell.className = 'custom-total-header';
            headerCell.style.fontWeight = 'bold';
            headerCell.style.backgroundColor = '#f2f2f2';
            header.appendChild(headerCell);
        }
    }

    function calculateTotal(cells) {
        const col1 = parseFloat(cells[2]?.textContent.trim()) || 0;
        const col2 = parseFloat(cells[3]?.textContent.trim()) || 0;
        const col3 = parseFloat(cells[4]?.textContent.trim()) || 0;
        const col4 = parseFloat(cells[5]?.textContent.trim()) || 0;
        return col1 * 7 + col2 * 3 + col3 * 0.3 + col4;
    }

    function addTotalColumnToRow(row) {
        if (row.querySelector('.custom-total-cell')) return;

        const cells = row.querySelectorAll('div');
        const total = calculateTotal(cells);

        const sumDiv = document.createElement('div');
        sumDiv.textContent = total.toFixed(2);
        sumDiv.className = 'custom-total-cell';
        sumDiv.style.fontWeight = 'bold';
        sumDiv.style.color = '#007bff';
        row.appendChild(sumDiv);
    }

    function addTotalToAllRows() {
        const rows = document.querySelectorAll('.row.table_body_item');
        rows.forEach(addTotalColumnToRow);
    }

    function observeLazyLoading() {
        const tableBody = document.querySelector('.table_body');
        if (!tableBody) return;

        const observer = new MutationObserver(() => {
            addTotalColumnToRowHeader();
            addTotalToAllRows();
        });

        observer.observe(tableBody, { childList: true, subtree: true });
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .row > div {
                padding: 4px 8px;
                min-width: 60px;
                text-align: center;
            }

            #quark-uid-selector {
                position: fixed;
                bottom: 700px;
                right: 20px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 12px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                font-family: "Helvetica Neue", sans-serif;
                z-index: 9999;
                cursor: move;
            }

            #quark-uid-selector .header {
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
                font-size: 14px;
                cursor: move;
            }

            .uid-btn-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .uid-btn {
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 6px 10px;
                font-size: 13px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .uid-btn:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(style);
    }

    function enableDrag(id) {
        const el = document.getElementById(id);
        let offsetX = 0, offsetY = 0, isDown = false;

        el.addEventListener('mousedown', function (e) {
            if (!e.target.classList.contains('header')) return;
            isDown = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });

        document.addEventListener('mouseup', () => isDown = false);

        document.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.position = 'fixed';
        });
    }

    function addTotalColumnToRowHeader() {
        addHeaderColumn();
    }

    // 初始化
    window.addEventListener('load', () => {
        createUIDButtons();
        addStyles();
        setTimeout(() => {
            addTotalColumnToRowHeader();
            addTotalToAllRows();
            observeLazyLoading();
            enableDrag('quark-uid-selector');
        }, 1500);
    });
})();
