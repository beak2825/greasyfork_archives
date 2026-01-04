// ==UserScript==
// @name         AssTars Card Pack Protector
// @namespace    asstars.tv
// @version      1.0
// @description  Защищает от случайного выбора не самой редкой карты при открытии паков.
// @author       Dread
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547673/AssTars%20Card%20Pack%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/547673/AssTars%20Card%20Pack%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // БЛОК ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ И НАСТРОЕК
    // =========================================================================
    const PROTECTOR_SETTINGS_KEY = 'cardPackProtectorSettings_v3';
    const PROTECTOR_RANK_HIERARCHY = { 'ass': 7, 's': 6, 'a': 5, 'b': 4, 'c': 3, 'd': 2, 'e': 1 };
    const PROTECTOR_PROTECTABLE_RANKS = ['ass', 's', 'a', 'b', 'c', 'd'];
    const PROTECTOR_DEFAULT_SETTINGS = { ass: true, s: true, a: false, b: false, c: false, d: false };

    // =========================================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =========================================================================

    /**
     * Проверяет, является ли текущая страница страницей открытия паков.
     * @returns {boolean}
     */
    function isCardPackPage() {
        return window.location.pathname === '/cards/pack/';
    }

    /**
     * Загружает настройки защиты из хранилища Greasemonkey.
     * @returns {object}
     */
    function loadSettings() {
        return { ...PROTECTOR_DEFAULT_SETTINGS, ...GM_getValue(PROTECTOR_SETTINGS_KEY, {}) };
    }

    /**
     * Сохраняет настройки защиты в хранилище Greasemonkey.
     * @param {object} settings
     */
    function saveSettings(settings) {
        GM_setValue(PROTECTOR_SETTINGS_KEY, settings);
    }

    // =========================================================================
    // ФУНКЦИИ КАСТОМНОГО ИНТЕРФЕЙСА (UI)
    // =========================================================================

    /**
     * Создает и отображает кастомное модальное окно подтверждения (аналог `confirm`).
     * @param {string} message - Сообщение для пользователя (может содержать HTML).
     * @returns {Promise<boolean>} - Promise, который разрешается в true (если "Да") или false (если "Нет"/закрыто).
     */
    function protector_customConfirm(message) {
        return new Promise(resolve => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="protector_backdrop"></div>
                <div class="protector_modal" id="protector_confirm_modal">
                    <div class="modal-header"><h2>Подтверждение</h2></div>
                    <div class="modal-body"><p>${message}</p></div>
                    <div class="modal-footer">
                        <button class="action-btn protector_confirm_no">Нет</button>
                        <button class="action-btn save-btn protector_confirm_yes">Да, выбрать</button>
                    </div>
                </div>`;
            document.body.appendChild(wrapper);

            const cleanup = () => document.body.removeChild(wrapper);
            wrapper.querySelector('.protector_confirm_yes').onclick = () => { cleanup(); resolve(true); };
            wrapper.querySelector('.protector_confirm_no').onclick = () => { cleanup(); resolve(false); };
            wrapper.querySelector('.protector_backdrop').onclick = () => { cleanup(); resolve(false); };
        });
    }

    /**
     * Создает и отображает кастомное модальное окно уведомления (аналог `alert`).
     * @param {string} message - Сообщение для пользователя.
     * @returns {Promise<void>}
     */
    function protector_customAlert(message) {
        return new Promise(resolve => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="protector_backdrop"></div>
                <div class="protector_modal" id="protector_alert_modal">
                    <div class="alert-body"><p>${message}</p></div>
                    <div class="alert-footer"><button id="protector_alert_ok_btn">OK</button></div>
                </div>`;
            document.body.appendChild(wrapper);
            const closeAndCallback = () => { document.body.removeChild(wrapper); resolve(); };
            wrapper.querySelector('#protector_alert_ok_btn').onclick = closeAndCallback;
            wrapper.querySelector('.protector_backdrop').onclick = closeAndCallback;
        });
    }

    /**
     * Создает HTML-структуру для модального окна настроек защиты.
     */
    function createSettingsModal() {
        const wrapper = document.createElement('div');
        wrapper.id = 'protector_settings_modal_wrapper';
        wrapper.style.display = 'none';
        wrapper.innerHTML = `
            <div class="protector_backdrop"></div>
            <div class="protector_modal" id="protector_settings_modal">
                <div class="modal-header">
                    <h2>Настройки защиты карт</h2>
                    <button class="close-btn protector_close_modal">×</button>
                </div>
                <div class="modal-body">
                    <div id="protector_settings_list"></div>
                </div>
                <div class="modal-footer">
                    <button class="action-btn save-btn protector_save_settings">Сохранить</button>
                </div>
            </div>`;
        document.body.appendChild(wrapper);

        const settingsList = wrapper.querySelector('#protector_settings_list');
        PROTECTOR_PROTECTABLE_RANKS.forEach(rank => {
            settingsList.innerHTML += `
                <div class="setting-row">
                    <span>Предупреждать для ранга <b>${rank.toUpperCase()}</b></span>
                    <label class="protector-toggle-switch">
                        <input type="checkbox" data-rank="${rank}">
                        <span class="protector-toggle-slider"></span>
                    </label>
                </div>`;
        });

        const closeModal = () => { wrapper.style.display = 'none'; };
        wrapper.querySelector('.protector_close_modal').onclick = closeModal;
        wrapper.querySelector('.protector_backdrop').onclick = closeModal;
        wrapper.querySelector('.protector_save_settings').onclick = () => {
            const newSettings = {};
            wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                newSettings[cb.dataset.rank] = cb.checked;
            });
            saveSettings(newSettings);
            closeModal();
            protector_customAlert('Настройки защиты карт успешно сохранены!');
        };
    }

    /**
     * Открывает модальное окно настроек защиты и заполняет его текущими значениями.
     */
    function openSettingsModal() {
        const wrapper = document.getElementById('protector_settings_modal_wrapper');
        if (!wrapper) {
            console.error("Модальное окно настроек не найдено!");
            return;
        }
        const settings = loadSettings();
        wrapper.querySelectorAll('#protector_settings_list input[type="checkbox"]').forEach(cb => {
            cb.checked = settings[cb.dataset.rank] === true;
        });
        wrapper.style.display = 'block';
    }

    /**
     * Добавляет CSS-стили для всех UI-элементов модуля защиты.
     */
    function addGlobalStyles() {
        GM_addStyle(`
            /* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ ОКОН --- */
            .protector_backdrop {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.75);
                z-index: 999998;
            }
            .protector_modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 400px; max-width: 90%; background: #1e1f22; color: #b0b0b0;
                border-radius: 6px; border: 1px solid #4a2f3a;
                box-shadow: 0 0 15px rgba(180, 40, 70, 0.25), 0 0 5px rgba(180, 40, 70, 0.15);
                font-family: Arial, sans-serif; display: flex; flex-direction: column;
                z-index: 999999;
            }
            .protector_modal .modal-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 10px 15px; border-bottom: 1px solid #33353a;
            }
            .protector_modal .modal-header h2 { margin: 0; font-size: 1em; font-weight: 500; color: #d4506a; }
            .protector_modal .close-btn { background: transparent; border: none; font-size: 22px; color: #888; cursor: pointer; transition: color 0.2s; }
            .protector_modal .close-btn:hover { color: #fff; }
            .protector_modal .modal-body { padding: 15px; background-color: #27292d; max-height: 70vh; overflow-y: auto;}
            .protector_modal .modal-footer {
                display: flex; justify-content: flex-end; align-items: center; gap: 10px;
                padding: 10px 15px; border-top: 1px solid #33353a;
            }
            .protector_modal .action-btn {
                color: #dadada; background-color: #c83a54; border: none; padding: 8px 15px;
                border-radius: 3px; cursor: pointer; font-weight: normal; font-size: 0.9em;
                transition: background-color 0.2s;
            }
            .protector_modal .action-btn:hover { background-color: #b02c44; }
            .protector_modal .action-btn.save-btn { background-color: #43b581; }
            .protector_modal .action-btn.save-btn:hover { background-color: #3aa070; }

            /* --- СТИЛИ ДЛЯ ОКНА НАСТРОЕК --- */
            #protector_settings_list { display: flex; flex-direction: column; gap: 12px; }
            #protector_settings_list .setting-row { display: flex; justify-content: space-between; align-items: center; }
            #protector_settings_list span { color: #ccc; }
            .protector-toggle-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
            .protector-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .protector-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #424549; transition: .3s; border-radius: 20px; }
            .protector-toggle-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .protector-toggle-slider { background-color: #43b581; }
            input:checked + .protector-toggle-slider:before { transform: translateX(18px); }

            /* --- СТИЛИ ДЛЯ ОКНА ПОДТВЕРЖДЕНИЯ --- */
            #protector_confirm_modal .modal-body p { margin: 0; line-height: 1.5; font-size: 1em; text-align: center; color: #e0e0e0; }

            /* --- СТИЛИ ДЛЯ ОКНА УВЕДОМЛЕНИЯ --- */
            #protector_alert_modal { text-align: center; padding: 20px; }
            #protector_alert_modal .alert-body p { margin: 0; line-height: 1.5; font-size: 1em; color: #e0e0e0; }
            #protector_alert_modal .alert-footer { margin-top: 20px; display: flex; justify-content: center; }
            #protector_alert_ok_btn { color: #fff; background-color: #5865f2; border: none; padding: 10px 35px; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 0.9em; transition: background-color 0.2s; }
            #protector_alert_ok_btn:hover { background-color: #4752c4; }
        `);
    }

    // =========================================================================
    // ОСНОВНАЯ ЛОГИКА И ИНИЦИАЛИЗАЦИЯ
    // =========================================================================

    /**
     * Основная логика: перехватывает клик по карте в паке, проверяет ранги
     * и запрашивает подтверждение, если необходимо.
     * @param {MouseEvent} event
     */
    async function handleCardClick(event) {
        // Игнорируем клики по кнопкам других скриптов на карте
        if (event.target.closest('.check-demand-btn, .check-duplicates-btn')) {
            return;
        }

        const clickedCard = event.target.closest('.lootbox__card');
        // Если клик не по карте или это подтвержденный повторный клик, выходим
        if (!clickedCard || clickedCard.dataset.confirmedClick === 'true') {
            if (clickedCard) delete clickedCard.dataset.confirmedClick;
            return;
        }

        // Предотвращаем стандартное действие (выбор карты)
        event.preventDefault();
        event.stopPropagation();

        const cardContainer = clickedCard.closest('.lootbox__list');
        if (!cardContainer) return;

        const allCards = cardContainer.querySelectorAll('.lootbox__card');
        let highestRankValue = 0;
        let highestRankName = '';

        // Находим самый высокий ранг среди всех карт в паке
        allCards.forEach(card => {
            const rank = card.dataset.rank;
            const rankValue = PROTECTOR_RANK_HIERARCHY[rank] || 0;
            if (rankValue > highestRankValue) {
                highestRankValue = rankValue;
                highestRankName = rank;
            }
        });

        const clickedRank = clickedCard.dataset.rank;
        const clickedRankValue = PROTECTOR_RANK_HIERARCHY[clickedRank] || 0;
        const settings = loadSettings();
        const isProtectionEnabledForThisRank = settings[highestRankName.toLowerCase()];

        // Если защита для самого высокого ранга в паке включена,
        // и пользователь кликнул на карту более низкого ранга
        if (isProtectionEnabledForThisRank && clickedRankValue < highestRankValue) {
            const message = `В паке есть карта ранга <b>${highestRankName.toUpperCase()}</b>.<br>Вы уверены, что хотите выбрать карту ранга <b>${clickedRank.toUpperCase()}</b>?`;
            const confirmation = await protector_customConfirm(message);
            if (confirmation) {
                clickedCard.dataset.confirmedClick = 'true';
                clickedCard.click(); // Симулируем оригинальный клик
            }
        } else {
            // Если условия не совпали, просто выполняем оригинальный клик
            clickedCard.dataset.confirmedClick = 'true';
            clickedCard.click();
        }
    }

    /**
     * Инициализирует модуль защиты карт.
     */
    function init() {
        addGlobalStyles();
        createSettingsModal();
        GM_registerMenuCommand("Настройки защиты карт (паки)", openSettingsModal);

        // Скрипт активен только на странице паков
        if (!isCardPackPage()) {
            return;
        }

        document.body.addEventListener('click', handleCardClick, true);
        console.log('[Card Protector] Скрипт защиты выбора карт успешно запущен!');
    }

    // Запускаем инициализацию
    init();

})();