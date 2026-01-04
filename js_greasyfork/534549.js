// ==UserScript==
// @name         CatWar Statistics (Fixed Count)
// @namespace    https://github.com/yourusername/catwar-word-counter
// @version      3.5
// @description  Точный подсчет заходов и нырков для CatWar
// @author       bell
// @match        https://catwar.net/*
// @match        http://catwar.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534549/CatWar%20Statistics%20%28Fixed%20Count%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534549/CatWar%20Statistics%20%28Fixed%20Count%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSpanId = 'ist';
    
    const wordsToFind = [
        'Обнаружил плотную водоросль', 'Обнаружил мох', 'Обнаружил крепкую ветку', 'Обнаружил целебную водоросль',
        'Обнаружил Форель', 'Обнаружил карася', 'Обнаружил чёрного окуня', 'Обнаружил белого амура',
        'Обнаружил толстолобика', 'Обнаружил сазана', 'Обнаружил небольшую ракушку', 'Обнаружил большую ракушку',
        'Обнаружил небольшой камень', 'Обнаружил камень', 'Обнаружила плотную водоросль', 'Обнаружила мох',
        'Обнаружила крепкую ветку', 'Обнаружила целебную водоросль', 'Обнаружила Форель', 'Обнаружила карася',
        'Обнаружила чёрного окуня', 'Обнаружила белого амура', 'Обнаружила толстолобика', 'Обнаружила сазана',
        'Обнаружила небольшую ракушку', 'Обнаружила большую ракушку', 'Обнаружила небольшой камень', 'Обнаружила камень'
    ];

    const resourceCategories = {
        'Целебные ресурсы': ['плотную водоросль', 'мох', 'крепкую ветку', 'целебную водоросль'],
        'Рыба': ['Форель', 'карася', 'чёрного окуня', 'белого амура', 'толстолобика', 'сазана'],
        'Ракушки': ['небольшую ракушку', 'большую ракушку'],
        'Камни': ['небольшой камень', 'камень']
    };

    function detectPlayerGender(text) {
        return text.includes('Обнаружила') || text.includes('Пошла') || text.includes('Нырнула') ? 'female' : 'male';
    }

    function countWords(text, words) {
        const counts = {};
        words.forEach(word => {
            const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            counts[word] = (text.match(regex) || []).length;
        });
        return counts;
    }

    function countGroupedResources(text, gender) {
        const prefix = gender === 'female' ? 'Обнаружила ' : 'Обнаружил ';
        const counts = {};
        
        for (const [category, items] of Object.entries(resourceCategories)) {
            counts[category] = items.reduce((sum, item) => {
                const regex = new RegExp(prefix + item, 'gi');
                return sum + (text.match(regex) || []).length;
            }, 0);
        }
        
        return counts;
    }

    function countDives(text) {
        // Считаем только успешные нырки (исключая отмененные действия)
        const maleDives = (text.match(/Нырнул\.(?! Отменил действие)/g) || []).length;
        const femaleDives = (text.match(/Нырнула\.(?! Отменила действие)/g) || []).length;
        return maleDives + femaleDives;
    }

    function countLocationVisits(text) {
        // Считаем все заходы (и мужские и женские), даже если между ними есть другие действия
        const maleVisits = (text.match(/Пошёл в локацию («|")Дно цветущей заводи(»|")\.(.*?)Нырнул\./gs) || []).length;
        const femaleVisits = (text.match(/Пошла в локацию («|")Дно цветущей заводи(»|")\.(.*?)Нырнула\./gs) || []).length;
        return maleVisits + femaleVisits;
    }

    function createDraggableTable() {
        const table = document.createElement('table');
        table.id = 'foundWordsTable';
        table.style.position = 'fixed';
        table.style.top = '10px';
        table.style.right = '10px';
        table.style.backgroundColor = 'rgba(255,255,255,0.9)';
        table.style.border = '1px solid #ccc';
        table.style.zIndex = '9999';
        table.style.padding = '0';
        table.style.fontSize = '14px';
        table.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        table.style.borderCollapse = 'collapse';
        table.style.fontFamily = 'Arial, sans-serif';
        table.style.userSelect = 'none';

        const headerRow = table.insertRow();
        headerRow.style.backgroundColor = '#f0f0f0';
        headerRow.style.cursor = 'move';
        
        const headerCell = headerRow.insertCell();
        headerCell.colSpan = 2;
        headerCell.style.padding = '5px 10px';
        headerCell.style.position = 'relative';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'CatWar Статистика';
        headerCell.appendChild(titleSpan);

        const toggleBtn = document.createElement('span');
        toggleBtn.id = 'toggleTable';
        toggleBtn.textContent = '−';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '10px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontWeight = 'bold';
        headerCell.appendChild(toggleBtn);

        const contentBody = document.createElement('tbody');
        contentBody.id = 'tableContent';
        table.appendChild(contentBody);

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        headerRow.onmousedown = function(e) {
            if (e.target.id === 'toggleTable') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            table.style.top = (table.offsetTop - pos2) + 'px';
            table.style.left = (table.offsetLeft - pos1) + 'px';
            table.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        toggleBtn.onclick = function() {
            contentBody.style.display = contentBody.style.display === 'none' ? '' : 'none';
            this.textContent = contentBody.style.display === 'none' ? '+' : '−';
        };

        return {table, contentBody};
    }

    function fillTable(contentBody, counts, visitCount, successfulDives, gender, groupedCounts) {
        contentBody.innerHTML = '';

        function addRow(text, value, isBold) {
            const row = contentBody.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            cell1.textContent = text;
            cell2.textContent = value;
            cell1.style.padding = '5px 10px';
            cell2.style.padding = '5px 10px';
            if (isBold) row.style.fontWeight = 'bold';
        }

        addRow('Всего заходов в локацию', visitCount, true);
        addRow('Всего успешных нырков', successfulDives, true);

        const itemsHeader = contentBody.insertRow();
        itemsHeader.style.backgroundColor = '#f0f0f0';
        const itemsCell = itemsHeader.insertCell();
        itemsCell.colSpan = 2;
        itemsCell.textContent = 'Найденные предметы/рыбы';
        itemsCell.style.padding = '5px 10px';
        itemsCell.style.textAlign = 'center';

        const prefix = gender === 'female' ? 'Обнаружила ' : 'Обнаружил ';
        for (const [word, count] of Object.entries(counts)) {
            if (count > 0 && word.startsWith(prefix)) {
                addRow(word, count, false);
            }
        }

        const dividerRow = contentBody.insertRow();
        const dividerCell = dividerRow.insertCell();
        dividerCell.colSpan = 2;
        dividerCell.style.padding = '5px 0';
        dividerCell.innerHTML = '<hr style="margin:5px 0;border:0;border-top:1px solid #ddd">';

        const groupedHeader = contentBody.insertRow();
        groupedHeader.style.backgroundColor = '#f0f0f0';
        const groupedHeaderCell = groupedHeader.insertCell();
        groupedHeaderCell.colSpan = 2;
        groupedHeaderCell.textContent = 'Ресурсы по категориям';
        groupedHeaderCell.style.padding = '5px 10px';
        groupedHeaderCell.style.textAlign = 'center';

        for (const [category, count] of Object.entries(groupedCounts)) {
            if (count > 0) {
                addRow(category, count, true);
            }
        }
    }

    function processContent() {
        const span = document.getElementById(targetSpanId);
        if (!span || !span.textContent.trim()) return;

        const text = span.textContent;
        console.log('Текст для анализа:', text);
        
        const gender = detectPlayerGender(text);
        const counts = countWords(text, wordsToFind);
        const groupedCounts = countGroupedResources(text, gender);
        const visits = countLocationVisits(text);
        const dives = countDives(text);

        console.log('Результаты подсчета:', {visits, dives});

        if (Object.values(counts).some(c => c > 0) || visits > 0 || dives > 0) {
            let table = document.getElementById('foundWordsTable');
            let content = document.getElementById('tableContent');
            
            if (!table) {
                const {table: t, contentBody: cb} = createDraggableTable();
                table = t;
                content = cb;
                document.body.appendChild(table);
            }

            fillTable(content, counts, visits, dives, gender, groupedCounts);
        }
    }

    // Запускаем проверку сразу и при изменениях
    function startObserver() {
        processContent();
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(processContent, 300);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Ждем загрузки страницы
    if (document.readyState === 'complete') {
        startObserver();
    } else {
        window.addEventListener('load', startObserver);
    }
})();