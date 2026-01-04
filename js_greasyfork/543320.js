// ==UserScript==
// @name         Elden Ring Gmail YOU DIED FX
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  "YOU DIED" Elden Ring при отправке письма Gmail
// @match        https://mail.google.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/543320/Elden%20Ring%20Gmail%20YOU%20DIED%20FX.user.js
// @updateURL https://update.greasyfork.org/scripts/543320/Elden%20Ring%20Gmail%20YOU%20DIED%20FX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Elden Ring Gmail] Скрипт запущен');

    let effectTriggered = false;
    let isEffectPlaying = false; // флаг для предотвращения дублирования
    let lastTriggerTime = 0; // время последнего срабатывания

    const audio = new Audio('https://www.myinstants.com/media/sounds/elden-ring-death.mp3');
    audio.preload = 'auto'; // предзагрузка аудио

    function showOverlay() {
        // Дополнительная проверка
        if (document.getElementById('elden-ring-overlay') || isEffectPlaying) {
            console.log('[Elden Ring Gmail] Эффект уже активен, пропускаем');
            return;
        }

        isEffectPlaying = true;

        // размытия фона
        document.body.classList.add('elden-ring-blur');

        const overlay = document.createElement('div');
        overlay.id = 'elden-ring-overlay';

        const bar = document.createElement('div');
        bar.id = 'elden-ring-bar';

        const message = document.createElement('div');
        message.id = 'elden-ring-message';
        message.textContent = 'YOU DIED';

        overlay.appendChild(bar);
        overlay.appendChild(message);
        document.body.appendChild(overlay);

        // очистка после анимации
        setTimeout(() => {
            const overlayElement = document.getElementById('elden-ring-overlay');
            if (overlayElement) {
                overlayElement.remove();
            }
            document.body.classList.remove('elden-ring-blur');
            isEffectPlaying = false;
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap');

        #elden-ring-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeOut 3s forwards;
            overflow: visible;
            pointer-events: none; /* Не блокируем клики */
        }

        #elden-ring-bar {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 80px;
            background-color: rgba(0, 0, 0, 0.2);
            transform: translateY(-50%);
            z-index: 1;
            pointer-events: none;
        }

        #elden-ring-message {
            position: relative;
            z-index: 2;
            color: #8B0000;
            font-size: min(72px, 12vw); /* Адаптивный размер */
            font-family: 'Libre Baskerville', serif;
            font-weight: 700;
            letter-spacing: 2px;
            text-shadow: 0 0 10px #500000, 0 0 20px #300000;
            user-select: none;
            transform: translateY(-20%);
            animation: textGlow 3s ease-in-out;
        }

        .elden-ring-blur > *:not(#elden-ring-overlay) {
            filter: blur(5px);
            transition: filter 0.3s ease;
        }

        @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }

        @keyframes textGlow {
            0% { text-shadow: 0 0 10px #500000; }
            50% { text-shadow: 0 0 20px #8B0000, 0 0 30px #500000; }
            100% { text-shadow: 0 0 10px #500000; }
        }
    `;
    document.head.appendChild(style);

    function triggerEmailSent() {
        const currentTime = Date.now();

        // не срабатывал ли эффект недавно
        if (currentTime - lastTriggerTime < 3000) {
            console.log('[Elden Ring Gmail] Эффект недавно срабатывал, пропускаем');
            return;
        }

        lastTriggerTime = currentTime;

        console.log('[Elden Ring Gmail] YOU DIED ⚔️');

        // воспроизводим звук
        audio.currentTime = 0; // сбрасываем
        audio.play().catch(e => console.warn('[Elden Ring Gmail] Audio play error:', e));

        showOverlay();
    }

    function observeDOM() {
        console.log('[Elden Ring Gmail] 🔍 Начинаем наблюдение за DOM');

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                            const text = node.textContent || '';

                            // проверка текста уведомления
                            if (text.includes('Сообщение отправлено') ||
                                text.includes('Message sent') ||
                                text.includes('Sent')) {

                                console.log('[Elden Ring Gmail] ✅ Обнаружено уведомление:', text.trim());

                                // задержка для предотвращения дублирования
                                setTimeout(() => {
                                    triggerEmailSent();
                                }, 100);

                                return;
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Дожидаемся загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        // Небольшая задержка
        setTimeout(observeDOM, 1000);
    }

})();