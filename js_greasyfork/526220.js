// ==UserScript==
// @name         Kittypet ТЕСТ ТАЙМЕРА
// @namespace    Sirotkin1
// @version      0.1
// @description  Скибиди доп доп доп ес ес
// @author       Сирота [1390991]
// @copyright    Wilhelm Birkner [https://vk.com/washclown]
// @match        *://catwar.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526220/Kittypet%20%D0%A2%D0%95%D0%A1%D0%A2%20%D0%A2%D0%90%D0%99%D0%9C%D0%95%D0%A0%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/526220/Kittypet%20%D0%A2%D0%95%D0%A1%D0%A2%20%D0%A2%D0%90%D0%99%D0%9C%D0%95%D0%A0%D0%90.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
  style.textContent = `
    #timer-window {
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: #181818;
      color: #ffffff;
      padding: 10px;
      border: 1px solid #333;
      border-radius: 5px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      cursor: grab;
      width: 380px;
    }
    #timer-window.dragging {
      cursor: grabbing;
    }
    #timer-header {
      margin-bottom: 5px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
      color: #ddd;
    }
    #timer-header.dragging {
      cursor: grabbing;
    }
    #timer-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
    }
    .timer-group {
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 1px dotted #555;
    }
    .timer-group:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .timer-label {
      font-weight: bold;
      margin-bottom: 3px;
      display: block;
      color: #eee;
      font-size: 0.95em;
    }
    .timer-display {
      font-size: 1.1em;
      margin-bottom: 3px;
      color: #fff;
    }
    .timer-button {
      padding: 4px 8px;
      border: 1px solid #555;
      border-radius: 3px;
      cursor: pointer;
      background-color: #575757;
      color: #fff;
      margin-right: 3px;
      font-size: 0.9em;
    }
    .timer-button:hover {
      background-color: #575757;
    }
    .timer-button.start {
      background-color: #575757;
    }
    .timer-button.start:hover {
      background-color: #707070;
    }
    .timer-button.reset {
      background-color: #575757;
    }
    .timer-button.reset:hover {
      background-color: #707070;
    }
    .collapse-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      padding: 0;
      margin-left: 5px;
      color: #ddd;
    }
    .collapsed #timer-container {
      display: none;
    }
    .collapsed #timer-header {
      margin-bottom: 0;
    }

  `;
  document.head.appendChild(style);

  // HTML структура окна таймеров
  const timerWindow = document.createElement('div');
  timerWindow.id = 'timer-window';
  timerWindow.innerHTML = `
    <div id="timer-header">
      Таймеры
            <button id="collapse-timer-window" class="collapse-button">☰</button>
    </div>
    <div id="timer-container">
      <div class="timer-group">
        <span class="timer-label">Покормить курочку:</span>
        <div class="timer-display" id="timer-1-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="1">Старт 6ч</button>
        <button class="timer-button reset" data-timer-id="1">Сброс</button>
      </div>
      <div class="timer-group">
        <span class="timer-label">Покормить Озика:</span>
        <div class="timer-display" id="timer-5-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="5">Старт 6ч</button>
        <button class="timer-button reset" data-timer-id="5">Сброс</button>
      </div>
      <div class="timer-group">
        <span class="timer-label">Погладить Лучика:</span>
        <div class="timer-display" id="timer-3-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="3">Старт 24ч</button>
        <button class="timer-button reset" data-timer-id="3">Сброс</button>
      </div>
      <div class="timer-group">
        <span class="timer-label">Потрогать миску:</span>
        <div class="timer-display" id="timer-6-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="6">Старт 6ч</button>
        <button class="timer-button reset" data-timer-id="6">Сброс</button>
      </div>
      <div class="timer-group">
        <span class="timer-label">Поговорить с Алу:</span>
        <div class="timer-display" id="timer-2-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="2">Старт 1ч</button>
        <button class="timer-button reset" data-timer-id="2">Сброс</button>
      </div>
       <div class="timer-group">
        <span class="timer-label">Джуди:</span>
        <div class="timer-display" id="timer-4-display">00:00:00</div>
        <button class="timer-button start" data-timer-id="4">Старт 3ч20м</button>
        <button class="timer-button reset" data-timer-id="4">Сброс</button>
      </div>
    </div>
  `;
  document.body.appendChild(timerWindow);

  const timerIntervals = {}; // Объект для хранения setInterval для каждого таймера
  const timerEndTimeKey = 'timerEndTimes';
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  const timerHeader = document.getElementById('timer-header');
  const collapseButton = document.getElementById('collapse-timer-window');

  // Функция для форматирования времени в ЧЧ:MM:CC
  function formatTime(milliseconds) {
    let totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
          return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  // Функция для запуска таймера
  function startTimer(timerId, durationMs) {
    const displayElement = document.getElementById(`timer-${timerId}-display`);
    let endTime = Date.now() + durationMs;
    let savedEndTimes = JSON.parse(localStorage.getItem(timerEndTimeKey) || '{}');
    savedEndTimes[timerId] = endTime;
    localStorage.setItem(timerEndTimeKey, JSON.stringify(savedEndTimes));

    if (timerIntervals[timerId]) {
      clearInterval(timerIntervals[timerId]); // Очищаем предыдущий интервал, если есть
    }

    timerIntervals[timerId] = setInterval(() => {
      const timeLeft = endTime - Date.now();
      if (timeLeft <= 0) {
        clearInterval(timerIntervals[timerId]);
        displayElement.textContent = 'Время вышло!';
        alert(`Время для таймера ${timerId} истекло!`);
        savedEndTimes = JSON.parse(localStorage.getItem(timerEndTimeKey) || '{}');
        delete savedEndTimes[timerId]; // Удаляем из localStorage после истечения
        localStorage.setItem(timerEndTimeKey, JSON.stringify(savedEndTimes));
      } else {
        displayElement.textContent = formatTime(timeLeft);
      }
    }, 1000);
  }

  // Функция для сброса таймера
  function resetTimer(timerId) {
    clearInterval(timerIntervals[timerId]);
    document.getElementById(`timer-${timerId}-display`).textContent = '00:00:00';
    let savedEndTimes = JSON.parse(localStorage.getItem(timerEndTimeKey) || '{}');
    delete savedEndTimes[timerId];
    localStorage.setItem(timerEndTimeKey, JSON.stringify(savedEndTimes));
  }

  // Обработчики событий для кнопок
  timerWindow.addEventListener('click', function(event) {
    if (event.target.classList.contains('start')) {
      const timerId = event.target.dataset.timerId;
      let duration;
      switch (timerId) {
        case '1': duration = 6 * 60 * 60 * 1000; break; // 6 часов (Курочка)
        case '2': duration = 1 * 60 * 60 * 1000; break; // 1 час (Алу)
        case '3': duration = 24 * 60 * 60 * 1000; break; // 24 часа (Лучик)
        case '4': duration = (3 * 60 + 20) * 60 * 1000; break; // 3 часа 20 минут (Джуди)
        case '5': duration = 6 * 60 * 60 * 1000; break; // 6 часов (Озик)
        case '6': duration = 6 * 60 * 60 * 1000; break; // 6 часов (Миска)
        default: duration = 0;
      }
      if (duration > 0) {
        startTimer(timerId, duration);
      }
    } else if (event.target.classList.contains('reset')) {
      const timerId = event.target.dataset.timerId;
      resetTimer(timerId);
    }
  });

  // Функционал перетаскивания окна и сохранение позиции
  timerHeader.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragOffsetX = e.clientX - timerWindow.offsetLeft;
    dragOffsetY = e.clientY - timerWindow.offsetTop;
    timerWindow.classList.add('dragging');
    timerHeader.classList.add('dragging');
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    timerWindow.style.left = e.clientX - dragOffsetX + 'px';
    timerWindow.style.top = e.clientY - dragOffsetY + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    timerWindow.classList.remove('dragging');
    timerHeader.classList.remove('dragging');
    // Сохранение позиции окна в localStorage
          localStorage.setItem('timerWindowLeft', timerWindow.style.left);
    localStorage.setItem('timerWindowTop', timerWindow.style.top);
  });

  // Функционал сворачивания окна и сохранение состояния
  collapseButton.addEventListener('click', function() {
    timerWindow.classList.toggle('collapsed');
    // Сохранение состояния свернутости в localStorage
    localStorage.setItem('timerWindowCollapsed', timerWindow.classList.contains('collapsed'));
  });

  // Восстановление таймеров, позиции и состояния при загрузке страницы
  function restoreTimers() {
    const savedEndTimes = JSON.parse(localStorage.getItem(timerEndTimeKey) || '{}');
    for (const timerId in savedEndTimes) {
      if (savedEndTimes.hasOwnProperty(timerId)) {
        const endTime = savedEndTimes[timerId];
        const timeLeft = endTime - Date.now();
        if (timeLeft > 0) {
          startTimer(timerId, timeLeft); // Перезапускаем таймер с оставшимся временем
        } // Если timeLeft <= 0, таймер уже должен был истечь или истечет сразу в setInterval
      }
    }

    // Восстановление позиции окна
    const savedLeft = localStorage.getItem('timerWindowLeft');
    const savedTop = localStorage.getItem('timerWindowTop');
    if (savedLeft) timerWindow.style.left = savedLeft;
    if (savedTop) timerWindow.style.top = savedTop;

    // Восстановление состояния свернутости окна
    const isCollapsed = localStorage.getItem('timerWindowCollapsed');
    if (isCollapsed === 'true') {
      timerWindow.classList.add('collapsed');
    } else {
      timerWindow.classList.remove('collapsed'); // Явно раскрываем, если в localStorage 'false' или null
    }
  }

  restoreTimers();

})();
