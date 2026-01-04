// ==UserScript==
// @name         CatWar Statistics
// @namespace    https://github.com/yourusername/catwar-word-counter
// @version      2.2
// @description  Расширенная статистика для CatWar с перетаскиванием и сворачиванием
// @author       bell
// @match        https://catwar.net/*
// @match        http://catwar.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534542/CatWar%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/534542/CatWar%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSpanId = 'ist';
    const wordsToFind = [
        'Обнаружил плотную водоросль',
        'Обнаружил мох',
        'Обнаружил крепкую ветку',
        'Обнаружил целебную водоросль',
        'Обнаружил Форель',
        'Обнаружил карася',
        'Обнаружил чёрного окуня',
        'Обнаружил белого амура',
        'Обнаружил толстолобика',
        'Обнаружил сазана',
        'Обнаружил небольшую ракушку',
        'Обнаружил большую ракушку',
        'Обнаружил небольшой камень',
        'Обнаружил камень',
        'Обнаружила плотную водоросль',
        'Обнаружила мох',
        'Обнаружила крепкую ветку',
        'Обнаружила целебную водоросль',
        'Обнаружила Форель',
        'Обнаружила карася',
        'Обнаружила чёрного окуня',
        'Обнаружила белого амура',
        'Обнаружила толстолобика',
        'Обнаружила сазана',
        'Обнаружила небольшую ракушку',
        'Обнаружила большую ракушку',
        'Обнаружила небольшой камень',
        'Обнаружила камень'
    ];

    const resourceCategories = {
        'Целебные ресурсы': [
            'Обнаружил плотную водоросль',
            'Обнаружил мох',
            'Обнаружил крепкую ветку',
            'Обнаружил целебную водоросль',
            'Обнаружила плотную водоросль',
            'Обнаружила мох',
            'Обнаружила крепкую ветку',
            'Обнаружила целебную водоросль'
        ],
        'Рыба': [
            'Обнаружил Форель',
            'Обнаружил карася',
            'Обнаружил чёрного окуня',
            'Обнаружил белого амура',
            'Обнаружил толстолобика',
            'Обнаружил сазана',
            'Обнаружила Форель',
            'Обнаружила карася',
            'Обнаружила чёрного окуня',
            'Обнаружила белого амура',
            'Обнаружила толстолобика',
            'Обнаружила сазана'
        ],
        'Ракушки': [
            'Обнаружил небольшую ракушку',
            'Обнаружил большую ракушку',
            'Обнаружила небольшую ракушку',
            'Обнаружила большую ракушку'
        ],
        'Камни': [
            'Обнаружил небольшой камень',
            'Обнаружил камень',
            'Обнаружила небольшой камень',
            'Обнаружила камень'
        ]
    };

    function detectPlayerGender(text) {
        if (/Обнаружил|Пошёл|Нырнул/.test(text)) return 'male';
        if (/Обнаружила|Пошла|Нырнула/.test(text)) return 'female';
        return 'male'; // По умолчанию
    }

    function countWords(text, words) {
        const counts = {};
        for (const word of words) {
            const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = text.match(regex);
            counts[word] = matches ? matches.length : 0;
        }
        return counts;
    }

    function countGroupedResources(text) {
        const counts = {};
        for (const [category, phrases] of Object.entries(resourceCategories)) {
            counts[category] = 0;
            for (const phrase of phrases) {
                const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                const matches = text.match(regex);
                counts[category] += matches ? matches.length : 0;
            }
        }
        return counts;
    }

    function countDives(text, gender) {
        if (gender === 'male') {
            const maleDivesAll = (text.match(/Нырнул\./g) || []).length;
            const canceledMaleDives = (text.match(/Нырнул\. Отменил действие\./g) || []).length;
            return maleDivesAll - canceledMaleDives;
        } else {
            const femaleDivesAll = (text.match(/Нырнула\./g) || []).length;
            const canceledFemaleDives = (text.match(/Нырнула\. Отменила действие\./g) || []).length;
            return femaleDivesAll - canceledFemaleDives;
        }
    }

    function countLocationVisits(text, gender) {
        if (gender === 'male') {
            const maleRegex = /Пошёл в локацию («|")Дно цветущей заводи(»|")\. Нырнул\.(?! Отменил действие\.)/g;
            return (text.match(maleRegex) || []).length;
        } else {
            const femaleRegex = /Пошла в локацию («|")Дно цветущей заводи(»|")\. Нырнула\.(?! Отменила действие\.)/g;
            return (text.match(femaleRegex) || []).length;
        }
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

        // Header with drag and collapse functionality
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
        toggleBtn.textContent = '−';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '10px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontWeight = 'bold';
        headerCell.appendChild(toggleBtn);

        // Table body (collapsible content)
        const contentBody = document.createElement('tbody');
        contentBody.id = 'tableContent';
        table.appendChild(contentBody);

        // Drag functionality
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        headerRow.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target === toggleBtn) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

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

        // Collapse/expand functionality
        toggleBtn.onclick = function() {
            const content = document.getElementById('tableContent');
            if (content.style.display === 'none') {
                content.style.display = '';
                toggleBtn.textContent = '−';
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
            }
        };

        return {table, contentBody};
    }

    function fillTableContent(contentBody, counts, visitCount, successfulDives, gender, groupedCounts) {
        contentBody.innerHTML = '';

        // Visits count
        const visitRow = contentBody.insertRow();
        const visitCell1 = visitRow.insertCell();
        const visitCell2 = visitRow.insertCell();
        visitCell1.textContent = 'Заходы';
        visitCell2.textContent = visitCount;
        visitCell1.style.padding = '5px 10px';
        visitCell2.style.padding = '5px 10px';

        // Successful dives
        const divesRow = contentBody.insertRow();
        const divesCell1 = divesRow.insertCell();
        const divesCell2 = divesRow.insertCell();
        divesCell1.textContent = 'Нырки';
        divesCell2.textContent = successfulDives;
        divesCell1.style.padding = '5px 10px';
        divesCell2.style.padding = '5px 10px';
        divesRow.style.fontWeight = 'bold';

        // Found items header
        const itemsHeader = contentBody.insertRow();
        itemsHeader.style.backgroundColor = '#f0f0f0';
        const itemsCell = itemsHeader.insertCell();
        itemsCell.colSpan = 2;
        itemsCell.textContent = 'Найденные предметы';
        itemsCell.style.padding = '5px 10px';
        itemsCell.style.textAlign = 'center';

        // Found items list
        const genderPrefix = gender === 'male' ? 'Обнаружил' : 'Обнаружила';
        for (const [word, count] of Object.entries(counts)) {
            if (count > 0 && word.startsWith(genderPrefix)) {
                const row = contentBody.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                cell1.textContent = word;
                cell2.textContent = count;
                cell1.style.padding = '5px 10px';
                cell2.style.padding = '5px 10px';
            }
        }

        // Divider
        const dividerRow = contentBody.insertRow();
        const dividerCell = dividerRow.insertCell();
        dividerCell.colSpan = 2;
        dividerCell.style.padding = '5px 0';
        dividerCell.innerHTML = '<hr style="margin:5px 0;border:0;border-top:1px solid #ddd;">';

        // Grouped resources header
        const groupedHeader = contentBody.insertRow();
        groupedHeader.style.backgroundColor = '#f0f0f0';
        const groupedHeaderCell = groupedHeader.insertCell();
        groupedHeaderCell.colSpan = 2;
        groupedHeaderCell.textContent = 'Ресурсы по категориям';
        groupedHeaderCell.style.padding = '5px 10px';
        groupedHeaderCell.style.textAlign = 'center';

        // Grouped resources
        for (const [category, count] of Object.entries(groupedCounts)) {
            if (count > 0) {
                const row = contentBody.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                cell1.textContent = category;
                cell2.textContent = count;
                cell1.style.padding = '5px 10px';
                cell2.style.padding = '5px 10px';
                row.style.fontWeight = 'bold';
            }
        }
    }

    function processContent() {
        const span = document.getElementById(targetSpanId);
        if (!span || !span.textContent.trim()) return;

        const text = span.textContent;
        const gender = detectPlayerGender(text);
        const counts = countWords(text, wordsToFind);
        const groupedCounts = countGroupedResources(text);
        const locationVisits = countLocationVisits(text, gender);
        const successfulDives = countDives(text, gender);

        if (Object.values(counts).some(count => count > 0) || locationVisits > 0 || successfulDives > 0) {
            let table = document.getElementById('foundWordsTable');
            let contentBody = document.getElementById('tableContent');
            
            if (!table) {
                const {table: newTable, contentBody: newContentBody} = createDraggableTable();
                table = newTable;
                contentBody = newContentBody;
                document.body.appendChild(table);
            }

            fillTableContent(contentBody, counts, locationVisits, successfulDives, gender, groupedCounts);
        }
    }

    // Initialize observer
    const observer = new MutationObserver(function(mutations) {
        if (document.getElementById(targetSpanId)) {
            setTimeout(processContent, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    setTimeout(processContent, 1000);
})();