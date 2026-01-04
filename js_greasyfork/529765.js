// ==UserScript==
// @name         Keylol Table Sort
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  对keylol琪露诺折扣贴表格按价格或折扣排序
// @author       冰雪聪明琪露诺
// @match        https://keylol.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529765/Keylol%20Table%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/529765/Keylol%20Table%20Sort.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let optionsContainer;
    // 用于存储原始的表格行顺序
    let originalRows = [];

    const setupSort = () => {
        optionsContainer && optionsContainer.remove();
        const table = document.querySelector('.t_fsz table.t_table');
        if (!table) return;
        const priceHeader = [...table.rows[0].cells].find(cell => cell.textContent.includes('商店价格'));
        const reviewHeader = [...table.rows[0].cells].find(cell => cell.textContent.includes('游戏评价'));
        const nameHeader = [...table.rows[0].cells].find(cell => cell.textContent.includes('游戏名称'));
        if (!priceHeader || !reviewHeader || !nameHeader) return;

        // 存储原始行顺序
        originalRows = [...table.rows].slice(1);

        optionsContainer = document.createElement('div');
        Object.assign(optionsContainer.style, {
            position: 'absolute', display: 'none', background: 'white',
            border: '1px solid #ccc', padding: '5px', zIndex: 100
        });
        optionsContainer.className = 'keylol-sort-options';

        const priceIndex = [...table.rows[0].cells].findIndex(cell => cell.textContent.includes('商店价格'));
        const reviewIndex = [...table.rows[0].cells].findIndex(cell => cell.textContent.includes('游戏评价'));
        const nameIndex = [...table.rows[0].cells].findIndex(cell => cell.textContent.includes('游戏名称'));

        const createSortOptions = (header, options, index) => {
            let visible = false;
            header.addEventListener('click', e => {
                e.stopPropagation();
                if (visible) {
                    optionsContainer.style.display = 'none';
                    visible = false;
                } else {
                    optionsContainer.innerHTML = '';
                    options.forEach(option => {
                        const opt = document.createElement('div');
                        opt.textContent = option.text;
                        opt.style.cssText = 'cursor: pointer; padding: 5px';
                        opt.addEventListener('click', () => {
                            sortTable(table, option.fn, index);
                            optionsContainer.style.display = 'none';
                            visible = false;
                        });
                        optionsContainer.appendChild(opt);
                    });
                    const { left, bottom } = header.getBoundingClientRect();
                    const { pageXOffset, pageYOffset } = window;
                    Object.assign(optionsContainer.style, { left: left + pageXOffset + 'px', top: bottom + pageYOffset + 'px', display: 'block' });
                    visible = true;
                }
            });
        };

        const priceSortOptions = [
            { text: '按价格排序（升序）', fn: (a, b, idx) => parseFloat(a.cells[idx].textContent.match(/¥(\d+\.\d+)/)[1]) - parseFloat(b.cells[idx].textContent.match(/¥(\d+\.\d+)/)[1]) },
            { text: '按价格排序（降序）', fn: (a, b, idx) => parseFloat(b.cells[idx].textContent.match(/¥(\d+\.\d+)/)[1]) - parseFloat(a.cells[idx].textContent.match(/¥(\d+\.\d+)/)[1]) },
            { text: '按折扣排序（升序）', fn: (a, b, idx) => parseFloat(a.cells[idx].textContent.match(/-(\d+)%/)[1]) - parseFloat(b.cells[idx].textContent.match(/-(\d+)%/)[1]) },
            { text: '按折扣排序（降序）', fn: (a, b, idx) => parseFloat(b.cells[idx].textContent.match(/-(\d+)%/)[1]) - parseFloat(a.cells[idx].textContent.match(/-(\d+)%/)[1]) }
        ];

        const reviewSortOptions = [
            { text: '按好评率排序（升序）', fn: (a, b, idx) => {
                const ratingA = parseFloat(a.cells[idx].textContent.match(/(\d+)%/)[1]);
                const ratingB = parseFloat(b.cells[idx].textContent.match(/(\d+)%/)[1]);
                return ratingA === ratingB ?
                    parseInt(a.cells[idx].textContent.match(/(\d+)篇/)[1]) - parseInt(b.cells[idx].textContent.match(/(\d+)篇/)[1]) :
                    ratingA - ratingB;
            } },
            { text: '按好评率排序（降序）', fn: (a, b, idx) => {
                const ratingA = parseFloat(a.cells[idx].textContent.match(/(\d+)%/)[1]);
                const ratingB = parseFloat(b.cells[idx].textContent.match(/(\d+)%/)[1]);
                return ratingA === ratingB ?
                    parseInt(b.cells[idx].textContent.match(/(\d+)篇/)[1]) - parseInt(a.cells[idx].textContent.match(/(\d+)篇/)[1]) :
                    ratingB - ratingA;
            } },
            { text: '按评测数排序（升序）', fn: (a, b, idx) => parseInt(a.cells[idx].textContent.match(/(\d+)篇/)[1]) - parseInt(b.cells[idx].textContent.match(/(\d+)篇/)[1]) },
            { text: '按评测数排序（降序）', fn: (a, b, idx) => parseInt(b.cells[idx].textContent.match(/(\d+)篇/)[1]) - parseInt(a.cells[idx].textContent.match(/(\d+)篇/)[1]) }
        ];

        const nameSortOptions = [
            {
                text: '恢复默认排序',
                fn: (table) => {
                    while (table.rows.length > 1) table.deleteRow(1);
                    originalRows.forEach(row => table.appendChild(row));
                }
            },
            { text: '按名称排序（升序）', fn: (a, b, idx) => a.cells[idx].textContent.localeCompare(b.cells[idx].textContent) },
            { text: '按名称排序（降序）', fn: (a, b, idx) => b.cells[idx].textContent.localeCompare(a.cells[idx].textContent) }
        ];

        createSortOptions(priceHeader, priceSortOptions, priceIndex);
        createSortOptions(reviewHeader, reviewSortOptions, reviewIndex);
        createSortOptions(nameHeader, nameSortOptions, nameIndex);
        document.body.appendChild(optionsContainer);

        document.addEventListener('click', e => {
            optionsContainer && !optionsContainer.contains(e.target) && (optionsContainer.style.display = 'none');
        });
    };

    const sortTable = (table, sortFunction, index) => {
        if (sortFunction.length === 1) {
            // 如果是恢复默认排序
            sortFunction(table);
        } else {
            const rows = [...table.rows].slice(1);
            rows.sort((a, b) => sortFunction(a, b, index));
            while (table.rows.length > 1) table.deleteRow(1);
            rows.forEach(row => table.appendChild(row));
        }
    };

    document.body.addEventListener('click', e => {
        if (e.target.closest('.tindex li, div[style*="text-align: center;margin-top: 10px;"] a')) {
            setTimeout(setupSort, 1000);
        }
    });

    setTimeout(setupSort, 1000);
})();