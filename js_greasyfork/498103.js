// ==UserScript==
// @name         Hamster Kombat - Morse Code Converter and Auto Clicker
// @namespace    https://hamsterkombat.io/*
// @version      2024-07-17
// @description  Автокликер, Ввод секретного слова, Вход на сайт с ПК. Нажимает кнопку на основе уровня энергии при срабатывании пользовательской кнопки и копирует src iframe в буфер обмена. Заменяет определенные URL-адреса скриптов на hamsterkombat.io
// @description:en Autoclicker, Secret Word Input, Site Login from PC. Clicks a button based on energy level when triggered by a custom button and copies iframe src to clipboard. Replaces certain script URLs on hamsterkombat.io
// @description:ru Автокликер, Ввод секретного слова, Вход на сайт с ПК. Нажимает кнопку на основе уровня энергии при срабатывании пользовательской кнопки и копирует src iframe в буфер обмена. Заменяет определенные URL-адреса скриптов на hamsterkombat.io
// @description:es Autoclicker, Entrada de Palabra Secreta, Inicio de sesión en el sitio desde PC. Hace clic en un botón según el nivel de energía cuando se activa con un botón personalizado y copia el src del iframe al portapapeles. Reemplaza ciertas URL de scripts en hamsterkombat.io
// @description:de Autoclicker, Eingabe des Geheimworts, Site-Anmeldung vom PC aus. Klickt auf eine Schaltfläche basierend auf dem Energieniveau, wenn sie durch eine benutzerdefinierte Schaltfläche ausgelöst wird, und kopiert die iframe-src in die Zwischenablage. Ersetzt bestimmte Skript-URLs auf hamsterkombat.io
// @description:fr Autoclicker, Saisie de Mot Secret, Connexion au site depuis un PC. Clique sur un bouton en fonction du niveau d'énergie lorsqu'il est déclenché par un bouton personnalisé et copie le src de l'iframe dans le presse-papiers. Remplace certaines URL de script sur hamsterkombat.io
// @description:zh 自动点击器，输入秘密词，从PC登录站点。根据能量水平点击一个按钮，当由自定义按钮触发时，并将iframe的src复制到剪贴板。替换hamsterkombat.io上的某些脚本URL
// @author       Devitp001
// @match        https://*.hamsterkombat.io/*
// @match        https://web.telegram.org/*/*
// @match        https://*.hamsterkombatgame.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498103/Hamster%20Kombat%20-%20Morse%20Code%20Converter%20and%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/498103/Hamster%20Kombat%20-%20Morse%20Code%20Converter%20and%20Auto%20Clicker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentUrl = window.location.href;

    // Константы
    const pauseDelay = 2000; // Задержка между буквами (ms)
    const dotDelay = 1; // Длительность точки (ms)
    const dashDelay = 750; // Длительность тире (ms)
    const extraDelay = 200; // Дополнительная пауза между нажатиями (ms)
    const multiplyTap = 16; // Сколько энергии тратится за 1 тап

    // Замена URL скриптов
    function replaceScriptUrl() {
        const urlsToReplace = [
            'https://hamsterkombatgame.io/js/telegram-web-app.js?v=7.6',
            'https://app.hamsterkombatgame.io/js/telegram-web-app.js?v=7.6',
        ];
        const newUrl = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

        document.querySelectorAll('script').forEach(script => {
            if (urlsToReplace.includes(script.src)) {
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';
                script.parentNode.replaceChild(newScript, script);
                console.log('Script URL replaced:', newScript.src);
            }
        });
    }

    // Наблюдатель для замены скриптов
    const scriptObserver = new MutationObserver(() => {
        replaceScriptUrl();
    });

    scriptObserver.observe(document.body, { childList: true, subtree: true });
    replaceScriptUrl();

    // Функция поиска кнопки
    function findTapButton() {
        return document.querySelector('.user-tap-button');
    }

    // Функция для проверки уровня энергии
    function energyLevel() {
        const energyElement = document.querySelector(".user-tap-energy p");
        if (energyElement) {
            return parseInt(energyElement.textContent.split(" / ")[0], 10);
        }
        return 0;
    }

    // Функция для эмуляции нажатий с использованием координат центра кнопки
    async function simulateTap(button, delay) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        const downEvent = new PointerEvent('pointerdown', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        });

        const upEvent = new PointerEvent('pointerup', {
            bubbles: true,
            clientX: centerX,
            clientY: centerY
        });

        button.dispatchEvent(downEvent);
        await new Promise(resolve => setTimeout(resolve, delay));
        button.dispatchEvent(upEvent);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async function dotTap(button) {
        if (energyLevel() > 100) {
            await simulateTap(button, dotDelay);
        }
    }

    async function dashTap(button) {
        if (energyLevel() > 100) {
            await simulateTap(button, dashDelay);
        }
    }

    function pauseBetweenLetters() {
        return new Promise(resolve => setTimeout(resolve, pauseDelay));
    }

    // Функция преобразования текста в Морзе
    function textToMorse(text) {
        const morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', ' ': ' '
        };

        return text.toUpperCase().split('').map(char => {
            if (char in morseCodeMap) {
                return morseCodeMap[char];
            } else if (char === ' ') {
                return ' ';
            }
            return '';
        }).join(' ');
    }

    // Функция для преобразования Морзе в нажатия
    async function textToTap(morseString) {
        const button = findTapButton();
        if (!button) {
            console.log('Button not found');
            return;
        }

        let clickWord = 0;
        let clickTime = 0;

        for (const char of morseString) {
            switch (char) {
                case '.':
                    await dotTap(button);
                    clickWord++;
                    clickTime += dotDelay;
                    break;
                case '-':
                    await dashTap(button);
                    clickWord++;
                    clickTime += dashDelay;
                    break;
                case ' ':
                    await pauseBetweenLetters();
                    break;
            }

            // Проверка уровня энергии перед каждым нажатием
            const energyNow = energyLevel();
            const waitTime = actionCanProceed(energyNow, clickWord, clickTime, multiplyTap);
            if (waitTime > 0) {
                console.log(`Not enough energy, waiting for ${waitTime} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            }
        }

        await pauseBetweenLetters();
    }

    // Функция для проверки возможности продолжения действия
    function actionCanProceed(energyNow, clickWord, clickTime, multiplyTap) {
        let energyCost = Math.ceil((clickWord * multiplyTap) - ((clickTime / 1000) * 3));
        let waitUntilEnergy = 0;

        if (energyCost > energyNow) {
            waitUntilEnergy = Math.ceil((energyCost - energyNow) / 3 + 3);
        }

        return waitUntilEnergy;
    }

    // Функция автоматического нажатия кнопки
    function checkEnergyAndClick() {
        if (!isClicking) return;

        const button = findTapButton();
        if (!button) {
            console.log('Button not found');
            return;
        }

        const energy = energyLevel();
        if (energy > 100) {
            simulateTap(button, dotDelay);
        }

        requestAnimationFrame(checkEnergyAndClick);
    }

    let isClicking = false;

    function toggleClicking() {
        isClicking = !isClicking;
        updateClickButtonState(document.getElementById('clickButton'));
        if (isClicking) {
            requestAnimationFrame(checkEnergyAndClick);
        }
    }

    function updateClickButtonState(button) {
        if (isClicking) {
            button.style.backgroundColor = '#4CAF50'; // green
            button.textContent = 'Остановить клики';
        } else {
            button.style.backgroundColor = '#FF0000'; // red
            button.textContent = 'Начать кликать';
        }
    }

    function createClickButton() {
        let clickButton = document.getElementById('clickButton');
        if (!clickButton) {
            clickButton = document.createElement('button');
            clickButton.id = 'clickButton';
            clickButton.style.position = 'fixed';
            clickButton.style.top = '10px';
            clickButton.style.left = '10px';
            clickButton.style.zIndex = '1000';
            clickButton.style.padding = '10px 20px';
            clickButton.style.color = 'white';
            clickButton.style.border = 'none';
            clickButton.style.borderRadius = '5px';
            clickButton.style.cursor = 'pointer';
            clickButton.style.margin = '5px';
            updateClickButtonState(clickButton);

            clickButton.addEventListener('click', toggleClicking);

            document.body.appendChild(clickButton);
        }
    }

    // Добавление поля ввода текста и обработчика событий
    function addInputField() {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'morseInputField';
        inputField.placeholder = 'Enter text-to-morse-and-click';
        inputField.style.position = 'fixed';
        inputField.style.top = '10px';
        inputField.style.right = '10px';
        inputField.style.zIndex = '1000';
        inputField.style.padding = '5px';
        inputField.style.backgroundColor = 'white';
        inputField.style.border = '2px solid black';
        inputField.style.fontSize = '16px';
        document.body.appendChild(inputField);

        inputField.addEventListener('keydown', async function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const text = inputField.value;
                const morseString = textToMorse(text);
                console.log('Converted Morse Code:', morseString);

                // Simulate button click using Morse code
                await textToTap(morseString);

                // Clear input field
                inputField.value = '';
            }
        });
    }

    // Основная логика для hamsterkombat.io
    function hamsterkombatFunctionality() {
        window.addEventListener('load', () => {
            createClickButton();

            const observer = new MutationObserver(() => {
                if (!document.getElementById('clickButton')) {
                    createClickButton();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Add input field for Morse code conversion
            addInputField();
        });
    }

    // Основная логика для web.telegram.org
    function telegramFunctionality() {
        function waitForIframe(selector, callback) {
            const iframe = document.querySelector(selector);
            if (iframe) {
                callback(iframe);
            } else {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                            const iframe = document.querySelector(selector);
                            if (iframe) {
                                observer.disconnect();
                                callback(iframe);
                            }
                        }
                    });
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        }

        function getIframeSrc(callback) {
            const selector = "body > div.popup.popup-payment.popup-payment-verification.popup-web-app.active > div > div.popup-body > iframe";
            waitForIframe(selector, (iframe) => {
                const src = iframe.getAttribute('src');
                if (callback) callback(src);
            });
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Link copied to clipboard!');
            }).catch(err => {
                console.error('Error copying to clipboard: ', err);
            });
        }

        function createCopyButton() {
            const copyButtonStyles = {
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: '1000',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
            };

            let copyButton = document.getElementById('copyButton');
            if (!copyButton) {
                copyButton = document.createElement('button');
                copyButton.id = 'copyButton';
                copyButton.textContent = 'Копировать ссылку';
                Object.assign(copyButton.style, copyButtonStyles);

                copyButton.addEventListener('click', () => {
                    getIframeSrc((src) => {
                        if (src) {
                            copyToClipboard(src);
                        } else {
                            console.error('Link not found.');
                        }
                    });
                });

                document.body.appendChild(copyButton);
            }
        }

        window.addEventListener('load', () => {
            createCopyButton();

            const observer = new MutationObserver(() => {
                if (!document.getElementById('copyButton')) {
                    createCopyButton();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Запуск соответствующей функциональности в зависимости от URL
    if (currentUrl.includes('web.telegram.org')) {
        telegramFunctionality();
    } else if (currentUrl.includes('hamster')) {
        hamsterkombatFunctionality();
    }
})();
