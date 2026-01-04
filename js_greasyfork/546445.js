// ==UserScript==
// @name         CaveGame.io Kill Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматический счетчик убийств и отправка в чат
// @description  Automatic kill counter and live chat
// @author       matrosik
// @match        *://cavegame.io/*
// @grant        none   
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cavegame.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546445/CaveGameio%20Kill%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/546445/CaveGameio%20Kill%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalConsoleLog = console.log;
    const originalConsoleInfo = console.info;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    let isScriptLog = false;
    console.log = function() {
        if (!isScriptLog) {
            originalConsoleLog.apply(console, arguments);
        }
    };

    console.info = function() {
        if (!isScriptLog) {
            originalConsoleInfo.apply(console, arguments);
        }
    };

    console.warn = function() {
        if (!isScriptLog) {
            originalConsoleWarn.apply(console, arguments);
        }
    };

    console.error = function() {
        if (!isScriptLog) {
            originalConsoleError.apply(console, arguments);
        }
    };

    function executeMainScript() {
        isScriptLog = true;

        const CONFIG = {
            chatKey: 't',
            messagePrefix: '-ezka '
        };

        let isKillVisible = false;
        const killCounter = {};

        function handleKillAppearance() {
            const killElement = document.getElementById('elimination-text');
            const nameElement = document.getElementById('elimination-name-text');

            if (!killElement || !nameElement || killElement.offsetParent === null) {
                if (isKillVisible) {
                    isKillVisible = false;
                }
                return;
            }

            if (isKillVisible) return;

            isKillVisible = true;
            const nickname = nameElement.textContent.trim();

            if (!killCounter[nickname]) {
                killCounter[nickname] = 1;
            } else {
                killCounter[nickname]++;
            }

            const killCount = killCounter[nickname];
            const message = killCount > 1 ?
                `${CONFIG.messagePrefix}${nickname} x${killCount}` :
                `${CONFIG.messagePrefix}${nickname}`;

            const keyEvent = new KeyboardEvent('keydown', {
                key: CONFIG.chatKey,
                code: `Key${CONFIG.chatKey.toUpperCase()}`,
                keyCode: CONFIG.chatKey.toUpperCase().charCodeAt(0),
                which: CONFIG.chatKey.toUpperCase().charCodeAt(0),
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(keyEvent);

            setTimeout(() => {
                const activeElement = document.activeElement;
                const allInputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');

                let textInput = null;
                if (activeElement && (activeElement.tagName === 'INPUT' ||
                                     activeElement.tagName === 'TEXTAREA' ||
                                     activeElement.isContentEditable)) {
                    textInput = activeElement;
                } else if (allInputs.length > 0) {
                    textInput = allInputs[0];
                    textInput.focus();
                }

                if (textInput) {
                    if (textInput.tagName === 'INPUT' || textInput.tagName === 'TEXTAREA') {
                        textInput.value = message;
                        const inputEvent = new Event('input', { bubbles: true });
                        textInput.dispatchEvent(inputEvent);
                    } else if (textInput.isContentEditable) {
                        textInput.textContent = message;
                    }

                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    textInput.dispatchEvent(enterEvent);
                }
            }, 0);
        }

        const observer = new MutationObserver((mutations) => {
            handleKillAppearance();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id', 'hidden']
        });

        window.resetKillCounter = function() {
            for (const key in killCounter) {
                delete killCounter[key];
            }
        };

        isScriptLog = false;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeMainScript);
    } else {
        executeMainScript();
    }

})();