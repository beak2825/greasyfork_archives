// ==UserScript==
// @name         AS Club Boost Hotkey
// @namespace    https://animestars.org/
// @version      1.4
// @description  Добавляет горячую клавишу (E) и авто-пропуск карты, если у нее менее 5 владельцев.
// @author       Jerichorpg // Можете заменить на свой ник
// @match        *://animestars.org/clubs/boost/*
// @match        *://asstars.tv/clubs/boost/*
// @match        *://astars.club/clubs/boost/*
// @match        *://as1.astars.club/clubs/boost/*
// @match        *://as1.asstars.tv/clubs/boost/*
// @match        *://as2.asstars.tv/clubs/boost/*
// @match        *://asstars.club/clubs/boost/*
// @match        *://asstars.online/clubs/boost/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @icon         https://i.postimg.cc/Z5NcKpdW/22.png
// @downloadURL https://update.greasyfork.org/scripts/544759/AS%20Club%20Boost%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/544759/AS%20Club%20Boost%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initSkipCardHotkeyFeature() {
        let hotkeyCode = GM_getValue('skipCardHotkeyCode', 'KeyE');
        let skipButton = null;
        const ownerThreshold = 5; // Порог владельцев для авто-скипа. Если их 4, 3, 2, 1 или 0 -> скип.
        const autoSkipDelay = 20; // Задержка перед авто-кликом в миллисекундах. Уменьшено для скорости.

        function getTheme() {
            return document.body.classList.contains('dle_theme_dark') ? 'dark' : 'light';
        }

        function createModal() {
            if (document.getElementById('skip-card-hotkey-modal')) return;

            const theme = getTheme();
            const modal = document.createElement('div');
            modal.id = 'skip-card-hotkey-modal';
            modal.style = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'}; color: ${theme === 'dark' ? '#f0f0f0' : '#000000'};
                padding: 20px; border: 2px solid ${theme === 'dark' ? '#444' : '#ccc'};
                box-shadow: 0 0 15px rgba(0,0,0,0.5); z-index: 10001; font-family: sans-serif;
                text-align: center; border-radius: 8px; min-width: 300px;
            `;

            modal.innerHTML = `
                <p style="margin-bottom: 10px;"><strong>Нажмите клавишу для скипа карты</strong></p>
                <p>Текущая: <code style="font-size: 14px;">${hotkeyCode}</code></p>
                <p id="skip-card-feedback" style="height: 1.5em; margin-top: 10px;"></p>
                <div style="margin-top: 15px;">
                    <button id="skip-card-close-btn" style="padding: 6px 12px; border: none; border-radius: 4px;
                        background: ${theme === 'dark' ? '#333' : '#eee'}; color: inherit; cursor: pointer;">Отмена</button>
                </div>
            `;

            document.body.appendChild(modal);

            const feedback = modal.querySelector('#skip-card-feedback');

            const close = () => {
                document.removeEventListener('keydown', keyHandler, true);
                modal.remove();
            };

            const keyHandler = async (e) => {
                e.preventDefault(); e.stopPropagation();
                const newCode = e.code;
                await GM_setValue('skipCardHotkeyCode', newCode);
                hotkeyCode = newCode;
                feedback.textContent = `Назначено: ${newCode}`;
                setTimeout(close, 800);
            };

            document.addEventListener('keydown', keyHandler, true);
            modal.querySelector('#skip-card-close-btn').onclick = close;
        }

        const observer = new MutationObserver(() => {
            const btn = document.querySelector('.club-boost__replace-btn');
            if (btn) {
                skipButton = btn;
            } else {
                skipButton = null;
            }

            // === ИЗМЕНЕННАЯ ЛОГИКА АВТО-СКИПА ===
            const ownersContainer = document.querySelector('.club-boost__owners');

            if (ownersContainer) {
                let ownerCount = Infinity; // По умолчанию ставим большое число, чтобы случайно не скипнуть

                // Сначала ищем список владельцев (стандартный случай)
                const ownersList = ownersContainer.querySelector('.club-boost__owners-list');
                if (ownersList) {
                    ownerCount = ownersList.querySelectorAll('.club-boost__user').length;
                } else {
                    // Если списка нет, ищем текстовое сообщение об их отсутствии
                    const noOwnersText = ownersContainer.querySelector('.club-boost__text');
                    if (noOwnersText && noOwnersText.textContent.includes('Карты ни у кого из клуба нет')) {
                        ownerCount = 0; // В этом случае владельцев 0
                    }
                }

                // Теперь общая логика скипа, которая сработает для обоих случаев
                if (ownerCount < ownerThreshold && skipButton && skipButton.offsetParent !== null) {
                    console.log(`[AS Club Boost] Авто-скип: ${ownerCount} владельцев (< ${ownerThreshold}). Нажимаю кнопку через ${autoSkipDelay} мс.`);
                    setTimeout(() => {
                         if (skipButton && skipButton.offsetParent !== null) {
                           skipButton.click();
                        }
                    }, autoSkipDelay);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        GM_registerMenuCommand("Настроить клавишу скипа карты", createModal);

        document.addEventListener('keydown', function (event) {
            if (event.code === hotkeyCode) {
                if (['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) {
                    return;
                }

                if (skipButton && skipButton.offsetParent !== null) {
                    console.log(`[AS Club Boost Hotkey] Нажата клавиша: ${hotkeyCode}. Скипаем карту.`);
                    skipButton.click();
                } else {
                    console.warn('[AS Club Boost Hotkey] Кнопка скипа карты не найдена или невидима.');
                }
            }
        });
    }

    initSkipCardHotkeyFeature();

})();