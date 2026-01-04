// ==UserScript==
// @name         Ozon Infinite Scroll with Countdown
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Бесконечная прокрутка на ozon.ru
// @match        https://www.ozon.ru/category/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514693/Ozon%20Infinite%20Scroll%20with%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/514693/Ozon%20Infinite%20Scroll%20with%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loading = false;
    let countdownInterval;
    let nextPage;
    let timerActive = false; // Флаг для отслеживания активности таймера
    let canStartTimer = true; // Флаг, чтобы контролировать возможность запуска таймера

    // Создаем контейнер с таймером и кнопками
    const countdownContainer = document.createElement('div');
    countdownContainer.style.position = 'fixed';
    countdownContainer.style.bottom = '20px';
    countdownContainer.style.right = '20px';
    countdownContainer.style.padding = '10px';
    countdownContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    countdownContainer.style.color = '#fff';
    countdownContainer.style.borderRadius = '5px';
    countdownContainer.style.zIndex = '1000';
    countdownContainer.style.display = 'none';

    // Создаем текст таймера
    const countdownText = document.createElement('span');
    countdownContainer.appendChild(countdownText);

    // Создаем кнопку "Отмена"
    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Отмена";
    cancelButton.style.marginLeft = '10px';
    cancelButton.style.padding = '5px';
    cancelButton.style.color = '#000';
    cancelButton.style.backgroundColor = '#fff';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '3px';
    cancelButton.style.cursor = 'pointer';
    countdownContainer.appendChild(cancelButton);

    // Создаем кнопку "Включить снова"
    const resumeButton = document.createElement('button');
    resumeButton.textContent = "Включить снова";
    resumeButton.style.marginLeft = '10px';
    resumeButton.style.padding = '5px';
    resumeButton.style.color = '#000';
    resumeButton.style.backgroundColor = '#fff';
    resumeButton.style.border = 'none';
    resumeButton.style.borderRadius = '3px';
    resumeButton.style.cursor = 'pointer';
    resumeButton.style.display = 'none'; // Скрыта по умолчанию
    countdownContainer.appendChild(resumeButton);

    document.body.appendChild(countdownContainer);

    // Получаем номер текущей страницы
    function getCurrentPageButton() {
        return Array.from(document.querySelectorAll('.s2e')).find(link => {
            return window.getComputedStyle(link).backgroundColor === 'rgb(0, 91, 255)' &&
                   window.getComputedStyle(link).color === 'rgb(255, 255, 255)';
        });
    }

    // Функция для клика на следующую страницу
    function clickNextPage() {
        if (loading || !timerActive) return;

        const currentButton = getCurrentPageButton();
        if (!currentButton) {
            console.log("Не удалось определить текущую страницу.");
            return;
        }

        nextPage = parseInt(currentButton.textContent.trim()) + 1;
        const nextLink = Array.from(document.querySelectorAll('.s2e')).find(link => link.textContent.trim() === nextPage.toString());

        if (nextLink) {
            loading = true;
            nextLink.click();
        } else {
            console.log("Ссылка на следующую страницу не найдена.");
        }
    }

    // Функция обратного отсчета с кнопкой отмены
    function startCountdown() {
        if (timerActive) return; // Если таймер уже активен, ничего не делаем
        if (!canStartTimer) return; // Если таймер отключен, ничего не делаем

        timerActive = true; // Устанавливаем флаг активности таймера
        let countdown = 5;
        countdownContainer.style.display = 'block';
        countdownText.textContent = `Переключение на следующую страницу через: ${countdown} сек`;

        countdownInterval = setInterval(() => {
            countdown--;
            countdownText.textContent = `Переключение на следующую страницу через: ${countdown} сек`;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownContainer.style.display = 'none';
                timerActive = false; // Сбрасываем флаг активности таймера
                clickNextPage(); // Переход на следующую страницу
            }
        }, 1000);

        // Обработчик на кнопку отмены
        cancelButton.onclick = function() {
            clearInterval(countdownInterval);
            // Не скрываем контейнер, чтобы пользователь мог видеть кнопку "Включить снова"
            loading = false; // Сбрасываем статус загрузки
            timerActive = false; // Сбрасываем флаг активности таймера
            canStartTimer = false; // Запрещаем запуск таймера
            resumeButton.style.display = 'inline-block'; // Показываем кнопку "Включить снова"
            console.log("Переход на следующую страницу отменен.");
        };

        // Обработчик на кнопку "Включить снова"
        resumeButton.onclick = function() {
            resumeButton.style.display = 'none'; // Скрываем кнопку "Включить снова"
            canStartTimer = true; // Разрешаем запуск таймера
            startCountdown(); // Начинаем обратный отсчет
        };
    }

    // Проверка загрузки новой страницы по кнопке
    function checkPageLoaded() {
        const currentButton = getCurrentPageButton();
        if (currentButton && parseInt(currentButton.textContent.trim()) === nextPage) {
            loading = false;
            timerActive = false; // Сбрасываем флаг, если новая страница загружена
            countdownContainer.style.display = 'none'; // Скрываем контейнер таймера
            resumeButton.style.display = 'none'; // Скрываем кнопку "Включить снова"
            canStartTimer = true; // Разрешаем запуск таймера снова
        }
    }

    // Инициализация и отслеживание скролла
    window.addEventListener('scroll', () => {
        if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            startCountdown();
        }
    });

    // Проверка страницы каждые 2 секунды для обновления статуса
    setInterval(checkPageLoaded, 2000);
})();
