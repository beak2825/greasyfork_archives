// ==UserScript==
// @name         Копирование ID уроков через запятую
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Копирование ID уроков через запятую с настраиваемым обрамлением
// @author       Daniil Postnov
// @match        https://*.getcourse.ru/teach/control/stream/view/id/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494794/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20ID%20%D1%83%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B7%D0%B0%D0%BF%D1%8F%D1%82%D1%83%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/494794/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20ID%20%D1%83%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B7%D0%B0%D0%BF%D1%8F%D1%82%D1%83%D1%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация настроек из localStorage или значений по умолчанию
    let wrapSymbol = localStorage.getItem('gcCollectorWrapSymbol') || '';
    
    // Создаем кнопку "Скопировать ID"
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Скопировать ID уроков на странице';
    copyButton.className = 'copy-button';
    document.body.appendChild(copyButton);

    // Создаем кнопку настроек
    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙️';
    settingsButton.className = 'settings-button';
    document.body.appendChild(settingsButton);

    // Создаем модальное окно настроек (скрытое по умолчанию)
    const settingsModal = document.createElement('div');
    settingsModal.className = 'settings-modal';
    settingsModal.style.display = 'none';
    
    // Содержимое модального окна
    settingsModal.innerHTML = `
        <div class="settings-content">
            <span class="close-button">&times;</span>
            <h3>Настройки</h3>
            <div class="form-group">
                <label for="wrap-symbol">Символ для обрамления ID:</label>
                <input type="text" id="wrap-symbol" placeholder="Например: ' или \" или ничего">
                <p class="hint">Оставьте пустым, чтобы не обрамлять ID</p>
            </div>
            <button class="save-settings">Сохранить</button>
        </div>
    `;
    document.body.appendChild(settingsModal);

    // Стили для элементов
    const styles = `
        .copy-button {
            position: fixed;
            top: 40px;
            right: 40px;
            padding: 15px 20px;
            color: #fff;
            border: none;
            cursor: pointer;
            background: #a75cf8;
            z-index: 10000;
            border-radius: 5px;
            font-family: 'Golos', sans-serif;
            font-size: 16px;
        }
        
        .settings-button {
            position: fixed;
            top: 40px;
            right: 10px;
            padding: 15px;
            color: #fff;
            border: none;
            cursor: pointer;
            background: #4a4a4a;
            z-index: 10000;
            border-radius: 5px;
            font-size: 16px;
        }
        
        .settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .settings-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 400px;
            position: relative;
        }
        
        .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        
        .form-group input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
        
        .hint {
            font-size: 12px;
            color: #777;
            margin-top: 5px;
        }
        
        .save-settings {
            background-color: #a75cf8;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
    `;

    // Добавляем стили на страницу
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Получаем ссылки на элементы модального окна
    const closeButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = settingsModal.querySelector('.save-settings');
    const wrapSymbolInput = settingsModal.querySelector('#wrap-symbol');
    
    // Устанавливаем текущие значения в форме
    wrapSymbolInput.value = wrapSymbol;

    // Сохраняем исходный цвет кнопки
    const originalButtonColor = copyButton.style.backgroundColor;

    // Открываем модальное окно по клику на кнопку настроек
    settingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
    });

    // Закрываем модальное окно при клике на крестик
    closeButton.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Закрываем модальное окно при клике вне его содержимого
    settingsModal.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Сохраняем настройки при нажатии на кнопку "Сохранить"
    saveSettingsButton.addEventListener('click', function() {
        wrapSymbol = wrapSymbolInput.value;
        
        // Сохраняем настройки в localStorage
        localStorage.setItem('gcCollectorWrapSymbol', wrapSymbol);
        
        // Закрываем модальное окно
        settingsModal.style.display = 'none';
    });

    // Добавляем обработчик клика на кнопку копирования
    copyButton.addEventListener('click', async function() {
        // Находим все элементы с классом lesson-list
        const lessonLists = document.querySelectorAll('.lesson-list');

        if (lessonLists.length > 0) {
            // Создаем массив для хранения всех data-lesson-id
            const allLessonIds = [];

            // Проходим по каждому элементу с классом lesson-list
            lessonLists.forEach(function(lessonList) {
                // Находим все элементы li внутри текущего lessonList
                const lessonItems = lessonList.querySelectorAll('li');

                // Проходим по каждому элементу li
                lessonItems.forEach(function(item) {
                    // Получаем значение атрибута data-lesson-id и добавляем в массив
                    const lessonId = item.getAttribute('data-lesson-id');
                    if (lessonId) {
                        allLessonIds.push(lessonId);
                    }
                });
            });

            // Обрабатываем каждый ID и обрамляем его символами, если они указаны
            const wrappedIds = allLessonIds.map(id => {
                return wrapSymbol + id + wrapSymbol;
            });

            // Формируем строку из массива wrappedIds, разделенную запятыми
            const idString = wrappedIds.join(', ');

            // Пытаемся скопировать idString в буфер обмена
            try {
                await navigator.clipboard.writeText(idString);

                // Устанавливаем текст и цвет кнопки на "Скопировано" (зеленый)
                copyButton.textContent = 'Скопировано';
                copyButton.style.backgroundColor = '#3faa59';

                // Ждем 2 секунды, затем возвращаем текст и цвет кнопки на исходные
                setTimeout(function() {
                    copyButton.textContent = 'Скопировать ID уроков на странице';
                    copyButton.style.backgroundColor = originalButtonColor;
                }, 2000);
            } catch (err) {
                console.error('Не удалось скопировать список ID в буфер обмена:', err);
                alert('Ошибка при копировании ID в буфер обмена');
            }
        } else {
            console.error('Элементы с классом .lesson-list не найдены на странице.');
        }
    });
});

})();