// ==UserScript==
// @name         Уведомление о конце действия
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Звуковые уведомления на конец действия/перехода
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        https://patron.kinwoods.com/game
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/536127/%D0%A3%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%20%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536127/%D0%A3%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%20%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const defaultConfig = {
        soundType: 'pook',
        volume: 0.5,
        minimized: false
    };

    // Обновленные звуковые профили с двойным воспроизведением
    const SOUNDS = {
        pook: {
            name: "🔊 Пип-Пип", // Было "Пуньк"
            play: function(volume) {
                try {
                    const ctx = new AudioContext();
                    // Первый "Пип"
                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'square';
                    osc1.frequency.value = 800; // Выше частота для "Пип"
                    gain1.gain.value = volume;
                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08); // Короче
                    osc1.start();
                    osc1.stop(ctx.currentTime + 0.08);

                    // Второй "Пип" через 0.1 сек
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'square';
                    osc2.frequency.value = 800;
                    gain2.gain.value = volume;
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
                    osc2.start(ctx.currentTime + 0.1);
                    osc2.stop(ctx.currentTime + 0.18);
                } catch (e) {
                    console.error("Sound error:", e);
                }
            }
        },
        boop: {
            name: "🔊 Буп-Буп", // Было "Бууп"
            play: function(volume) {
                try {
                    const ctx = new AudioContext();
                    // Первый "Буп"
                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.value = 500; // Частота повыше для "Буп"
                    gain1.gain.value = volume;
                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); // Короче
                    osc1.start();
                    osc1.stop(ctx.currentTime + 0.1);

                    // Второй "Буп" через 0.15 сек
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.value = 500;
                    gain2.gain.value = volume;
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                    osc2.start(ctx.currentTime + 0.15);
                    osc2.stop(ctx.currentTime + 0.25);
                } catch (e) {
                    console.error("Sound error:", e);
                }
            }
        },
        ping: {
            name: "🔊 Пинг-Пинг",
            play: function(volume) {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();

                    // Первый звук
                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'triangle';
                    osc1.frequency.value = 800;
                    gain1.gain.value = volume;
                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    gain1.gain.setValueAtTime(volume, ctx.currentTime);
                    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                    osc1.start();
                    osc1.stop(ctx.currentTime + 0.1);

                    // Второй звук
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'triangle';
                    osc2.frequency.value = 800;
                    gain2.gain.value = volume;
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    gain2.gain.setValueAtTime(volume, ctx.currentTime + 0.15);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                    osc2.start(ctx.currentTime + 0.15);
                    osc2.stop(ctx.currentTime + 0.25);
                } catch (e) {
                    console.error("Sound error:", e);
                }
            }
        },
        blip: {
            name: "🔊 Блип-Блип",
            play: function(volume) {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();

                    // Первый звук
                    const osc1 = ctx.createOscillator();
                    const gain1 = ctx.createGain();
                    osc1.type = 'sawtooth';
                    osc1.frequency.value = 300;
                    gain1.gain.value = volume;
                    osc1.connect(gain1);
                    gain1.connect(ctx.destination);
                    gain1.gain.setValueAtTime(volume, ctx.currentTime);
                    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                    osc1.start();
                    osc1.stop(ctx.currentTime + 0.08);

                    // Второй звук
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.type = 'sawtooth';
                    osc2.frequency.value = 300;
                    gain2.gain.value = volume;
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    gain2.gain.setValueAtTime(volume, ctx.currentTime + 0.1);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
                    osc2.start(ctx.currentTime + 0.1);
                    osc2.stop(ctx.currentTime + 0.18);
                } catch (e) {
                    console.error("Sound error:", e);
                }
            }
        }
    };
    // Загрузка настроек с проверкой
    let config;
    try {
        const savedConfig = GM_getValue('soundConfig') || {};
        config = {
            ...defaultConfig,
            ...savedConfig
        };
        if (!SOUNDS[config.soundType]) {
            config.soundType = defaultConfig.soundType;
        }
    } catch (e) {
        console.error("Config load error, using defaults:", e);
        config = { ...defaultConfig };
    }

    let lastTimerState = null;
    let panel, toggleBtn;

    // Создание интерфейса
    function createUI() {
        if (panel) panel.remove();

        // Добавляем стили для выпадающего списка
        const style = document.createElement('style');
        style.textContent = `
            .sound-select {
                all: initial; /* Сбрасываем все стили */
                width: 100% !important;
                margin-bottom: 12px !important;
                padding: 7px !important;
                border-radius: 6px !important;
                border: 1px solid #ccc !important;
                background: white !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                font-size: 13px !important;
                cursor: pointer !important;
            }
            .sound-select option {
                color: black !important;
                background: white !important;
            }
        `;
        document.head.appendChild(style);

        // Основная панель
        panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(50, 50, 50, 0.95);
            border-radius: 12px;
            padding: ${config.minimized ? '8px' : '12px'};
            z-index: 99999;
            color: white;
            font-family: 'Arial', sans-serif;
            width: ${config.minimized ? '42px' : '180px'};
            height: ${config.minimized ? '42px' : 'auto'};
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.15);
            transition: all 0.25s ease-out;
            overflow: hidden;
            box-sizing: border-box;
        `;

        // Кнопка свернуть/развернуть
        toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = config.minimized ? '⚙️' : '❌';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 6px;
            right: 6px;
            cursor: pointer;
            font-size: 16px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
            z-index: 2;
            user-select: none;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = 'rgba(255,255,255,0.25)';
        toggleBtn.onmouseout = () => toggleBtn.style.background = 'transparent';
        toggleBtn.onclick = togglePanel;

        if (!config.minimized) {
            // Заголовок
            const title = document.createElement('div');
            title.textContent = 'Звуковые сигналы';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 12px;
                color: #4CAF50;
                font-size: 14px;
                text-align: center;
            `;

            // Выбор звука
            const select = document.createElement('select');
            select.className = 'sound-select';
            Object.keys(SOUNDS).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = SOUNDS[key].name;
                option.selected = key === config.soundType;
                select.appendChild(option);
            });

            // Громкость
            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = `
                margin-bottom: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            const volumeIcon = document.createElement('span');
            volumeIcon.textContent = '🔈';
            volumeIcon.style.fontSize = '15px';

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.05';
            volumeSlider.value = config.volume;
            volumeSlider.style.cssText = `
                flex-grow: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(255,255,255,0.1);
                outline: none;
                accent-color: #4CAF50;
                cursor: pointer;
            `;

            // Кнопка теста
            const testBtn = document.createElement('button');
            testBtn.textContent = 'Тестировать звук';
            testBtn.style.cssText = `
                width: 100%;
                padding: 8px;
                background: linear-gradient(to right, #4CAF50, #3d8b40);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                transition: all 0.2s;
            `;
            testBtn.onmouseover = () => testBtn.style.opacity = '0.85';
            testBtn.onmouseout = () => testBtn.style.opacity = '1';
            testBtn.onclick = () => {
                if (SOUNDS[config.soundType] && SOUNDS[config.soundType].play) {
                    SOUNDS[config.soundType].play(config.volume);
                }
            };

            // Сборка интерфейса
            panel.appendChild(title);
            panel.appendChild(select);
            volumeContainer.appendChild(volumeIcon);
            volumeContainer.appendChild(volumeSlider);
            panel.appendChild(volumeContainer);
            panel.appendChild(testBtn);

            // Обработчики событий
            select.addEventListener('change', () => {
                config.soundType = select.value;
                saveConfig();
            });

            volumeSlider.addEventListener('input', () => {
                config.volume = parseFloat(volumeSlider.value);
                saveConfig();
            });
        }

        panel.appendChild(toggleBtn);
        document.body.appendChild(panel);
    }

    function togglePanel() {
        config.minimized = !config.minimized;
        saveConfig();
        createUI();
    }

    function saveConfig() {
        GM_setValue('soundConfig', config);
    }

    function checkTimer() {
        try {
            const panels = document.querySelectorAll('.panel');
            let timerPanel = null;

            panels.forEach(panel => {
                if (panel.textContent.includes('осталось')) {
                    timerPanel = panel;
                }
            });

            if (!timerPanel) {
                if (lastTimerState === '1') {
                    if (SOUNDS[config.soundType] && SOUNDS[config.soundType].play) {
                        SOUNDS[config.soundType].play(config.volume);
                    }
                }
                lastTimerState = null;
                return;
            }

            const timerText = timerPanel.querySelector('p')?.textContent.trim();
            const match = timerText?.match(/осталось\s+(\d+)\s+сек/i);
            const currentValue = match ? match[1] : null;

            if (currentValue === '0' && lastTimerState !== '0') {
                if (SOUNDS[config.soundType] && SOUNDS[config.soundType].play) {
                    SOUNDS[config.soundType].play(config.volume);
                }
            }

            lastTimerState = currentValue;
        } catch (e) {
            console.error("Timer check error:", e);
        }
    }

    function init() {
        createUI();
        setInterval(checkTimer, 300);
    }

    if (document.readyState === 'complete') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1500));
    }
})();