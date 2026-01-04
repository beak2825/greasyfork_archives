// ==UserScript==
// @name         Crop
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519670/Crop.user.js
// @updateURL https://update.greasyfork.org/scripts/519670/Crop.meta.js
// ==/UserScript==

(function () {
    // Ключ для локального хранилища
    const STORAGE_KEY = 'cropScriptEnabled';

    // Ищем кнопку по селектору
    const oldButton = document.querySelector('#svgRed_Content > div.red_footer.clearfix > div.switch-editor-buttons-wrapper > a:nth-child(3)');

    if (oldButton) {
        // Создаём новую кнопку, чтобы убрать старый функционал
        const newButton = oldButton.cloneNode(true);
        oldButton.replaceWith(newButton);

        // Загружаем состояние кнопки из локального хранилища
        const savedState = localStorage.getItem(STORAGE_KEY) === 'true';

        // Иконка для состояния "включено"
const enabledIcon = document.createElement('img');
enabledIcon.src = 'https://img.icons8.com/officel/80/crop.png'; // Ссылка на изображение
enabledIcon.alt = 'Crop Enabled'; // Альтернативный текст
enabledIcon.style.width = '27px'; // Установка размеров (если требуется)
enabledIcon.style.height = '27 px';
enabledIcon.title = 'Остановить Crop'; // Подсказка
enabledIcon.style.margin = 'auto'; // Центрирование

// Иконка для состояния "выключено"
const disabledIcon = document.createElement('img');
disabledIcon.src = 'https://img.icons8.com/office/40/unchecked-checkbox.png'; // Ссылка на изображение
disabledIcon.alt = 'Crop Disabled'; // Альтернативный текст
disabledIcon.style.width = '27px'; // Установка размеров (если требуется)
disabledIcon.style.height = '27px';
disabledIcon.title = 'Посмотреть Crop'; // Подсказка
disabledIcon.style.margin = 'auto'; // Центрирование

// Удаляем текущие элементы внутри кнопки
newButton.innerHTML = '';
newButton.appendChild(savedState ? enabledIcon : disabledIcon);


        // Основной код с управлением
        let intervalId = null;

        const startScript = () => {
            intervalId = setInterval(() => {
                const svg = document.querySelector('#canvas > svg');
                const image = document.querySelector('#canvas > svg > image');

                if (svg && image && !svg.querySelector('rect.border-rect')) {
                    // Добавляем рамку, если она отсутствует
                    const x = parseFloat(image.getAttribute('x')) || 0;
                    const y = parseFloat(image.getAttribute('y')) || 0;
                    const width = parseFloat(image.getAttribute('width')) || 0;
                    const height = parseFloat(image.getAttribute('height')) || 0;

                    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('x', x - 0);
                    rect.setAttribute('y', y - 0);
                    rect.setAttribute('width', width + 0);
                    rect.setAttribute('height', height + 0);
                    rect.setAttribute('stroke', 'black');
                    rect.setAttribute('stroke-width', '1');
                    rect.setAttribute('fill', 'none');
                    rect.classList.add('border-rect');

                    svg.insertBefore(rect, image);
                }
            }, 1000); // Проверяем каждую секунду
        };

        const stopScript = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            // Удаляем все элементы с классом 'border-rect'
            const borderRects = document.querySelectorAll('.border-rect');
            borderRects.forEach(rect => rect.remove());
        };

        // Применяем сохранённое состояние
        if (savedState) {
            startScript();
        }

        // Обработка кликов на кнопку
        newButton.addEventListener('click', () => {
            const isRunning = intervalId !== null;

            if (isRunning) {
                stopScript();
                newButton.replaceChild(disabledIcon, newButton.firstChild);
                localStorage.setItem(STORAGE_KEY, 'false');
            } else {
                startScript();
                newButton.replaceChild(enabledIcon, newButton.firstChild);
                localStorage.setItem(STORAGE_KEY, 'true');
            }
        });

        // Добавляем действия при наведении мыши
        const showBorderOnHover = () => {
            if (!intervalId) { // Только если скрипт не активен
                const svg = document.querySelector('#canvas > svg');
                const image = document.querySelector('#canvas > svg > image');

                if (svg && image && !svg.querySelector('rect.border-rect')) {
                    const x = parseFloat(image.getAttribute('x')) || 0;
                    const y = parseFloat(image.getAttribute('y')) || 0;
                    const width = parseFloat(image.getAttribute('width')) || 0;
                    const height = parseFloat(image.getAttribute('height')) || 0;

                    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('x', x - 0);
                    rect.setAttribute('y', y - 0);
                    rect.setAttribute('width', width + 0);
                    rect.setAttribute('height', height + 0);
                    rect.setAttribute('stroke', 'black');
                    rect.setAttribute('stroke-width', '1');
                    rect.setAttribute('fill', 'none');
                    rect.classList.add('border-rect');

                    svg.insertBefore(rect, image);
                }
            }
        };

        const removeBorderOnHoverOut = () => {
            if (!intervalId) { // Только если скрипт не активен
                const borderRects = document.querySelectorAll('.border-rect');
                borderRects.forEach(rect => rect.remove());
            }
        };

        newButton.addEventListener('mouseenter', showBorderOnHover);
        newButton.addEventListener('mouseleave', removeBorderOnHoverOut);
    }
})();
