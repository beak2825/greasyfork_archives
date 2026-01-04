// ==UserScript==
// @name         Character.AI Auto-Requester
// @namespace    http://tampermonkey.net/
// @version      2.95555556
// @license       GNU GPLv3
// @description  Автоматическая отправка сообщений с настройкой интервалов
// @match        https://character.ai/chat*
// @author       xPress
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526934/CharacterAI%20Auto-Requester.user.js
// @updateURL https://update.greasyfork.org/scripts/526934/CharacterAI%20Auto-Requester.meta.js
// ==/UserScript==

//TODO: Слайдер для .control-overlay scale

(function() {
    'use strict';

    // Начальные значения
    let delayVoice = 10000;
    let interval = 30000;
    let timer;

    // Стили для оверлея
    GM_addStyle(`
        .control-overlay {
            user-select: none;
            position: absolute;
            top: 50%; /* или любое другое фиксированное значение */

            left: 50%;
            background: rgba(255,255,255,0.8);
            padding: 15px;
            border-radius: 8px;
            color: black;
            z-index: 9999;
            min-width: 250px;
            width: 350px;
            max-height: 800px; /* Максимальная высота */
            transition: max-height 0.4s ease-in-out;
            transform: translate(-50%, -100px) scale(0.9);
            transform-origin: top left; /* или center, в зависимости от нужного эффекта */

        }
        .slider-container {
            margin: 10px 0;
        }
        input[type="range"] {
            width: 100%;
            margin: 5px 0;
            -webkit-appearance: none;
            background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: lime;
            cursor: pointer;
            margin-top: -6px;
        }
        input[type="range"]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: lime;
            cursor: pointer;
        }
        input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #c9c9c9;
            border-radius: 2px;
        }
        input[type="range"]::-moz-range-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #c9c9c9;
            border-radius: 2px;
        }
        .value-display {
            font-size: 14px;
            margin-top: 5px;
        }
        .header {
            cursor: move;
            padding: 0 10px;
            background: rgba(255,255,255,0.5);
            border-bottom: 1px solid #333;
        }
        .minimized {
            max-height: 53px;
            overflow: hidden;
        }

        .control-overlay:not(.minimized) .content {
            opacity: 1;
            transition: opacity 0.4s ease-in-out;
        }

        .control-overlay.minimized .content {
            opacity: 0;
            transition: opacity 0.4s ease-in-out;
        }

        .switch-container {
            margin: 10px 0;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .switch-container label {
            margin: 15px 35px;
            font-size: 24px;
            margin-top: 23px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: lime;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px lime;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        .description {
            font-size: 12px;
            text-indent: 25px;
            line-height: 11px;
            color: gray;
        }
        
        .description p {
            margin-top: 5px; /* Отступ сверху */
            margin-bottom: 5px; /* Отступ снизу */
            color: gray
        }

    `);

    const textFieldXPath = '//*[@id="chat-body"]/div[2]/div/div/div/div[1]/textarea';
    const sendButtonXPath = '//*[@id="chat-body"]/div[2]/div/div/div/div[2]/button';
    const voiceButtonXPath = '//*[@id="chat-messages"]/div[1]/div[1]/div/div/div[1]/div/div[1]/div[1]/div[2]/div[1]/div[2]/div[2]/div/button';

    // Создаем элементы управления
    const overlay = document.createElement('div');
    overlay.className = 'control-overlay';
    overlay.innerHTML = `
        <div class="header">
            <h3 style="margin:0; display:inline-block;">Character.AI Auto-Requester</h3>
            <button class="minimize" style="float:right;">▼</button>
        </div>
        <div class="content">
            <div class="slider-container">
                <label>Задержка голоса:</label>
                <input type="range" min="1" max="60" value="${delayVoice/1000}" class="voice-delay">
                <div class="value-display">${delayVoice/1000} сек</div>
            </div>
            <div class="slider-container">
                <label>Интервал сообщений:</label>
                <input type="range" min="3" max="120" value="${interval/1000}" class="send-interval">
                <div class="value-display">${interval/1000} сек</div>
            </div>
            <div class="switch-container">
                <label>Вкл/Выкл</label>
                <label class="switch">
                    <input type="checkbox" class="toggle-auto-send">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="description">
                Пользуйтесь аккуратно; не совсем понятно, за какие скорости могут забанить аккаунт. В любом случае даже простое использование стороннего софта типа этого, скорее всего, не приветствуется.
                <p>
                Осторожно, смартфон, например, может не отключать экран и не блокироваться из-за работающего скрипта. Даже в состоянии "Выкл".
                <p>
                Если нужна тёмная тема - включайте DarkReader; если хочется какую-то другую - Stylus. Спасибо за понимание.
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Обработчики ползунков
    overlay.querySelector('.voice-delay').addEventListener('input', function(e) {
        delayVoice = e.target.value * 1000;
        e.target.nextElementSibling.textContent = `${e.target.value} сек`;

        // Останавливаем таймер
        clearInterval(timer);
        overlay.querySelector('.toggle-auto-send').checked = false;
    });

    let currentUrl = window.location.href;

    overlay.querySelector('.send-interval').addEventListener('input', function(e) {
        interval = e.target.value * 1000;
        e.target.nextElementSibling.textContent = `${e.target.value} сек`;

        // Останавливаем таймер
        clearInterval(timer);
        overlay.querySelector('.toggle-auto-send').checked = false;
    });

    function clickVoiceButton() {
        const voiceButton = document.evaluate(
            voiceButtonXPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        voiceButton?.click();
    }

    function simulateSend() {
        if (window.location.href !== currentUrl) {
            // Останавливаем таймер
            clearInterval(timer);
            overlay.querySelector('.toggle-auto-send').checked = false;

            currentUrl = window.location.href;
            return
        }
        const textField = document.evaluate(
            textFieldXPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        const sendButton = document.evaluate(
            sendButtonXPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (textField && sendButton && !sendButton.disabled) {
            const inputText = textField.value.trim();

            if (inputText === '') {
                sendButton.click();
                textField.value = '';
                setTimeout(clickVoiceButton, delayVoice);
            }
        }
    }

    // Вкл/Выкл
    overlay.querySelector('.toggle-auto-send').addEventListener('change', function(e) {
        if (e.target.checked) {
            // Включаем автоматическую отправку
            clearInterval(timer);
            timer = setInterval(simulateSend, interval);

            // Запоминаем страницу, на которой запустили автоотправку
            let currentUrl = window.location.href;
        } else {
            // Выключаем автоматическую отправку
            clearInterval(timer);
        }
    });

    // Перемещение оверлея
    let isDown = false;
    let offset = [0, 0];

    // Функция для обработки начала касания
    function handleTouchStart(event) {
        if (event.touches.length === 1) { // Только одно касание
            isDown = true;
            const touch = event.touches[0];
            offset = [
                overlay.offsetLeft - touch.clientX,
                overlay.offsetTop - touch.clientY
            ];
            event.preventDefault(); // Предотвратить выделение текста
        }
    }

    // Функция для обработки движения касания
    function handleTouchMove(event) {
        if (isDown) {
            const touch = event.touches[0];
            overlay.style.top = `${touch.clientY + offset[1]}px`;
            overlay.style.right = 'auto'; // Чтобы не было привязки к правому краю
            overlay.style.left = `${touch.clientX + offset[0]}px`;
            event.preventDefault(); // Предотвратить прокрутку страницы
        }
    }

    // Функция для обработки окончания касания
    function handleTouchEnd() {
        isDown = false;
    }

    // Добавление обработчиков событий для касаний
    overlay.querySelector('.header h3').addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Добавление обработчиков событий для мыши (чтобы не потерять функциональность на компьютере)
    overlay.querySelector('.header h3').addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Левая кнопка мыши
            isDown = true;
            offset = [
                overlay.offsetLeft - event.clientX,
                overlay.offsetTop - event.clientY
            ];
            event.preventDefault(); // Предотвратить выделение текста
        }
    });

    document.addEventListener('mouseup', function() {
        isDown = false;
    });

    document.addEventListener('mousemove', function(event) {
        if (isDown) {
            overlay.style.top = `${event.clientY + offset[1]}px`;
            overlay.style.right = 'auto'; // Чтобы не было привязки к правому краю
            overlay.style.left = `${event.clientX + offset[0]}px`;
        }
    });
    // Минимизация/сворачивание
    overlay.querySelector('.minimize').addEventListener('click', function() {
        if (overlay.classList.contains('minimized')) {
            overlay.classList.remove('minimized');
            this.textContent = '▼'; // Используем Unicode для символа
        } else {
            overlay.classList.add('minimized');
            this.textContent = '▲'; // Используем Unicode для символа
        }
    });
})();
