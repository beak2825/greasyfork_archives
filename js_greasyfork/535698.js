// ==UserScript==
// @name         Уведомление о нападении
// @namespace    http://tampermonkey.net/
// @version      5.2 господи помоги чтобы скрипт работал без ошибок
// @description  Ручное определение персонажа и автоматическое обнаружение нападения на него
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        https://patron.kinwoods.com/game
// @grant        none
// @run-at       document-idle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/535698/%D0%A3%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%BD%D0%B0%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/535698/%D0%A3%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%BD%D0%B0%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const config = {
        soundVolume: 0.7,
        beepFrequency: 800,
        beepDuration: 0.3,
        beepRepeats: 3,
        beepDelay: 300,
        checkInterval: 1000,
        notificationDuration: 3000,
        maxDetectionAttempts: 10
    };

    // Состояние системы
    let myCharacterId = localStorage.getItem('kinwoods_charId');
    let audioContext = null;
    let isBeingAttacked = false;
    let attackCheckInterval = null;
    let detectionAttempts = 0;

    // Инициализация аудио
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Воспроизведение звука атаки
    function playAttackSound() {
        initAudioContext();

        let repeats = 0;
        const playBeep = () => {
            if (repeats >= config.beepRepeats) return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = config.beepFrequency;
            gain.gain.value = config.soundVolume;

            osc.connect(gain);
            gain.connect(audioContext.destination);

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + config.beepDuration
            );

            osc.start();
            osc.stop(audioContext.currentTime + config.beepDuration);

            repeats++;
            setTimeout(playBeep, config.beepDelay);
        };

        playBeep();
    }

    // Определение персонажа по клику
    function setupCharacterDetection() {
        addClickableHighlightStyle();
        showNotification('Кликните по СВОЕМУ персонажу на карте', 'info');

        const clickHandler = (event) => {
            detectionAttempts++;

            // Поиск через tooltip-anchor
            const tooltipAnchor = event.target.closest('.tooltip-anchor');
            if (tooltipAnchor) {
                const charId = extractCharIdFromTooltip(tooltipAnchor);
                if (charId) {
                    completeCharacterDetection(charId, clickHandler);
                    return;
                }
            }

            // Поиск через изображение персонажа
            const charImg = event.target.closest('.cell-cat, [src*="/characters/"]');
            if (charImg) {
                const parentTooltip = charImg.closest('.tooltip-anchor');
                if (parentTooltip) {
                    const charId = extractCharIdFromTooltip(parentTooltip);
                    if (charId) {
                        completeCharacterDetection(charId, clickHandler);
                        return;
                    }
                }
            }

            if (detectionAttempts >= config.maxDetectionAttempts) {
                showNotification('Не удалось определить персонажа. Попробуйте снова.', 'error');
                document.removeEventListener('click', clickHandler);
                removeClickableHighlightStyle();
            }
        };

        document.addEventListener('click', clickHandler);
    }

    // Извлечение ID персонажа из тултипа
    function extractCharIdFromTooltip(tooltipElement) {
        try {
            const profileLink = tooltipElement.querySelector('.cell-tooltip a[href*="charId="]');
            if (!profileLink) return null;

            const charIdMatch = profileLink.href.match(/charId=(\d+)/);
            return charIdMatch ? charIdMatch[1] : null;
        } catch (e) {
            console.error('Ошибка извлечения ID:', e);
            return null;
        }
    }

    // Завершение определения персонажа
    function completeCharacterDetection(charId, clickHandler) {
        myCharacterId = charId;
        localStorage.setItem('kinwoods_charId', charId);

        showNotification(`Персонаж сохранен! ID: ${charId}`, 'success');
        document.removeEventListener('click', clickHandler);
        removeClickableHighlightStyle();

        startAttackMonitoring();
    }

    // Мониторинг атак
    function startAttackMonitoring() {
        if (attackCheckInterval) clearInterval(attackCheckInterval);

        attackCheckInterval = setInterval(() => {
            if (!myCharacterId) return;

            try {
                const battleActive = document.querySelector('.fight-indicator-wrapper') !== null;
                const fightingCats = document.querySelectorAll('.cat-fighting');

                if (!battleActive || fightingCats.length === 0) {
                    if (isBeingAttacked) {
                        isBeingAttacked = false;
                    }
                    return;
                }

                // Проверяем, атакуют ли нашего персонажа
                const isDefender = Array.from(fightingCats).some(cat => {
                    const tooltip = cat.closest('.tooltip-anchor');
                    if (!tooltip) return false;

                    const profileLink = tooltip.querySelector('.cell-tooltip a[href*="charId="]');
                    return profileLink && profileLink.href.includes(`charId=${myCharacterId}`);
                });

                // Проверяем, что это не мы атакуем
                const notAttacking = !document.querySelector('.basic-attack-target, .attack-indicator');

                if (isDefender && notAttacking && !isBeingAttacked) {
                    isBeingAttacked = true;
                    playAttackSound();
                    showNotification('Вас атакуют!', 'warning');
                } else if (!isDefender) {
                    isBeingAttacked = false;
                }
            } catch (e) {
                console.error('Ошибка проверки боя:', e);
            }
        }, config.checkInterval);
    }

    // Визуальная подсветка
    function addClickableHighlightStyle() {
        const style = document.createElement('style');
        style.id = 'kinwoods-highlight-style';
        style.textContent = `
            .tooltip-anchor:hover, .cell-cat:hover {
                outline: 2px dashed #4CAF50 !important;
                outline-offset: 2px !important;
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(style);
    }

    function removeClickableHighlightStyle() {
        const style = document.getElementById('kinwoods-highlight-style');
        if (style) style.remove();
    }

    // Показ уведомлений
    function showNotification(message, type) {
        const existing = document.getElementById('kinwoods-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'kinwoods-notification';
        notification.textContent = message;
        notification.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial;
            font-size: 14px;
            background: ${type === 'success' ? '#4CAF50' :
                         type === 'warning' ? '#FF9800' : '#F44336'};
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, config.notificationDuration - 300);
    }

    // Добавление кнопки активации
    function addControlButton() {
        if (document.getElementById('kinwoods-control-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'kinwoods-control-btn';
        btn.innerHTML = '🛡️ Kinwoods Protect';
        btn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            font-family: Arial;
            font-size: 14px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        btn.addEventListener('click', () => {
            if (!myCharacterId) {
                setupCharacterDetection();
            } else {
                if (confirm(`Текущий ID: ${myCharacterId}\n\nВыберите действие:`, 'Обновить персонажа', 'Отмена')) {
                    myCharacterId = null;
                    localStorage.removeItem('kinwoods_charId');
                    setupCharacterDetection();
                }
            }
        });

        document.body.appendChild(btn);

        // Добавляем стили анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -10px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, 0); }
                to { opacity: 0; transform: translate(-50%, -10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Инициализация
    function init() {
        addControlButton();

        if (myCharacterId) {
            showNotification(`Защита активна (ID: ${myCharacterId})`, 'success');
            startAttackMonitoring();
        }
    }

    // Запуск после полной загрузки
    if (document.readyState === 'complete') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1500));
    }
})();