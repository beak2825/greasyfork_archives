// ==UserScript==
// @name         Timer for Homepage
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  I can add a new button!)
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azurewebsites.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499294/Timer%20for%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/499294/Timer%20for%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем кнопку для переключения отображения таймера
    let toggleButton = document.createElement('button');
    toggleButton.textContent = 'Timer';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    document.body.appendChild(toggleButton);

    // Функция для получения состояния отображения таймера из localStorage
    function getTimerDisplayState() {
        // Если в localStorage нет записи о состоянии, вернуть false (по умолчанию таймер скрыт)
        return localStorage.getItem('timerDisplayState') === 'true';
    }

    // Функция для сохранения состояния отображения таймера в localStorage
    function setTimerDisplayState(state) {
        localStorage.setItem('timerDisplayState', state);
    }

    // Найти элемент с таймером
    let timerElement = document.getElementById('countdown');

    // Создать новое окно для отображения таймера
    let timerWindow = document.createElement('div');
    timerWindow.style.position = 'fixed';
    timerWindow.style.width = '1200px';
    timerWindow.style.height = '1200px';
    timerWindow.style.top = '50%';
    timerWindow.style.left = '50%';
    timerWindow.style.transform = 'translate(-50%, -50%)';
    timerWindow.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Почти прозрачный фон
    timerWindow.style.zIndex = '10000';
    timerWindow.style.pointerEvents = 'none'; // Неактивное окно
    timerWindow.style.display = getTimerDisplayState() ? 'flex' : 'none'; // Используем состояние из localStorage
    timerWindow.style.alignItems = 'center';
    timerWindow.style.justifyContent = 'center';
    timerWindow.style.fontSize = '230px';
    timerWindow.style.color = 'black';
    timerWindow.style.border = '2px solid rgba(0, 0, 0, 0.1)'; // Полупрозрачная граница

    // Создать элемент для отображения времени
    let timerDisplay = document.createElement('div');
    if (timerElement) {
        timerDisplay.innerText = timerElement.innerText.trim().replace(/^Remaining\s+/i, '');
    }

    // Добавить элемент в окно
    timerWindow.appendChild(timerDisplay);
    document.body.appendChild(timerWindow);

    // Обновлять время в окне при изменении времени на странице
    let observer = new MutationObserver(() => {
        if (timerElement) {
            timerDisplay.innerText = timerElement.innerText.trim().replace(/^Remaining\s+/i, '');
        }
    });

    observer.observe(timerElement, { childList: true, subtree: true });

    // Функция для переключения отображения таймера
    function toggleTimerDisplay() {
        if (timerWindow.style.display === 'none') {
            timerWindow.style.display = 'flex';
            setTimerDisplayState(true);
        } else {
            timerWindow.style.display = 'none';
            setTimerDisplayState(false);
        }
    }

    // Добавляем обработчик клика по кнопке
    toggleButton.addEventListener('click', toggleTimerDisplay);

    // При загрузке страницы проверяем состояние и устанавливаем отображение таймера
    document.addEventListener('DOMContentLoaded', () => {
        if (getTimerDisplayState()) {
            timerWindow.style.display = 'flex';
        } else {
            timerWindow.style.display = 'none';
        }
    });
})();
