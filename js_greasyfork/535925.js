// ==UserScript==
// @name         Тёмная тема
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Тёмная тема для Kinwoods. Побережём глаза
// @author       Шумелка (347). ВК - https://vk.com/oleg_rennege
// @match        *://*.kinwoods.com/game*
// @match        *://*.kinwoods.com/abilities*
// @match        *://*.kinwoods.com/faction*
// @grant        GM_addStyle
// @run-at       document-start
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/535925/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/535925/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkTheme = `
        /* 1. ОСНОВНЫЕ НАСТРОЙКИ */
        body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        /* 2. ЛЕВЫЙ БЛОК (ФОН И ССЫЛКИ) */
        .game-left.svelte-15im41r {
            background-color: #1a1a1a !important;
            border-right: 1px solid #333 !important;
        }

        .game-left .links {
            display: flex;
            flex-direction: column;
            gap: 6px !important;
            padding: 8px !important;
            background-color: #1a1a1a !important; /* Сохраняем темный фон */
        }

        .game-left .links a {
            color: #64b5f6 !important;
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            text-decoration: none !important;
            text-align: center;
            transition: all 0.2s ease;
            margin: 0 !important;
        }

        .game-left .links a:hover {
            background-color: #333 !important;
            transform: translateY(-1px);
        }

        /* 2. ИГРОВОЕ ПОЛЕ (ВСЕ КЛЕТКИ) */
        .field-cell.svelte-1j22l9m,
        .cell-move.svelte-1trbnwi {
            background-color: transparent !important;
            box-shadow: none !important;
        }

        /* 3. ТЕКСТ ПЕРЕМЕЩЕНИЯ (ОТДЕЛЬНО) */
        .cell-move.svelte-1trbnwi {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            background-color: transparent !important;
            background-image: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: none !important;
            transform: translateY(0) !important; /* Убрали смещение вниз */
        }

        /* Текст перемещения */
        .cell-move-name.svelte-1trbnwi {
            position: relative !important; /* Возвращаем relative */
            margin-top: 68px !important; /* Компактный отступ от иконки */
            color: white !important;
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            border-radius: 3px !important;
            padding: 6px 12px !important;
            text-shadow: 1px 1px 3px #000 !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.7) !important;
            z-index: 1 !important;
            opacity: 1 !important;
            font-size: 13px !important;
            line-height: 1.2 !important;
            white-space: pre-line !important;
            word-break: keep-all !important;
            text-align: center !important;
            min-width: 100px !important;
            pointer-events: auto !important;
        }

        /* Иконка перемещения */
        .cell-move.svelte-1trbnwi > :not(.cell-move-name) {
            position: relative !important;
            z-index: 2 !important;
            pointer-events: auto !important;
            margin-bottom: 0 !important;
            align-self: center !important;
        }

        /* 4. ПАНЕЛЬ НАВЫКОВ */
        .skills.svelte-15m9dum {
            background-color: #252525 !important;
        }

        /* 5. ОСНОВНОЙ ИГРОВОЙ БЛОК */
        .game.svelte-15im41r {
            background-color: #1e1e1e !important;
        }

        /* 6. ЛЕВЫЙ БЛОК - ОБНОВЛЁННЫЕ СТИЛИ ССЫЛОК */
        .game-left .links {
            display: flex;
            flex-direction: column;
            gap: 6px !important; /* Отступ между ссылками */
            padding: 8px !important;
        }

        .game-left .links a {
            color: #64b5f6 !important;
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            text-decoration: none !important;
            text-align: center;
            transition: all 0.2s ease;
            margin: 0 !important; /* Убираем внешние отступы */
        }

        .game-left .links a:hover {
            background-color: #333 !important;
            transform: translateY(-1px);
        }

        /* Ссылки в левом блоке */
        .game-left .links a {
            color: #64b5f6 !important;
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            margin: 2px 0 !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
        }

        /* Панель параметров */
        .parameters.svelte-v5xjc1 {
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }

        /* Полоски параметров */
        .bar.svelte-1dlaans {
            background-color: #333 !important;
        }
        .bar-progress.svelte-1dlaans {
            background-color: #4CAF50 !important;
        }
        .bar-number.svelte-1dlaans {
            color: white !important;
        }

        /* 7. ПАНЕЛЬ ДЕЙСТВИЙ */
        .actions.svelte-nqamr4 {
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            border-radius: 4px !important;
        }

        /* Кнопки действий */
        .action.svelte-5ea9xh {
            background-color: #333 !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
        }

        /* 8. ПРАВЫЙ БЛОК */
        .game-right.svelte-15im41r {
            background-color: #1a1a1a !important;
            border-left: 1px solid #333 !important;
        }

        /* Блок эффектов */
        .effects_wrap.svelte-49171s {
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }

        /* Блок способностей */
        .abilities.svelte-96sseb {
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }

        .abils-title.svelte-96sseb {
            color: #e0e0e0 !important;
        }

        /* Слоты способностей */
        .slot.svelte-o9jkce {
            background-color: #333 !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
        }

        /* Полоски прогресса способностей */
        .abil-progress .bar.svelte-1dlaans {
            background-color: #333 !important;
        }
        .abil-progress .bar-progress.svelte-1dlaans {
            background-color: #FFC107 !important;
        }

        /* 9. ЧАТ */
        #gamechat.svelte-9fmcrh {
            background-color: #1e1e1e !important;
        }

        /* 13. СТИЛИЗАЦИЯ ПОЛЯ ВВОДА ЧАТА */
        #gamechat-input.svelte-9fmcrh {
            background-color: #2a2a2a !important; /* Чуть светлее основного фона */
            border: 1px solid #444 !important;
            border-radius: 4px !important;
            padding: 6px !important;
            margin-top: 8px !important;
        }

        #gamechat-input textarea.svelte-9fmcrh {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
            padding: 6px 10px !important;
            margin-right: 6px !important;
            flex-grow: 1 !important;
            resize: none !important;
        }

        #gamechat-input button.svelte-9fmcrh {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
            padding: 6px 10px !important;
            margin-left: 4px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        #gamechat-input button.svelte-9fmcrh:hover {
            background-color: #444 !important;
        }

        #gamechat-input button.mode-active.svelte-9fmcrh {
            background-color: #4a4a4a !important;
            border-color: #555 !important;
        }

        /* Стили для контейнера сообщений чата */
        .mess-container.svelte-9fmcrh {
            background-color: transparent !important; /* Убираем фон */
            color: #e0e0e0 !important; /* Светлый текст */
            border: none !important; /* Убираем границы */
            padding: 4px 8px !important; /* Компактные отступы */
            margin: 2px 0 !important;
        }

        /* Стиль для времени сообщения */
        .message-time {
            color: #999 !important; /* Серый цвет для времени */
        }

        /* Стиль для имени отправителя */
        .senderName.svelte-9fmcrh {
            color: #64b5f6 !important; /* Голубой цвет для имен */
        }

        /* Стиль для ID игрока */
        .player-id {
            color: #777 !important; /* Темно-серый цвет для ID */
        }

        /* Стиль для двоеточия и жирного текста */
        .mess strong.svelte-9fmcrh {
            color: #e0e0e0 !important; /* Светло-серый цвет */
        }

        /* Стиль для системных сообщений */
        .mess-container.svelte-9fmcrh.info {
            background-color: transparent !important;
            color: #e0e0e0 !important;
            border-left: 2px solid #444 !important; /* Тонкая акцентная линия */
            padding-left: 8px !important;
        }

        /* 10. ИНФОЛИНИЯ */
        .infoline.svelte-1yiowxi {
            background-color: #252525 !important;
        }

        /* 11. ИНВЕНТАРЬ */
        .items-panel.svelte-bphnd8 {
            background-color: #252525 !important;
        }

        /* 12. ГАРАНТИЯ ТЕМНОГО ТЕКСТА ДЛЯ ВСЕХ ЭЛЕМЕНТОВ */
        p, div, span {
            color: #e0e0e0 !important;
        }

        /* 13. ИСКЛЮЧЕНИЯ ДЛЯ ИКОНОК */
        .parameter-icon.icon-view.svelte-v5xjc1,
        .action-img.svelte-5ea9xh {
            filter: none !important;
        }

        /* 8. ПРАВЫЙ БЛОК */
        .game-right.svelte-15im41r {
            background-color: #1a1a1a !important;
            border-left: 1px solid #333 !important;
        }

        /* Блок эффектов - ПРОЗРАЧНЫЙ */
        .effects_wrap.svelte-49171s.desktop,
        .effects_wrap.svelte-49171s.desktop .grid.svelte-49171s {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* Блок базовой атаки - стилизация под другие способности */
        .basic_attack_wrapper.svelte-96sseb {
            background-color: #252525 !important;
            border: 1px solid #333 !important;
            border-radius: 4px !important;
            padding: 8px !important;
            margin-bottom: 8px !important;
        }

        /* Кнопка базовой атаки */
        .basic-attack.svelte-18h74nq {
           background-color: #333 !important;
           border: 1px solid #444 !important;
           border-radius: 4px !important;
           width: 30px !important;
           height: 30px !important;
           display: flex !important;
           justify-content: center !important;
           align-items: center !important;
        }

        /* Иконка базовой атаки */
        .basic-attack.svelte-18h74nq img {
            filter: brightness(0.9) !important;
        }

        /* Основной контейнер инвентаря */
        .items-panel.svelte-bphnd8 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
        }

        /* Заголовки разделов */
        .items-panel p.svelte-bphnd8 {
            color: #e0e0e0 !important;
        }

        /* Слоты предметов (оригинальная сетка) */
        .slots.svelte-1bra3p7 {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important; /* 3 колонки */
            gap: 5px !important;
        }

        /* Стандартный слот (тёмные цвета) */
        .slot-item.svelte-1bra3p7 {
            background-color: #333 !important;
            border: 1px solid #444 !important;
        }

        /* Выбранный слот (подсветка) */
        .slot-item.svelte-1bra3p7.selected {
            border: 2px solid #64b5f6 !important;
            box-shadow: 0 0 8px rgba(100, 181, 246, 0.5) !important;
        }

        /* Уровень предмета */
        .tier.svelte-1bra3p7 {
            background-color: #2a2a2a !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
        }

        /* Кнопка крафта */
        .craft-flag.svelte-bphnd8 {
            background-color: #333 !important;
            border: 1px solid #444 !important;
        }

        /* Подсказки */
        .cell-tooltip.svelte-1my6515 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            color: #e0e0e0 !important;
        }

        /* Основной контейнер тултипа */
        .cell-tooltip.svelte-1dfm7bg {
            background-color: #252525 !important; /* Тёмный фон */
            border-color: #444 !important; /* Тёмная граница */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;
        }

        /* Текст и ссылки */
        .char-name.svelte-1q3ck26,
        .position.svelte-1q3ck26 p {
            color: #e0e0e0 !important; /* Светлый текст */
        }

        .char-name a.svelte-1q3ck26 {
            color: #64b5f6 !important; /* Голубые ссылки */
        }

        /* Предметы в инвентаре */
        .cat-tooltip-items.svelte-1q3ck26 {
            background-color: #2a2a2a00 !important; /* Тёмный фон */
        }
        .cat-tooltip-item.svelte-1q3ck26 {
            background-color: #333 !important; /* Фон иконок */
            border-color: #444 !important; /* Границы иконок */
        }

        /* Гарантия для динамических элементов */
        .tooltip-anchor.svelte-1dfm7bg [slot="content"] {
            background-color: #252525 !important;
        }

        /* Тёмный стиль для информационных сообщений */
        .mess-container.svelte-9fmcrh.info {
            color: #e0e0e0 !important; /* Светло-серый текст */
            background-color: #2a2a2a !important; /* Тёмный фон */
            border-left: 3px solid #444 !important; /* Акцентная полоса */
            padding: 8px 12px !important;
            margin: 6px 0 !important;
            border-radius: 4px !important;
        }

        /* Стиль для имени отправителя */
        .senderName.svelte-9fmcrh {
            color: #bbb !important; /* Серый цвет */
            font-weight: bold !important;
        }

        /* Основной текст сообщения */
        .mess.svelte-9fmcrh {
            color: inherit !important; /* Наследует цвет контейнера */
            margin: 0 !important;
        }

        /* Жирный текст (двоеточие) */
        .mess strong.svelte-9fmcrh {
            color: #d0d0d0 !important;
        }

        /* Тёмный стиль для панели таймера */
        .panel.svelte-1t5p5a7 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            color: #e0e0e0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        /* Стиль текста таймера */
        .panel.svelte-1t5p5a7 p.svelte-1t5p5a7 {
            margin: 0 !important;
            font-size: 14px !important;
            color: #e0e0e0 !important;
        }

        /* Стиль кнопки "Отмена" */
        .timer-cancel.svelte-1t5p5a7 {
            background-color: #333 !important;
            border: 1px solid #555 !important;
            color: #e0e0e0 !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        /* Ховер-эффект для кнопки */
        .timer-cancel.svelte-1t5p5a7:hover {
            background-color: #444 !important;
            border-color: #666 !important;
        }

        /* Активное состояние кнопки */
        .timer-cancel.svelte-1t5p5a7:active {
            transform: translateY(1px);
        }

        /* СТИЛИ ДЛЯ СТРАНИЦЫ СПОСОБНОСТЕЙ */
    .abs-equip.svelte-1jnojkb {
        background-color: #252525 !important;
        border: 1px solid #444 !important;
        border-radius: 8px !important;
        padding: 12px !important;
        color: #e0e0e0 !important;
    }

    .abs-equip p.svelte-1jnojkb {
        color: #e0e0e0 !important;
    }

    .abs-equip p strong.svelte-1jnojkb {
        color: #f0f0f0 !important;
    }

    /* Стили для кнопок вкладок "Все", "Мир", "Бой" */
    .tabs.svelte-1jnojkb {
        background-color: #333 !important;
        border-radius: 6px !important;
        padding: 4px !important;
        display: inline-flex !important;
    }

    .tabs.svelte-1jnojkb button.svelte-1jnojkb {
        background-color: #333 !important;
        color: #e0e0e0 !important;
        border: none !important;
        padding: 6px 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        border-radius: 4px !important;
    }

    .tabs.svelte-1jnojkb button.current-tab.svelte-1jnojkb {
        background-color: #444 !important;
        color: #fff !important;
        font-weight: bold !important;
        border: 2px solid #64b5f6 !important;
    }

    .tabs.svelte-1jnojkb button.svelte-1jnojkb:hover:not(.current-tab) {
        background-color: #3a3a3a !important;
    }

    /* Стили для кнопок способностей */
    .slot.svelte-o9jkce {
        background-color: #333 !important;
        border: 1px solid #444 !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
    }

    .slot.svelte-o9jkce:hover {
        background-color: #3a3a3a !important;
        transform: translateY(-2px);
    }

    .slot.svelte-o9jkce.master {
        background-color: #2a2a2a !important;
        border: 1px dashed #555 !important;
    }

    /* Выбранные слоты способностей */
    .slot.svelte-o9jkce.selected {
        border: 2px solid #64b5f6 !important;
        box-shadow: 0 0 8px rgba(100, 181, 246, 0.5) !important;
    }

    /* Сетка способностей */
    .abils-grid.svelte-1jnojkb {
        background-color: #252525 !important;
        border-radius: 8px !important;
        padding: 8px !important;
    }

    /* Прогресс изучения способностей */
    .abil-progress.svelte-1h7ru6 {
        background-color: #333 !important;
    }

    .bar.svelte-1dlaans {
        background-color: #333 !important;
    }

    .bar-progress.svelte-1dlaans {
        background-color: #4CAF50 !important;
    }

    /* Тултипы способностей */
    .cell-tooltip.svelte-1my6515 {
        background-color: #252525 !important;
        border: 1px solid #444 !important;
        color: #e0e0e0 !important;
    }

    .abil-title.svelte-lyyv8m {
        color: #e0e0e0 !important;
    }

    .abil-progress-info {
        color: #bbb !important;
    }

    .abil-baseD.svelte-lyyv8m,
    .abil-masterD.svelte-lyyv8m {
        color: #e0e0e0 !important;
    }

    .abil-number {
        color: #64b5f6 !important;
    }

    .master-title.svelte-lyyv8m {
        color: #FFC107 !important;
    }

    .master-title.master-blocked {
        color: #888 !important;
    }

    /* Кнопка сохранения */
    .save-button.svelte-1jnojkb {
        background-color: #2e7d32 !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 8px 16px !important;
        margin-top: 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
    }

    .save-button.svelte-1jnojkb:hover {
        background-color: #388e3c !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

        /* ВКЛАДКА С АКТИВНОСТБЮ ФРАКЦИЙ */
        /* Основная таблица (только цвета) */
        table.svelte-1bwa4vs {
            background-color: #424242 !important; /* Серый фон */
            color: white !important; /* Белый текст */
        }

        /* Заголовки столбцов (только цвета) */
        tr.score.title.svelte-1bwa4vs {
            background-color: #555 !important; /* Темно-серый */
            color: white !important;
        }

        /* Строки с данными (только цвета) */
        tr.score.svelte-1bwa4vs {
            background-color: #424242 !important; /* Серый фон */
            color: white !important;
        }

        /* Альтернативный цвет для четных строк (опционально) */
        tr.score.svelte-1bwa4vs:nth-child(even) {
            background-color: #3a3a3a !important; /* Чуть темнее */
        }

        /* Ячейки таблицы (границы) */
        td.svelte-1bwa4vs {
            border-color: #555 !important; /* Цвет границ */
        }

        /* Особые стили для колонок (цвета текста) */
        td.score_place.svelte-1bwa4vs {
            color: #bbb !important; /* Светло-серый для номеров */
        }

        td.score_char.svelte-1bwa4vs {
            color: white !important; /* Белый для имен */
        }

        td.score_pos.svelte-1bwa4vs {
            color: #ddd !important; /* Светло-серый для должностей */
        }

        td.score_points.svelte-1bwa4vs {
            color: white !important; /* Белый для баллов */
        }

        /* Меню с компактными отступами */
        .top_menu.flex-row.gap3 {
            gap: 6px !important; /* Уменьшенный отступ между кнопками (было 12px) */
            padding: 4px !important; /* Внутренний отступ контейнера */
        }

        /* Стиль кнопок */
        .top_menu button.svelte-6fpv34 {
            background-color: #424242 !important;
            color: #f0f0f0 !important;
            border: none !important;
            border-radius: 4px !important; /* Чуть меньше скругление */
            padding: 6px 12px !important; /* Более компактные отступы */
            font-size: 13px !important;   /* Чуть меньший шрифт */
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            margin: 2px !important;       /* Дополнительный небольшой отступ */
        }

        /* Активная кнопка (компактная версия) */
        .top_menu button.active_top.svelte-6fpv34 {
            background-color: #555 !important;
            padding: 6px 12px !important; /* Такие же отступы как у обычных */
        }

        /* Эффекты при наведении */
        .top_menu button.svelte-6fpv34:hover {
            transform: none; /* Убираем смещение для компактности */
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }

        /* ИКОНКА ВРЕМЕНИ (НОВОЕ ИЗМЕНЕНИЕ) */
        .time.svelte-1yiowxi {
            filter: invert(1) brightness(1.5) !important;
        }

        /* НОВЫЕ СТИЛИ ДЛЯ ИНФОЛИНИИ */
        .infoline.svelte-1rta3dd {
            background-color: #252525 !important;
            color: #e0e0e0 !important;
        }

        .world-info.svelte-1rta3dd {
            color: #e0e0e0 !important;
        }

        #loc-name.svelte-1rta3dd {
            color: #e0e0e0 !important;
        }

        .time.svelte-1rta3dd {
            filter: invert(1) brightness(1.5) !important;
        }

        .flag.svelte-1rta3dd {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
        }

        /* СТИЛИ ДЛЯ ВЫДЕЛЕНИЯ ВЫБРАННЫХ СПОСОБНОСТЕЙ */
        .slot.svelte-o9jkce.selected,
        .basic-attack.svelte-18h74nq.selected {
            border: 2px solid #64b5f6 !important;
            box-shadow: 0 0 8px rgba(100, 181, 246, 0.5) !important;
        }

        .abils-list .slot.svelte-o9jkce {
            transition: all 0.2s ease !important;
        }

        .abils-list .slot.svelte-o9jkce.selected {
            transform: scale(1.05);
        }

        /* СТИЛИ ДЛЯ ИМЕН ПЕРСОНАЖЕЙ */
        .char-name.svelte-1q3ck26,
        .char-name.svelte-ci4r28 {
            color: #e0e0e0 !important;
        }

        /* СТИЛИ ДЛЯ КОНТЕЙНЕРА СПОСОБНОСТЕЙ */
        .abils-grid.svelte-1jnojkb {
            background-color: #252525 !important;
            border-radius: 8px !important;
            padding: 8px !important;
        }

        /* СТИЛИ ДЛЯ ТУЛТИПОВ СПОСОБНОСТЕЙ */
        .cell-tooltip.svelte-1my6515 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            color: #e0e0e0 !important;
        }

        /* СТИЛИ ДЛЯ ПРОГРЕССА СПОСОБНОСТЕЙ */
        .abil-progress.svelte-1h7ru6 {
            background-color: #333 !important;
        }

        /* Кнопки "Все", "Мир", "Бой" */
        .tabs.svelte-ykbs1w button.svelte-ykbs1w {
            color: #e0e0e0 !important; /* Светлый текст */
            background-color: #333 !important; /* Темный фон */
        }

        .tabs.svelte-ykbs1w button.current-tab.svelte-ykbs1w {
            color: #fff !important; /* Белый текст для активной кнопки */
            background-color: #444 !important;
            border: 2px solid #64b5f6 !important; /* Голубая рамка */
        }

        /* Стили для тултипов персонажей */
        .clan-exile.svelte-ci4r28,
        .clan-keeper.svelte-ci4r28,
        .clan-bots.svelte-ci4r28,
        .clan-neutral.svelte-ci4r28 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
            color: #e0e0e0 !important;
        }

        .char-name.svelte-ci4r28,
        .position.svelte-ci4r28 p,
        .subPosition.svelte-ci4r28 i {
            color: #e0e0e0 !important; /* Светлый текст */
        }

        .char-name a.svelte-ci4r28 {
            color: #64b5f6 !important; /* Голубые ссылки */
        }

        .cat-tooltip-items.svelte-ci4r28 {
            background-color: transparent !important;
        }

        .cat-tooltip-item.svelte-ci4r28 {
            background-color: #252525 !important;
            border: 1px solid #444 !important;
        }

        .online-indicator.svelte-ci4r28 {
            border-color: #444 !important;
        }
    `;

    // Добавляем стили
    GM_addStyle(darkTheme);

    // Функция для проверки клеток
    function checkCells() {
        document.querySelectorAll('.field-cell, .cell-move').forEach(cell => {
            cell.style.backgroundColor = 'transparent';
            cell.style.backgroundImage = 'none';
        });
    }

    // Наблюдатель за изменениями
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(() => checkCells());
    });

    // Запускаем проверку
    window.addEventListener('load', function() {
        checkCells();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Дополнительные проверки
        setTimeout(checkCells, 1000);
        setTimeout(checkCells, 3000);
    });
})();