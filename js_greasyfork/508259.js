// ==UserScript==
// @name         Z-AE
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Made for the Auto-E server
// @author       zeta
// @match        *://dynast.io/*
// @match        *://nightly.dynast.cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dynast.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508259/Z-AE.user.js
// @updateURL https://update.greasyfork.org/scripts/508259/Z-AE.meta.js
// ==/UserScript==

(function() {
    window.autoEKey = "q";
    window.useRightClick = true;
    window.MaxEPerSecond = 0;

    let intervalId = null;
    let scriptEnabled = false;
    let body = document.body;
    let wasmModule = null;
    let wasmInstance = null;

    // Функция для эмуляции нажатия клавиши
    function pressKey(key) {
        const eventProps = { key: key, keyCode: key.charCodeAt(0), code: `Key${key.toUpperCase()}` };
        let keyIsDown = new KeyboardEvent('keydown', eventProps);
        let keyIsUp = new KeyboardEvent('keyup', eventProps);
        window.dispatchEvent(keyIsDown);
        window.dispatchEvent(keyIsUp);
    }

    // Загрузка и инициализация WebAssembly модуля
    async function loadWasmModule() {
        try {
            const response = await fetch('URL_TO_YOUR_MODULE.wasm'); // Замените на URL вашего .wasm файла
            const buffer = await response.arrayBuffer();
            const module = await WebAssembly.compile(buffer);
            wasmModule = module;
            wasmInstance = await WebAssembly.instantiate(module);
            console.log('WASM module loaded and instantiated');
        } catch (e) {
            console.error('Failed to load WASM module:', e);
        }
    }

    // Пример функции для взаимодействия с WASM
    function wasmExampleFunction() {
        if (wasmInstance && wasmInstance.exports) {
            const result = wasmInstance.exports.exampleFunction(); // Предположим, у вас есть функция `exampleFunction` в WASM
            console.log('WASM function result:', result);
        }
    }

    // Обработка правой кнопки мыши
    function handleRightClickHold() {
        document.addEventListener('mousedown', function(event) {
            if (event.button === 2 && scriptEnabled) {
                event.preventDefault();
                if (!intervalId) {
                    pressKey('e');
                    intervalId = setInterval(() => pressKey('e'), window.MaxEPerSecond);
                }
            }
        });

        document.addEventListener('mouseup', function(event) {
            if (event.button === 2) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
    }

    // Обработка нажатия клавиши
    function handleAutoEKey() {
        let autoEKey = window.autoEKey;
        document.addEventListener('keydown', function(event) {
            if (event.key === autoEKey && !intervalId && scriptEnabled) {
                pressKey('e');
                intervalId = setInterval(() => pressKey('e'), window.MaxEPerSecond);
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === autoEKey) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
    }

    // Перезагрузка скрипта
    function handleReloadKey() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'r' || event.key === 'R') {
                loadScript();
            }
        });
    }

    // Динамическая загрузка скрипта
    function loadScript() {
        if (window.currentScript) {
            body.removeChild(window.currentScript);
        }

        let script = document.createElement('script');
        script.src = 'URL_TO_YOUR_SCRIPT.js'; // Замените на URL вашего скрипта
        script.onload = function() {
            console.log('Script reloaded');
        };

        window.currentScript = script;

        body.appendChild(script);
    }

    // Создание мини-консоли
    function createConsole() {
        let consoleDiv = document.createElement('div');
        consoleDiv.style = `
            position: fixed; bottom: 10px; right: 10px; padding: 15px 20px;
            background-color: rgba(0, 0, 0, 0.85); color: white; z-index: 1000;
            border-radius: 10px; font-size: 16px; font-weight: bold;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5); cursor: move;
            text-align: center; border: 2px solid #00FF00;
            text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 20px #00FF00;
        `;

        let toggleButton = document.createElement('button');
        toggleButton.innerText = 'Enable Script';
        toggleButton.style = `
            margin-bottom: 10px; padding: 10px; background-color: #00FF00;
            color: black; border: none; border-radius: 5px; cursor: pointer;
            font-weight: bold; box-shadow: 0 0 10px #00FF00;
        `;

        toggleButton.addEventListener('click', function() {
            scriptEnabled = !scriptEnabled;
            toggleButton.innerText = scriptEnabled ? 'Disable Script' : 'Enable Script';
            toggleButton.style.boxShadow = scriptEnabled ? 'none' : '0 0 10px #00FF00';
            toggleButton.style.backgroundColor = scriptEnabled ? '#00FF00' : '#222';
            toggleButton.style.color = scriptEnabled ? 'black' : '#00FF00';
        });

        consoleDiv.appendChild(toggleButton);
        body.appendChild(consoleDiv);

        let isDragging = false;
        let offsetX, offsetY;

        consoleDiv.addEventListener('mousedown', function(event) {
            if (event.target === toggleButton) return;
            isDragging = true;
            offsetX = event.clientX - consoleDiv.getBoundingClientRect().left;
            offsetY = event.clientY - consoleDiv.getBoundingClientRect().top;
            consoleDiv.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(event) {
            if (isDragging) {
                consoleDiv.style.left = (event.clientX - offsetX) + 'px';
                consoleDiv.style.top = (event.clientY - offsetY) + 'px';
                consoleDiv.style.bottom = 'auto';
                consoleDiv.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                consoleDiv.style.cursor = 'move';
            }
        });
    }

    // Периодическое нажатие клавиши 'r'
    function pressRPeriodically() {
        setInterval(() => pressKey('r'), 100);
    }

    // Запуск функций
    createConsole();
    loadWasmModule();

    if (window.useRightClick) {
        handleRightClickHold();
    } else {
        handleAutoEKey();
    }

    handleReloadKey();
    pressRPeriodically();
})();