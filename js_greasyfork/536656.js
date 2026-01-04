// ==UserScript==
// @name         SullyTavern Auto Resend on Empty AI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically clicks the send button in Sully Tavern when "Google AI Studio Candidate text empty" error occurs, and counts the auto-resends. Resets counter on manual send (click or Enter).
// @author       Your Helper
// @match        http://127.0.0.1:8000/*
// @match        http://localhost:8000/*
// @match        http://127.0.0.1:8000
// @match        http://localhost:8000
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536656/SullyTavern%20Auto%20Resend%20on%20Empty%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/536656/SullyTavern%20Auto%20Resend%20on%20Empty%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const TARGET_ERROR_SUBSTRING = "Google AI Studio Candidate text empty";
    const BUTTON_ID = "send_but";
    const TEXTAREA_ID = "send_textarea"; // <-- НОВОЕ: ID поля для ввода текста
    const SCRIPT_PREFIX = "[SullyTavern AutoResend] ";
    const COUNTER_ID = "st-autoresend-counter";

    // --- СОСТОЯНИЕ СКРИПТА ---
    let scriptInitialized = false;
    let autoClickCount = 0;
    let counterElement = null;


    // --- НОВЫЕ ФУНКЦИИ ДЛЯ СЧЕТЧИКА ---

    /**
     * Создает и стилизует элемент счетчика на странице.
     */
    function createCounterUI() {
        if (document.getElementById(COUNTER_ID)) return;

        counterElement = document.createElement('div');
        counterElement.id = COUNTER_ID;
        Object.assign(counterElement.style, {
            position: 'fixed',
            bottom: '50px',
            left: '25px',
            color: '#888888',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: '99999',
            pointerEvents: 'none',
            display: 'none'
        });
        document.body.appendChild(counterElement);
    }

    /**
     * Обновляет отображение счетчика. Показывает его, если > 0, иначе скрывает.
     */
    function updateCounterDisplay() {
        if (!counterElement) return;

        counterElement.textContent = autoClickCount;
        counterElement.style.display = autoClickCount > 0 ? 'block' : 'none';
    }

    /**
     * Устанавливает слушатель на кнопку отправки для сброса счетчика при ручном клике.
     * @param {HTMLElement} button - Элемент кнопки отправки.
     */
    function setupManualClickReset(button) {
        if (button.dataset.manualResetListener) return;

        button.addEventListener('click', (event) => {
            if (event.isTrusted && autoClickCount > 0) {
                console.log(SCRIPT_PREFIX + "Manual send detected (click). Resetting counter.");
                autoClickCount = 0;
                updateCounterDisplay();
            }
        });
        button.dataset.manualResetListener = 'true';
    }

    /**
     * НОВАЯ ФУНКЦИЯ
     * Устанавливает слушатель на поле ввода текста для сброса счетчика при нажатии Enter.
     * @param {HTMLTextAreaElement} textarea - Элемент поля ввода.
     */
    function setupEnterKeyReset(textarea) {
        if (textarea.dataset.enterResetListener) return; // Предотвращаем повторное назначение

        textarea.addEventListener('keydown', (event) => {
            // Сбрасываем, только если нажат Enter без Shift (для отправки) и счетчик > 0
            if (event.key === 'Enter' && !event.shiftKey && autoClickCount > 0) {
                console.log(SCRIPT_PREFIX + "Manual send detected (Enter key). Resetting counter.");
                autoClickCount = 0;
                updateCounterDisplay();
            }
        });
        textarea.dataset.enterResetListener = 'true';
    }


    // --- ОСНОВНАЯ ЛОГИКА ---

    function handleError(errorSource, errorDetails) {
        let errorMessage = "";

        if (typeof errorDetails === 'string') {
            errorMessage = errorDetails;
        } else if (errorDetails instanceof Error) {
            errorMessage = errorDetails.message || "";
        } else if (errorDetails && typeof errorDetails.reason !== 'undefined') {
            if (errorDetails.reason instanceof Error) {
                errorMessage = errorDetails.reason.message || "";
            } else if (typeof errorDetails.reason === 'string') {
                errorMessage = errorDetails.reason;
            }
        }

        if (typeof errorMessage === 'string' && errorMessage.includes(TARGET_ERROR_SUBSTRING)) {
            console.log(SCRIPT_PREFIX + `Target error detected via ${errorSource}: "${errorMessage}". Clicking send button.`);
            clickSendButton();
        }
    }

    function initializeScript() {
        if (scriptInitialized) {
            return;
        }

        createCounterUI();

        if (typeof console !== 'undefined' && typeof console.error !== 'undefined') {
            const originalConsoleError = console.error;
            console.error = function(...args) {
                originalConsoleError.apply(console, args);
                if (args.length > 0) {
                    handleError("console.error", args[0]);
                }
            };
        }

        window.addEventListener('unhandledrejection', function(event) {
            handleError("unhandledrejection", event);
        });

        // ИЗМЕНЕНО: MutationObserver теперь ищет и кнопку, и поле ввода
        const observer = new MutationObserver((mutations, obs) => {
            const sendButton = document.getElementById(BUTTON_ID);
            const textarea = document.getElementById(TEXTAREA_ID);

            let allElementsFound = true;

            if (sendButton && !sendButton.dataset.manualResetListener) {
                setupManualClickReset(sendButton);
                console.log(SCRIPT_PREFIX + "Manual click reset listener attached to the send button.");
            } else if (!sendButton) {
                allElementsFound = false;
            }

            if (textarea && !textarea.dataset.enterResetListener) {
                setupEnterKeyReset(textarea);
                 console.log(SCRIPT_PREFIX + "Enter key reset listener attached to the textarea.");
            } else if (!textarea) {
                allElementsFound = false;
            }

            if (allElementsFound) {
                obs.disconnect(); // Все элементы найдены, прекращаем наблюдение
                console.log(SCRIPT_PREFIX + "All required UI elements found and listeners attached.");
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        scriptInitialized = true;
        console.log(SCRIPT_PREFIX + "Script loaded and fully initialized.");
    }

    function clickSendButton() {
        setTimeout(() => {
            const sendButton = document.getElementById(BUTTON_ID);
            if (sendButton) {
                if (sendButton.offsetParent !== null && !sendButton.disabled) {
                    autoClickCount++;
                    updateCounterDisplay();
                    sendButton.click();
                    console.log(SCRIPT_PREFIX + `Send button clicked automatically. New count: ${autoClickCount}`);
                } else {
                    console.warn(SCRIPT_PREFIX + `Send button found but is not clickable (Visible: ${sendButton.offsetParent !== null}, Disabled: ${sendButton.disabled}).`);
                }
            } else {
                console.warn(SCRIPT_PREFIX + `Send button with ID "${BUTTON_ID}" NOT FOUND.`);
            }
        }, 100);
    }

    // --- ЗАПУСК СКРИПТА ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
    window.addEventListener('load', () => {
        if (!scriptInitialized) {
            initializeScript();
        }
    });

})();