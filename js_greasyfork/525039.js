// ==UserScript==
// @name         Текст статуса и ограничение формата файла
// @namespace    https://admin.adeo.pro/
// @version      1.4
// @description  Изменяет цвет текста статуса, делает его жирным в зависимости от ключевых слов + добавляет ограничения на загрузку файлов
// @author       Your Name
// @match        https://admin.adeo.pro/admin/supplier/price/comparemode/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525039/%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0%20%D0%B8%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B0%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525039/%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0%20%D0%B8%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B0%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для изменения цвета текста и стиля в зависимости от содержимого
    function updateTextStyle(element) {
        const text = element.textContent.trim().toLowerCase(); // Приводим текст к нижнему регистру для нечувствительности к регистру
        element.style.fontWeight = 'bold'; // Делаем текст жирным

        if (text.includes('уже идет импорт')) {
            element.style.color = 'red'; // Красный цвет для статуса "уже идет импорт"
        } else if (text.includes('задание в очереди')) {
            element.style.color = '#CC9933'; // Желтоватый цвет для статуса "задание в очереди"
        } else if (text.includes('импорт окончен')) {
            element.style.color = 'green'; // Зелёный цвет для статуса "импорт окончен"
        } else {
            element.style.color = ''; // Сбрасываем стиль, если текст не соответствует условиям
        }
    }

    // Применяем стили ко всем существующим элементам с классом 'job-status'
    function applyStyles() {
        const elements = document.querySelectorAll('.job-status');
        elements.forEach(updateTextStyle);
    }

    // Наблюдаем за изменениями элементов с классом 'job-status'
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if (mutation.target.classList && mutation.target.classList.contains('job-status')) {
                    updateTextStyle(mutation.target);
                } else if (mutation.target.nodeType === 3 && mutation.parentElement.classList.contains('job-status')) {
                    updateTextStyle(mutation.parentElement);
                }
            }
        });
    });

    // Запускаем наблюдение за всем документом
    const config = { subtree: true, childList: true, characterData: true };
    observer.observe(document.body, config);

    // Применяем стили к существующим элементам при загрузке страницы
    applyStyles();

    // Функция для добавления атрибута 'accept' в поле загрузки файла
    function setFileAcceptAttribute() {
        const fileInput = document.querySelector('input[type="file"][name="upfile"][id="pricefile"]');
        if (fileInput) {
            fileInput.setAttribute('accept', '.xlsx, .xls'); // Устанавливаем разрешённые форматы файлов
            console.log("Атрибут 'accept' добавлен к полю загрузки файла");
            return true;
        }
        return false;
    }

    // Периодически проверяем наличие элемента каждые 500 мс
    const intervalId = setInterval(() => {
        const fileInputUpdated = setFileAcceptAttribute();

        // Останавливаем интервал, если элемент найден и модифицирован
        if (fileInputUpdated) {
            clearInterval(intervalId);
        }
    }, 500); // Проверяем каждые 500 мс
})();
