// ==UserScript==
// @name         Сетка поля
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Точная сетка для игрового поля Kinwoods
// @author       Шумелка (ID 347)
// @match        https://patron.kinwoods.com/game
// @require      https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js
// @grant        GM_addStyle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/535654/%D0%A1%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535654/%D0%A1%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Настройки смещения (если нужно подкорректировать)
    const offsetX = 0; // Сдвиг по X (px)
    const offsetY = 0; // Сдвиг по Y (px)

    // Автоподстройка под размер контейнера
    const cellWidth = 122.5; // 980px / 8 = 122.5
    const cellHeight = 122.5; // Делаем клетки квадратными для полного покрытия

    GM_addStyle(`
        .kinwoods-grid-overlay {
            position: absolute;
            pointer-events: none;
            z-index: 5;
            overflow: visible;
        }
        .kinwoods-grid-overlay svg {
            display: block;
            overflow: visible;
        }
        .grid-line {
            stroke: rgba(255, 255, 255, 0.4);
            stroke-width: 1.5px;
            shape-rendering: crispEdges;
        }
    `);

    function initGrid() {
        const fieldContainer = document.querySelector('.field-container.svelte-nuhjax');
        if (!fieldContainer) return;

        const cols = 8, rows = 8;
        const svgWidth = cols * cellWidth, svgHeight = rows * cellHeight;

        // Создаем контейнер
        const gridContainer = d3.select(fieldContainer)
            .append('div')
            .attr('class', 'kinwoods-grid-overlay')
            .style('left', `${offsetX}px`)
            .style('top', `${offsetY}px`);

        const svg = gridContainer.append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        const gridGroup = svg.append('g').attr('class', 'grid-lines');

        // Горизонтальные линии
        for (let row = 0; row <= rows; row++) {
            gridGroup.append('line')
                .attr('class', 'grid-line')
                .attr('x1', 0)
                .attr('y1', row * cellHeight)
                .attr('x2', svgWidth)
                .attr('y2', row * cellHeight);
        }

        // Вертикальные линии
        for (let col = 0; col <= cols; col++) {
            gridGroup.append('line')
                .attr('class', 'grid-line')
                .attr('x1', col * cellWidth)
                .attr('y1', 0)
                .attr('x2', col * cellWidth)
                .attr('y2', svgHeight);
        }

        console.log('Сетка создана с полным покрытием:', svgWidth, 'x', svgHeight);
    }

    // Запуск после загрузки
    const observer = new MutationObserver(() => {
        if (document.querySelector('.field-container.svelte-nuhjax')) {
            observer.disconnect();
            initGrid();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.querySelector('.field-container.svelte-nuhjax')) {
        initGrid();
    }
})();