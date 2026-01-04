// ==UserScript==
// @name         virtual gamepad
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  мод, который оптимизирует боевой режим телефонщиков для активного боя и более удобных тренировок
// @author       кораблекрушение 1198898
// @match        https://catwar.net/cw3/*
// @match        https://catwar.su/cw3/*
// @match        https://catwar.net/settings
// @match        https://catwar.su/settings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542568/virtual%20gamepad.user.js
// @updateURL https://update.greasyfork.org/scripts/542568/virtual%20gamepad.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const activeKeys = {};
    const keyInUse = {};
    const movementKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X'];
    const actionKeys = ['I', 'J', 'L', 'O'];
    let keyRepeatInterval = {};
    let observer;
    let keyboardEnabled = JSON.parse(localStorage.getItem('virtualKeyboardEnabled')) || false;

    function createVirtualKeyboard() {
        if (document.getElementById('virtual-keyboard')) return;

        const keyboardHTML = `
            <div id="virtual-keyboard">
                <div id="left-keys">
                    <button id="key-Q" class="virtual-key">Q</button>
                    <button id="key-W" class="virtual-key">W</button>
                    <button id="key-E" class="virtual-key">E</button>
                    <button id="key-A" class="virtual-key">A</button>
                    <button id="key-K" class="virtual-key">K</button>
                    <button id="key-D" class="virtual-key">D</button>
                    <button id="key-Z" class="virtual-key">Z</button>
                    <button id="key-S" class="virtual-key">S</button>
                    <button id="key-X" class="virtual-key">X</button>
                </div>
                <div id="right-keys">
                    <button id="key-I" class="virtual-key">I</button>
                    <div>
                        <button id="key-J" class="virtual-key">J</button>
                        <button id="key-L" class="virtual-key">L</button>
                    </div>
                    <button id="key-O" class="virtual-key">O</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', keyboardHTML);

        const style = document.createElement('style');
        style.innerHTML = `
            .virtual-key {
                width: 150px;
                height: 150px;
                font-size: 48px;
                border: 1px solid #aaa;
                border-radius: 10px;
                background-color: #eee;
                cursor: pointer;
            }
            .virtual-key:active {
                background-color: #ccc;
            }
            #virtual-keyboard {
                position: fixed;
                bottom: 20px;
                left: 20px;
                display: flex;
                gap: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }
            #left-keys {
                display: grid;
                grid-template-columns: repeat(3, 150px);
                grid-template-rows: repeat(3, 150px);
                gap: 10px;
                justify-items: center;
                align-items: center;
            }
            #right-keys {
                position: fixed;
                right: 150px;
                bottom: 20px;
                display: grid;
                grid-template-columns: 150px;
                grid-template-rows: 150px 150px 150px;
                gap: 10px;
                justify-items: center;
                align-items: center;
                margin-top: 20px;
            }
            #right-keys div {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);

        addKeyboardControls();
    }

    function removeVirtualKeyboard() {
        const keyboard = document.getElementById('virtual-keyboard');
        if (keyboard) keyboard.remove();
        console.log('[Catwar Virtual Keyboard] Виртуальная клавиатура удалена.');
    }

    function addKeyboardControls() {
        const buttons = document.querySelectorAll('.virtual-key');

        buttons.forEach(button => {
            button.addEventListener('touchstart', (event) => {
                event.preventDefault();
                const key = button.id.split('-')[1];
                if (!keyInUse[key]) {
                    keyInUse[key] = true;
                    activeKeys[key] = true;
                    simulateKeyEvent('keydown', key);
                    startKeyRepeat(key);
                }
            });

            button.addEventListener('touchend', (event) => {
                event.preventDefault();
                const key = button.id.split('-')[1];
                if (keyInUse[key]) {
                    keyInUse[key] = false;
                    activeKeys[key] = false;
                    simulateKeyEvent('keyup', key);
                    stopKeyRepeat(key);
                }
            });

            button.addEventListener('mousedown', () => {
                const key = button.id.split('-')[1];
                if (!keyInUse[key]) {
                    keyInUse[key] = true;
                    activeKeys[key] = true;
                    simulateKeyEvent('keydown', key);
                    startKeyRepeat(key);
                }
            });

            button.addEventListener('mouseup', () => {
                const key = button.id.split('-')[1];
                if (keyInUse[key]) {
                    keyInUse[key] = false;
                    activeKeys[key] = false;
                    simulateKeyEvent('keyup', key);
                    stopKeyRepeat(key);
                }
            });
        });
    }

    function startKeyRepeat(key) {
        if (keyRepeatInterval[key]) return;
        keyRepeatInterval[key] = setInterval(() => {
            if (activeKeys[key]) {
                simulateKeyEvent('keydown', key);
            }
        }, 100);
    }

    function stopKeyRepeat(key) {
        if (keyRepeatInterval[key]) {
            clearInterval(keyRepeatInterval[key]);
            delete keyRepeatInterval[key];
        }
    }

    function simulateKeyEvent(type, key) {
        const event = new KeyboardEvent(type, {
            key: key,
            code: `Key${key}`,
            keyCode: key.charCodeAt(0),
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
        console.log(`[DEBUG] Событие ${type} для клавиши: ${key}`);
    }

    function observeTooltip() {
        observer = new MutationObserver(() => {
            const tooltip = document.querySelector('[data-original-title="null"] img[src="actions/28.png"]');
            if (tooltip) {
                console.log('[Catwar Virtual Keyboard] Элемент найден, создаём клавиатуру.');
                if (keyboardEnabled) {
                    createVirtualKeyboard();
                }
            } else {
                console.log('[Catwar Virtual Keyboard] Элемент отсутствует, удаляем клавиатуру.');
                removeVirtualKeyboard();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // нормальная кнопка включения в настройках
    function addSettings() {
        if (document.querySelector('#virtual-keyboard-settings')) return;
        if (window.location.pathname !== '/settings') return;

        const siteTable = document.querySelector("#site_table");
        const isMobile = siteTable?.getAttribute("data-mobile") === "0";
        const settingsContainer = isMobile
            ? document.querySelector("#branch")
            : siteTable || document.body;

        const settingsElement = document.createElement("div");
        settingsElement.id = 'virtual-keyboard-settings';
        settingsElement.style.marginTop = '20px';
        settingsElement.style.marginBottom = '20px';
        settingsElement.style.padding = '15px';
        settingsElement.style.border = '2px solid #d2b48c';
        settingsElement.style.borderRadius = '10px';
        settingsElement.style.backgroundColor = '#f9f9f9';
        settingsElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.fontSize = '18px';
        label.style.fontWeight = 'bold';
        label.style.color = '#333';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = keyboardEnabled;
        checkbox.style.marginRight = '10px';
        checkbox.style.transform = 'scale(1.5)';

        checkbox.addEventListener('change', () => {
            keyboardEnabled = checkbox.checked;
            localStorage.setItem('virtualKeyboardEnabled', JSON.stringify(keyboardEnabled));
            console.log(`[Catwar Virtual Keyboard] gamepad ${keyboardEnabled ? 'включен' : 'выключен'}`);
            if (keyboardEnabled) {
                createVirtualKeyboard();
            } else {
                removeVirtualKeyboard();
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode('Включить gamepad'));
        settingsElement.appendChild(label);
        settingsContainer.appendChild(settingsElement);
    }

    function init() {
        console.log('[Catwar Virtual Keyboard] Запуск.');
        observeTooltip();
        addSettings();
    }

    // убрать сообщение "Вы никого не ударили"
    (function () {
        'use strict';

        function removeErrorMessage() {
            const observer = new MutationObserver(() => {
                const errorMessage = document.getElementById('error');
                if (errorMessage && errorMessage.innerText.includes("Вы никого не ударили")) {
                    errorMessage.remove();
                    console.log('[Catwar Virtual Keyboard] Сообщение об ошибке удалено.');
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        removeErrorMessage();
    })();

    init();
})();
