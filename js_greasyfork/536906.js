// ==UserScript==
// @name         Тёмное компактное игровое поле
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Компактный интерфейс в тёмной теме + тёмная тема в разделе Фракций и настройки способностей
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        https://patron.kinwoods.com/game
// @match        *://*.kinwoods.com/abilities*
// @match        *://*.kinwoods.com/faction*
// @grant        GM_addStyle
// @license      CC BY-NC-ND 4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536906/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%BE%D0%B5%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/536906/%D0%A2%D1%91%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D0%BE%D0%B5%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        leftWidth: '700px',
        chatHeight: '440px',
        chatInputHeight: '70px',
        actionsHeight: '100px',
        parametersHeight: '120px',
        skillsHeight: '120px',
        gapBetween: '5px',
        panelPadding: '5px',
        actionsHorizontal: true,
        actionsLeftOffset: '100px',
        chatWidth: 'calc(100% - 0px)',
        basicAttackSize: '35px',
        basicAttackIconSize: '20px',
        panelPositions: {
            'chat': 0,
            'actions': 250,
            'parameters': 365,
            'skills': 465,
            'items': 600
        },
        buttonSize: '80px',
        iconSize: '70px',
        colors: {
            background: '#121212',
            panelBackground: '#252525',
            panelBorder: '#444',
            buttonHover: '#333',
            textColor: '#e0e0e0',
            accentColor: '#64b5f6',
            healthBar: '#4CAF50',
            skillBar: '#FFC107',
            skillBarBg: '#9a8b79',
            chatBackground: '#1e1e1e',
            tooltipBackground: '#252525',
            inventoryBackground: 'transparent',
            chatInputBorder: '#555',
            systemMessageText: '#ff6b6b',
            playerMessageText: '#e0e0e0',
            selectionBorder: '#64b5f6',
            selectionShadow: '0 0 8px rgba(100, 181, 246, 0.5)',
            chatModeActive: '#64b5f6',
            chatModeBorder: '2px solid #64b5f6',
            chatModeShadow: '0 0 8px rgba(100, 181, 246, 0.5)'
        }
    };

    // Применяем тёмную тему сразу при загрузке
    GM_addStyle(`

 /* Стили для вкладок "Все", "Мир", "Бой" */
    .tabs.svelte-1jnojkb {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
        border-radius: 6px !important;
        padding: 4px !important;
    }

    .tabs button.svelte-1jnojkb {
        background-color: ${CONFIG.colors.panelBackground} !important;
        color: ${CONFIG.colors.textColor} !important;
        border: none !important;
        border-radius: 4px !important;
        padding: 6px 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
    }

    .tabs button.svelte-1jnojkb:hover {
        background-color: ${CONFIG.colors.buttonHover} !important;
    }

    .tabs button.current-tab.svelte-1jnojkb {
        background-color: ${CONFIG.colors.panelBackground} !important;
        color: ${CONFIG.colors.accentColor} !important;
        font-weight: bold !important;
        border: 2px solid ${CONFIG.colors.accentColor} !important;
        box-shadow: ${CONFIG.colors.selectionShadow} !important;
    }

    .tabs button.current-tab.svelte-1jnojkb p {
        color: ${CONFIG.colors.accentColor} !important;
    }

 /* Основные стили для страницы способностей */
    .abilities.svelte-dr867d {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
        color: ${CONFIG.colors.textColor} !important;
    }

    /* Заголовок "Мои способности" */
    #app > p {
        color: ${CONFIG.colors.textColor} !important;
    }

    /* Контейнер с настройками */
    .abs-equip.svelte-1jnojkb {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
        color: ${CONFIG.colors.textColor} !important;
    }

    /* Заголовки разделов */
    .abs-equip p strong,
    .master-info {
        color: ${CONFIG.colors.textColor} !important;
    }

    /* Вкладки */
    .tabs.svelte-1jnojkb {
        background-color: #333 !important;
        border-radius: 6px !important;
    }

    .tabs button.svelte-1jnojkb {
        color: ${CONFIG.colors.textColor} !important;
    }

    .tabs button.current-tab.svelte-1jnojkb {
        background-color: #444 !important;
        color: #fff !important;
    }

    /* Слоты способностей */
    .abils-list {
        background-color: ${CONFIG.colors.panelBackground} !important;
    }

    .slot.svelte-o9jkce {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
    }

    .slot.master.svelte-o9jkce {
        background-color: #2a2a2a !important;
        border: 1px dashed #555 !important;
    }

    /* Кнопка сохранения */
    .save-button.svelte-1jnojkb {
        background-color: #2e7d32 !important;
        color: white !important;
    }

    /* Список всех способностей */
    .abils-grid.svelte-1jnojkb {
        background-color: ${CONFIG.colors.background} !important;
    }

    /* Тултипы способностей */
    .cell-tooltip.svelte-1my6515 {
        background-color: ${CONFIG.colors.tooltipBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
    }

    .abil-title.svelte-lyyv8m,
    .abil-progress-info,
    .abil-baseD.svelte-lyyv8m,
    .master-title.svelte-lyyv8m,
    .abil-masterD.svelte-lyyv8m {
        color: ${CONFIG.colors.textColor} !important;
    }

    /* Полоски прогресса */
    .bar.svelte-1dlaans {
        background-color: ${CONFIG.colors.skillBarBg} !important;
    }

    .bar-progress.svelte-1dlaans {
        background-color: ${CONFIG.colors.skillBar} !important;
    }

    /* Бургер-меню */
    .burger-content.svelte-1c8ivlm {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
    }

    .burger-link.svelte-1c8ivlm {
        color: ${CONFIG.colors.textColor} !important;
    }

 /* Стили для новой инфолинии */
    .infoline.svelte-1rta3dd {
        background-color: ${CONFIG.colors.panelBackground} !important;
        color: ${CONFIG.colors.textColor} !important;
    }

    .world-info.svelte-1rta3dd {
        color: ${CONFIG.colors.textColor} !important;
    }

    #loc-name.svelte-1rta3dd {
        color: ${CONFIG.colors.textColor} !important;
    }

    .time.svelte-1rta3dd {
        filter: invert(1) brightness(1.5) !important;
    }

    .flag.svelte-1rta3dd {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
    }

    /* Стили для новых тултипов */
    .cell-tooltip.svelte-1dfm7bg {
        background-color: ${CONFIG.colors.tooltipBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
        color: ${CONFIG.colors.textColor} !important;
    }

    .clan-exile.svelte-ci4r28,
    .clan-keeper.svelte-ci4r28,
    .clan-bots.svelte-ci4r28,
    .clan-neutral.svelte-ci4r28 {
        background-color: ${CONFIG.colors.tooltipBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
        color: ${CONFIG.colors.textColor} !important;
    }

    .char-name.svelte-ci4r28,
    .position.svelte-ci4r28 p,
    .subPosition.svelte-ci4r28 i {
        color: ${CONFIG.colors.textColor} !important;
    }

    .char-name a.svelte-ci4r28 {
        color: ${CONFIG.colors.accentColor} !important;
    }

    .cat-tooltip-items.svelte-ci4r28 {
        background-color: transparent !important;
    }

    .cat-tooltip-item.svelte-ci4r28 {
        background-color: ${CONFIG.colors.panelBackground} !important;
        border: 1px solid ${CONFIG.colors.panelBorder} !important;
    }

    .online-indicator.svelte-ci4r28 {
        border-color: ${CONFIG.colors.panelBorder} !important;
    }

/* Основные настройки */
        body {
            background-color: ${CONFIG.colors.background} !important;
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Левый блок */
        .game-left {
            background-color: ${CONFIG.colors.background} !important;
            border-right: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* Правый блок */
        .game-right {
            background-color: ${CONFIG.colors.background} !important;
            border-left: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* Панели */
        .parameters.desktop,
        .skills-desktop,
        .actions-desktop {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Панель инвентаря - прозрачная */
        .items-panel {
            background-color: ${CONFIG.colors.inventoryBackground} !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* Полоски параметров */
        .bar.svelte-1dlaans {
            background-color: ${CONFIG.colors.skillBarBg} !important;
        }
        .bar-progress.svelte-1dlaans {
            background-color: ${CONFIG.colors.healthBar} !important;
        }
        .bar-number.svelte-1dlaans {
            color: white !important;
        }

        /* Полоски навыков */
        .skill .bar.svelte-1dlaans {
            background-color: ${CONFIG.colors.skillBarBg} !important;
        }
        .skill .bar-progress.svelte-1dlaans {
            background-color: ${CONFIG.colors.skillBar} !important;
        }

        /* Кнопки действий */
        .action.svelte-5ea9xh {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            border-radius: 4px !important;
        }
        .action.svelte-5ea9xh:hover {
            background-color: ${CONFIG.colors.buttonHover} !important;
        }

        /* Чат */
        #gamechat {
            background-color: ${CONFIG.colors.chatBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* Сообщения чата */
        #gamechat-messages {
            background-color: ${CONFIG.colors.chatBackground} !important;
        }

        /* Сообщения игроков */
        .mess-container.svelte-9fmcrh {
            background-color: transparent !important;
            color: ${CONFIG.colors.playerMessageText} !important;
            padding: 4px 0 !important;
            margin: 2px 0 !important;
            border: none !important;
        }

        /* Системные сообщения */
        .mess-container.svelte-9fmcrh.info {
            background-color: transparent !important;
            color: ${CONFIG.colors.systemMessageText} !important;
            border: none !important;
            padding: 4px 0 !important;
            margin: 2px 0 !important;
        }

        /* Имена отправителей */
        .senderName.svelte-9fmcrh {
            color: ${CONFIG.colors.accentColor} !important;
        }

        /* Поле ввода чата */
        #gamechat-input textarea.svelte-9fmcrh {
            background-color: ${CONFIG.colors.panelBackground} !important;
            color: ${CONFIG.colors.textColor} !important;
            border: 1px solid ${CONFIG.colors.chatInputBorder} !important;
        }

        /* Кнопки чата */
        #gamechat-input button.svelte-9fmcrh {
            background-color: ${CONFIG.colors.panelBackground} !important;
            color: ${CONFIG.colors.textColor} !important;
            border: 1px solid ${CONFIG.colors.chatInputBorder} !important;
        }

        /* Режимы чата */
        #gamechat-input button.svelte-9fmcrh {
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
            background-color: ${CONFIG.colors.panelBackground} !important;
        }

        #gamechat-input button.mode-active.svelte-9fmcrh {
            border: ${CONFIG.colors.chatModeBorder} !important;
            box-shadow: ${CONFIG.colors.chatModeShadow} !important;
            background-color: ${CONFIG.colors.chatModeActive} !important;
            color: white !important;
            font-weight: bold !important;
        }

        #gamechat-input button.svelte-9fmcrh:hover {
            background-color: ${CONFIG.colors.buttonHover} !important;
        }

        /* Инфолиния */
        .infoline.svelte-1yiowxi {
            background-color: ${CONFIG.colors.panelBackground} !important;
        }

        /* Иконка времени */
        .time.svelte-1yiowxi {
            filter: invert(1) brightness(1.5) !important;
        }

        /* Инвентарь */
        .slot-item.svelte-1bra3p7 {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }
        .slot-item.svelte-1bra3p7.selected {
            border: 2px solid ${CONFIG.colors.accentColor} !important;
            box-shadow: ${CONFIG.colors.selectionShadow} !important;
        }

        /* Подсказки (тултипы) */
        .cell-tooltip.svelte-1my6515,
        .cell-tooltip.svelte-1dfm7bg {
            background-color: ${CONFIG.colors.tooltipBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Текст в тултипах */
        .cell-tooltip p,
        .cell-tooltip .char-name,
        .cell-tooltip .position {
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Ссылки в тултипах */
        .cell-tooltip a {
            color: ${CONFIG.colors.accentColor} !important;
        }

        /* Способности */
        .abilities.svelte-96sseb {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }
        .slot.svelte-o9jkce {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* Текст перемещения */
        .cell-move-name.svelte-1trbnwi {
            color: white !important;
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* Ссылки */
        a {
            color: ${CONFIG.colors.accentColor} !important;
        }

        /* Гарантия тёмного текста */
        p, div, span {
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Фон действий */
        .actions.svelte-nqamr4 {
            background-color: ${CONFIG.colors.panelBackground} !important;
        }

        /* Контейнер предметов инвентаря */
        .cell-items.svelte-bphnd8,
        .bag-items.svelte-bphnd8,
        .my-items.svelte-bphnd8 {
            background-color: transparent !important;
        }

        /* СТИЛИ ДЛЯ ТУЛТИПОВ ПЕРСОНАЖЕЙ */
        .clan-keeper.svelte-1q3ck26,
        .clan-exile.svelte-1q3ck26,
        .clan-wanderer.svelte-ci4r28,
        .clan-bots.svelte-1q3ck26,
        .clan-neutral.svelte-1q3ck26,
        .clan-any-other-faction.svelte-1q3ck26 {
            background-color: ${CONFIG.colors.tooltipBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            color: ${CONFIG.colors.textColor} !important;
        }

        /* Общие стили для всех фракций */
        .char-name.svelte-1q3ck26,
        .position.svelte-1q3ck26 p,
        .subPosition.svelte-1q3ck26 i {
            color: ${CONFIG.colors.textColor} !important;
        }

        .char-name a.svelte-1q3ck26 {
            color: ${CONFIG.colors.accentColor} !important;
        }

        .cat-tooltip-items.svelte-1q3ck26 {
            background-color: transparent !important;
        }

        .subPosition.svelte-1q3ck26 i {
            color: #bbb !important;
        }

        .cat-tooltip-item.svelte-1q3ck26 {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
        }

        /* СТИЛИ ДЛЯ БАЗОВОЙ АТАКИ */
        .basic-attack.svelte-18h74nq {
            width: ${CONFIG.basicAttackSize} !important;
            height: ${CONFIG.basicAttackSize} !important;
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .basic-attack.svelte-18h74nq:hover {
            background-color: ${CONFIG.colors.buttonHover} !important;
        }

        .basic-attack.svelte-18h74nq img {
            width: ${CONFIG.basicAttackIconSize} !important;
            height: ${CONFIG.basicAttackIconSize} !important;
            filter: brightness(0.9) !important;
        }

        /* ВЫДЕЛЕНИЕ ВЫБРАННОЙ АТАКИ/СПОСОБНОСТИ */
        .slot.svelte-o9jkce.selected,
        .basic-attack.svelte-18h74nq.selected {
            border: 2px solid ${CONFIG.colors.selectionBorder} !important;
            box-shadow: ${CONFIG.colors.selectionShadow} !important;
        }

        .abils-list .slot.svelte-o9jkce {
            transition: all 0.2s ease !important;
        }

        .abils-list .slot.svelte-o9jkce.selected {
            transform: scale(1.05);
        }

        /* СТИЛИ ДЛЯ СТРАНИЦЫ СПОСОБНОСТЕЙ */
        .abs-equip.svelte-ykbs1w {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            border-radius: 8px !important;
            padding: 12px !important;
            color: ${CONFIG.colors.textColor} !important;
        }

        .abs-equip p.svelte-ykbs1w {
            margin: 8px 0 !important;
            font-size: 15px !important;
            color: #f0f0f0 !important;
        }

        .slot.svelte-o9jkce {
            background-color: ${CONFIG.colors.panelBackground} !important;
            border: 1px solid ${CONFIG.colors.panelBorder} !important;
            border-radius: 6px !important;
            transition: all 0.2s ease !important;
        }

        .slot.master.svelte-o9jkce {
            background-color: #2a2a2a !important;
            border: 1px dashed #555 !important;
        }

        .slot.svelte-o9jkce:hover {
            background-color: #3a3a3a !important;
            transform: translateY(-2px);
        }

        .save-button.svelte-ykbs1w {
            background-color: #2e7d32 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            margin-top: 12px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .save-button.svelte-ykbs1w:hover {
            background-color: #388e3c !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .abils-list.svelte-ykbs1w {
            padding: 6px;
            background-color: #2a2a2a !important;
            border-radius: 6px;
            margin-bottom: 10px;
        }

        .tabs.svelte-ykbs1w {
            background-color: #333 !important;
            border-radius: 6px !important;
            padding: 4px !important;
            display: inline-flex !important;
        }

        .tabs button.svelte-ykbs1w {
            background: none !important;
            border: none !important;
            color: #e0e0e0 !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            border-radius: 4px !important;
        }

        .tabs button.current-tab.svelte-ykbs1w {
            background-color: #444 !important;
            color: #fff !important;
            font-weight: bold !important;
        }

        .tabs button.svelte-ykbs1w:not(.current-tab):hover {
            background-color: #3a3a3a !important;
            color: #f0f0f0 !important;
        }

        /* СТИЛИ ДЛЯ СТРАНИЦЫ ФРАКЦИИ */
        table.svelte-1bwa4vs {
            background-color: #424242 !important;
            color: white !important;
        }

        tr.score.title.svelte-1bwa4vs {
            background-color: #555 !important;
            color: white !important;
        }

        tr.score.svelte-1bwa4vs {
            background-color: #424242 !important;
            color: white !important;
        }

        tr.score.svelte-1bwa4vs:nth-child(even) {
            background-color: #3a3a3a !important;
        }

        td.svelte-1bwa4vs {
            border-color: #555 !important;
        }

        td.score_place.svelte-1bwa4vs {
            color: #bbb !important;
        }

        td.score_char.svelte-1bwa4vs {
            color: white !important;
        }

        td.score_pos.svelte-1bwa4vs {
            color: #ddd !important;
        }

        td.score_points.svelte-1bwa4vs {
            color: white !important;
        }

        .top_menu.flex-row.gap3 {
            gap: 6px !important;
            padding: 4px !important;
        }

        .top_menu button.svelte-6fpv34 {
            background-color: #424242 !important;
            color: #f0f0f0 !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            margin: 2px !important;
        }

        .top_menu button.active_top.svelte-6fpv34 {
            background-color: #555 !important;
            padding: 6px 12px !important;
        }
    `);

    window.addEventListener('load', function() {
        setTimeout(function() {
            createCompactLayout();
            fixActionButtons();
            applyAdditionalDarkStyles();
            fixInventoryBackground();
            fixChatMessages();
            fixBasicAttackButton();
            addSelectionHandlers();
        }, 2000);
    });

    function fixBasicAttackButton() {
        const basicAttackBtn = document.querySelector('.basic-attack.svelte-18h74nq');
        if (basicAttackBtn) {
            basicAttackBtn.style.pointerEvents = 'auto';
            basicAttackBtn.style.cursor = 'pointer';

            // Добавляем компактные стили непосредственно к элементу
            basicAttackBtn.style.width = CONFIG.basicAttackSize;
            basicAttackBtn.style.height = CONFIG.basicAttackSize;

            const img = basicAttackBtn.querySelector('img');
            if (img) {
                img.style.width = CONFIG.basicAttackIconSize;
                img.style.height = CONFIG.basicAttackIconSize;
            }
        }
    }

    function addSelectionHandlers() {
        // Обработчики для выбора способностей
        document.querySelectorAll('.slot.svelte-o9jkce').forEach(slot => {
            slot.addEventListener('click', function() {
                document.querySelectorAll('.slot.svelte-o9jkce.selected, .basic-attack.svelte-18h74nq.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Обработчик для базовой атаки
        const basicAttackBtn = document.querySelector('.basic-attack.svelte-18h74nq');
        if (basicAttackBtn) {
            basicAttackBtn.addEventListener('click', function() {
                document.querySelectorAll('.slot.svelte-o9jkce.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        }
    }

    function applyAdditionalDarkStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Эффекты */
            .effects_wrap.svelte-49171s {
                background-color: transparent !important;
            }

            /* Панель таймера */
            .panel.svelte-1t5p5a7 {
                background-color: ${CONFIG.colors.panelBackground} !important;
                border: 1px solid ${CONFIG.colors.panelBorder} !important;
            }

            /* Кнопка отмены */
            .timer-cancel.svelte-1t5p5a7 {
                background-color: ${CONFIG.colors.panelBackground} !important;
                border: 1px solid ${CONFIG.colors.panelBorder} !important;
                color: ${CONFIG.colors.textColor} !important;
            }

            /* Иконки параметров */
            .parameter-icon.icon-view.svelte-v5xjc1,
            .action-img.svelte-5ea9xh {
                filter: none !important;
            }

            /* Заголовки инвентаря */
            .items-panel p.svelte-bphnd8 {
                color: ${CONFIG.colors.textColor} !important;
                background-color: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }

    function fixInventoryBackground() {
        const inventoryPanels = document.querySelectorAll('.cell-items, .bag-items, .my-items');
        inventoryPanels.forEach(panel => {
            panel.style.backgroundColor = 'transparent';
        });
    }

    function fixChatMessages() {
        const style = document.createElement('style');
        style.textContent = `
            /* Жирный текст в сообщениях */
            .mess.svelte-9fmcrh strong {
                color: ${CONFIG.colors.textColor} !important;
            }
        `;
        document.head.appendChild(style);
    }

    function fixActionButtons() {
        const actionsContainer = document.querySelector('.actions-buttons.svelte-nqamr4');
        if (actionsContainer) {
            actionsContainer.style.cssText = `
                display: flex !important;
                flex-direction: row !important;
                justify-content: center !important;
                align-items: center !important;
                height: ${CONFIG.actionsHeight} !important;
                gap: 0px !important;
                padding: 5px !important;
                position: relative !important;
                z-index: 100 !important;
                background-color: ${CONFIG.colors.panelBackground} !important;
            `;
        }

        document.querySelectorAll('.action.svelte-5ea9xh').forEach(button => {
            button.style.cssText = `
                width: ${CONFIG.buttonSize} !important;
                height: ${CONFIG.buttonSize} !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                background: none !important;
                cursor: pointer !important;
                position: relative !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                z-index: 100 !important;
            `;

            const img = button.querySelector('.action-img.svelte-5ea9xh');
            if (img) {
                img.style.cssText = `
                    width: ${CONFIG.iconSize} !important;
                    height: ${CONFIG.iconSize} !important;
                    display: block !important;
                    margin: 0 !important;
                    transition: transform 0.2s ease !important;
                    pointer-events: none !important;
                `;

                button.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.1)';
                });
                button.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }

            const tooltip = button.closest('.tooltip-anchor.svelte-1my6515');
            if (tooltip) {
                tooltip.style.cssText = `
                    position: relative !important;
                    width: ${CONFIG.buttonSize} !important;
                    height: ${CONFIG.buttonSize} !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    z-index: 1 !important;
                `;

                const tooltipPanel = tooltip.querySelector('.cell-tooltip.svelte-1my6515');
                if (tooltipPanel) {
                    tooltipPanel.style.cssText = `
                        position: absolute !important;
                        top: 100% !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        z-index: 1000 !important;
                        pointer-events: none !important;
                        background-color: ${CONFIG.colors.tooltipBackground} !important;
                        border: 1px solid ${CONFIG.colors.panelBorder} !important;
                    `;
                }
            }
        });
    }

    function createCompactLayout() {
        const gameLeft = document.querySelector('.game-left');
        const gameRight = document.querySelector('.game-right');
        const gameContainer = document.querySelector('.game-container');
        const gamechat = document.querySelector('#gamechat');

        if (!gameLeft || !gameRight || !gameContainer || !gamechat) return;

        document.querySelector('.game.svelte-15im41r').style.cssText = `
            display: flex !important;
            flex-wrap: nowrap !important;
            height: 100vh !important;
            overflow: hidden !important;
            background-color: ${CONFIG.colors.background} !important;
        `;

        gameLeft.style.cssText = `
            width: ${CONFIG.leftWidth} !important;
            min-width: ${CONFIG.leftWidth} !important;
            max-width: ${CONFIG.leftWidth} !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 5px !important;
            overflow-y: auto !important;
            gap: ${CONFIG.gapBetween} !important;
            position: relative;
            background-color: ${CONFIG.colors.background} !important;
        `;

        gameRight.style.cssText = `
            width: auto !important;
            min-width: 100px !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 5px !important;
            overflow-y: auto !important;
            background-color: ${CONFIG.colors.background} !important;
        `;

        gameContainer.style.cssText = `
            flex: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            background-color: ${CONFIG.colors.background} !important;
        `;

        const panelsContainer = document.createElement('div');
        panelsContainer.style.cssText = `
            position: relative;
            flex-grow: 1;
            min-height: calc(100vh - 50px);
            background-color: transparent !important;
        `;
        gameLeft.appendChild(panelsContainer);

        const panels = {
            'chat': {
                element: gamechat,
                height: CONFIG.chatHeight,
                width: CONFIG.chatWidth,
                position: CONFIG.panelPositions.chat
            },
            'actions': {
                element: gameLeft.querySelector('.actions-desktop'),
                height: CONFIG.actionsHeight,
                position: CONFIG.panelPositions.actions,
                left: CONFIG.actionsLeftOffset
            },
            'parameters': {
                element: gameLeft.querySelector('.parameters.desktop'),
                height: CONFIG.parametersHeight,
                position: CONFIG.panelPositions.parameters
            },
            'skills': {
                element: gameLeft.querySelector('.skills-desktop'),
                height: CONFIG.skillsHeight,
                position: CONFIG.panelPositions.skills
            }
        };

        Object.entries(panels).forEach(([type, panel]) => {
            if (!panel.element) return;

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: absolute;
                top: ${panel.position}px;
                left: ${panel.left || '0'};
                right: 0;
                height: ${panel.height};
                ${panel.width ? `width: ${panel.width};` : ''}
                margin: 0;
                padding: ${CONFIG.panelPadding};
                background: transparent;
            `;

            if (type === 'actions' && CONFIG.actionsHorizontal) {
                const actionsButtons = panel.element.querySelector('.actions-buttons');
                if (actionsButtons) {
                    actionsButtons.style.cssText = `
                        display: flex !important;
                        flex-direction: row !important;
                        justify-content: space-around !important;
                        align-items: center !important;
                        height: 100% !important;
                        margin-left: ${CONFIG.actionsLeftOffset} !important;
                        gap: 8px !important;
                        background-color: ${CONFIG.colors.panelBackground} !important;
                    `;
                }
            }

            wrapper.appendChild(panel.element);
            panelsContainer.appendChild(wrapper);
        });

        const itemsPanel = document.querySelector('.items-panel');
        if (itemsPanel) {
            const itemsWrapper = document.createElement('div');
            itemsWrapper.style.cssText = `
                position: absolute;
                top: ${CONFIG.panelPositions.items}px;
                left: 0;
                right: 0;
                padding: ${CONFIG.panelPadding};
                background: transparent;
            `;

            itemsWrapper.appendChild(itemsPanel);
            panelsContainer.appendChild(itemsWrapper);

            itemsPanel.style.cssText = `
                position: relative !important;
                bottom: auto !important;
                left: auto !important;
                width: auto !important;
                max-width: 50% !important;
                height: auto !important;
                z-index: 1000 !important;
                border-radius: 5px !important;
                padding: 5px !important;
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
            `;
        }

        const style = document.createElement('style');
        style.textContent = `
            body {
                overflow: hidden !important;
            }

            #gamechat {
                width: ${CONFIG.chatWidth} !important;
                background-color: ${CONFIG.colors.chatBackground} !important;
            }

            #gamechat-messages {
                background-color: ${CONFIG.colors.chatBackground} !important;
            }

            .actions-buttons.svelte-nqamr4 {
                display: flex !important;
                justify-content: space-around !important;
                align-items: center !important;
                height: ${CONFIG.actionsHeight} !important;
                gap: 8px !important;
                background-color: ${CONFIG.colors.panelBackground} !important;
            }

            .tooltip-anchor.svelte-1my6515 {
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
            }

            .action.svelte-5ea9xh {
                width: ${CONFIG.buttonSize} !important;
                height: ${CONFIG.buttonSize} !important;
                padding: 0 !important;
                margin: 0 8px !important;
                border: none !important;
                background: none !important;
                cursor: pointer !important;
                position: relative !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }

            .action-img.svelte-5ea9xh {
                width: ${CONFIG.iconSize} !important;
                height: ${CONFIG.iconSize} !important;
                display: block !important;
                margin: 0 !important;
                transition: transform 0.2s ease !important;
            }

            .action.svelte-5ea9xh:hover .action-img.svelte-5ea9xh {
                transform: scale(1.1);
            }

            .parameter.svelte-v5xjc1 {
                margin: 2px 0 !important;
            }

            .skill.flex-row {
                margin: 2px 0 !important;
            }

            /* Инвентарь - прозрачный фон */
            .items-panel.svelte-bphnd8 {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }

            .cell-items.svelte-bphnd8,
            .bag-items.svelte-bphnd8,
            .my-items.svelte-bphnd8 {
                background-color: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }
})();