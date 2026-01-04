// ==UserScript==
// @name         Извлечение данных о больших объектах в Google Photos и сохранение в CSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Извлекает данные и сохраняет их в формате CSV с разделителем ";" по нажатию на плавающую кнопку
// @author       
// @match        https://one.google.com/storage/management/photos
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486063/%D0%98%D0%B7%D0%B2%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BE%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0%D1%85%20%D0%B2%20Google%20Photos%20%D0%B8%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/486063/%D0%98%D0%B7%D0%B2%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BE%20%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0%D1%85%20%D0%B2%20Google%20Photos%20%D0%B8%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%20CSV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения и форматирования размера файла и даты
    function formatFileSizeDate(fileSizeDate) {
        const parts = fileSizeDate.split(', ');
        const fileSize = parts[0];
        const fileDate = parts.length > 1 ? parts[1] : 'Дата не найдена';
        return {
            fileSize,
            fileDate
        };
    }

    // Функция для извлечения данных
    function extractData() {
        let items = document.querySelectorAll('tr.VfPpkd-wZVHld-xMbwt.ee6GL');
        if (items.length === 0) {
            // Если по первому классу ничего не найдено, ищем по второму классу
            items = document.querySelectorAll('tr.VfPpkd-wZVHld-xMbwt.GEDZqf');
        }

        const extractedData = [];

        items.forEach((item) => {
            let fileName, fileSize, fileDate;

            // Попытка извлечения данных по первому классу
            fileName = item.querySelector('div.qgRl3') ? item.querySelector('div.qgRl3').textContent : 'Не найдено';
            fileSize = item.querySelector('div.X6mc4e') ? item.querySelector('div.X6mc4e').textContent.split(', ')[0] : 'Не найдено';
            fileDate = item.querySelector('div.X6mc4e') ? item.querySelector('div.X6mc4e').textContent.split(', ')[1] : 'Не найдена';

            // Если данные не найдены, пытаемся извлечь их по второму классу
            if (fileName === 'Не найдено' || fileSize === 'Не найдено' || fileDate === 'Не найдена') {
                fileName = item.querySelector('div.FSjHSb') ? item.querySelector('div.FSjHSb').textContent : 'Не найдено';
                fileSize = item.querySelector('div.eaeUof') ? item.querySelector('div.eaeUof').textContent : 'Не найдено';
                fileDate = item.querySelector('div.GlsRcd') ? item.querySelector('div.GlsRcd').textContent : 'Не найдена';
            }

            extractedData.push([fileName, fileSize, fileDate]);
        });

        return extractedData;
    }


    // Функция для конвертации данных в формат CSV с разделителем ";"
    function convertToCSV(data) {
        const csvRows = [];
        csvRows.push('File Name;File Size;File Date');
        data.forEach(row => {
            csvRows.push(row.join(';'));
        });
        return csvRows.join('\n');
    }

    // Функция для создания и загрузки файла CSV
    function downloadCSV(csvData) {
        const blob = new Blob([csvData], {
            type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Создание плавающей кнопки
    function createFloatingButton() {
        const button = document.createElement('button');
        button.textContent = 'Скачать CSV';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            const data = extractData();
            const csvData = convertToCSV(data);
            downloadCSV(csvData);
        });

        document.body.appendChild(button);
    }

    // Добавление плавающей кнопки при загрузке страницы
    window.addEventListener('load', createFloatingButton);
})();