// ==UserScript==
// @name         Таймер сна для LordFilm (исправленный)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Таймер сна с обратным отсчётом и сохранением времени
// @author       Ваше имя
// @match        https://mazhor-lordfilm.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536903/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D1%81%D0%BD%D0%B0%20%D0%B4%D0%BB%D1%8F%20LordFilm%20%28%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536903/%D0%A2%D0%B0%D0%B9%D0%BC%D0%B5%D1%80%20%D1%81%D0%BD%D0%B0%20%D0%B4%D0%BB%D1%8F%20LordFilm%20%28%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Удаляем старые таймеры (если скрипт запускался дважды)
    const oldTimer = document.getElementById('sleepTimerContainer');
    if (oldTimer) oldTimer.remove();

    // Получаем сохранённые данные
    const savedEndTime = localStorage.getItem('sleepTimerEndTime');
    const savedMinutes = localStorage.getItem('sleepTimerMinutes');

    // Создаём интерфейс
    const timerContainer = document.createElement('div');
    timerContainer.id = 'sleepTimerContainer';
    timerContainer.style.position = 'fixed';
    timerContainer.style.bottom = '20px';
    timerContainer.style.right = '20px';
    timerContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    timerContainer.style.color = 'white';
    timerContainer.style.padding = '10px';
    timerContainer.style.borderRadius = '5px';
    timerContainer.style.zIndex = '9999';
    timerContainer.style.fontFamily = 'Arial, sans-serif';

    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.placeholder = 'Минуты';
    timerInput.min = '1';
    timerInput.style.width = '60px';
    timerInput.style.marginRight = '5px';
    timerInput.style.padding = '5px';

    const timerButton = document.createElement('button');
    timerButton.textContent = savedEndTime ? 'Отменить таймер' : 'Запустить';
    timerButton.style.padding = '5px 10px';
    timerButton.style.marginRight = '5px';
    timerButton.style.cursor = 'pointer';

    const timerStatus = document.createElement('div');
    timerStatus.style.marginTop = '5px';
    timerStatus.style.fontWeight = 'bold';

    if (savedEndTime) {
        timerInput.value = savedMinutes;
        updateCountdown();
    } else {
        timerStatus.textContent = 'Таймер не активен';
    }

    timerContainer.appendChild(timerInput);
    timerContainer.appendChild(timerButton);
    timerContainer.appendChild(timerStatus);
    document.body.appendChild(timerContainer);

    // Обновляем обратный отсчёт
    function updateCountdown() {
        const endTime = parseInt(localStorage.getItem('sleepTimerEndTime'));
        if (!endTime) return;

        const now = Date.now();
        const remainingMs = endTime - now;

        if (remainingMs <= 0) {
            stopVideo();
            clearTimer();
            timerStatus.textContent = 'Время вышло!';
            return;
        }

        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

        timerStatus.textContent = `Осталось: ${remainingMinutes} мин ${remainingSeconds} сек`;
        setTimeout(updateCountdown, 1000);
    }

    // Останавливаем видео
    function stopVideo() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }

    // Сбрасываем таймер
    function clearTimer() {
        localStorage.removeItem('sleepTimerEndTime');
        localStorage.removeItem('sleepTimerMinutes');
        timerButton.textContent = 'Запустить';
        timerStatus.textContent = 'Таймер не активен';
    }

    // Запускаем таймер
    function startTimer(minutes) {
        const endTime = Date.now() + minutes * 60000;
        localStorage.setItem('sleepTimerEndTime', endTime);
        localStorage.setItem('sleepTimerMinutes', minutes);
        timerButton.textContent = 'Отменить таймер';
        updateCountdown();
    }

    // Обработка кнопки
    timerButton.addEventListener('click', () => {
        if (localStorage.getItem('sleepTimerEndTime')) {
            clearTimer();
        } else {
            const minutes = parseInt(timerInput.value);
            if (minutes > 0) {
                startTimer(minutes);
            } else {
                alert('Введите число больше 0!');
            }
        }
    });

    // Проверяем таймер при загрузке
    if (savedEndTime) {
        updateCountdown();
    }
})();