// ==UserScript==
// @name         Изменение ширины div блока и стиля textarea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Изменяем ширину div блока с определенным классом и стиль textarea
// @author       Вы
// @match        https://www.coze.com/space/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496208/%D0%98%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%88%D0%B8%D1%80%D0%B8%D0%BD%D1%8B%20div%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20%D0%B8%20%D1%81%D1%82%D0%B8%D0%BB%D1%8F%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/496208/%D0%98%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%88%D0%B8%D1%80%D0%B8%D0%BD%D1%8B%20div%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20%D0%B8%20%D1%81%D1%82%D0%B8%D0%BB%D1%8F%20textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для изменения ширины div и стиля textarea
    function changeStyles() {
        // Изменение ширины div блока
        let div = document.querySelector('.TH9DlQU1qwg_KGXdDYzk');
        if (div) {
            div.style.width = '100%';
            div.style.backgroundColor = "#000000";
             div.style.display = 'block';
        }
        let div_2 = document.querySelector('.WfXRc6x8M2gbaaX2HSxJ');
        if (div_2) {
            div_2.style.backgroundColor = "#000000"; // Правильно для черного цвета
        }
        let div_3 = document.querySelector('.UMf9npeM8cVkDi0CDqZ0');
        if (div_3) {
            div_3.style.display = 'block'; // Правильно для черного цвета
        }


        let div_4 = document.querySelector('.qtV_UKcJKqgw6X0fPvI4');
        if (div_4) {
            div_4.remove(); // Правильно для черного цвета
        }
        // Добавление кода для удаления div блока с классом "arQAab07X2IRwAe6dqHV"
        let divToRemove = document.querySelector('.IoQhh3vVUhwDTJi9EIDK');
        if (divToRemove) {
            divToRemove.remove();
        }

        let divToRemove2 = document.querySelector('.xp0QFn7jxEMNQMGtTbNT');
        if (divToRemove2) {
            divToRemove2.remove();
        }
        let divToRemove3 = document.querySelector('.coz-bg-primary');
        if (divToRemove3) {
            divToRemove3.remove();
        }




        // Получаем элемент textarea по его классу
        var textarea = document.querySelector('.rc-textarea.oTXB57QK8bQN2BKYJ2Bi');

        if(textarea) {
            textarea.style.backgroundColor = '#1c1c1c';
            textarea.style.color = '#ffffff';
}
        let div_5 = document.querySelector('.k5ePpJvczIMzaNIaOwKS');
        if (div_5) {
            div_5.style.backgroundColor = "#1c1c1c"; // Правильно для черного цвета
        }





    }

    // Создание кнопки для запуска функции changeStyles
    function createToggleButton() {
       let button = document.createElement('button');
        button.textContent = 'Переключить стили';
        button.style.position = 'fixed';
        button.style.top = '100px'; // Увеличиваем отступ снизу
        button.style.right = '20px'; // Увеличиваем отступ справа
        button.style.zIndex = '1000';
        button.style.padding = '15px 30px'; // Увеличиваем внутренние отступы
        button.style.fontSize = '16px'; // Увеличиваем размер шрифта
        button.style.color = '#fff'; // Цвет текста
        button.style.background = 'linear-gradient(45deg, #007BFF, #6610F2)'; // Градиентный фон
        button.style.border = 'none'; // Убираем границу
        button.style.borderRadius = '25px'; // Скругляем углы
        button.style.cursor = 'pointer'; // Курсор в виде указателя
        button.style.boxShadow = '0 8px 6px rgba(0,0,0,0.25)'; // Добавляем тень

        // Флаг для отслеживания состояния включения/выключения стилей
        let stylesEnabled = false;

        // Обработчик нажатия на кнопку
        button.addEventListener('click', function() {


            if (stylesEnabled) {
                // При выключении стилей, возможно, вам нужно будет восстановить исходные значения.
                // Здесь должен быть ваш код для восстановления предыдущих значений стилей
                button.textContent = 'Включить стили';
            } else {
                changeStyles();
                button.textContent = 'Выключить стили';
            }

            stylesEnabled = !stylesEnabled; // Переключение флага
        });

        document.body.appendChild(button);
    }

    // Вызов функции создания кнопки после загрузки документа
    setTimeout(createToggleButton, 3000);

})();