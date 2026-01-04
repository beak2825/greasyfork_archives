// ==UserScript==
// @name         lobotomy drawaria
// @namespace    lobotomy.drawariaonline
// @version      1.2
// @description  добавляет радужный цвет и переворачивает игру.
// @author       minish
// @match        https://drawaria.online
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521649/lobotomy%20drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/521649/lobotomy%20drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания радужного эффекта
    function applyRainbowEffect(element) {
        const colors = [
            'rgba(255, 0, 0, 0.7)',   // Красный
            'rgba(255, 127, 0, 0.7)', // Оранжевый
            'rgba(255, 255, 0, 0.7)', // Желтый
            'rgba(0, 255, 0, 0.7)',   // Зеленый
            'rgba(0, 0, 255, 0.7)',   // Синий
            'rgba(75, 0, 130, 0.7)',  // Индиго
            'rgba(148, 0, 211, 0.7)'  // Фиолетовый
        ];

        // Применяем радужный эффект к элементу
        element.style.transition = 'background-color 0.5s';
        let index = 0;

        setInterval(() => {
            element.style.backgroundColor = colors[index];
            index = (index + 1) % colors.length;
        }, 500); // Меняем цвет каждые 500 мс
    }

    // Функция для применения искажения
    function applyDistortionEffect(element) {
        const distortions = [
            'scale(1.1)',  // Увеличение
            'rotate(5deg)', // Поворот
            'skew(10deg, 10deg)', // Искажение
            'scale(0.9)',  // Уменьшение
            'rotate(-5deg)' // Обратный поворот
        ];

        // Применяем случайное искажение
        const randomDistortion = distortions[Math.floor(Math.random() * distortions.length)];
        element.style.transform = randomDistortion;
        element.style.transition = 'transform 0.5s';
    }

    // Применяем эффект ко всем элементам на странице
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
        applyRainbowEffect(element);
        
        // Применяем искажение к некоторым элементам случайным образом
        if (Math.random() < 0.3) { // 30% шанс на искажение
            applyDistortionEffect(element);
        }
    });
})(); // Убедитесь, что здесь есть закрывающая скобка
