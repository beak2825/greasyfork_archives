// ==UserScript==
// @name         Удаление "Н
// @namespace    https://github.com/awesfdawe
// @version      0.1.0
// @description  Убирает "Н" из таблицы оценок
// @author       awesfdawe
// @match        *://keo.gov39.ru/journal-student-grades-action/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493834/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%22%D0%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/493834/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%22%D0%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для удаления "Н" из ячеек
    function removeN(cell) {
        let cellData = cell.querySelector('.cell-data');
        if (cellData && (cellData.innerHTML.trim() === 'Н' || cellData.innerHTML.trim() === ' ')) {
            cellData.innerHTML = '';
        }
    }

    // Функция для сдвига оценок влево
    function shiftGradesLeft() {
        let cells = document.querySelectorAll('.cells_marks .cell');
        cells.forEach(cell => {
            let cellData = cell.querySelector('.cell-data');
            if (cellData && cellData.innerHTML.trim() === '') {
                let rowName = cell.getAttribute('name');
                let cellsInRow = document.querySelectorAll(`.cell[name="${rowName}"]`);
                let emptyIndex = Array.from(cellsInRow).indexOf(cell);

                for (let i = emptyIndex + 1; i < cellsInRow.length; i++) {
                    let nextCellData = cellsInRow[i].querySelector('.cell-data');
                    if (nextCellData && nextCellData.innerHTML.trim() !== '') {
                        cellData.innerHTML = nextCellData.innerHTML;
                        nextCellData.innerHTML = '';
                        break; // Прерываем цикл после первого сдвига
                    }
                }
            }
        });
    }

    // Запускаем удаление "Н" и сдвиг оценок после загрузки страницы
    window.addEventListener('load', function() {
        let cells = document.querySelectorAll('.cells_marks .cell');
        cells.forEach(removeN); // Сначала удаляем все "Н"
        shiftGradesLeft(); // Затем сдвигаем оценки влево
    });
})();
