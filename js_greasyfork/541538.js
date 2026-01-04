// ==UserScript==
// @name         Animestars Trade Helper TEST
// @namespace    http://tampermonkey.net/
// @version      7.7
// @description  Упрощенные обмены, авто-обмены, авто-переплавка, автокликер, улучшение карт, предпросмотр обменов.
// @author       Nickmur
// @match        */user/cards*
// @match        */cards/users*
// @match        */cards/users/need*
// @match        */cards/users/trade*
// @match        */cards/*/trade/
// @match        */clubs/boost/*
// @match        */trades*
// @match        */user/*/cards_progress/
// @match        */update_stars/*
// @match        */cards/pack/
// @match        */cards_remelt/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.open
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541538/Animestars%20Trade%20Helper%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/541538/Animestars%20Trade%20Helper%20TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // MERGED GLOBAL CONFIGURATION, STATE, AND ICONS
    // =================================================================================

    const CURRENT_ORIGIN = window.location.origin;
    const isIframe = (window.self !== window.top);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const ICONS = {
        // Trade Helper & General Icons
        TRADE_ON: 'https://i.postimg.cc/Y9CqzNHv/off-2.png',
        TRADE_OFF: 'https://i.postimg.cc/yxNB070c/off-1.png',
        ADD: 'https://i.postimg.cc/DyjCR9cP/image.png',
        ADD_ALL: 'https://i.postimg.cc/xdYrvNfB/all.png',
        ADD_DUPLICATES: 'https://i.postimg.cc/wBkC0x3M/duplicate.png',
        REMOVE: 'https://i.postimg.cc/8zgFk5wp/image.png',
        START_TRADE: 'https://i.postimg.cc/Prj49tZD/image.png',
        CANCEL_TRADE: 'https://i.postimg.cc/VLM87hDH/image.png',
        MODE_1: 'https://i.postimg.cc/C1ZS121h/1.png',
        MODE_2: 'https://i.postimg.cc/wvSHskyh/2.png',
        MODE_3: 'https://i.postimg.cc/L5LSkZLG/3.png',
        ONLY_ONLINE_ON: 'https://i.postimg.cc/sDNCFRGk/image.png',
        ONLY_ONLINE_OFF: 'https://i.postimg.cc/Z5WZ0qhY/image.png',
        // Club Trade Helper & Toggles Icons
        BOOST_ON: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 24" width="44" height="24"><rect x="1" y="1" width="42" height="22" rx="11" fill="%234CAF50" stroke="%23388E3C" stroke-width="1"/><circle cx="32" cy="12" r="9" fill="white"/></svg>`,
        BOOST_OFF: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 24" width="44" height="24"><rect x="1" y="1" width="42" height="22" rx="11" fill="%23ccc" stroke="%23a5a5a5" stroke-width="1"/><circle cx="12" cy="12" r="9" fill="white"/></svg>`,
        REFRESH: 'https://i.postimg.cc/L69LcpkG/image.png',
        TOGGLE_SLIDER: 'https://i.postimg.cc/pXKCGzFX/free-icon-settings-126472-1.png',
        HIDE_SETTINGS: 'https://i.postimg.cc/yNFzQQhd/image-1.png',
        // Remelt Helper Icons
        CANCEL: 'https://i.postimg.cc/VLM87hDH/image.png'
    };
    const SCRIPT_STATE = {
        // Trade Helper State
        helperEnabled: GM_getValue('helperEnabled', true),
        helperAutoSendMode: GM_getValue('helperAutoSendMode', 1),
        helperAutoSendEnabled: GM_getValue('helperAutoSendEnabled', true),
        logoEnabled: GM_getValue('logoEnabled', true),
        logoCache: JSON.parse(localStorage.getItem('clubLogosCache-v2') || '{}'),
        onlyOnlineEnabled: GM_getValue('onlyOnlineEnabled', false),
        // Club Trade Helper State
        boostMainEnabled: GM_getValue('boostMainEnabled', false),
        boostSkipEnabled: GM_getValue('boostSkipEnabled', false),
        boostSkipInterval: GM_getValue('boostSkipInterval', 1000),
        // Mass operation state flags
        isAddingInProgress: false,
        isRemovingInProgress: false,
        isAddingDuplicatesInProgress: false,
        // Trade Preview State
        isPreviewSliderVisible: GM_getValue('isPreviewSliderVisible', true),
        // Remelt Helper State
        isMeltingInProgress: false,
        lastNotifiedImageUrl: null,
        closeIfWantsEmpty: GM_getValue('closeIfWantsEmpty', false), // По умолчанию выключено
    };

    // =================================================================================
    // STYLES
    // =================================================================================
    GM_addStyle(`
        /* Общие стили вращения */
        @keyframes cardHelperSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* --- Стили из Trade Helper --- */
        /* Стили для нового модуля UpgradeHelper */
        .upgrade-star-btn { background-color: #4CAF50; border: none; color: white; padding: 10px; text-align: center; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px; width: 38px; height: 38px; vertical-align: middle; margin-left: 5px; position: relative; }
        .upgrade-star-btn:hover { background-color: #45a049; }
        #upgrade-task-iframe { position: absolute; top: -9999px; left: -9999px; width: 800px; height: 600px; }
        .card-helper-status-notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: #3e444c; color: #f0f0f0; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; z-index: 2147483647; display: flex; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); opacity: 0; transition: opacity 0.4s ease, bottom 0.4s ease; max-width: 380px; min-width: 280px; box-sizing: border-box; }
        .card-helper-status-notification.show { opacity: 1; bottom: 30px; }
        .ch-status-icon-container { margin-right: 10px; display: flex; align-items: center; height: 18px; }
        .card-helper-spinner { width: 16px; height: 16px; border: 2px solid #666; border-top: 2px solid #ddd; border-radius: 50%; animation: cardHelperSpin 0.8s linear infinite; }
        .card-helper-checkmark, .card-helper-crossmark { font-size: 18px; line-height: 1; }
        .card-helper-checkmark { color: #76c779; }
        .card-helper-crossmark { color: #e57373; }
        .card-helper-status-text { white-space: normal; text-align: left; line-height: 1.3; }
        .anime-cards__placeholder img { transition: transform 0.25s ease-in-out; cursor: zoom-in; will-change: transform; }
        .anime-cards__placeholder img.enlarged { transform: scale(1.6) translateY(-10px); cursor: zoom-out; transform-origin: top center; }
        .anime-cards__placeholder.is-zoomed { position: relative; z-index: 10000; }
        #club-rank-info, #user-contribution-info { padding: 5px; color: white; font-size: 16px; text-align: center; background-color: transparent; font-weight: bold; }
        #club-rank-info { margin-bottom: 5px; }
        #user-contribution-info { margin-bottom: 15px; }
        body.mass-adding-active .ui-dialog.modalfixed { top: -9999px !important; left: -9999px !important; opacity: 0; pointer-events: none; }

        /* --- Стили из Remelt Helper (Test.txt) --- */
        .ch-status-icon-char { font-size: 18px; line-height: 1; }
        .remelt-confirm-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2147483647; display: flex; align-items: center; justify-content: center; }
        .remelt-confirm-dialog { background: #3e444c; color: #f0f0f0; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); text-align: center; max-width: 400px; animation: fadeIn 0.3s ease-out; }
        .remelt-confirm-dialog p { margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; }
        .remelt-confirm-buttons { display: flex; justify-content: center; gap: 15px; }
        .remelt-confirm-buttons button { border: none; border-radius: 5px; padding: 10px 20px; font-size: 14px; cursor: pointer; font-weight: bold; transition: background-color 0.2s, transform 0.1s; }
        .remelt-confirm-btn-yes { background-color: #4CAF50; color: white; }
        .remelt-confirm-btn-yes:hover { background-color: #45a049; transform: scale(1.05); }
        .remelt-confirm-btn-no { background-color: #f44336; color: white; }
        .remelt-confirm-btn-no:hover { background-color: #d32f2f; transform: scale(1.05); }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .new-card-notification { position: fixed; top: 20px; right: 20px; z-index: 2147483647; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); opacity: 0; transform: translateX(100%); transition: opacity 0.5s ease-out, transform 0.5s ease-out; border: 2px solid #6c5ce7; }
        .new-card-notification.show { opacity: 1; transform: translateX(0); }
        .new-card-notification img { display: block; width: 120px; height: auto; }
        .remelt-confirm-dialog input[type="number"] {
            width: 90%;
            padding: 8px;
            margin-bottom: 20px;
            background-color: #555;
            color: white;
            border: 1px solid #777;
            border-radius: 4px;
            font-size: 16px;
            text-align: center;
            box-sizing: border-box;
        }
        .remelt-confirm-dialog input[type="number"]:focus {
            border-color: #e53935;
            outline: none;
        }

         /* --- Стили для Trade Preview --- */
        #size-control-container { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 10px; padding: 0; background-color: transparent; color: #ccc; font-size: 14px; }
        #trade-preview-popup { position: absolute; background-color: #282828; border: 1px solid #4a4a4a; z-index: 99999; display: flex; align-items: center; pointer-events: none; padding: var(--popup-padding, 10px); border-radius: var(--card-border-radius, 6px); gap: var(--popup-gap, 12px); visibility: hidden; }
        .trade-preview-section { display: flex; flex-wrap: nowrap; gap: var(--section-gap, 8px); flex-shrink: 0; }
        #trade-preview-popup img { height: var(--card-height, 110px); border-radius: var(--card-border-radius, 6px); background-color: #1a1a1a; }
        .trade-separator { color: #888; font-weight: bold; font-size: var(--separator-font-size, 24px); flex-shrink: 0; }
        #trade-preview-popup .loading-text { color: #ccc; font-size: 14px; visibility: visible; }
        #size-control-container input[type="range"] { -webkit-appearance: none; appearance: none; width: 120px; height: 5px; background: #444; border-radius: 5px; outline: none; }
        #size-control-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 15px; height: 15px; background: #e53935; cursor: pointer; border-radius: 50%; }
        #size-control-container input[type="range"]::-moz-range-thumb { width: 15px; height: 15px; background: #e53935; cursor: pointer; border-radius: 50%; }
    `);

    // =================================================================================
    // GENERAL UTILITY FUNCTIONS
    // =================================================================================

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, callback, timeout = 20000) {
        let timeElapsed = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else {
                timeElapsed += 250;
                if (timeElapsed > timeout) {
                    clearInterval(interval);
                    console.log(`[Super Helper] Элемент ${selector} не найден.`);
                }
            }
        }, 250);
    }

    // =================================================================================
    // UNIVERSAL UI CREATION FUNCTIONS
    // =================================================================================

    function createMainPanel() {
        if (document.getElementById('super-helper-panel')) return null;
        const panel = document.createElement('div');
        panel.id = 'super-helper-panel';
        panel.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;';
        document.body.appendChild(panel);
        return panel;
    }

    function applyHoverEffect(btn) {
        btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        });
    }

    function addTooltipRight(btn, text) {
        if (isMobile) return;
        let tip = btn.querySelector('.tooltip-super-helper');
        if (!tip) {
            tip = document.createElement('span');
            tip.className = 'tooltip-super-helper';
            tip.style.cssText = `position: absolute; top: 50%; left: 115%; transform: translateY(-50%); background-color: rgba(0, 0, 0, 0.8); color: #fff; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 10000;`;
            btn.style.position = 'relative';
            btn.appendChild(tip);
            btn.addEventListener('mouseenter', () => {
                tip.style.visibility = 'visible';
                tip.style.opacity = '1';
            });
            btn.addEventListener('mouseleave', () => {
                tip.style.opacity = '0';
                tip.style.visibility = 'hidden';
            });
        }
        tip.textContent = text;
    }

    function addTooltipTop(btn, text) {
        if (isMobile) return;
        let tip = btn.querySelector('.tooltip-super-helper');
        let modalBody;
        let originalOverflow;

        if (!tip) {
            tip = document.createElement('span');
            tip.className = 'tooltip-super-helper';
            tip.style.cssText = `position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.8); color: #fff; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 10001;`;
            btn.style.position = 'relative';
            btn.appendChild(tip);
            btn.addEventListener('mouseenter', () => {
                tip.style.visibility = 'visible';
                tip.style.opacity = '1';
                modalBody = btn.closest('.modal__body');
                if (modalBody) {
                    originalOverflow = modalBody.style.overflow;
                    modalBody.style.overflow = 'visible';
                }
            });
            btn.addEventListener('mouseleave', () => {
                tip.style.opacity = '0';
                tip.style.visibility = 'hidden';
                if (modalBody) {
                    modalBody.style.overflow = originalOverflow;
                }
            });
        }
        tip.textContent = text;
    }

    function createStyledButton(id, tooltip, iconUrl, onClick) {
        const panel = document.getElementById('super-helper-panel');
        if (!panel || document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.style.cssText = `background-color: rgb(108, 92, 231); transition: transform 0.2s, box-shadow 0.2s; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px; position: relative; transform: scale(1); animation: 2.5s ease-in-out 0s infinite normal none running breatheShadowInteractive; border-radius: 50%; width: 40px; height: 40px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px;`;
        const img = document.createElement('img');
        img.src = iconUrl;
        img.style.cssText = 'width: 28px; height: 28px; object-fit: contain; pointer-events: none;';
        btn.appendChild(img);
        applyHoverEffect(btn);
        addTooltipRight(btn, tooltip);
        btn.onclick = onClick;
        panel.appendChild(btn);
        return btn;
    }

    function createToggleButton({
        id,
        tooltipOn,
        tooltipOff,
        stateKey,
        onToggle,
        iconOn,
        iconOff
    }) {
        const panel = document.getElementById('super-helper-panel');
        if (!panel || document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.style.cssText = `width: 44px; height: 24px; border: none; cursor: pointer; background-color: transparent; padding: 0;`;
        const img = document.createElement('img');
        img.style.cssText = 'width: 100%; height: 100%; pointer-events: none;';
        const updateButton = (isEnabled) => {
            img.src = isEnabled ?
                iconOn : iconOff;
            addTooltipRight(btn, isEnabled ? tooltipOn : tooltipOff);
        };
        btn.addEventListener('click', () => {
            const newState = !SCRIPT_STATE[stateKey];
            SCRIPT_STATE[stateKey] = newState;
            GM_setValue(stateKey, newState);
            updateButton(newState);
            if (onToggle) onToggle(newState);
        });
        btn.appendChild(img);
        applyHoverEffect(btn);
        panel.appendChild(btn);
        updateButton(SCRIPT_STATE[stateKey]);
        if (SCRIPT_STATE[stateKey] && onToggle) {
            onToggle(SCRIPT_STATE[stateKey]);
        }
        return btn;
    }


    // =================================================================================
    // MODULE: PACK ANIMATION SKIPPER
    // =================================================================================
    const PackAnimationSkipper = {
        initialize: function() {
            if (window.location.pathname.includes('/cards/pack/')) {
                const skipperInterval = setInterval(() => {
                    if (typeof unsafeWindow.doAnimLoot === 'function' && unsafeWindow.doAnimLoot.toString().length > 15) {
                        unsafeWindow.doAnimLoot = () => {};
                        console.log('[Trade Helper] Анимация паков успешно отключена через unsafeWindow.');
                        clearInterval(skipperInterval);
                    }
                }, 100);
            }
        }
    };
    // =================================================================================
    // MODULE: REMELT HELPER
    // =================================================================================
    const RemeltNotificationHelper = {
        currentNotification: null,
        showTemporaryMessage: function(id, message, isSuccess = true, duration = 3500) {
            if (this.currentNotification) this.currentNotification.remove();
            const notificationElement = document.createElement('div');
            notificationElement.className = 'card-helper-status-notification';
            const iconChar = isSuccess ? '✔' : '✖';
            const iconColor = isSuccess ?
                '#76c779' : '#e57373';
            notificationElement.innerHTML = `<div class="ch-status-icon-container"><span class="ch-status-icon-char" style="color: ${iconColor};">${iconChar}</span></div><span>${message}</span>`;
            document.body.appendChild(notificationElement);
            this.currentNotification = notificationElement;
            requestAnimationFrame(() => notificationElement.classList.add('show'));
            setTimeout(() => {
                notificationElement.classList.remove('show');
                setTimeout(() => {
                    if (notificationElement) notificationElement.remove();
                }, 400);
            }, duration);
        },
        showConfirmation: function(message) {
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.className = 'remelt-confirm-overlay';
                overlay.innerHTML = `
                    <div class="remelt-confirm-dialog">
                        <p>${message}</p>
                        <div class="remelt-confirm-buttons">
                            <button class="remelt-confirm-btn-yes">Подтвердить</button>
                            <button class="remelt-confirm-btn-no">Отмена</button>
                        </div>
                    </div>`;
                const cleanup = () => document.body.removeChild(overlay);
                overlay.querySelector('.remelt-confirm-btn-yes').onclick = () => {
                    cleanup();
                    resolve(true);
                };
                overlay.querySelector('.remelt-confirm-btn-no').onclick = () => {
                    cleanup();
                    resolve(false);
                };
                document.body.appendChild(overlay);
            });
        },
        showNewCard: function(imageUrl, duration = 2000) {
            const notification = document.createElement('div');
            notification.className = 'new-card-notification';
            const img = document.createElement('img');
            img.src = imageUrl;
            notification.appendChild(img);
            document.body.appendChild(notification);
            requestAnimationFrame(() => notification.classList.add('show'));
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }, duration);
        },

        showInputModal: function(message, defaultValue = '') {
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.className = 'remelt-confirm-overlay';
                overlay.innerHTML = `
                    <div class="remelt-confirm-dialog">
                        <p>${message}</p>
                        <input type="number" id="ch-input-modal-field" value="${defaultValue}" />
                        <div class="remelt-confirm-buttons">
                            <button class="remelt-confirm-btn-yes">Сохранить</button>
                            <button class="remelt-confirm-btn-no">Отмена</button>
                        </div>
                    </div>`;

                const inputField = overlay.querySelector('#ch-input-modal-field');
                const cleanup = () => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                };

                overlay.querySelector('.remelt-confirm-btn-yes').onclick = () => {
                    resolve(inputField.value);
                    cleanup();
                };
                overlay.querySelector('.remelt-confirm-btn-no').onclick = () => {
                    resolve(null);
                    cleanup();
                };

                // Позволяет нажать Enter для сохранения
                inputField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        resolve(inputField.value);
                        cleanup();
                    }
                });

                document.body.appendChild(overlay);
                inputField.focus();
                inputField.select();
            });
        }
    };

    const RemeltHelper = {
        meltAllBtn: null,
        meltDuplicatesBtn: null,
        cancelBtn: null,

        waitForMeltCompletion: async function(timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const slotImage = document.querySelector('.remelt__item--one img');
                    if (!slotImage) {
                        clearInterval(interval);
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new Error('Melt completion timeout'));
                    }
                }, 250);
            });
        },

        setUIMode: function(mode) {
            this.meltAllBtn.style.display = (mode === 'idle') ?
                'flex' : 'none';
            this.meltDuplicatesBtn.style.display = (mode === 'idle') ? 'flex' : 'none';
            this.cancelBtn.style.display = (mode === 'running') ?
                'flex' : 'none';
        },

        runMeltLoop: async function(mode) {
            SCRIPT_STATE.isMeltingInProgress = true;
            this.setUIMode('running');

            while (SCRIPT_STATE.isMeltingInProgress) {
                let batch = [];
                let hasEnoughCards = false;

                if (mode === 'all') {
                    const availableCards = Array.from(document.querySelectorAll('.remelt__inventory-item:not([style*="display: none"])'));
                    if (availableCards.length >= 3) {
                        hasEnoughCards = true;
                        batch = availableCards.slice(0, 3);
                    }
                } else if (mode === 'duplicates') {
                    const visibleCards = Array.from(document.querySelectorAll('.remelt__inventory-item:not([style*="display: none"])'));
                    const cardsByImage = new Map();
                    visibleCards.forEach(card => {
                        const imgSrc = card.querySelector('img')?.src;
                        if (!imgSrc) return;
                        if (!cardsByImage.has(imgSrc)) cardsByImage.set(imgSrc, []);
                        cardsByImage.get(imgSrc).push(card);
                    });
                    const duplicates = [];
                    for (const group of cardsByImage.values()) {
                        if (group.length > 1) {
                            duplicates.push(...group.slice(1));
                        }
                    }
                    if (duplicates.length >= 3) {
                        hasEnoughCards = true;
                        batch = duplicates.slice(0, 3);
                    }
                }

                if (!hasEnoughCards) {
                    const nextPageBtn = Array.from(document.querySelectorAll('button.btn')).find(btn => btn.textContent.trim() === 'Вперед');
                    const pagination = document.getElementById('info_filter_page')?.querySelector('span');
                    let hasMorePages = false;
                    if (pagination) {
                        const [current, total] = pagination.textContent.split('/').map(s => parseInt(s.trim()));
                        if (!isNaN(current) && !isNaN(total) && current < total) {
                            hasMorePages = true;
                        }
                    }

                    if (nextPageBtn && hasMorePages) {
                        RemeltNotificationHelper.showTemporaryMessage('pagination', 'Переход на следующую страницу...', true, 2500);
                        GM_setValue('remeltProcessActive', true);
                        GM_setValue('remeltMode', mode);
                        SCRIPT_STATE.isMeltingInProgress = false;
                        await wait(1000);
                        nextPageBtn.click();
                        return;
                    }
                    break;
                }

                for (const card of batch) {
                    card.click();
                    await wait(150);
                }

                let meltSucceeded = false;
                await new Promise(resolve => {
                    const remeltBtn = document.querySelector('.remelt__start-btn');
                    if (remeltBtn && remeltBtn.style.display !== 'none') {
                        remeltBtn.click();
                        this.waitForMeltCompletion().then(() => {
                            meltSucceeded = true;
                            resolve();
                        }).catch(error => {
                            console.error(error);
                            RemeltNotificationHelper.showTemporaryMessage('meltError', "Ошибка ожидания завершения плавки.", false, 4000);
                            SCRIPT_STATE.isMeltingInProgress = false;
                            resolve();
                        });
                    } else {
                        SCRIPT_STATE.isMeltingInProgress = false;
                        resolve();
                    }
                });
                if (!meltSucceeded) break;
                await wait(800);
            }

            if (SCRIPT_STATE.isMeltingInProgress) {
                RemeltNotificationHelper.showTemporaryMessage('meltComplete', 'Переплавка завершена!', true, 4000);
            }
            this.stopMeltingProcess();
        },

        startMeltAll: async function() {
            const confirmed = await RemeltNotificationHelper.showConfirmation(`Начать процесс переплавки ВСЕХ карт?`);
            if (confirmed) {
                this.runMeltLoop('all');
            }
        },

        startMeltDuplicates: async function() {
            const confirmed = await RemeltNotificationHelper.showConfirmation(`Начать процесс переплавки ДУБЛЕЙ?`);
            if (confirmed) {
                this.runMeltLoop('duplicates');
            }
        },

        stopMeltingProcess: function() {
            SCRIPT_STATE.isMeltingInProgress = false;
            GM_deleteValue('remeltProcessActive');
            GM_deleteValue('remeltMode');
            this.setUIMode('idle');
        },

        observePageChanges: function() {
            const targetNode = document.getElementById('info_filter_page');
            if (!targetNode) return;
            const config = {
                childList: true,
                subtree: true,
                characterData: true
            };
            const callback = (mutationsList, observer) => {
                if (SCRIPT_STATE.isMeltingInProgress) return;
                if (GM_getValue('remeltProcessActive', false)) {
                    RemeltNotificationHelper.showTemporaryMessage('continueMelt', 'Продолжаю автоматическую переплавку...', true, 2000);
                    const mode = GM_getValue('remeltMode', 'all');
                    setTimeout(() => {
                        this.runMeltLoop(mode);
                    }, 1200);
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        },

        observeCardModal: function() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    const modalNode = Array.from(mutation.addedNodes).find(node =>
                        node.nodeType === 1 &&
                        node.matches &&
                        node.matches('.ui-dialog') &&
                        node.querySelector('.anime-cards__placeholder img')
                    );
                    if (modalNode) {
                        const imgElement = modalNode.querySelector('.anime-cards__placeholder img');
                        const closeButton = modalNode.querySelector('.ui-dialog-titlebar-close');
                        if (imgElement && closeButton) {
                            setTimeout(() => {
                                const imageUrl = new URL(imgElement.src, window.location.origin).href;
                                if (SCRIPT_STATE.lastNotifiedImageUrl !== imageUrl) {
                                    SCRIPT_STATE.lastNotifiedImageUrl = imageUrl;
                                    RemeltNotificationHelper.showNewCard(imageUrl);
                                }
                                closeButton.click();
                            }, 50);
                        }
                    }
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        initialize: function() {
            this.meltAllBtn = createStyledButton('meltAllBtn', 'Переплавить ВСЕ карты', ICONS.ADD_ALL, () => this.startMeltAll());
            this.meltDuplicatesBtn = createStyledButton('meltDuplicatesBtn', 'Переплавить ДУБЛИ', ICONS.ADD_DUPLICATES, () => this.startMeltDuplicates());
            this.cancelBtn = createStyledButton('cancelMeltBtn', 'Остановить процесс', ICONS.CANCEL, () => this.stopMeltingProcess());
            this.setUIMode('idle');

            this.observePageChanges();
            this.observeCardModal();

            if (GM_getValue('remeltProcessActive', false)) {
                const mode = GM_getValue('remeltMode', 'all');
                RemeltNotificationHelper.showTemporaryMessage('continueMelt', 'Продолжаю автоматическую переплавку...', true, 2000);
                setTimeout(() => {
                    this.runMeltLoop(mode);
                }, 1000);
            }
        }
    };
    // =================================================================================
    // MODULE: Trade Helper
    // =================================================================================

    const TradeHelper = {
        focusHijack: {
            originalFocus: null,
            disable: function() {
                this.originalFocus = HTMLElement.prototype.focus;
                HTMLElement.prototype.focus = () => {};
            },
            enable: function() {
                if (this.originalFocus) {
                    HTMLElement.prototype.focus = this.originalFocus;
                }
            }
        },

        clearTradeState: function() {
            GM_deleteValue('stealth.tradeActive');
            GM_deleteValue('stealth.ownersQueue');
            GM_deleteValue('stealth.myTradeableCards');
            GM_deleteValue('stealth.targetCardId');
            GM_deleteValue('stealth.targetCardRank');
            GM_deleteValue('stealth.usedCardIds');
            GM_deleteValue('stealth.returnUrl');
            console.log('[Trade Helper] Состояние автообмена очищено.');
        },

        getCardIdFromImageUrl: function(url) {
            if (!url) return null;
            const match = url.match(/\/cards_image\/(\d+)\//);
            return match ? match[1] : null;
        },

        getCardIdFromHref: function(href) {
            if (!href) return null;
            const match = href.match(/id=(\d+)/);
            return match ? match[1] : null;
        },

        getSearchableName: function(originalName) {
            const specialCharMatch = originalName.match(/[^a-zA-Z0-9а-яА-ЯёЁ\s]/);
            return specialCharMatch ? originalName.substring(0, specialCharMatch.index) : originalName;
        },

        runWorker: async function() {
            if (!GM_getValue('stealth.tradeActive', false)) {
                return;
            }

            const path = window.location.pathname;
            if (path.includes('/user/cards/')) {
                const targetCardId = GM_getValue('stealth.targetCardId');
                if (!targetCardId) {
                    if (isMobile) window.close();
                    return;
                }

                let availableCard = null;
                const maxRetries = 10;
                const retryDelay = 400;
                for (let i = 0; i < maxRetries; i++) {
                    availableCard = document.querySelector(`.anime-cards__item[data-id="${targetCardId}"][data-can-trade="1"]`);
                    if (availableCard) {
                        console.log(`[Trade Helper] Карта ID ${targetCardId} найдена и доступна для обмена!`);
                        break;
                    }
                    if (i < maxRetries - 1) await wait(retryDelay);
                }

                if (availableCard) {
                    availableCard.click();
                    await wait(500);
                    const tradeButton = document.querySelector('.all-owners[href*="/trade/"]');
                    if (tradeButton) {
                        window.location.href = tradeButton.href;
                    } else {
                        console.error('[Trade Helper] Кнопка обмена не найдена в модальном окне.');
                        GM_setValue('stealth.status', 'FAILED_NO_TRADE_BUTTON');
                        if (isMobile) window.close();
                    }
                } else {
                    console.warn(`[Trade Helper] Нужная карта (ID: ${targetCardId}) не найдена или недоступна после ${maxRetries} попыток.`);
                    GM_setValue('stealth.status', 'FAILED_CARD_NOT_FOUND');
                    if (isMobile) window.close();
                }
                return;
            }

            if (path.includes('/cards/') && path.endsWith('/trade/')) {
                await wait(750);
                const limitMessage = document.querySelector('.message-info');
                if (limitMessage && limitMessage.textContent.includes('Достигнут лимит')) {
                    console.warn('[Trade Helper] Достигнут лимит обменов с этим пользователем. Пропускаю.');
                    GM_setValue('stealth.status', 'FAILED_TRADE_LIMIT');
                    if (isMobile) window.close();
                    return;
                }

                const myCards = JSON.parse(GM_getValue('stealth.myTradeableCards', '[]'));
                const targetRank = GM_getValue('stealth.targetCardRank');
                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                const usedCardIdsFromGM = JSON.parse(GM_getValue('stealth.usedCardIds', '[]'));
                const searchInput = document.getElementById('trade_search');
                const searchBtn = document.querySelector('.trade__search-btn');
                if (!searchInput || !searchBtn) {
                    GM_setValue('stealth.status', `FAILED_NO_SEARCH_INPUT`);
                    if (isMobile) window.close();
                    return;
                }

                let offeredData = [];
                // --- STAGE 1: "WANTS" LIST SEARCH ---
                console.log('[Trade Helper] Stage 1: "Wants" list search.');
                const inactiveWantBtn = document.querySelector('button.tabs__item.tabs__want__card:not(.tabs__item__want--active)');
                if (inactiveWantBtn) {
                    console.log('[Trade Helper] Activating "Wants" filter.');
                    inactiveWantBtn.click();
                    await wait(750);
                }

                let hasMoreWantsPages = true;
                while (hasMoreWantsPages && offeredData.length < offerCount) {
                    const offeredImages = offeredData.map(c => c.image);
                    const cardsToLookFor = myCards.filter(c =>
                        (c.rank || '').toLowerCase() == (targetRank || '').toLowerCase() &&
                        !usedCardIdsFromGM.includes(c.id) &&
                        !offeredImages.includes(c.image)
                    );
                    if (cardsToLookFor.length === 0) {
                        console.log('[Trade Helper] No more suitable cards from my list to look for in "Wants".');
                        break;
                    }

                    const inventoryItems = Array.from(document.querySelectorAll('.trade__inventory-item:not([style*="display: none"]):not(.trade__inventory-item_state_selected)'));
                    console.log(`[Trade Helper] Scanning page in "Wants" mode. Found ${inventoryItems.length} items.`);
                    for (const myCard of cardsToLookFor) {
                        if (offeredData.length >= offerCount) break;
                        const matchingItem = inventoryItems.find(item => {
                            const imgSrc = item.querySelector('img')?.src;
                            if (!imgSrc) return false;
                            return new URL(imgSrc).pathname === myCard.image;
                        });
                        if (matchingItem) {
                            const initialCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                            matchingItem.click();
                            await wait(350);
                            const newCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                            if (newCount > initialCount) {
                                console.log(`[Trade Helper] Found and added a match in "Wants" list: ${myCard.name}`);
                                offeredData.push(myCard);
                            } else {
                                console.warn(`[Trade Helper] FAILED to add card from "Wants" list: ${myCard.name}. It might be untradeable or a website glitch. Skipping it.`);
                            }
                        }
                    }

                    const paginationEl = document.querySelector('#info_trade_page span');
                    if (paginationEl) {
                        const [currentPage, totalPages] = paginationEl.textContent.split('/').map(s => parseInt(s.trim()));
                        if (currentPage >= totalPages) {
                            hasMoreWantsPages = false;
                            console.log('[Trade Helper] Last page of "Wants" list reached.');
                        } else {
                            const nextBtn = document.querySelector('#next_trade_page button');
                            if (nextBtn) {
                                console.log(`[Trade Helper] Clicking next page (${currentPage}/${totalPages}) in "Wants" list.`);
                                nextBtn.click();
                                await wait(750);
                            } else {
                                hasMoreWantsPages = false;
                                console.log('[Trade Helper] Next button not found, ending "Wants" search.');
                            }
                        }
                    } else {
                        hasMoreWantsPages = false;
                        console.log('[Trade Helper] Pagination info not found, ending "Wants" search.');
                    }
                }

                console.log(`[Trade Helper] Stage 1 finished. Found ${offeredData.length} of ${offerCount} cards.`);
                // --- STAGE 2: REGULAR SEARCH (if needed) ---
                if (offeredData.length < offerCount) {
                    console.log('[Trade Helper] Starting Stage 2: Regular search.');
                    const activeWantBtn = document.querySelector('button.tabs__item.tabs__want__card.tabs__item__want--active');
                    if (activeWantBtn) {
                        console.log('[Trade Helper] Deactivating "Wants" filter.');
                        activeWantBtn.click();
                        await wait(750);
                    }

                    const cardsStillNeeded = offerCount - offeredData.length;
                    const offeredImages = offeredData.map(c => c.image);
                    const suitableAndUnusedCards = myCards.filter(c =>
                        (c.rank || '').toLowerCase() == (targetRank || '').toLowerCase() &&
                        !usedCardIdsFromGM.includes(c.id) &&
                        !offeredImages.includes(c.image)
                    );
                    if (suitableAndUnusedCards.length < cardsStillNeeded) {
                        console.error(`[Trade Helper] Not enough cards for regular search. Have ${suitableAndUnusedCards.length}, need ${cardsStillNeeded}.`);
                        GM_setValue('stealth.status', 'FAILED_INSUFFICIENT_OFFER');
                    } else {
                        const groupedCards = suitableAndUnusedCards.reduce((acc, card) => {
                            if (!acc[card.image]) acc[card.image] = [];
                            acc[card.image].push(card);
                            return acc;
                        }, {});
                        for (const image in groupedCards) {
                            if (offeredData.length >= offerCount) break;
                            const cardGroup = groupedCards[image];
                            const myCard = cardGroup[0];
                            const searchName = this.getSearchableName(myCard.name);
                            console.log(`[Trade Helper] Searching for: ${searchName}`);
                            searchInput.value = searchName;
                            searchBtn.click();
                            await wait(600);

                            const availableItems = Array.from(document.querySelectorAll('.trade__inventory-item:not([style*="display: none"]):not(.trade__inventory-item_state_selected)'))
                                .filter(item => {
                                    const imgSrc = item.querySelector('img')?.src;
                                    if (!imgSrc) return false;
                                    return new URL(imgSrc).pathname === myCard.image;
                                });
                            console.log(`[Trade Helper] Found ${availableItems.length} matching items in search results.`);
                            for (let i = 0; i < cardGroup.length && i < availableItems.length; i++) {
                                if (offeredData.length >= offerCount) break;
                                const initialCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                                availableItems[i].click();
                                await wait(350);
                                const newCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                                if (newCount > initialCount) {
                                    console.log(`[Trade Helper] Successfully added card from search: ${cardGroup[i].name}`);
                                    offeredData.push(cardGroup[i]);
                                } else {
                                    console.warn(`[Trade Helper] FAILED to add card from search: ${cardGroup[i].name}. Skipping it.`);
                                }
                            }
                        }
                    }
                }


                // --- STAGE 3: FINALIZE TRADE ---
                if (offeredData.length < offerCount) {
                    console.error(`[Trade Helper] Не удалось найти достаточно карт для предложения (найдено ${offeredData.length} из ${offerCount}).`);
                    GM_setValue('stealth.status', 'FAILED_CANNOT_FIND_OFFER_CARD');
                } else {
                    console.log(`[Trade Helper] Проверка успешна. Отправляю обмен с ${offeredData.length} карт(ой).`);
                    const newUsedIds = offeredData.map(c => c.id);
                    GM_setValue('stealth.usedCardIds', JSON.stringify([...usedCardIdsFromGM, ...newUsedIds]));
                    document.querySelector('.trade__send-trade-btn')?.click();
                    await wait(1000);
                    GM_setValue('stealth.status', 'SUCCESS');
                }

                if (isMobile) await wait(500).then(() => window.close());
            }
        },

        StealthTradeController: {
            statusDiv: null,
            startBtn: null,
            cancelBtn: null,
            modeBtn: null,
            worker: null,

            highlightOwner(ownerId, color) {
                if (!ownerId) return;
                const targetOwnerElement = document.querySelector(`a.card-show__owner[data-owner-id="${ownerId}"]`);
                if (targetOwnerElement) {
                    let bgColor, borderColor;
                    switch (color) {
                        case 'SUCCESS':
                            bgColor = 'rgba(40, 167, 69, 0.4)';
                            borderColor = 'rgba(40, 167, 69, 0.7)';
                            break;
                        case 'SKIPPED':
                            bgColor = 'rgba(255, 193, 7, 0.4)';
                            borderColor = 'rgba(255, 193, 7, 0.7)';
                            break;
                        case 'FAILED':
                            bgColor = 'rgba(220, 53, 69, 0.4)';
                            borderColor = 'rgba(220, 53, 69, 0.7)';
                            break;
                        default:
                            return;
                    }
                    targetOwnerElement.style.backgroundColor = bgColor;
                    targetOwnerElement.style.borderRadius = '8px';
                    targetOwnerElement.style.border = `1px solid ${borderColor}`;
                }
            },

            findIframeContainer() {
                const potentialSelectors = ['.card-show', '.card-details', '.card_details', '.card-info', '.card-show-container', '.ncard__main', 'main'];
                for (const selector of potentialSelectors) {
                    const element = document.querySelector(selector);
                    if (element) return element;
                }
                return document.body;
            },

            findNextPageLink() {
                const paginationContainer = document.querySelector('.pagination__pages');
                if (!paginationContainer) return document.querySelector('.pagination__pages-btn a');
                const pageElements = Array.from(paginationContainer.children);
                const currentPageIndex = pageElements.findIndex(el => el.tagName === 'SPAN' && !el.classList.contains('nav_ext'));
                if (currentPageIndex > -1) {
                    const nextElement = pageElements[currentPageIndex + 1];
                    if (nextElement && nextElement.tagName === 'A') {
                        return nextElement;
                    }
                }
                return document.querySelector('.pagination__pages-btn a');
            },

            fetchAllTradeableCards(username) {
                return new Promise((resolve, reject) => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);

                    let allCards = [];
                    iframe.onload = () => {
                        try {
                            const
                                doc = iframe.contentDocument;
                            if (!doc) throw new Error("Нет доступа к iframe.");
                            doc.querySelectorAll('.anime-cards__item').forEach(card => {
                                allCards.push({
                                    id: card.dataset.id,
                                    rank: card.dataset.rank,
                                    name: card.dataset.name,
                                    image: card.dataset.image
                                });

                            });
                            const nextPageLink = doc.querySelector('.pagination__pages-btn a');
                            if (nextPageLink && nextPageLink.href) {
                                iframe.src = nextPageLink.href;
                            } else {
                                document.body.removeChild(iframe);
                                resolve(allCards);
                            }
                        } catch (error) {
                            document.body.removeChild(iframe);
                            reject(error);
                        }
                    };
                    iframe.onerror = () => reject(new Error("Ошибка iframe."));
                    iframe.src = `/user/cards/trade/?name=${username}`;
                });
            },

            fetchOfferedCardIds: () => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${CURRENT_ORIGIN}/trades/offers/`,
                        onload: async (response) => {
                            try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, "text/html");
                                const offerLinks = Array.from(doc.querySelectorAll('.trade__list-item')).map(a => a.href);



                                if (offerLinks.length === 0) {
                                    return resolve([]);
                                }


                                const cardIdPromises = offerLinks.map(link =>
                                    new Promise(res => {
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: link,
                                            onload: (offerResponse) => {
                                                const offerDoc = parser.parseFromString(offerResponse.responseText, "text/html");
                                                const cardElements = offerDoc.querySelectorAll('.trade__main-items .trade__main-item');
                                                const ids = Array.from(cardElements).map(card => TradeHelper.getCardIdFromHref(card.href)).filter(Boolean);
                                                res(ids);
                                            },
                                            onerror: () => res([])
                                        });
                                    })
                                );
                                const cardIdArrays = await Promise.all(cardIdPromises);
                                const allCardIds = cardIdArrays.flat();
                                resolve(allCardIds);
                            } catch (e) {
                                console.error("Ошибка при парсинге активных обменов:", e);
                                reject(e);
                            }
                        },
                        onerror: (error) => {
                            console.error("Не удалось загрузить страницу активных обменов:", error);
                            reject(error);
                        }
                    });
                });
            },

            async startTradeProcess() {
                this.startBtn.style.display = 'none';
                this.cancelBtn.style.display = 'flex';
                this.modeBtn.style.display = 'none';
                if (this.statusDiv) {
                    this.statusDiv.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.75); border-radius: 8px; color: white; font-size: 14px; white-space: nowrap;';
                }

                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                TradeHelper.clearTradeState();
                try {
                    TradeHelper.focusHijack.disable();
                    this.statusDiv.innerHTML = `Проверка активных обменов...`;
                    const offeredCardIds = await this.fetchOfferedCardIds();
                    if (offeredCardIds.length > 0) {
                        console.log(`[Trade Helper] Найдены карты в активных обменах: ${offeredCardIds.join(', ')}. Они будут исключены.`);
                    }
                    this.statusDiv.innerHTML = `Сбор ваших карт для обмена...`;
                    GM_setValue('stealth.tradeOfferCount', offerCount);
                    GM_setValue('stealth.returnUrl', window.location.href);
                    const urlParams = new URLSearchParams(window.location.search);
                    const targetCardId = urlParams.get('id');
                    if (!targetCardId) throw new Error('Не удалось определить ID целевой карты.');
                    const username = document.querySelector('.lgn__name span')?.textContent.trim();
                    if (!username) throw new Error('Не удалось найти ваш никнейм.');

                    let targetRank = GM_getValue('AS_cardRank', null);
                    if (!targetRank) {
                        const rankElement = document.querySelector('[class*="ncard__rank rank-"]');
                        if (rankElement) {
                            targetRank = rankElement.className.match(/rank-([sabcde])/)?.[1];
                        }
                    }
                    if (!targetRank) throw new Error('Не удалось определить ранг целевой карты. Сначала откройте основную страницу нужной карты.');
                    const onlyOnline = GM_getValue('onlyOnlineEnabled', false);
                    const ownersNodeList = onlyOnline ?
                        document.querySelectorAll('a.card-show__owner--online') :
                        document.querySelectorAll('a.card-show__owner');
                    let ownerIdCounter = 0;
                    const ownersQueue = Array.from(ownersNodeList)
                        .filter(el => !el.querySelector('.fa-exchange, .fa-lock, .fa-star, .fa-user, .fa-trophy-alt') && el.querySelector('.card-show__owner-name')?.textContent.trim() !== username)
                        .map(el => {
                            const ownerId = `owner-${Date.now()}-${ownerIdCounter++}`;
                            el.setAttribute('data-owner-id', ownerId);
                            return {
                                url: el.href,
                                id: ownerId,
                                name: el.querySelector('.card-show__owner-name')?.textContent.trim()
                            };
                        });
                    if (ownersQueue.length === 0) throw new Error('Подходящие владельцы не найдены.');
                    const allMyCards = await this.fetchAllTradeableCards(username);
                    const cardsNotInOffers = allMyCards.filter(card => !offeredCardIds.includes(card.id));
                    const myCards = cardsNotInOffers.filter(card => {
                        const searchableName = TradeHelper.getSearchableName(card.name);
                        if (searchableName.length < 3) {
                            console.log(`[Trade Helper] Исключена карта "${card.name}", т.к. поисковый запрос "${searchableName}" слишком короткий.`);
                            return false;
                        }
                        return true;

                    });
                    console.log(`[Trade Helper] Всего карт: ${allMyCards.length}. Доступно для обмена (за вычетом активных и коротких): ${myCards.length}.`);
                    if (myCards.filter(c => (c.rank || '').toLowerCase() == (targetRank || '').toLowerCase()).length < offerCount) {
                        throw new Error(`Недостаточно карт ранга ${targetRank.toUpperCase()} для обмена (с учетом уже отправленных).`);
                    }

                    GM_setValue('stealth.myTradeableCards', JSON.stringify(myCards));
                    GM_setValue('stealth.targetCardId', targetCardId);
                    GM_setValue('stealth.targetCardRank', targetRank);
                    GM_setValue('stealth.ownersQueue', JSON.stringify(ownersQueue));
                    GM_setValue('stealth.tradeActive', true);
                    GM_setValue('stealth.usedCardIds', '[]');
                    if (!isMobile) {
                        this.worker = document.getElementById('stealth_iframe');
                        if (!this.worker) {
                            this.worker = document.createElement('iframe');
                            this.worker.id = 'stealth_iframe';
                            this.worker.style.cssText = 'position: fixed; top: -5000px; left: -5000px; width: 0; height: 0; border: none;';
                            const iframeContainer = this.findIframeContainer();
                            iframeContainer.appendChild(this.worker);
                        }
                    }

                    this.processQueue();
                } catch (error) {
                    TradeHelper.focusHijack.enable();
                    if (this.statusDiv) this.statusDiv.innerHTML = `Ошибка: ${error.message}`;
                    console.error('[Trade Helper]', error);
                    this.startBtn.style.display = 'flex';
                    this.cancelBtn.style.display = 'none';
                    this.modeBtn.style.display = 'flex';
                }
            },

            async processQueue() {
                if (!GM_getValue('stealth.tradeActive', false)) {
                    TradeHelper.focusHijack.enable();
                    if (this.statusDiv) this.statusDiv.innerHTML = 'Процесс остановлен.';
                    if (this.startBtn) {
                        this.startBtn.style.display = 'flex';
                        this.cancelBtn.style.display = 'none';
                        this.modeBtn.style.display = 'flex';
                    }
                    if (this.worker && !isMobile) this.worker.remove();
                    if (this.worker && isMobile && !this.worker.closed) this.worker.close();
                    return;
                }

                const myCards = JSON.parse(GM_getValue('stealth.myTradeableCards', '[]'));
                const targetRank = GM_getValue('stealth.targetCardRank', '');
                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                const usedCardIds = JSON.parse(GM_getValue('stealth.usedCardIds', '[]'));
                const availableCardsCount = myCards.filter(c => (c.rank || '').toLowerCase() === targetRank.toLowerCase() && !usedCardIds.includes(c.id)).length;
                console.log(`[Trade Helper] Проверка карт. Доступно карт ранга ${targetRank.toUpperCase()}: ${availableCardsCount}. Требуется: ${offerCount}.`);
                if (availableCardsCount < offerCount) {
                    TradeHelper.focusHijack.enable();
                    if (this.statusDiv) this.statusDiv.innerHTML = `Остановлено: кончились карты ранга ${targetRank.toUpperCase()}`;
                    TradeHelper.clearTradeState();
                    if (this.worker && !isMobile) this.worker.remove();
                    if (this.startBtn) {
                        this.startBtn.style.display = 'flex';
                        this.cancelBtn.style.display = 'none';
                        this.modeBtn.style.display = 'flex';
                    }
                    return;
                }

                let owners = JSON.parse(GM_getValue('stealth.ownersQueue', '[]'));
                if (owners.length === 0) {
                    const username = document.querySelector('.lgn__name span')?.textContent.trim();
                    const onlyOnline = GM_getValue('onlyOnlineEnabled', false);
                    const ownersNodeList = onlyOnline ? document.querySelectorAll('a.card-show__owner--online') : document.querySelectorAll('a.card-show__owner');
                    let ownerIdCounter = 0;
                    const freshOwners = Array.from(ownersNodeList)
                        .filter(el => !el.style.backgroundColor && !el.querySelector('.fa-exchange, .fa-lock, .fa-star, .fa-user, .fa-trophy-alt') && el.querySelector('.card-show__owner-name')?.textContent.trim() !== username)
                        .map(el => {
                            const ownerId = `owner-${Date.now()}-${ownerIdCounter++}`;
                            el.setAttribute('data-owner-id', ownerId);
                            return {
                                url: el.href,
                                id: ownerId,
                                name: el.querySelector('.card-show__owner-name')?.textContent.trim()
                            };
                        });
                    if (freshOwners.length > 0) {
                        owners = freshOwners;
                        GM_setValue('stealth.ownersQueue', JSON.stringify(owners));
                    } else {
                        const nextPageLink = this.findNextPageLink();
                        if (nextPageLink && nextPageLink.href) {
                            if (this.statusDiv) this.statusDiv.innerHTML = 'Страница обработана.\nПерехожу к следующей...';
                            await wait(500);
                            window.location.href = nextPageLink.href;
                        } else {
                            TradeHelper.focusHijack.enable();
                            if (this.statusDiv) this.statusDiv.innerHTML = 'Все владельцы на всех страницах обработаны!';
                            TradeHelper.clearTradeState();
                            if (this.worker && !isMobile) this.worker.remove();
                            if (this.startBtn) {
                                this.startBtn.style.display = 'flex';
                                this.cancelBtn.style.display = 'none';
                                this.modeBtn.style.display = 'flex';
                            }
                        }
                        return;
                    }
                }

                const nextOwner = owners.shift();
                const ownerName = nextOwner.name;
                const ownerId = nextOwner.id;

                GM_setValue('stealth.ownersQueue', JSON.stringify(owners));
                if (this.statusDiv) this.statusDiv.innerHTML = `Работаю...<br>Цель: ${ownerName}. Осталось: ${owners.length}`;
                GM_setValue('stealth.status', 'STARTED');
                if (isMobile) {
                    this.worker = window.open(nextOwner.url, '_blank');
                } else {
                    this.worker.src = nextOwner.url;
                }

                let timeout = 60;
                while (timeout > 0) {
                    const status = GM_getValue('stealth.status', 'STARTED');
                    if (status !== 'STARTED') {
                        console.log(`[Trade Helper] Итерация для ${ownerName} (ID: ${ownerId}) завершена: ${status}`);
                        if (status === 'FAILED_CANNOT_FIND_OFFER_CARD') {
                            this.highlightOwner(ownerId, 'FAILED');
                            if (this.statusDiv) this.statusDiv.innerHTML = `<b>Остановлено:</b><br>Карты для обмена не найдены.`;
                            TradeHelper.clearTradeState();
                            if (this.worker && !isMobile) this.worker.remove();
                            if (this.startBtn) {
                                this.startBtn.style.display = 'flex';
                                this.cancelBtn.style.display = 'none';
                                this.modeBtn.style.display = 'flex';
                            }
                            TradeHelper.focusHijack.enable();
                            return;
                        }

                        if (status === 'SUCCESS') this.highlightOwner(ownerId, 'SUCCESS');
                        else if (status === 'FAILED_TRADE_LIMIT') this.highlightOwner(ownerId, 'SKIPPED');
                        else this.highlightOwner(ownerId, 'FAILED');

                        setTimeout(() => this.processQueue(), 150);
                        return;
                    }

                    if (this.statusDiv) this.statusDiv.innerHTML = `Отправка: ${ownerName}<br>Осталось карт: ${availableCardsCount}.`;
                    await wait(1000);
                    timeout--;
                }

                console.error(`[Trade Helper] Истекло время ожидания для ${ownerName}.`);
                this.highlightOwner(ownerId, 'FAILED');
                if (isMobile && this.worker && !this.worker.closed) this.worker.close();

                setTimeout(() => this.processQueue(), 150);
            }
        },

        initialize: function() {
            const path = window.location.pathname;
            const isTradeActive = GM_getValue('stealth.tradeActive', false);

            if (isTradeActive) {
                if (path.includes('/cards/users/')) {
                    TradeHelper.focusHijack.disable();
                    const panel = document.getElementById('super-helper-panel');
                    if (panel) panel.innerHTML = '';
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'stealth_status_div';
                    statusDiv.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.75); border-radius: 8px; color: white; font-size: 14px; white-space: nowrap;';
                    if (panel) panel.appendChild(statusDiv);
                    this.StealthTradeController.statusDiv = statusDiv;
                    createStyledButton('cancelStealthTradeBtn', 'Остановить автообмен', ICONS.CANCEL_TRADE, () => {
                        if (isMobile && this.StealthTradeController.worker && !this.StealthTradeController.worker.closed) {
                            this.StealthTradeController.worker.close();
                        }

                        const returnUrl = GM_getValue('stealth.returnUrl');
                        this.clearTradeState();
                        if (returnUrl) {
                            window.location.href = returnUrl;
                        } else {
                            window.location.reload();
                        }
                    });
                    if (!isMobile) {
                        this.StealthTradeController.worker = document.getElementById('stealth_iframe');
                        if (!this.StealthTradeController.worker) {
                            this.StealthTradeController.worker = document.createElement('iframe');
                            this.StealthTradeController.worker.id = 'stealth_iframe';
                            this.StealthTradeController.worker.style.cssText = 'position: fixed; top: -5000px; left: -5000px; width: 0; height: 0; border: none;';
                            const iframeContainer = this.StealthTradeController.findIframeContainer();
                            iframeContainer.appendChild(this.StealthTradeController.worker);
                        }
                    }

                    this.StealthTradeController.processQueue();
                } else {
                    const panel = document.getElementById('super-helper-panel');
                    if (panel) panel.innerHTML = '';

                    createStyledButton('cancelStealthTradeBtn', 'Остановить и закрыть', ICONS.CANCEL_TRADE, () => {
                        this.clearTradeState();
                        window.close();
                    });
                }
            } else {
                if (path.includes('/cards/users/')) {
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'stealth_status_div';
                    statusDiv.style.cssText = 'font-size: 14px; color: #fff;';
                    document.getElementById('super-helper-panel')?.appendChild(statusDiv);
                    this.StealthTradeController.statusDiv = statusDiv;
                    const startBtn = createStyledButton('startStealthTradeBtn', 'Начать автообмен', ICONS.START_TRADE, () => this.StealthTradeController.startTradeProcess());
                    const cancelBtn = createStyledButton('cancelStealthTradeBtn', 'Остановить автообмен', ICONS.CANCEL_TRADE, () => {
                        this.clearTradeState();
                        window.location.reload();
                    });
                    cancelBtn.style.display = 'none';

                    this.StealthTradeController.startBtn = startBtn;
                    this.StealthTradeController.cancelBtn = cancelBtn;

                    const modeBtn = createStyledButton('tradeModeBtn', `Режим обмена`, ICONS[`MODE_${GM_getValue('stealth.tradeOfferCount', 1)}`], () => {
                        let mode = GM_getValue('stealth.tradeOfferCount', 1);
                        mode = mode >= 3 ? 1 : mode + 1;
                        GM_setValue('stealth.tradeOfferCount', mode);
                        modeBtn.querySelector('img').src = ICONS[`MODE_${mode}`];
                        addTooltipRight(modeBtn, `Предлагать ${mode} карт(ы)`);
                    });
                    this.StealthTradeController.modeBtn = modeBtn;

                    const onlineBtn = createStyledButton('toggleOnlyOnlineBtn', SCRIPT_STATE.onlyOnlineEnabled ? 'Только онлайн ВКЛ' : 'Только онлайн ВЫКЛ', SCRIPT_STATE.onlyOnlineEnabled ? ICONS.ONLY_ONLINE_ON : ICONS.ONLY_ONLINE_OFF, (e) => {
                        const btn = e.currentTarget;
                        SCRIPT_STATE.onlyOnlineEnabled = !SCRIPT_STATE.onlyOnlineEnabled;
                        GM_setValue('onlyOnlineEnabled', SCRIPT_STATE.onlyOnlineEnabled);
                        const img = btn.querySelector('img');
                        img.src = SCRIPT_STATE.onlyOnlineEnabled ? ICONS.ONLY_ONLINE_ON : ICONS.ONLY_ONLINE_OFF;
                        addTooltipRight(btn, SCRIPT_STATE.onlyOnlineEnabled ? 'Только онлайн ВКЛ' : 'Только онлайн ВЫКЛ');
                    });

                    // [КНОПКА] Открыть все уникальные (логика из Source 1)
                    const openAllCardsBtn = createStyledButton('openAllCardsBtn', 'Открыть всех владельцев', ICONS.ADD_ALL, () => {
                        const myNameEl = document.querySelector('.lgn__name span');
                        const myName = myNameEl ? myNameEl.innerText.trim() : "";
                        const allLinks = document.querySelectorAll('a.card-show__owner');

                        if (allLinks.length === 0) { alert('Владельцы не найдены!'); return; }

                        const linksToOpen = [];
                        const seenUsers = new Set();

                        allLinks.forEach(link => {
                            // --- НОВОЕ: Проверка на иконку пользователя ---
                            if (link.querySelector('.card-show__owner-icon .fa-user')) return;
                            // ----------------------------------------------

                            const nameEl = link.querySelector('.card-show__owner-name');
                            const userName = nameEl ? nameEl.innerText.trim() : "";

                            if (myName && userName === myName) return;
                            if (seenUsers.has(userName)) return;

                            seenUsers.add(userName);
                            linksToOpen.push(link);
                        });

                        if (linksToOpen.length === 0) { alert('Нет карт для открытия.'); return; }
                        if (!confirm(`Найдено: ${allLinks.length}. Уникальных: ${linksToOpen.length}. Открыть?`)) return;

                        linksToOpen.forEach(link => { if (link.href) window.open(link.href, '_blank'); });
                    });

                    // [НАСТРОЙКА] Тумблер автозакрытия
                    const closeEmptyToggleBtn = createToggleButton({
                        id: 'toggleCloseEmptyBtn',
                        tooltipOn: 'Закрывать пустые "Хочет": ВКЛ',
                        tooltipOff: 'Закрывать пустые "Хочет": ВЫКЛ',
                        stateKey: 'closeIfWantsEmpty', // Связано с переменной из Шага 1
                        onToggle: (isEnabled) => { }, // Состояние сохраняется само
                        iconOn: ICONS.BOOST_ON, // Иконка крестика (ВКЛ)
                        iconOff: ICONS.BOOST_OFF    // Иконка выкл (ВЫКЛ)
                    });

                    const logoBtn = createToggleButton({
                        id: 'toggleLogoBtn',
                        tooltipOn: 'Лого клубов ВКЛ',
                        tooltipOff: 'Лого клубов ВЫКЛ',
                        stateKey: 'logoEnabled',
                        onToggle: (isEnabled) => {
                            localStorage.removeItem('clubLogosCache-v2');
                            SCRIPT_STATE.logoCache = {};
                            this.LogoModule.clearLogos();
                            if (isEnabled) this.LogoModule.processAllOwners();
                        },
                        iconOn: ICONS.BOOST_ON,
                        iconOff: ICONS.BOOST_OFF
                    });
                    const helperBtn = createToggleButton({
                        id: 'toggleHelperBtn',
                        tooltipOn: 'Авто-переход ВКЛ',
                        tooltipOff: 'Авто-переход ВЫКЛ',
                        stateKey: 'helperEnabled',
                        onToggle: null,
                        iconOn: ICONS.BOOST_ON,
                        iconOff: ICONS.BOOST_OFF
                    });

                    const setTradeSettingsUIMode = (show) => {
                        settingsBtn.style.display = show ? 'none' : 'flex';
                        hideSettingsBtn.style.display = show ? 'flex' : 'none';

                        // Существующие
                        modeBtn.style.display = show ? 'flex' : 'none';
                        onlineBtn.style.display = show ? 'flex' : 'none';
                        logoBtn.style.display = show ? 'flex' : 'none';
                        helperBtn.style.display = show ? 'flex' : 'none';

                        // [НОВЫЕ]
                        // openAllCardsBtn.style.display = show ? 'flex' : 'none';
                        closeEmptyToggleBtn.style.display = show ? 'flex' : 'none';
                    };

                    const settingsBtn = createStyledButton('toggleTradeSettingsBtn', 'Настройки обменов', ICONS.TOGGLE_SLIDER, () => setTradeSettingsUIMode(true));
                    const hideSettingsBtn = createStyledButton('hideTradeSettingsBtn', 'Скрыть настройки', ICONS.HIDE_SETTINGS, () => setTradeSettingsUIMode(false));

                    setTradeSettingsUIMode(false);

                    this.LogoModule.run();
                } else if (path.includes('/user/cards')) {
                    this.initializeHelperButtons();
                }
                this.HelperModule.run();
            }
        },

        LogoModule: {
            run() {
                if (SCRIPT_STATE.logoEnabled) this.processAllOwners();
                else this.clearLogos();
            },
            clearLogos() {
                document.querySelectorAll('.club-logo-trade-helper').forEach(el => el.remove());
            },
            processAllOwners() {
                this.clearLogos();
                document.querySelectorAll('.card-show__owner').forEach(owner => {
                    const nameEl = owner.querySelector('.card-show__owner-name');
                    if (!nameEl) return;
                    const username = nameEl.textContent.trim();
                    if (SCRIPT_STATE.logoCache[username]) {
                        this.injectLogo(owner, SCRIPT_STATE.logoCache[username]);
                    } else {
                        this.fetchUserClubData(username).then(data => {
                            if (data) {
                                SCRIPT_STATE.logoCache[username] = data;
                                localStorage.setItem('clubLogosCache-v2', JSON.stringify(SCRIPT_STATE.logoCache));
                                this.injectLogo(owner, data);
                            }
                        });
                    }
                });
            },
            injectLogo(ownerEl, clubData) {
                if (ownerEl.querySelector('.club-logo-trade-helper')) return;
                const logoContainer = document.createElement('div');
                logoContainer.className = 'club-logo-trade-helper';
                logoContainer.style.cssText = `position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; z-index: 10;`;
                const tooltipTarget = document.createElement('div');
                tooltipTarget.style.cssText = `width: 100%; height: 100%;`;
                const img = document.createElement('img');
                img.src = clubData.logo;
                img.style.cssText = `width: 100%; height: 100%; border-radius: 4px; background: #222; padding: 1px; box-shadow: 0 0 3px rgba(0,0,0,0.5);`;
                ownerEl.style.position = 'relative';
                tooltipTarget.appendChild(img);
                logoContainer.appendChild(tooltipTarget);
                ownerEl.appendChild(logoContainer);
                addTooltipRight(tooltipTarget, clubData.name);
            },
            fetchUserClubData(username) {
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `${CURRENT_ORIGIN}/user/${username}/`,
                        onload: (response) => {
                            const clubLinkMatch = response.responseText.match(/<a href="\/clubs\/(\d+)\/">[^<]+<\/a>/);
                            if (!clubLinkMatch) return resolve(null);
                            const clubId = clubLinkMatch[1];
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `${CURRENT_ORIGIN}/clubs/${clubId}/`,
                                onload: (clubResp) => {
                                    const clubHtml = clubResp.responseText;
                                    const logoMatch = clubHtml.match(/<img src="(\/uploads\/clubs\/icon_[^"]+)"/);
                                    const nameMatch = clubHtml.match(/<div class="nclub-enter__main-name[^>]*>\s*<div>([^<]+)<\/div>/);
                                    if (logoMatch && nameMatch) {
                                        resolve({
                                            logo: `${CURRENT_ORIGIN}${logoMatch[1]}`,
                                            name: nameMatch[1].trim()
                                        });
                                    } else {
                                        resolve(null);
                                    }
                                }
                            });
                        }
                    });
                });
            }
        },
        HelperModule: {
            run() {
                const path = window.location.pathname;
                if (path.includes('/cards/users/')) {
                    if (SCRIPT_STATE.helperEnabled) this.prepareOwnerLinks();
                } else if (path.includes('/user/cards/')) {
                    // Проверка на ЧС и недоступность обмена
                    // Проверка ошибок и состояния карт
                    setInterval(() => {
                        // 1. Проверка на черный список (оставляем как есть)
                        const infoContent = document.querySelector('.message-info__content');
                        if (infoContent && infoContent.innerText.includes('черном списке')) {
                             window.close();
                             return;
                        }

                        // 2. Умная проверка доступности карт (ИСПРАВЛЕНО)
                        const urlParams = new URLSearchParams(window.location.search);
                        const targetId = urlParams.get('trade_card_id');

                        if (targetId) {
                            // Ищем ВСЕ карточки на странице, которые соответствуют ID из ссылки
                            // Селектор ищет по части ссылки на картинку, так как data-id там может отличаться у дублей или совпадать
                            const allCopies = document.querySelectorAll(`.anime-cards__item[data-image*="/${targetId}/"]`);

                            // Проверяем только если карточки уже прогрузились
                            if (allCopies.length > 0) {
                                // Проверяем, есть ли ХОТЯ БЫ ОДНА "живая" карта
                                // Условия: data-can-trade="1" И нет иконки замка (fa-lock)
                                const hasAvailableCopy = Array.from(allCopies).some(card =>
                                    card.getAttribute('data-can-trade') === '1' &&
                                    !card.querySelector('.lock-trade-btn') // Проверка на визуальный замок
                                );

                                // Если ни одной доступной копии нет — закрываемся
                                if (!hasAvailableCopy) {
                                    console.log('Trade Helper: Все копии карты недоступны (в обмене или под замком). Закрываю...');
                                    window.close();
                                }
                            }
                        }
                    }, 500);

                    if (SCRIPT_STATE.helperEnabled) this.initiateTradeOnUserPage();
                } else if (path.includes('/cards/') && path.endsWith('/trade/')) {
                    this.initializeTradePageUI();
                    if (SCRIPT_STATE.helperAutoSendEnabled) this.setupAutoSendObserver();

                    // --- ИНТЕГРАЦИЯ ИЗ TRADE UPDATE ---

                    // 1. Постоянная проверка на ошибки (Черный список / Лимит)
                    // Работает всегда, независимо от настроек, так как обмен невозможен
                    const errorCheckInterval = setInterval(() => {
                        const infoContent = document.querySelector('.message-info__content');
                        const infoTitle = document.querySelector('.message-info__title');

                        // Проверка на лимит (Source 1)
                        if (infoTitle && infoTitle.innerText.includes('Достигнут лимит')) {
                            console.log('Trade Helper: Достигнут лимит. Закрываю...');
                            clearInterval(errorCheckInterval);
                            window.close();
                            return;
                        }

                        // Проверка на черный список (Source 1)
                        if (infoContent && infoContent.innerText.includes('черном списке')) {
                            console.log('Trade Helper: Черный список. Закрываю...');
                            clearInterval(errorCheckInterval);
                            window.close();
                            return;
                        }

                        // Проверка на успешную отправку (если авто-отправка сработала)
                        if (infoContent && infoContent.innerText.includes('Обмен отправлен')) {
                             console.log('Trade Helper: Обмен отправлен. Закрываю...');
                             clearInterval(errorCheckInterval);
                             window.close();
                             return;
                        }
                    }, 500);

                   // 2. Логика кнопки "Хочет" и "Ползунка"
                    setTimeout(() => {
                        const wantButton = document.querySelector('.tabs__item.tabs__want__card[data-want="1"]');
                        if (wantButton) {
                            // А. Нажимаем кнопку "Хочет"
                            wantButton.click();

                            // Б. Ждем прогрузки (1.5 сек), нажимаем ползунок и проверяем на пустоту
                            setTimeout(() => {
                                // --- ДОБАВЛЕНО: Логика ползунка (из Source 1) ---
                                const nameCheckbox = document.getElementById('cards_by_name');
                                if (nameCheckbox && !nameCheckbox.checked) {
                                    nameCheckbox.click(); // Нажимаем, только если еще не включено
                                    console.log('Trade Helper: Ползунок (сортировка по имени) включен.');
                                }
                                // -----------------------------------------------

                                // В. Логика автозакрытия (если включена настройка)
                                if (SCRIPT_STATE.closeIfWantsEmpty) {
                                    const inventoryList = document.querySelector('.trade__inventory-list');
                                    // Проверяем, пуст ли список
                                    if (inventoryList && inventoryList.children.length === 0) {
                                        console.log('Trade Helper: Список "Хочет" пуст и автозакрытие включено. Закрываю...');
                                        window.close();
                                    }
                                }
                            }, 1500); // Задержка 1.5 сек на прогрузку списка
                        }
                    }, 500);
                }
            },
            prepareOwnerLinks() {
                let cardId = GM_getValue('AS_tradeCardId', null);
                if (!cardId) {
                    const mainCardImage = document.querySelector('.ncard__img img');
                    if (mainCardImage) {
                        cardId = TradeHelper.getCardIdFromImageUrl(mainCardImage.src);
                    }
                    if (cardId) {
                        console.log(`[Trade Helper] ID карты для обмена не был сохранен, используется ID с текущей страницы: ${cardId}`);
                    } else {
                        console.log('[Trade Helper] Не удалось определить ID целевой карты для обмена.');
                        return;
                    }
                }

                document.querySelectorAll('a.card-show__owner').forEach(link => {
                    try {
                        const url = new URL(link.href);
                        url.searchParams.set('trade_card_id', cardId);
                        link.href = url.toString();
                    } catch (e) {
                        console.error('[Trade Helper] Не удалось обработать ссылку:', link.href, e);
                    }
                });
            },
            initiateTradeOnUserPage() {
                const cardId = new URLSearchParams(window.location.search).get('trade_card_id');
                if (!cardId) return;

                // Базовый селектор: ищем карту по ID и со статусом "можно обменять"
                const baseCardSelector = `div.anime-cards__item[data-image*="/cards_image/${cardId}/"][data-can-trade="1"]`;

                // Ждем, пока на странице появится ХОТЯ БЫ ОДНА такая карта
                waitForElement(baseCardSelector, () => {
                    // Теперь, когда карты загружены, ищем ВСЕ подходящие
                    const allTradeableCards = document.querySelectorAll(baseCardSelector);

                    // Находим первую карту, у которой НЕТ иконки замка
                    const cardToClick = Array.from(allTradeableCards).find(card =>
                        !card.querySelector('.lock-trade-btn')
                    );

                    if (cardToClick) {
                        // Карта без замка найдена, запускаем старую логику
                        console.log('[Trade Helper] Найдена карта без замка. Кликаю...');
                        const observer = new MutationObserver((mutations, obs) => {
                            const tradeButton = document.querySelector('.all-owners[href*="/trade/"]');
                            if (tradeButton) {
                                obs.disconnect();
                                window.location.href = tradeButton.href;
                            }
                        });
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                        cardToClick.click();
                    } else {
                        // Все доступные для обмена карты оказались с замком
                        console.warn(`[Trade Helper] Карта (ID: ${cardId}) найдена, но все копии заблокированы. Авто-переход остановлен.`);
                    }
                });
            },
            initializeTradePageUI() {
                createToggleButton({
                    id: 'toggleAutoSendBtn',
                    tooltipOn: 'Автоотправка ВКЛ',
                    tooltipOff: 'Автоотправка ВЫКЛ',
                    stateKey: 'helperAutoSendEnabled',
                    onToggle: (isEnabled) => {
                        if (isEnabled) this.setupAutoSendObserver();
                    },
                    iconOn: ICONS.BOOST_ON,
                    iconOff: ICONS.BOOST_OFF

                });
                const modeBtn = createStyledButton('changeModeBtn', `Отправлять ${SCRIPT_STATE.helperAutoSendMode} карты`, ICONS[`MODE_${SCRIPT_STATE.helperAutoSendMode}`], () => {
                    let mode = SCRIPT_STATE.helperAutoSendMode % 3 + 1;
                    SCRIPT_STATE.helperAutoSendMode = mode;
                    GM_setValue('helperAutoSendMode', mode);
                    modeBtn.querySelector('img').src = ICONS[`MODE_${mode}`];
                    addTooltipRight(modeBtn, `Отправлять ${mode} карты`);
                });
            },
            setupAutoSendObserver() {
                const tradeContainer = document.querySelector('.trade__main-items[data-type="creator"]');
                if (!tradeContainer || tradeContainer.dataset.observerAttached) return;
                const observer = new MutationObserver(() => {
                    if (SCRIPT_STATE.helperAutoSendEnabled) {
                        const selectedCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                        if (selectedCount === SCRIPT_STATE.helperAutoSendMode) {
                            document.querySelector('.trade__send-trade-btn')?.click();
                        }
                    }
                });
                observer.observe(tradeContainer, {
                    childList: true
                });
                tradeContainer.dataset.observerAttached = 'true';
            }
        },

        initializeHelperButtons: function() {
            const path = window.location.pathname;
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();

            if (path.includes('/user/cards') && !path.includes('/trade')) {
                if (loggedInUser && (new URLSearchParams(window.location.search).get('name') === null || new URLSearchParams(window.location.search).get('name') === loggedInUser)) {

                    const panel = document.getElementById('super-helper-panel');
                    if (!panel) return;

                    const masterAddBtn = document.createElement('button');
                    const addAllBtn = document.createElement('button');
                    const addDuplicatesBtn = document.createElement('button');
                    const backBtn = document.createElement('button');
                    const runningCancelBtn = document.createElement('button');

                    const styleAsHelperButton = (btn) => {
                        btn.style.cssText = `background-color: rgb(108, 92, 231); transition: transform 0.2s, box-shadow 0.2s; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px; position: relative; transform: scale(1); animation: 2.5s ease-in-out 0s infinite normal none running breatheShadowInteractive; border-radius: 50%; width: 40px; height: 40px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px;`;
                        applyHoverEffect(btn);
                    };

                    styleAsHelperButton(masterAddBtn);
                    masterAddBtn.innerHTML = `<img src="${ICONS.ADD}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(masterAddBtn, 'Добавить карты в обмен');

                    styleAsHelperButton(addAllBtn);
                    addAllBtn.innerHTML = `<img src="${ICONS.ADD_ALL}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(addAllBtn, 'Добавить ВСЕ в обмен');

                    styleAsHelperButton(addDuplicatesBtn);
                    addDuplicatesBtn.innerHTML = `<img src="${ICONS.ADD_DUPLICATES}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(addDuplicatesBtn, 'Добавить ДУБЛИ в обмен');

                    styleAsHelperButton(backBtn);
                    backBtn.innerHTML = `<img src="${ICONS.CANCEL_TRADE}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(backBtn, 'Назад');

                    styleAsHelperButton(runningCancelBtn);
                    runningCancelBtn.innerHTML = `<img src="${ICONS.CANCEL_TRADE}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(runningCancelBtn, 'Остановить процесс');
                    const setUIMode = (mode) => {
                        masterAddBtn.style.display = (mode === 'idle') ?
                            'flex' : 'none';
                        addAllBtn.style.display = (mode === 'menu') ? 'flex' : 'none';
                        addDuplicatesBtn.style.display = (mode === 'menu') ?
                            'flex' : 'none';
                        backBtn.style.display = (mode === 'menu') ? 'flex' : 'none';
                        runningCancelBtn.style.display = (mode === 'running') ?
                            'flex' : 'none';
                    };

                    const cleanupState = () => {
                        console.log('[Trade Helper] Процесс остановлен и состояние очищено.');
                        SCRIPT_STATE.isAddingInProgress = false;
                        SCRIPT_STATE.isAddingDuplicatesInProgress = false;
                        GM_deleteValue('massMarkUnwantedInProgress');
                        GM_deleteValue('massAddDuplicatesInProgress');
                        sessionStorage.removeItem('massMarkUnwantedProcessedPages');
                        GM_deleteValue('totalAddedDuplicatesCount');
                        document.body.classList.remove('mass-adding-active');
                        setUIMode('idle');
                    };

                    masterAddBtn.onclick = () => setUIMode('menu');
                    backBtn.onclick = () => setUIMode('idle');
                    runningCancelBtn.onclick = cleanupState;


                    panel.appendChild(masterAddBtn);
                    panel.appendChild(addAllBtn);
                    panel.appendChild(addDuplicatesBtn);
                    panel.appendChild(backBtn);
                    panel.appendChild(runningCancelBtn);
                    const highlightCard = (cardElement, status) => {
                        if (!cardElement) return;
                        let bgColor, borderColor;
                        switch (status) {
                            case 'SUCCESS':
                                bgColor = 'rgba(40, 167, 69, 0.4)';
                                borderColor = 'rgba(40, 167, 69, 0.7)';
                                break;
                            case 'SKIPPED':
                                bgColor = 'rgba(255, 193, 7, 0.4)';
                                borderColor = 'rgba(255, 193, 7, 0.7)';
                                break;
                            case 'FAILED':
                                bgColor = 'rgba(220, 53, 69, 0.4)';
                                borderColor = 'rgba(220, 53, 69, 0.7)';
                                break;
                            default:
                                return;
                        }
                        cardElement.style.backgroundColor = bgColor;
                        cardElement.style.borderRadius = '8px';
                        cardElement.style.border = `2px solid ${borderColor}`;
                        cardElement.style.boxSizing = 'border-box';
                    };
                    const fetchCardsInTradeList = (username) => {
                        return new Promise((resolve, reject) => {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            document.body.appendChild(iframe);
                            let offeredCardIds = new Set();
                            let pageUrl = `/user/cards/trade/?name=${username}`;



                            const processPage = () => {
                                try {
                                    const doc = iframe.contentDocument;
                                    if (!doc) throw new Error("Could not access iframe content for trade list.");
                                    doc.querySelectorAll('.anime-cards__item[data-id]').forEach(card => offeredCardIds.add(card.dataset.id));



                                    const nextPageLink = doc.querySelector('.pagination__pages-btn a[href]');
                                    if (nextPageLink) {
                                        iframe.src = new URL(nextPageLink.href, window.location.origin).href;
                                    } else {
                                        document.body.removeChild(iframe);
                                        resolve(offeredCardIds);
                                    }
                                } catch (error) {
                                    document.body.removeChild(iframe);
                                    reject(error);
                                }
                            };
                            iframe.onload = processPage;
                            iframe.onerror = () => {
                                document.body.removeChild(iframe);
                                reject(new Error("Iframe loading error while fetching trade list."));
                            };
                            iframe.src = pageUrl;
                        });
                    };
                    const startMarkingAsUnwantedProcess = async () => {
                        setUIMode('running');
                        const processedPages = new Set(JSON.parse(sessionStorage.getItem('massMarkUnwantedProcessedPages') || '[]'));
                        const currentPageEl = document.querySelector('.pagination__pages > span:not([class])');
                        const currentPageNum = currentPageEl ?
                            currentPageEl.textContent.trim() : '1';

                        if (processedPages.has(currentPageNum)) {
                            console.log('[Trade Helper] Страница уже обработана, остановка во избежание цикла.');
                            alert('Процесс завершен. Все страницы обработаны.');
                            cleanupState();
                            return;
                        }

                        try {
                            const listModeBtn = document.querySelector('a.list-card-mode-btn');
                            if (!listModeBtn) {
                                throw new Error('Кнопка "Нужны / не нужны" не найдена.');
                            }

                            if (!document.querySelector('button.profile-cards__deck-btn')) {
                                listModeBtn.click();
                                await wait(1000);
                            }

                            const markUnwantedBtn = document.querySelector('button.profile-cards__deck-btn[onclick="PageNoNeedCards(); return false;"]');
                            if (markUnwantedBtn) {
                                await wait(1000);
                                // Задержка перед нажатием
                                markUnwantedBtn.click();
                                console.log('[Trade Helper] Нажата кнопка "Добавить карты на странице в ненужные".');
                                await wait(3000);
                                // Увеличенная задержка после нажатия
                            } else {
                                const otherBtn = document.querySelector('button.profile-cards__deck-btn');
                                if (otherBtn) {
                                    console.log('[Trade Helper] Карты на странице уже отмечены или доступно другое действие. Пропускаю.');
                                } else {
                                    throw new Error('Кнопка "Добавить карты на странице в ненужные" не найдена.');
                                }
                            }

                            if (!SCRIPT_STATE.isAddingInProgress) {
                                cleanupState();
                                return;
                            }

                            processedPages.add(currentPageNum);
                            sessionStorage.setItem('massMarkUnwantedProcessedPages', JSON.stringify(Array.from(processedPages)));

                            const nextPageA = currentPageEl ? currentPageEl.nextElementSibling : document.querySelector('.pagination__pages-btn a');
                            if (nextPageA && nextPageA.tagName === 'A') {
                                window.location.href = nextPageA.href;
                            } else {
                                alert('Процесс завершен. Все карты на всех страницах отмечены как ненужные.');
                                cleanupState();
                            }
                        } catch (error) {
                            console.error('[Trade Helper] Ошибка в процессе отметки карт:', error);
                            alert(`Произошла ошибка: ${error.message}`);
                            cleanupState();
                        }
                    };
                    const startAddingDuplicatesProcess = async () => {
                        setUIMode('running');
                        document.body.classList.add('mass-adding-active');

                        try {
                            const offeredCardIds = await fetchCardsInTradeList(loggedInUser);
                            console.log(`[Trade Helper] Найдено ${offeredCardIds.size} карт в обмене. Начинаю добавление дублей.`);
                            let totalAddedCount = GM_getValue('totalAddedDuplicatesCount', 0);

                            const cardsOnPageMap = new Map();
                            for (const cardEl of document.querySelectorAll('.anime-cards__item')) {
                                const imagePath = cardEl.dataset.image;
                                if (!imagePath) continue;
                                if (!cardsOnPageMap.has(imagePath)) {
                                    cardsOnPageMap.set(imagePath, []);
                                }
                                cardsOnPageMap.get(imagePath).push(cardEl);
                            }

                            for (const cardGroup of cardsOnPageMap.values()) {
                                if (!SCRIPT_STATE.isAddingDuplicatesInProgress) break;
                                if (cardGroup.length <= 1) continue;

                                const cardId = cardGroup[0].dataset.id;
                                if (cardId && offeredCardIds.has(cardId)) {
                                    console.log(`[Trade Helper] Карта ID ${cardId} уже в обмене, пропуск.`);
                                    highlightCard(cardGroup[0], 'SKIPPED');
                                    continue;
                                }

                                const duplicatesToAdd = cardGroup.slice(1);
                                console.log(`[Trade Helper] Карта ID ${cardId}: найдено ${duplicatesToAdd.length} дублей для добавления.`);
                                for (const cardToAdd of duplicatesToAdd) {
                                    if (!SCRIPT_STATE.isAddingDuplicatesInProgress) break;
                                    try {
                                        TradeHelper.focusHijack.disable();
                                        cardToAdd.click();
                                        await new Promise((resolve, reject) => {
                                            const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
                                            const interval = setInterval(() => {
                                                const tradeBtn = document.querySelector('#card-modal .all-owners[onclick*="ProposeAdd.call"]');
                                                if (tradeBtn) {
                                                    clearInterval(interval);
                                                    clearTimeout(timeout);
                                                    tradeBtn.click();
                                                    totalAddedCount++;
                                                    console.log(`[Trade Helper] Всего добавлено дублей: ${totalAddedCount}`);
                                                    highlightCard(cardToAdd, 'SUCCESS');
                                                    resolve();
                                                }
                                            }, 100);
                                        });
                                    } catch (error) {
                                        console.log('[Trade Helper] Дубль уже в обмене или кнопка не найдена. Пропуск.');
                                        highlightCard(cardToAdd, 'SKIPPED');
                                        document.dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 'Escape'
                                        }));
                                    } finally {
                                        TradeHelper.focusHijack.enable();
                                    }
                                    await wait(700);
                                }
                                if (cardId) offeredCardIds.add(cardId);
                            }

                            if (!SCRIPT_STATE.isAddingDuplicatesInProgress) {
                                cleanupState();
                                return;
                            }

                            GM_setValue('totalAddedDuplicatesCount', totalAddedCount);
                            const currentPageEl = document.querySelector('.pagination__pages > span:not([class])');
                            const nextPageA = currentPageEl ? currentPageEl.nextElementSibling : document.querySelector('.pagination__pages-btn a');
                            if (nextPageA && nextPageA.tagName === 'A') {
                                await wait(1000);
                                window.location.href = nextPageA.href;
                            } else {
                                alert(`Процесс завершен. Всего добавлено дублей: ${totalAddedCount}`);
                                cleanupState();
                            }

                        } catch (error) {
                            console.error('[Trade Helper] Ошибка при добавлении дублей:', error);
                            alert(`Произошла ошибка: ${error.message}`);
                            cleanupState();
                        }
                    };
                    addAllBtn.onclick = () => {
                        SCRIPT_STATE.isAddingInProgress = true;
                        GM_setValue('massMarkUnwantedInProgress', true);
                        sessionStorage.removeItem('massMarkUnwantedProcessedPages'); // Reset on new run
                        startMarkingAsUnwantedProcess();
                    };

                    addDuplicatesBtn.onclick = () => {
                        SCRIPT_STATE.isAddingDuplicatesInProgress = true;
                        GM_setValue('massAddDuplicatesInProgress', true);
                        GM_deleteValue('totalAddedDuplicatesCount');
                        startAddingDuplicatesProcess();
                    };

                    if (GM_getValue('massMarkUnwantedInProgress', false)) {
                        SCRIPT_STATE.isAddingInProgress = true;
                        startMarkingAsUnwantedProcess();
                    } else if (GM_getValue('massAddDuplicatesInProgress', false)) {
                        SCRIPT_STATE.isAddingDuplicatesInProgress = true;
                        setTimeout(() => {
                            startAddingDuplicatesProcess();
                        }, 2000);
                    } else {
                        setUIMode('idle');
                    }
                }
            }

            if (path.includes('/user/cards/trade')) {
                if (loggedInUser && new URLSearchParams(window.location.search).get('name') === loggedInUser) {
                    const setButtonState = (btn, state) => {
                        const img = btn.querySelector('img');
                        if (state === 'running') {
                            img.src = ICONS.CANCEL_TRADE;
                            addTooltipRight(btn, 'Остановить удаление');
                        } else {
                            img.src = ICONS.REMOVE;
                            addTooltipRight(btn, 'Удалить все из обмена');
                        }
                    };
                    const startRemovingProcess = async (btn) => {
                        if (btn) setButtonState(btn, 'running');
                        const removeBtns = document.querySelectorAll('button.card-offer-remove-btn');
                        if (removeBtns.length === 0) {
                            alert('Нет карт для удаления.');
                            SCRIPT_STATE.isRemovingInProgress = false;
                            if (btn) setButtonState(btn, 'stopped');
                            return;
                        }
                        for (const r_btn of removeBtns) {
                            if (!SCRIPT_STATE.isRemovingInProgress) {
                                console.log('[Trade Helper] Процесс удаления остановлен пользователем.');
                                return;
                            }
                            r_btn.click();
                            await wait(250);
                        }
                        if (SCRIPT_STATE.isRemovingInProgress) {
                            alert(`Отправлено ${removeBtns.length} запросов на удаление. Страница перезагрузится.`);
                            SCRIPT_STATE.isRemovingInProgress = false;
                            window.location.reload();
                        }
                    };
                    const removeBtn = createStyledButton('removeAllFromTradeBtn', 'Удалить все из обмена', ICONS.REMOVE, () => {
                        SCRIPT_STATE.isRemovingInProgress = !SCRIPT_STATE.isRemovingInProgress;
                        if (SCRIPT_STATE.isRemovingInProgress) {
                            console.log('[Trade Helper] Запущен процесс удаления всех карт.');
                            startRemovingProcess(removeBtn);
                        } else {
                            console.log('[Trade Helper] Процесс удаления будет остановлен.');
                            setButtonState(removeBtn, 'stopped');
                        }
                    });
                }
            }
        }
    };
    const BoostHelper = {
        mainInterval: null,
        skipInterval: null,
        lastCardImageUrl: null,
        cardUnchangedSince: null,
        limitObserver: null,
        mainClicker: function() {
            const boostBtn = document.querySelector('.club__boost-btn, .club__boost__refresh-btn');
            if (boostBtn) {
                boostBtn.click();
            }
        },
        cardSkipper: function() {
            const replaceBtn = document.querySelector('button.club-boost__replace-btn');
            if (!replaceBtn) return;
            const noOwnersMessage = document.querySelector('.club-boost__text');
            if (noOwnersMessage && noOwnersMessage.textContent.includes('Карты ни у кого из клуба нет')) {
                console.log('[Trade Helper] Сообщение "Карты ни у кого нет". Пропускаем...');
                replaceBtn.click();
                this.cardUnchangedSince = Date.now();
                return;
            }
            const cardImage = document.querySelector('.club-boost__image img');
            const currentCardImageUrl = cardImage ? cardImage.src : null;
            if (currentCardImageUrl && currentCardImageUrl !== this.lastCardImageUrl) {
                this.lastCardImageUrl = currentCardImageUrl;
                this.cardUnchangedSince = Date.now();
            } else if (currentCardImageUrl) {
                if (Date.now() - this.cardUnchangedSince > SCRIPT_STATE.boostSkipInterval) {
                    replaceBtn.click();
                    this.cardUnchangedSince = Date.now();
                }
            }
        },
        handleMainToggle: function() {
            if (SCRIPT_STATE.boostMainEnabled) {
                if (this.mainInterval) return;
                this.mainInterval = setInterval(() => this.mainClicker(), 10);
                console.log('[Trade Helper] Основной кликер ЗАПУЩЕН.');
            } else {
                if (!this.mainInterval) return;
                clearInterval(this.mainInterval);
                this.mainInterval = null;
                console.log('[Trade Helper] Основной кликер ОСТАНОВЛЕН.');
            }
        },
        handleSkipToggle: function() {
            if (SCRIPT_STATE.boostSkipEnabled) {
                if (this.skipInterval) return;
                this.skipInterval = setInterval(() => this.cardSkipper(), 500);
                console.log('[Trade Helper] Скрипт пропуска карт ЗАПУЩЕН.');
            console.log(`[Trade Helper] Скрипт пропуска карт ЗАПУЩЕН (интервал ожидания 't': ${SCRIPT_STATE.boostSkipInterval} мс, частота проверки: 500 мс).`);
            } else {
                if (!this.skipInterval) return;
                clearInterval(this.skipInterval);
                this.skipInterval = null;
                this.lastCardImageUrl = null;
                console.log('[Trade Helper] Скрипт пропуска карт ОСТАНОВЛЕН.');
            }
        },
        showIntervalModal: async function() {
            const newInterval = await RemeltNotificationHelper.showInputModal(
                'Введите интервал автоскипа (в мс):',
                SCRIPT_STATE.boostSkipInterval
            );

            if (newInterval !== null) {
                const intervalMs = parseInt(newInterval, 10);
                // Установим минимальный разумный интервал 200мс
                if (!isNaN(intervalMs) && intervalMs >= 200) {
                    SCRIPT_STATE.boostSkipInterval = intervalMs;
                    GM_setValue('boostSkipInterval', intervalMs);
                    RemeltNotificationHelper.showTemporaryMessage('intervalSaved', `Интервал сохранен: ${intervalMs} мс`, true, 3000);

                    // Если автоскип сейчас включен, перезапускаем его с новым интервалом
                    if (this.skipInterval) {
                        clearInterval(this.skipInterval);
                        this.skipInterval = setInterval(() => this.cardSkipper(), SCRIPT_STATE.boostSkipInterval);
                        console.log(`[Trade Helper] Интервал автоскипа обновлен: ${intervalMs} мс`);
                    }
                } else {
                    RemeltNotificationHelper.showTemporaryMessage('intervalError', 'Неверное значение. Введите число (минимум 200).', false, 4000);
                }
            }
        },
        limitWatcher: function() {
            const targetNode = document.querySelector('main');
            if (!targetNode) return;
            const checkLimit = (node) => {
                if (node && node.nodeType === 1 && node.textContent.includes('В день можно пожертвовать до 600/600 карт.')) {
                    console.log('[Trade Helper] Дневной лимит 600/600 достигнут. Отключаю автокликер и скип.');
                    if (SCRIPT_STATE.boostMainEnabled) {
                        const mainToggle = document.getElementById('toggleMainBoost');
                        if (mainToggle) mainToggle.click();
                    }
                    if (SCRIPT_STATE.boostSkipEnabled) {
                        const skipToggle = document.getElementById('toggleSkipBoost');
                        if (skipToggle) skipToggle.click();
                    }
                }
            };
            checkLimit(targetNode);
            this.limitObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => checkLimit(node));
                    } else if (mutation.type === 'characterData') {
                        checkLimit(mutation.target.parentElement);
                    }
                }
            });
            this.limitObserver.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        },
        scheduleAutoBoost: function() {
            const now = new Date();
            // Создаем целевое время на сегодня в UTC. 21:01:02:50 МСК = 18:01:02:50 UTC
            let targetTime = new Date();
            targetTime.setUTCHours(18, 1, 2, 50); // Часы, минуты, секунды, миллисекунды

            // Если это время уже прошло сегодня, планируем на завтра
            if (now.getTime() > targetTime.getTime()) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            const delay = targetTime.getTime() - now.getTime();
            // Форматируем время для вывода в консоль (по МСК)
            const formatter = new Intl.DateTimeFormat('ru-RU', {
                timeZone: 'Europe/Moscow',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            console.log(`[Trade Helper] Автокликер запланирован на ${formatter.format(targetTime)} (МСК)`);

            setTimeout(() => {
                console.log('[Trade Helper] Запуск запланированного автокликера.');
                if (!SCRIPT_STATE.boostMainEnabled) {
                    const mainToggle = document.getElementById('toggleMainBoost');
                    if (mainToggle) {
                        mainToggle.click();
                    }
                }
            }, delay);
        },
        initialize: function() {
            createToggleButton({
                id: 'toggleMainBoost',
                tooltipOn: 'Автокликер ВКЛ',
                tooltipOff: 'Автокликер ВЫКЛ',
                stateKey: 'boostMainEnabled',
                onToggle: () => this.handleMainToggle(),
                iconOn: ICONS.BOOST_ON,
                iconOff: ICONS.BOOST_OFF
            });
           if (document.querySelector('button.club-boost__replace-btn')) {
                createToggleButton({
                    id: 'toggleSkipBoost',
                    tooltipOn: 'Авто скип ВКЛ',
                    tooltipOff: 'Авто скип ВЫКЛ',
                    stateKey: 'boostSkipEnabled',
                    onToggle: () => this.handleSkipToggle(),
                    iconOn: ICONS.BOOST_ON,
                    iconOff: ICONS.BOOST_OFF
                });
                createStyledButton(
                    'setSkipIntervalBtn',          // id
                    'Интервал автоскипа',          // tooltip
                    ICONS.TOGGLE_SLIDER,           // иконка
                    () => this.showIntervalModal() // действие при клике
                );
           }
            this.scheduleAutoBoost();
            this.limitWatcher();
        }
    };
    const NotificationHider = {
        observer: null,
        spamTexts: [
            "Нужная клубу карта изменилась",
            "Нужная клубу карта не менялась",
            "Слишком часто. Ваше мастерство превосходно - но замедлитесь, познайте просветление",
            "Слишком часто" // Добавлено для переплавки и других мест
        ],
        dailyLimitText: "Достигнут дневной лимит пожертвований в клуб, подождите до завтра",
        processNotification: function(node) {
            if (node.nodeType === 1 && node.matches('.DLEPush-notification, .custom-card-notification')) {
                const messageElement = node.querySelector('.DLEPush-message') ||
                    node;
                if (messageElement) {
                    const notificationText = messageElement.textContent.trim();
                    if (this.spamTexts.some(spam => notificationText.includes(spam))) {
                        node.style.display = 'none';
                        return;
                    }
                    if (notificationText === this.dailyLimitText) {
                        console.log('[Trade Helper] Обнаружен дневной лимит пожертвований. Отключение модулей...');
                        if (SCRIPT_STATE.boostMainEnabled) {
                            document.getElementById('toggleMainBoost')?.click();
                        }
                        if (SCRIPT_STATE.boostSkipEnabled) {
                            document.getElementById('toggleSkipBoost')?.click();
                        }
                    }
                }
            }
        },
        initialize: function() {
            document.querySelectorAll('.DLEPush-notification, .custom-card-notification').forEach(notification => this.processNotification(notification));
            this.observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.matches('.DLEPush-notification, .custom-card-notification')) {
                                    this.processNotification(node);
                                }
                                node.querySelectorAll('.DLEPush-notification, .custom-card-notification').forEach(notification => this.processNotification(notification));
                            }
                        });
                    }
                }
            });
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    const ClubInfoHelper = {
        config: {
            injectionPointSelector: '.secondary-title.text-center',
            nicknameSelector: '.lgn__name span',
            clubInfoStorageKey: 'clubInfoHelper_clubData',
            userInfoStorageKey: 'clubInfoHelper_userData',
        },
        calculateDuration(endTimeString) {
            try {

                const startTime = new Date();
                startTime.setHours(21, 1, 0, 0);
                const endTimeParts = endTimeString.split('(')[0].split(':');
                const endTime = new Date();
                endTime.setHours(
                    parseInt(endTimeParts[0], 10), parseInt(endTimeParts[1], 10), parseInt(endTimeParts[2], 10), 0
                );
                const diffMs =
                    endTime - startTime;
                if (diffMs < 0) return "Ошибка расчета";
                const totalSeconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                return `${minutes} мин ${seconds.toString().padStart(2, '0')} сек`;
            } catch (error) {
                console.error('[Trade Helper] Ошибка при расчете времени:', error);
                return "Ошибка";
            }
        },
        updateDisplay: function() {

            const clubContainer = document.getElementById('club-rank-info');
            const userContainer = document.getElementById('user-contribution-info');
            if (!clubContainer || !userContainer) return;
            const clubData = GM_getValue(this.config.clubInfoStorageKey, null);
            const userData = GM_getValue(this.config.userInfoStorageKey, null);
            clubContainer.innerHTML = clubData ?
                `Место клуба: ${clubData.place} | Закрыли за: ${clubData.displayTime}` : '';
            userContainer.innerHTML = userData ? `Моё место: №${userData.position} | Внесено карт: ${userData.contribution}` : '';
        },
        fetchClubInfo: function() {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${CURRENT_ORIGIN}/clubs/`,
                    onload: (response) => {

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const clubLink = Array.from(doc.querySelectorAll('.club-top-list__name')).find(a => a.textContent.trim() === 'Oni no Kage');

                        if (!clubLink) return resolve();
                        const clubContainer = clubLink.closest('.club-top-list__item');
                        if (!clubContainer) return resolve();
                        const place = clubContainer.querySelector('.club-top-list__place div')?.textContent.trim() || 'не найдено';

                        let displayTime = 'не найдено';
                        const timeMatch = clubContainer.querySelector('.club-top-list__count')?.textContent.match(/Время\s*([\d:()msa-z]+)/i);
                        if (timeMatch && timeMatch[1]) displayTime = this.calculateDuration(timeMatch[1]);
                        const data = {
                            place,
                            displayTime
                        };
                        GM_setValue(this.config.clubInfoStorageKey, data);
                        resolve();
                    }
                });
            });
        },
        fetchUserContributionInfo: function(nickname) {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${CURRENT_ORIGIN}/clubs/boost/?id=71`,
                    onload: (response) => {

                        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let userRow;
                        for (const row of doc.querySelectorAll('.club-boost__top-item')) {
                            if (row.querySelector('.club-boost__top-name')?.textContent.trim() === nickname) {
                                userRow = row;
                                break;
                            }

                        }
                        if (userRow) {
                            const position = userRow.querySelector('.club-boost__top-position').textContent.trim();
                            const contribution = userRow.querySelector('.club-boost__top-contribution').textContent.trim();
                            const data = {
                                position,
                                contribution
                            };
                            GM_setValue(this.config.userInfoStorageKey, data);
                        }
                        resolve();
                    }
                });
            });
        },
        initialize: function() {
            const injectionPoint = document.querySelector(this.config.injectionPointSelector);
            if (injectionPoint) {
                if (!document.getElementById('club-rank-info')) {
                    const clubDiv = document.createElement('div');
                    clubDiv.id = 'club-rank-info';
                    injectionPoint.parentNode.insertBefore(clubDiv, injectionPoint);
                }
                if (!document.getElementById('user-contribution-info')) {
                    const userDiv = document.createElement('div');
                    userDiv.id = 'user-contribution-info';
                    const clubDiv = document.getElementById('club-rank-info');
                    clubDiv.parentNode.insertBefore(userDiv, clubDiv.nextSibling);
                }
            }
            this.updateDisplay();
            createStyledButton('refreshClubInfoBtn', 'Обновить информацию', ICONS.REFRESH, async (e) => {
                const btn = e.currentTarget;
                const img = btn.querySelector('img');
                addTooltipRight(btn, 'Обновление...');
                img.style.animation = 'cardHelperSpin 1.2s linear infinite';
                btn.disabled =
                    true;
                const nicknameElement = document.querySelector(this.config.nicknameSelector);
                if (nicknameElement) {
                    const nickname = nicknameElement.textContent.trim();
                    await Promise.all([
                        this.fetchClubInfo(),
                        this.fetchUserContributionInfo(nickname)
                    ]);
                    this.updateDisplay();
                }
                btn.disabled = false;
                img.style.animation = '';
                addTooltipRight(btn, 'Обновить информацию');
            });
        }
    };
    const ImageZoomHelper = {
        initialize: function() {
            const addZoomFunctionality = (imageElement) => {
                if (imageElement.dataset.zoomListenerAdded) {
                    return;
                }
                imageElement.dataset.zoomListenerAdded = 'true';
                imageElement.addEventListener('click', function() {
                    const modalContent = this.closest('#card-modal');
                    const placeholder = this.closest('.anime-cards__placeholder');
                    this.classList.toggle('enlarged');
                    if (placeholder) {
                        placeholder.classList.toggle('is-zoomed');
                    }
                    if (modalContent) {
                        if (this.classList.contains('enlarged')) {
                            modalContent.style.overflow = 'visible';
                        } else {
                            modalContent.style.overflow = 'auto';
                        }
                    }
                });
            };
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        const image = document.querySelector('.anime-cards__placeholder img:not([data-zoom-listener-added])');
                        if (image) {
                            addZoomFunctionality(image);
                        }
                    }
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    const PackButtonHelper = {
        injectButton: function() {
            const containerSelector = '.ncard__tabs-btns';
            const allContainers = document.querySelectorAll(containerSelector);
            if (allContainers.length === 0) return false;

            let targetContainer = null;
            if (allContainers.length > 1) {
                targetContainer = allContainers[1];
            } else {
                targetContainer = allContainers[0];
            }

            if (targetContainer.querySelector('#pack-button-helper')) {
                return true;
                // Уже добавлено
            }

            const packButton = document.createElement('a');
            packButton.id = 'pack-button-helper';
            packButton.className = 'ncard__tabs-btn btn c-gap-10';
            packButton.href = `${CURRENT_ORIGIN}/cards/pack/`;
            packButton.textContent = 'Паки карт';
            targetContainer.appendChild(packButton);
            return true;
        },

        initialize: function() {
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();
            const pageUser = new URLSearchParams(window.location.search).get('name');
            const isCorrectPath = window.location.pathname === '/user/cards/';
            if (!loggedInUser || !isCorrectPath || (pageUser !== null && pageUser !== loggedInUser)) {
                return;
            }

            if (this.injectButton()) {
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                if (this.injectButton()) {
                    obs.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    const UpgradeHelper = {
        currentNotification: {
            element: null,
            id: null,
            type: null,
            timeoutId: null
        },
        initialize: function() {
            if (!window.location.search.includes('sort=duplicates')) return;
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length && document.querySelector('.modal__body .anime-cards__wrapper:not(.--processed-upgrade)')) {
                        const modalBody = document.querySelector('.modal__body .anime-cards__wrapper');
                        modalBody.classList.add('--processed-upgrade');
                        this.addUpgradeButton(modalBody);
                    }
                });
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        addUpgradeButton: function(modalBody) {
            const nameElement = modalBody.querySelector('.anime-cards__name');
            if (!nameElement) return;
            const button = document.createElement('button');
            button.className = 'upgrade-star-btn';
            button.innerHTML = '<i class="fas fa-star"></i>';
            addTooltipTop(button, 'Повысить звёздность');
            button.onclick = (event) => this.handleUpgrade(event);
            nameElement.appendChild(button);
        },
        handleUpgrade: async function(event) {
            event.stopPropagation();
            event.preventDefault();
            const notificationId = 'upgradeProcess';
            const modal = event.target.closest('.modal__body');

            const searchDupsButton = modal.querySelector('button.all-owners.dubl-search-card');
            if (!searchDupsButton) {
                return this.showTemporaryMessage('dupBtnError', 'Не найдена кнопка поиска дублей.', false);
            }
            const onclickAttr = searchDupsButton.getAttribute('onclick');
            const urlMatch = onclickAttr.match(/window\.location = '([^']*)'/);
            if (!urlMatch || !urlMatch[1]) {
                return this.showTemporaryMessage('dupUrlError', 'Не удалось извлечь URL для поиска дублей.', false);
            }
            const unlockUrl = new URL(urlMatch[1], CURRENT_ORIGIN).href;
            const username = new URLSearchParams(window.location.search).get('name');
            if (!username) return this.showTemporaryMessage('userError', 'Не удалось определить имя пользователя.', false);
            const animeTitle = modal.querySelector('.anime-cards__link span').textContent.trim();
            const imageUrl = modal.querySelector('.anime-cards__placeholder img').src;
            const characterName = modal.querySelector('.anime-cards__name').firstChild.textContent.trim();
            const rank = modal.querySelector('.ncard__rank[class*="rank-"]').className.match(/rank-([sabcde])/)[1];
            const imageRelativePath = new URL(imageUrl).pathname;
            const cardElementOnPage = document.querySelector(`.anime-cards__item[data-image="${imageRelativePath}"]`);
            if (!cardElementOnPage) {
                return this.showTemporaryMessage('criticalError', 'Критическая ошибка: не удалось найти карту на странице.', false);
            }
            const totalCardCount = parseInt(cardElementOnPage.querySelector('.dupl-count')?.textContent || '0', 10);
            const progressUrl = `${CURRENT_ORIGIN}/user/${username}/cards_progress/`;


            this.displayNotification(notificationId, 'Начинаю процесс улучшения...', 'progress', {
                sticky: true
            });
            if (isMobile) {
                GM_setValue('upgrade.isActive', true);
                GM_setValue('upgrade.step', 'unlockCards');
                GM_setValue('upgrade.username', username);
                GM_setValue('upgrade.animeTitle', animeTitle);
                GM_setValue('upgrade.rank', rank);
                GM_setValue('upgrade.characterName', characterName);
                GM_setValue('upgrade.imageUrl', imageUrl);
                GM_setValue('upgrade.totalCardCount', totalCardCount);
                GM_setValue('upgrade.progressUrl', progressUrl);
                GM_setValue('upgrade.returnUrl', window.location.href);
                GM_setValue('upgrade.wasFixed', false);
                GM_setValue('upgrade.status', 'STARTED');
                window.open(unlockUrl, '_blank');
                const interval = setInterval(() => {
                    const status = GM_getValue('upgrade.status', 'STARTED');
                    if (status !== 'STARTED') {
                        clearInterval(interval);
                        if (status === 'SUCCESS') {
                            this.completeProgressNotification(notificationId, 'Карта успешно улучшена!', true, 5000);
                            setTimeout(() => window.location.reload(), 2000);
                        } else {
                            this.completeProgressNotification(notificationId, `Ошибка: ${status}`, false, 5000);
                        }
                        this.clearWorkerState();
                    }
                }, 1000);
            } else {
                const iframe = document.createElement('iframe');
                iframe.id = 'upgrade-task-iframe';
                document.body.appendChild(iframe);
                let wasFixed = false;
                let upgradeSucceeded = false;
                try {
                    await this.unlockCards(iframe, unlockUrl, notificationId);
                    wasFixed = await this.unfixCollection(iframe, progressUrl, animeTitle, notificationId);
                    const resultMessage = await this.attemptUpgrade(iframe, rank, characterName, imageUrl, totalCardCount, notificationId);
                    if (resultMessage === 'success') {
                        upgradeSucceeded = true;
                        this.completeProgressNotification(notificationId, 'Карта успешно улучшена!', true, 5000);
                    } else {
                        this.completeProgressNotification(notificationId, resultMessage, false, 5000);
                    }
                } catch (error) {
                    this.completeProgressNotification(notificationId, `Произошла ошибка: ${error.message}`, false, 5000);
                    console.error('[Trade Helper] Ошибка в процессе повышения:', error);
                } finally {
                    if (wasFixed) {
                        try {
                            await this.fixCollection(iframe, progressUrl, animeTitle, notificationId);
                        } catch (fixError) {
                            this.showTemporaryMessage('fixError', 'Не удалось вернуть фиксацию коллекции.', false, 5000);
                            console.error('[Trade Helper] Ошибка при возврате фиксации:', fixError);
                        }
                    }
                    if (upgradeSucceeded) {
                        setTimeout(() => window.location.reload(), 2000);
                    } else {
                        setTimeout(() => {
                            if (iframe && iframe.parentNode) iframe.remove();
                        }, 6000);
                    }
                }
            }
        },
        unlockCards: async function(context, url, notificationId) {
            this.updateNotificationProgress(notificationId, "Снятие блокировки карт...");
            let doc = await this._loadPageWithScripts(context, url);
            this.updateNotificationProgress(notificationId, "Снятие блокировки: Активация режима...");
            const lockModeBtn = await this._waitForElement(doc, 'a.lock-card-mode-btn');
            lockModeBtn.click();
            this.updateNotificationProgress(notificationId, "Снятие блокировки: Нажатие кнопки...");
            const unlockPageBtn = await this._waitForElement(doc, 'button.profile-cards__deck-btn[onclick="PageUnLockCards(); return false;"]');
            unlockPageBtn.click();
            await this._waitForOneOfElements(doc, ['.DLEPush-message'], 10000);
            this.updateNotificationProgress(notificationId, "Снятие блокировки: Успешно.");
            await wait(1000);
            return true;
        },
        attemptUpgrade: async function(context, rank, characterName, imageUrl, totalCards, notificationId) {
            this.updateNotificationProgress(notificationId, "Загрузка страницы улучшения...");
            let doc = await this._loadPageWithScripts(context, `${CURRENT_ORIGIN}/update_stars/`);
            const rankButton = await this._waitForElement(doc, `.tabs__item.tabs__navigate__rank[data-rank="${rank}"]`);
            if (!rankButton.classList.contains('tabs__item--active')) {
                rankButton.click();
                doc = await this._waitForNextPageLoad(context);
            }
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Имя персонажа..."]');
            searchInput.value = characterName;
            doc.querySelector('.card-stars-form__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            await this._waitForElement(doc, '.card-stars-list__items, .pagination__pages', 10000);
            const urlParts = imageUrl.split('/');
            const uniqueImageFilename = urlParts[urlParts.length - 1];
            if (!uniqueImageFilename) throw new Error(`Не удалось извлечь имя файла из URL изображения: ${imageUrl}`);
            const cardSelector = `.card-stars-list__items .card-stars-list__card img[src$="${uniqueImageFilename}"]`;
            let cardImg = null;
            let currentPage = 1;
            const maxPagesToScan = 20;
            while (currentPage <= maxPagesToScan) {
                this.updateNotificationProgress(notificationId, `Поиск карты на странице ${currentPage}...`);
                cardImg = doc.querySelector(cardSelector);
                if (cardImg) break;
                const nextPageLink = doc.querySelector('.pagination__pages-btn a');
                if (nextPageLink) {
                    const nextPageUrl = new URL(nextPageLink.href, doc.location.origin).href;
                    try {
                        doc = await this._loadIframePage(context, nextPageUrl);
                        currentPage++;
                    } catch (error) {
                        throw new Error(`Не удалось загрузить следующую страницу. ${error.message}`);
                    }
                } else {
                    break;
                }
            }
            if (!cardImg) throw new Error(`Карта не найдена ни на одной из страниц поиска (проверено ${currentPage} стр.).`);
            this.updateNotificationProgress(notificationId, "Карта найдена, проверка стоимости...");
            cardImg.parentElement.click();

            const infoDiv = await this._waitForTextInElement(doc, '.card-level-up__info', 'потребуется', 15000);
            const requiredMatch = infoDiv.textContent.match(/потребуется (\d+) дублей карт/);
            if (!requiredMatch) throw new Error('Не удалось определить стоимость улучшения.');
            const requiredCount = parseInt(requiredMatch[1], 10);
            const actualDuplicates = totalCards - 1;
            if (actualDuplicates < requiredCount) {
                const needed = requiredCount - actualDuplicates;
                return `Не хватает дублей. Нужно еще ${needed} шт.`;
            }
            this.updateNotificationProgress(notificationId, "Начинаю улучшение...");
            const startBtn = await this._waitForElement(doc, '.card-level-up__start-btn');
            startBtn.click();
            const pushMessage = await this._waitForOneOfElements(doc, ['.DLEPush-message', '.custom-card-notification'], 15000);
            return pushMessage.textContent.toLowerCase().includes('успешно') ?
                'success' : `${pushMessage.textContent}`;
        },
        unfixCollection: async function(context, url, title, notificationId) {
            this.updateNotificationProgress(notificationId, "Проверка фиксации коллекции...");
            let doc = await this._loadPageWithScripts(context, url);
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Название аниме..."]');
            searchInput.value = title;
            doc.querySelector('.progress__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            try {
                const animeLink = await this._waitForAnimeTitle(doc, title);
                const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
                if (!fixButton) {
                    console.log('[Trade Helper] Кнопка фиксации не найдена. Пропускаю этап.');
                    this.updateNotificationProgress(notificationId, "Кнопка фиксации не найдена, пропускаю...");
                    await wait(1500);
                    return false;
                }
                const wasFixed = fixButton.getAttribute('data-fixed') === '1';
                if (wasFixed) {
                    this.updateNotificationProgress(notificationId, "Снимаю фиксацию коллекции...");
                    fixButton.click();
                    const confirmDialog = await this._waitForElement(doc, '.ui-dialog.dle-popup-confirm');
                    const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                    if (!confirmButton) throw new Error('Кнопка "Подтвердить" не найдена.');
                    confirmButton.click();
                    await this._waitForElementDisappear(doc, '.ui-dialog.dle-popup-confirm');
                    await this._waitForAttribute(fixButton, 'data-fixed', '0');
                }
                return wasFixed;
            } catch (error) {
                if (error.message && error.message.includes('не найдено')) {
                    console.log(`[Trade Helper] Коллекция "${title}" не найдена. Пропускаю этап фиксации.`);
                    this.updateNotificationProgress(notificationId, "Коллекция не найдена, пропускаю...");
                    await wait(2000);
                    return false;
                } else {
                    throw error;
                }
            }
        },
        fixCollection: async function(context, url, title, notificationId) {
            let doc = await this._loadPageWithScripts(context, url);
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Название аниме..."]');
            searchInput.value = title;
            doc.querySelector('.progress__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            const animeLink = await this._waitForAnimeTitle(doc, title);
            const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
            if (!fixButton) {
                console.log('[Trade Helper] Кнопка фиксации не найдена. Возврат не требуется.');
                return;
            }

            const isUnfixed = fixButton.getAttribute('data-fixed') === '0';
            if (isUnfixed) {
                fixButton.click();
                const confirmDialog = await this._waitForElement(doc, '.ui-dialog.dle-popup-confirm');
                const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                if (!confirmButton) throw new Error('Кнопка "Подтвердить" (фиксация) не найдена.');
                confirmButton.click();
                await this._waitForElementDisappear(doc, '.ui-dialog.dle-popup-confirm');
                await this._waitForAttribute(fixButton, 'data-fixed', '1');
            }
        },
        _loadPageWithScripts: (context, url) => new Promise(resolve => {
            if (context.tagName === 'IFRAME') {
                context.onload = () => resolve(context.contentWindow.document);
                context.src = url;
            } else {
                resolve(context);
            }
        }),
        _waitForNextPageLoad: (context) => new Promise(resolve => {
            if (context.tagName === 'IFRAME') {
                context.onload = () => resolve(context.contentWindow.document);
            } else {
                resolve(context);
            }
        }),

        _loadIframePage: (iframe, url, timeout = 15000) => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    iframe.onload = null;
                    reject(new Error(`Загрузка iframe превысила таймаут: ${url}`));

                }, timeout);
                iframe.onload = () => {
                    clearTimeout(timer);
                    iframe.onload = null;
                    resolve(iframe.contentWindow.document);

                };
                iframe.onerror = () => {
                    clearTimeout(timer);
                    iframe.onerror = null;
                    reject(new Error(`Iframe не смог загрузить: ${url}`));
                };
                iframe.src = url;
            });
        },
        _waitForElement: (doc, selector, timeout = 7000) => new Promise((resolve, reject) => {
            const el = doc.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const foundEl = doc.querySelector(selector);
                if (foundEl) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve(foundEl);
                }
            });
            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Элемент не найден: ${selector}`));
            }, timeout);
            observer.observe(doc.body, {
                childList: true,
                subtree: true
            });
        }),
        _waitForOneOfElements: (doc, selectors, timeout = 7000) => new Promise((resolve, reject) => {
            for (const selector of selectors) {
                const el = doc.querySelector(selector);
                if (el) return resolve(el);
            }
            const observer = new MutationObserver(() => {
                for (const selector of selectors) {
                    const foundEl = doc.querySelector(selector);
                    if (foundEl) {
                        observer.disconnect();
                        clearTimeout(id);
                        const messageElement = foundEl.querySelector('.DLEPush-message') || foundEl;
                        resolve(messageElement);
                        return;
                    }
                }
            });
            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Ни один из элементов не найден: ${selectors.join(', ')}`));
            }, timeout);
            observer.observe(doc.body, {
                childList: true,
                subtree: true
            });
        }),
        _waitForAttribute: (element, attrName, expectedValue, timeout = 5000) => new Promise((resolve, reject) => {
            if (element.getAttribute(attrName) === expectedValue) return resolve();
            const observer = new MutationObserver(() => {
                if (element.getAttribute(attrName) === expectedValue) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve();
                }
            });
            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Атрибут '${attrName}' не стал равен '${expectedValue}'`));
            }, timeout);
            observer.observe(element, {
                attributes: true
            });
        }),
        _waitForTextInElement: (doc, selector, text, timeout = 7000) => new Promise((resolve, reject) => {
            let observer;
            const checkText = () => {
                const element = doc.querySelector(selector);
                if (element && element.textContent.includes(text)) {
                    if (observer) observer.disconnect();
                    clearTimeout(id);
                    resolve(element);
                    return true;
                }
                return false;
            };
            const id = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`Текст "${text}" не появился в "${selector}"`));
            }, timeout);
            if (!checkText()) {
                observer = new MutationObserver(checkText);
                observer.observe(doc.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }),
        _waitForElementDisappear: (doc, selector, timeout = 5000) => new Promise((resolve, reject) => {
            if (!doc.querySelector(selector))
                return resolve();
            const observer = new MutationObserver(() => {
                if (!doc.querySelector(selector)) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve();

                }
            });
            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Элемент "${selector}" не исчез`));
            }, timeout);
            observer.observe(doc.body, {
                childList: true,
                subtree: true
            });
        }),
        _waitForAnimeTitle: (doc, title, timeout = 7000) => new Promise((resolve, reject) => {
            let observer;
            const check = () => {
                const animeLink = Array.from(doc.querySelectorAll('.user-anime__title')).find(a => a.textContent.trim() === title);
                if (animeLink) {
                    if (observer) observer.disconnect();
                    clearTimeout(id);
                    resolve(animeLink);
                    return true;
                }
                return false;
            };
            const id = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`Аниме "${title}" не найдено`));
            }, timeout);
            if (!check()) {
                observer = new MutationObserver(check);
                observer.observe(doc.body, {
                    childList: true,
                    subtree: true
                });
            }
        }),
        displayNotification: function(id, message, type = 'temporary', options = {}) {
            const {
                isSuccess = true, duration = 3500, sticky = false
            } = options;
            if (this.currentNotification.element && this.currentNotification.id !== id) {
                if (this.currentNotification.timeoutId) clearTimeout(this.currentNotification.timeoutId);
                if (this.currentNotification.element.parentNode) this.currentNotification.element.remove();
                this.currentNotification.element = null;
                this.currentNotification.id = null;
            }
            let notificationElement = this.currentNotification.element;
            if (!notificationElement || this.currentNotification.id !== id || (this.currentNotification.type === 'progress' && type !== 'progress')) {
                if (notificationElement && notificationElement.parentNode) notificationElement.remove();
                notificationElement = document.createElement('div');
                notificationElement.className = 'card-helper-status-notification';
                document.body.appendChild(notificationElement);
                this.currentNotification.element = notificationElement;
                this.currentNotification.id = id;
            }
            this.currentNotification.type = type;
            let finalHtml = '';
            if (type === 'progress') {
                finalHtml = `<div class="ch-status-icon-container"><div class="card-helper-spinner"></div></div><span class="card-helper-status-text">${message}</span>`;
            } else if (type === 'completion' || type === 'temporary') {
                const iconChar = isSuccess ?
                    '✔' : '✖';
                const iconColor = isSuccess ? '#76c779' : '#e57373';
                finalHtml = `<div class="ch-status-icon-container"><span style="color: ${iconColor}; font-size: 18px; line-height: 1;">${iconChar}</span></div><span class="card-helper-status-text">${message}</span>`;
            } else {
                finalHtml = `<span class="card-helper-status-text">${message}</span>`;
            }
            notificationElement.innerHTML = finalHtml;
            requestAnimationFrame(() => notificationElement.classList.add('show'));
            if (this.currentNotification.timeoutId) {
                clearTimeout(this.currentNotification.timeoutId);
                this.currentNotification.timeoutId = null;
            }
            if (!sticky && (type === 'completion' || type === 'temporary')) {
                this.currentNotification.timeoutId = setTimeout(() => this.hideCurrentNotification(id), duration);
            }
        },
        updateNotificationProgress: function(id, messagePrefix) {
            if (this.currentNotification.id === id && this.currentNotification.type === 'progress') {
                const textElement = this.currentNotification.element.querySelector('.card-helper-status-text');
                if (textElement && textElement.textContent !== messagePrefix) textElement.textContent = messagePrefix;
            } else {
                this.displayNotification(id, messagePrefix, 'progress', {
                    sticky: true
                });
            }
        },
        completeProgressNotification: function(id, message, isSuccess = true, duration = 3500) {
            if (message === 'Карта успешно улучшена!') {
                isSuccess = true;
            }
            this.displayNotification(id, message, 'completion', {
                isSuccess,
                duration
            });
        },
        showTemporaryMessage: function(id, message, isSuccess = true, duration = 3500) {
            this.displayNotification(id, message, 'temporary', {
                isSuccess,
                duration
            });
        },
        hideCurrentNotification: function(idToHide) {
            if (this.currentNotification.element && this.currentNotification.id === idToHide) {
                const element = this.currentNotification.element;
                element.classList.remove('show');
                if (this.currentNotification.timeoutId) {
                    clearTimeout(this.currentNotification.timeoutId);
                    this.currentNotification.timeoutId = null;
                }
                setTimeout(() => {
                    if (element.parentNode) element.remove();
                    if (this.currentNotification.element === element) {
                        this.currentNotification.element = null;
                        this.currentNotification.id = null;
                        this.currentNotification.type = null;
                    }
                }, 400);
            }
        },
        clearWorkerState: function() {
            GM_deleteValue('upgrade.isActive');
            GM_deleteValue('upgrade.step');
            GM_deleteValue('upgrade.username');
            GM_deleteValue('upgrade.animeTitle');
            GM_deleteValue('upgrade.rank');
            GM_deleteValue('upgrade.characterName');
            GM_deleteValue('upgrade.imageUrl');
            GM_deleteValue('upgrade.totalCardCount');
            GM_deleteValue('upgrade.progressUrl');
            GM_deleteValue('upgrade.returnUrl');
            GM_deleteValue('upgrade.wasFixed');
            GM_deleteValue('upgrade.status');
        },
        runWorker: async function() {
            if (!GM_getValue('upgrade.isActive', false)) return;
            waitForElement('body', async () => {
                const step = GM_getValue('upgrade.step');
                const path = window.location.pathname;
                const search = window.location.search;
                console.log(`[Trade Helper] Active. Step: ${step}, Path: ${path}`);

                try {
                    if (step === 'unlockCards' && path.includes('/user/cards/')) {
                        console.log('[Trade Helper] Step 1: Unlocking cards...');
                        const lockModeBtn = await this._waitForElement(document, 'a.lock-card-mode-btn');
                        lockModeBtn.click();

                        const unlockPageBtn = await this._waitForElement(document, 'button.profile-cards__deck-btn[onclick="PageUnLockCards(); return false;"]');
                        unlockPageBtn.click();

                        await this._waitForOneOfElements(document, ['.DLEPush-message'], 10000);



                        GM_setValue('upgrade.step', 'searchForAnime');
                        window.location.href = GM_getValue('upgrade.progressUrl');
                    } else if (step === 'searchForAnime' && path.includes('/cards_progress')) {
                        console.log('[Trade Helper] Step 2: Searching for anime...');
                        const searchInput = await this._waitForElement(document, 'input.form__field[placeholder="Название аниме..."]');
                        searchInput.value = GM_getValue('upgrade.animeTitle');
                        GM_setValue('upgrade.step', 'handleFix');
                        document.querySelector('.progress__search-btn').click();
                    } else if (step === 'handleFix' && path.includes('/cards_progress')) {
                        console.log('[Trade Helper] Step 2.5 or 5: Handling collection fix...');
                        const wasFixed = GM_getValue('upgrade.wasFixed', false);

                        if (wasFixed) { // This means we are RE-FIXING
                            const animeLink = await this._waitForAnimeTitle(document, GM_getValue('upgrade.animeTitle'));
                            const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
                            if (fixButton && fixButton.getAttribute('data-fixed') === '0') {
                                fixButton.click();
                                const confirmDialog = await this._waitForElement(document, '.ui-dialog.dle-popup-confirm');
                                const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                                if (confirmButton) confirmButton.click();
                                await this._waitForElementDisappear(document, '.ui-dialog.dle-popup-confirm');
                            }
                            GM_setValue('upgrade.status', 'SUCCESS');
                            this.clearWorkerState();
                            window.close();
                        } else { // This means we are UN-FIXING for the first time
                            const animeLink = await this._waitForAnimeTitle(document, GM_getValue('upgrade.animeTitle'));
                            const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
                            if (fixButton && fixButton.getAttribute('data-fixed') === '1') {
                                GM_setValue('upgrade.wasFixed', true);
                                // Remember we need to re-fix later
                                fixButton.click();
                                const confirmDialog = await this._waitForElement(document, '.ui-dialog.dle-popup-confirm');
                                const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                                if (confirmButton) confirmButton.click();
                                await this._waitForElementDisappear(document, '.ui-dialog.dle-popup-confirm');
                            }
                            GM_setValue('upgrade.step', 'navigateToUpgradePage');
                            window.location.href = `${CURRENT_ORIGIN}/update_stars/`;
                        }
                    } else if (step === 'navigateToUpgradePage' && path.includes('/update_stars')) {
                        console.log('[Trade Helper] Step 3: Selecting rank...');
                        const rank = GM_getValue('upgrade.rank');
                        const rankButton = await this._waitForElement(document, `.tabs__item.tabs__navigate__rank[data-rank="${rank}"]`);
                        if (!rankButton.classList.contains('tabs__item--active')) {
                            GM_setValue('upgrade.step', 'searchForCharacter');
                            rankButton.click();
                        } else {
                            GM_setValue('upgrade.step', 'searchForCharacter');
                            window.location.reload(); // Already on correct rank, reload to trigger next step
                        }
                    } else if (step === 'searchForCharacter' && path.includes('/update_stars')) {
                        console.log('[Trade Helper] Step 4: Searching for character...');
                        const searchInput = await this._waitForElement(document, 'input.form__field[placeholder="Имя персонажа..."]');
                        searchInput.value = GM_getValue('upgrade.characterName');
                        GM_setValue('upgrade.step', 'findCardInList');
                        document.querySelector('.card-stars-form__search-btn').click();
                    } else if (step === 'findCardInList' && path.includes('/update_stars')) {
                        console.log('[Trade Helper] Step 5: Finding and upgrading card...');
                        const imageUrl = GM_getValue('upgrade.imageUrl');
                        const urlParts = imageUrl.split('/');
                        const uniqueImageFilename = urlParts[urlParts.length - 1];
                        if (!uniqueImageFilename) throw new Error('Не удалось извлечь имя файла из URL.');

                        const cardSelector = `.card-stars-list__items .card-stars-list__card img[src$="${uniqueImageFilename}"]`;
                        let cardImg = document.querySelector(cardSelector);

                        if (cardImg) {
                            cardImg.parentElement.click();
                            const infoDiv = await this._waitForTextInElement(document, '.card-level-up__info', 'потребуется', 15000);
                            const requiredMatch = infoDiv.textContent.match(/потребуется (\d+) дублей карт/);
                            if (!requiredMatch) throw new Error('Не удалось определить стоимость улучшения.');

                            const requiredCount = parseInt(requiredMatch[1], 10);
                            const actualDuplicates = GM_getValue('upgrade.totalCardCount', 0) - 1;
                            if (actualDuplicates < requiredCount) {
                                const needed = requiredCount - actualDuplicates;
                                throw new Error(`Не хватает дублей. Нужно еще ${needed} шт.`);
                            }

                            const startBtn = await this._waitForElement(document, '.card-level-up__start-btn');
                            startBtn.click();

                            const pushMessage = await this._waitForOneOfElements(document, ['.DLEPush-message', '.custom-card-notification'], 15000);
                            if (!pushMessage.textContent.toLowerCase().includes('успешно')) {
                                throw new Error(pushMessage.textContent);
                            }

                            if (GM_getValue('upgrade.wasFixed', false)) {
                                GM_setValue('upgrade.step', 'searchForAnime');
                                // Go back to re-fix
                                window.location.href = GM_getValue('upgrade.progressUrl');
                            } else {
                                GM_setValue('upgrade.status', 'SUCCESS');
                                this.clearWorkerState();
                                window.close();
                            }
                        } else {
                            const nextPageLink = document.querySelector('.pagination__pages-btn a');
                            if (nextPageLink) {
                                window.location.href = nextPageLink.href;
                            } else {
                                throw new Error('Карта для улучшения не найдена на страницах поиска.');
                            }
                        }
                    }

                } catch (e) {
                    console.error(`[Trade Helper] Ошибка на шаге ${step}:`, e);
                    GM_setValue('upgrade.status', e.message || 'Неизвестная ошибка');
                    if (GM_getValue('upgrade.wasFixed', false)) {
                        // Attempt to re-fix collection even on error
                        GM_setValue('upgrade.step', 'handleFix');
                        window.location.href = GM_getValue('upgrade.progressUrl');
                    } else {
                        this.clearWorkerState();
                        if (window.opener) window.close();
                    }
                }
            });
        }
    };
    const TradePreviewHelper = {
        PREVIEW_STORAGE_KEY: 'as_trade_preview_size',
        initialize: function() {
            this.addPreviewStyles();
            this.createSizeSlider();
            this.initTradePreview();
            const observer = new MutationObserver(() => {
                this.initTradePreview();
                if (!document.getElementById('size-control-container')) {
                    this.createSizeSlider();
                }
            });
            const targetNode = document.querySelector('body');
            if (targetNode) {
                observer.observe(targetNode, {
                    childList: true,
                    subtree: true
                });
            }
        },
        addPreviewStyles: function() { /* Стили уже добавлены в общий GM_addStyle */ },
        updateDynamicStyles: function(baseHeight) {
            const height = Number(baseHeight);
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty('--card-height', `${height}px`);
            rootStyle.setProperty('--card-border-radius', `${Math.round(height * 0.06)}px`);
            rootStyle.setProperty('--popup-padding', `${Math.round(height * 0.1)}px`);
            rootStyle.setProperty('--popup-gap', `${Math.round(height * 0.12)}px`);
            rootStyle.setProperty('--section-gap', `${Math.round(height * 0.08)}px`);
            rootStyle.setProperty('--separator-font-size', `${Math.round(height * 0.22)}px`);
        },
        setSliderVisibility: function() {
            const controlContainer = document.getElementById('size-control-container');
            if (controlContainer) {
                controlContainer.style.display = SCRIPT_STATE.isPreviewSliderVisible ?
                    'flex' : 'none';
            }
        },
        createSizeSlider: function() {
            const tradeContainer = document.querySelector('.trade');
            if (!tradeContainer || document.getElementById('size-control-container')) return;
            const controlContainer = document.createElement('div');
            controlContainer.id = 'size-control-container';
            const label = document.createElement('label');
            label.textContent = 'Размер превью:';
            label.htmlFor = 'size-slider';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'size-slider';
            slider.min = '80';
            slider.max = '250';
            slider.step = '1';
            slider.value = GM_getValue(this.PREVIEW_STORAGE_KEY, 110);
            slider.addEventListener('input', () => {
                const newSize = slider.value;
                this.updateDynamicStyles(newSize);
                GM_setValue(this.PREVIEW_STORAGE_KEY, newSize);
            });
            controlContainer.appendChild(label);
            controlContainer.appendChild(slider);
            tradeContainer.parentNode.insertBefore(controlContainer, tradeContainer);
            this.setSliderVisibility();
            slider.dispatchEvent(new Event('input', {
                bubbles: true
            }));
        },
        handleMouseEnter: function(e) {
            const tradeItem = e.currentTarget;
            const tradeUrl = tradeItem.href || tradeItem.querySelector('a')?.href;
            if (!tradeUrl) return;
            const cursorX = e.pageX;
            const cursorY = e.pageY;
            const popup = document.createElement('div');
            popup.id = 'trade-preview-popup';
            popup.innerHTML = '<span class="loading-text">Загрузка...</span>';
            document.body.appendChild(popup);
            popup.style.left = `${cursorX + 20}px`;
            popup.style.top = `${cursorY + 20}px`;
            popup.style.visibility = 'visible';
            GM_xmlhttpRequest({
                method: 'GET',
                url: tradeUrl,
                onload: (response) => {
                    const existingPopup = document.getElementById('trade-preview-popup');
                    if (!existingPopup) return;
                    const parser = new DOMParser();
                    const tradeDoc = parser.parseFromString(response.responseText, 'text/html');
                    const itemContainers = tradeDoc.querySelectorAll('.trade__main-items');
                    existingPopup.innerHTML = '';
                    if (itemContainers.length > 0) {
                        const offeredDiv = document.createElement('div');
                        offeredDiv.className = 'trade-preview-section';
                        const separatorSpan = document.createElement('span');
                        separatorSpan.className = 'trade-separator';
                        separatorSpan.textContent = '⇄';
                        const requestedDiv = document.createElement('div');
                        requestedDiv.className = 'trade-preview-section';
                        itemContainers[0].querySelectorAll('img').forEach(img => {
                            const i = document.createElement('img');
                            i.src = img.dataset.src || img.src;
                            offeredDiv.appendChild(i);
                        });
                        if (itemContainers.length > 1) {
                            itemContainers[1].querySelectorAll('img').forEach(img => {
                                const i = document.createElement('img');
                                i.src = img.dataset.src || img.src;
                                requestedDiv.appendChild(i);
                            });
                        }
                        if (offeredDiv.hasChildNodes()) existingPopup.appendChild(offeredDiv);
                        if (offeredDiv.hasChildNodes() && requestedDiv.hasChildNodes()) existingPopup.appendChild(separatorSpan);
                        if (requestedDiv.hasChildNodes()) existingPopup.appendChild(requestedDiv);
                        const popupWidth = existingPopup.offsetWidth;
                        const popupHeight = existingPopup.offsetHeight;
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        const margin = 20;
                        let newLeft = cursorX + margin;
                        let newTop = cursorY + margin;
                        if (newLeft + popupWidth > viewportWidth + window.scrollX) {
                            newLeft = cursorX - popupWidth - margin;
                        }
                        if (newLeft < window.scrollX) {
                            newLeft = window.scrollX + margin;
                        }
                        if (newTop + popupHeight > viewportHeight + window.scrollY) {
                            newTop = cursorY - popupHeight - margin;
                        }
                        if (newTop < window.scrollY) {
                            newTop = window.scrollY + margin;
                        }
                        existingPopup.style.left = `${newLeft}px`;
                        existingPopup.style.top = `${newTop}px`;
                        existingPopup.style.visibility = 'visible';
                    } else {
                        existingPopup.innerHTML = '<span class="loading-text">Не удалось найти карты</span>';
                    }
                },
                onerror: function() {
                    const existingPopup = document.getElementById('trade-preview-popup');
                    if (existingPopup) {
                        existingPopup.innerHTML = '<span class="loading-text">Ошибка сети</span>';
                    }
                }
            });
        },
        handleMouseLeave: function() {
            const popup = document.getElementById('trade-preview-popup');
            if (popup) {
                popup.remove();
            }
        },
        initTradePreview: function() {
            const tradeItems = document.querySelectorAll('.trade__list-item');
            tradeItems.forEach(item => {
                if (item.dataset.previewListenerAttached) return;
                item.dataset.previewListenerAttached = 'true';
                item.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                item.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            });
        }
    };
    const RankBasedTradeLinker = {
        run: function() {
            const path = window.location.pathname;
            // Блок 1: Сохраняем ранг и ID на основной странице карточки.
            if (path.includes('/cards/users/') && !path.includes('/need') && !path.includes('/trade')) {
                const rankElement = document.querySelector('.ncard__rank');
                if (rankElement) {
                    const rankClass = Array.from(rankElement.classList).find(cls => cls.startsWith('rank-'));
                    if (rankClass) {
                        const rank = rankClass.split('-')[1];
                        GM_setValue('AS_cardRank', rank);
                        console.log(`[Trade Helper] Ранг карточки '${rank.toUpperCase()}' был сохранен.`);
                    }
                }
                const mainCardImage = document.querySelector('.ncard__img img');
                if (mainCardImage) {
                    const cardId = TradeHelper.getCardIdFromImageUrl(mainCardImage.src);
                    if (cardId) {
                        GM_setValue('AS_tradeCardId', cardId);
                        // Сохраняем ID для авто-перехода
                        console.log(`[Trade Helper] ID целевой карты для обмена '${cardId}' был сохранен.`);
                    }
                }
            }

            // Блок 2: Модифицируем ссылки на странице /need (старый функционал)
            if (path.includes('/cards/users/need')) {
                const savedRank = GM_getValue('AS_cardRank', null);
                if (savedRank) {
                    console.log(`[Trade Helper] Применяется сохраненный ранг '${savedRank.toUpperCase()}'.`);
                    const userLinks = document.querySelectorAll('a.card-show__owner');
                    userLinks.forEach(link => {
                        const nicknameSpan = link.querySelector('span.card-show__owner-name');
                        if (nicknameSpan) {
                            const nickname = nicknameSpan.textContent.trim();
                            const newUrl = `${CURRENT_ORIGIN}/user/cards/?name=${nickname}&rank=${savedRank}&locked=0`;
                            link.href = newUrl;
                        }
                    });
                    console.log(`[Trade Helper] Все ссылки на пользователей (${userLinks.length} шт.) были обновлены.`);
                } else {
                    console.warn('[Trade Helper] Сохраненный ранг карточки не найден. Сначала откройте основную страницу карточки.');
                }
            }
        }
    };
    const AutoUpgradeHelper = {
        isAutoUpgrading: false,
        mainTimeoutId: null,
        countdownIntervalId: null,
        CLICK_INTERVAL: 180000, // 3 минуты в миллисекундах

        initialize: function() {
            if (document.querySelector('button.card-level-up__start-btn')) {
                const btn = createStyledButton(
                    'auto-upgrade-btn',
                    'Начать авто-улучшение',
                    ICONS.START_TRADE,
                    () => this.toggleAutoUpgrade()
                );
                this.updateButtonUI(btn);
            }
        },

        toggleAutoUpgrade: function() {
            this.isAutoUpgrading = !this.isAutoUpgrading;
            const btn = document.getElementById('auto-upgrade-btn');

            if (this.isAutoUpgrading) {
                this.startAutoUpgrade();
            } else {
                this.stopAutoUpgrade();
            }
            this.updateButtonUI(btn);
        },

        startAutoUpgrade: function() {
            console.log('[Trade Helper] Запуск автоматического улучшения...');
            this.performClickAndScheduleNext();
        },

        stopAutoUpgrade: function() {
            console.log('[Trade Helper] Остановка автоматического улучшения.');
            if (this.mainTimeoutId) clearTimeout(this.mainTimeoutId);
            if (this.countdownIntervalId) clearInterval(this.countdownIntervalId);
            this.mainTimeoutId = null;
            this.countdownIntervalId = null;
            UpgradeHelper.hideCurrentNotification('autoUpgradeCountdown');
        },

        performClickAndScheduleNext: function() {
            if (!this.isAutoUpgrading) return;
            const upgradeButton = document.querySelector('button.card-level-up__start-btn');
            if (upgradeButton) {
                upgradeButton.click();
                console.log('[Trade Helper] Нажата кнопка "Начать повышение".');
                UpgradeHelper.showTemporaryMessage('autoUpgradeClick', 'Карта улучшена!', true, 4000);

                this.showCountdownNotification();
                this.mainTimeoutId = setTimeout(() => this.performClickAndScheduleNext(), this.CLICK_INTERVAL);
            } else {
                console.warn('[Trade Helper] Кнопка улучшения не найдена. Остановка.');
                UpgradeHelper.showTemporaryMessage('autoUpgradeError', 'Кнопка улучшения не найдена. Процесс остановлен.', false, 5000);
                this.isAutoUpgrading = false;
                this.updateButtonUI(document.getElementById('auto-upgrade-btn'));
            }
        },

        showCountdownNotification: function() {
            if (this.countdownIntervalId) clearInterval(this.countdownIntervalId);
            let remainingTime = this.CLICK_INTERVAL;
            const notificationId = 'autoUpgradeCountdown';

            const updateTimer = () => {
                const minutes = Math.floor(remainingTime / 60000);
                const seconds = Math.floor((remainingTime % 60000) / 1000);
                const message = `Следующее нажатие через: ${minutes} мин ${seconds.toString().padStart(2, '0')} сек`;
                UpgradeHelper.displayNotification(notificationId, message, 'progress', {
                    sticky: true
                });
                remainingTime -= 1000;
                if (remainingTime < 0) {
                    clearInterval(this.countdownIntervalId);
                    UpgradeHelper.hideCurrentNotification(notificationId);
                }
            };

            updateTimer();
            this.countdownIntervalId = setInterval(updateTimer, 1000);
        },

        updateButtonUI: function(btn) {
            if (!btn) return;
            const img = btn.querySelector('img');
            if (this.isAutoUpgrading) {
                img.src = ICONS.CANCEL_TRADE;
                addTooltipRight(btn, 'Остановить авто-улучшение');
            } else {
                img.src = ICONS.START_TRADE;
                addTooltipRight(btn, 'Начать авто-улучшение');
            }
        }
    };
    // =================================================================================
    // SCRIPT ENTRY POINT & ROUTER
    // =================================================================================

    function main() {
        if (GM_getValue('stealth.tradeActive', false)) {
            sessionStorage.removeItem('stealthTradeScrollPos');
        }

        createMainPanel();
        if (isIframe) {
            TradeHelper.runWorker();
            UpgradeHelper.runWorker();
            return;
        }

        PackAnimationSkipper.initialize();
        const path = window.location.pathname;
        if (path.includes('/clubs/boost/')) {
            BoostHelper.initialize();
            NotificationHider.initialize();
            ClubInfoHelper.initialize();
        } else if (path.includes('/cards/') || path.includes('/user/cards')) {
            TradeHelper.initialize();
            ImageZoomHelper.initialize();
            UpgradeHelper.initialize();
            RankBasedTradeLinker.run();
            if (path.includes('/user/cards')) {
                PackButtonHelper.initialize();
            }
        } else if (path.includes('/trades')) {
            TradePreviewHelper.initialize();
            createStyledButton('toggle-slider-btn', 'Скрыть/показать ползунок', ICONS.TOGGLE_SLIDER, () => {
                SCRIPT_STATE.isPreviewSliderVisible = !SCRIPT_STATE.isPreviewSliderVisible;
                GM_setValue('isPreviewSliderVisible', SCRIPT_STATE.isPreviewSliderVisible);
                TradePreviewHelper.setSliderVisibility();
            });
        } else if (path.includes('/update_stars/')) {
            AutoUpgradeHelper.initialize();
        } else if (path.includes('/cards_remelt/')) {
            GM_addStyle(`.ui-dialog:has(.anime-cards__placeholder) { display: none !important; }`);
            NotificationHider.initialize();
            RemeltHelper.initialize();
        }

        TradeHelper.runWorker();
        UpgradeHelper.runWorker();
    }

    main();

})();