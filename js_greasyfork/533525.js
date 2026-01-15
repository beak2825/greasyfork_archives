// ==UserScript==
// @name         AS CardControl
// @namespace    https://animestars.org/
// @version      12
// @description  Множество вспомогательных функций для работы с картами
// @author       Sandr
// @match        *://*.animestars.org/*
// @match        *://*.animesss.com/*
// @match        *://*.animesss.tv/*
// @match        *://*.asstars.tv/*
// @match        *://*.astars.club/*
// @match        *://*.asstars.online/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at document-idle
// @license      MIT
// @icon         https://i.postimg.cc/Z5NcKpdW/22.png
// @downloadURL https://update.greasyfork.org/scripts/533525/AS%20CardControl.user.js
// @updateURL https://update.greasyfork.org/scripts/533525/AS%20CardControl.meta.js
// ==/UserScript==


const SCRIPT_VERSION_KEY = 'ascc_script_version_v1';

async function initialize() {
    // БЛОК ОПОВЕЩЕНИЯ ОБ ОБНОВЛЕНИИ ВЕРСИИ
    const currentVersion = GM_info.script.version;
    const lastRunVersion = await GM_getValue(SCRIPT_VERSION_KEY, null);

    if (currentVersion !== lastRunVersion) {
        const notificationEl = document.createElement('div');
        Object.assign(notificationEl.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 28px', color: 'white', borderRadius: '10px',
            background: 'linear-gradient(145deg, #007bff, #0056b3)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)', zIndex: '2147483639',
            fontSize: '15px', fontWeight: 'bold', textAlign: 'center',
            transition: 'opacity 0.5s ease', whiteSpace: 'pre-line'
        });
        notificationEl.textContent = 'AS CardControl\nСкрипт обновлен до версии ' + currentVersion + '!';
        document.body.appendChild(notificationEl);

        setTimeout(() => {
            notificationEl.style.opacity = '0';
            setTimeout(() => notificationEl.remove(), 500);
        }, 10000);

        console.log(`[AS CardControl] Обнаружено обновление скрипта с версии ${lastRunVersion || 'N/A'} до ${currentVersion}.`);
        await GM_setValue(SCRIPT_VERSION_KEY, currentVersion);
    }

    // БЛОК ЗАПУСКА ОСНОВНОГО СКРИПТА
    console.log("[AS CardControl] Запуск скрипта...");
    runMainScript();
}
initialize();

function runMainScript() {
    const settings = {
        blockCardEnabled: GM_getValue('blockCardEnabled', true),
        addCardEnabled: GM_getValue('addCardEnabled', true),
        previewCardEnabled: GM_getValue('previewCardEnabled', true),
        showMyCardsButton: GM_getValue('showMyCardsButton', true),
        enableCardOwnersViaMiddleClickEnabled: GM_getValue('enableCardOwnersViaMiddleClickEnabled', true),
        showLevelProgressEstimateEnabled: GM_getValue('showLevelProgressEstimateEnabled', true),
        initWantCardButtonFeatureEnabled: GM_getValue('initWantCardButtonFeatureEnabled', true),
        initRemeltHotkeyFeatureEnabled: GM_getValue('initRemeltHotkeyFeatureEnabled', true),
        addMyCardsButtonsEnabled: GM_getValue('addMyCardsButtonsEnabled', true),
        enableTradeHistoryInNotificationsEnabled: GM_getValue('enableTradeHistoryInNotificationsEnabled', true),
        initAsLoadUserTradeConditionsFeatureEnabled: GM_getValue('initAsLoadUserTradeConditionsFeatureEnabled', true),
        addUserCardShortcutsEnabled: GM_getValue('addUserCardShortcutsEnabled', true),
        initCelestialStoneChargeToFullEnabled: GM_getValue('initCelestialStoneChargeToFullEnabled', true),
        initNotebookFeatureEnabled: GM_getValue('initNotebookFeatureEnabled', true),
    };

    // === Стили для ползунков (тумблеров) и выравнивания ===
    const style = document.createElement('style');
    style.textContent = `
/* Новая структура переключателей */
.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  /* УБИРАЕМ width: 100%; - его заменяет flex-grow: 1 */
  flex-grow: 1; /* ГАРАНТИРУЕТ ВЫРАВНИВАНИЕ ПОЛЗУНКА СПРАВА */
  cursor: default; /* УБИРАЕТ РУКУ СО ВСЕГО КОНТЕЙНЕРА */
}

.switch-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 14px;
  user-select: none;
  cursor: default;
  flex-wrap: wrap;
}

/* Ползунок  */
.switch-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-toggle .slider {
  position: relative;
  width: 46px;
  height: 22px;
  background-color: #999;
  border-radius: 22px;
  transition: 0.4s;
}
.switch-toggle .slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}
.switch-toggle input:checked + .slider {
  background-color: #9e294f;
}
.switch-toggle input:checked + .slider:before {
  transform: translateX(24px);
}
    #as-tools-settings .setting-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px; /* Отступ между строками */
      line-height: 1.3; /* Улучшение читаемости текста */
    }

    /* Общая обертка для текста и ползунка */
    .switch-label {
      position: relative; /* Важно: позиционирует дочерние элементы абсолютно относительно себя */
      display: flex; /* Используем flex для выравнивания */
      justify-content: space-between; /* Распределяем текст и ползунок по краям */
      align-items: center; /* Выравниваем по центру по вертикали */
      flex-grow: 1; /* Позволяет label занимать все доступное пространство */
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-sizing: border-box;
      min-height: 26px; /* Минимальная высота строки, чтобы ползунок помещался */
    }

    /* Скрываем нативный чекбокс */
    .switch-label input[type="checkbox"] {
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
      /* Удаляем position: absolute; отсюда, так как он будет на slider */
    }

    /* Фон ползунка */
    .slider {
      position: relative; /* Важно: позиционирует дочерние элементы абсолютно относительно себя */
      flex-shrink: 0; /* Запрещаем сжиматься */
      width: 48px; /* Ширина ползунка */
      height: 22px; /* Высота ползунка */
      background-color: #ccc;
      transition: .4s;
      border-radius: 22px; /* Для скругления углов */
      margin-left: 10px; /* Отступ от текста */
    }

    /* Кружок ползунка */
    .slider:before {
      position: absolute; /* Теперь позиционируется относительно .slider */
      content: "";
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%; /* Делаем его круглым */
    }

    /* Когда чекбокс включен */
    .switch-label input[type="checkbox"]:checked + .slider {
      background-color: #9e294f; /* Цвет активного ползунка (ваш основной цвет) */
    }

    /* Когда чекбокс включен, двигаем кружок */
    .switch-label input[type="checkbox"]:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Для темной темы */
    html.dark-theme .slider {
      background-color: #555;
    }

    html.dark-theme .switch-label input[type="checkbox"]:checked + .slider {
      background-color: #9e294f;
    }

    /* Стили для info-icon */
    .info-icon {
      margin-left: 8px; /* Отступ от ползунка/контейнера */
      flex-shrink: 0; /* Запрещаем иконке сжиматься */
      cursor: help; /* Меняет курсор на вопросительный при наведении */
      color: #999; /* Серый цвет для иконки */
      font-size: 0.9em; /* Немного меньше текст */
    }

    /* Общие стили для модального окна настроек */
    #as-tools-settings {
        max-width: 450px;
    }

    /* Стили для кастомного тултипа (модального окна подсказки) */
    .custom-tooltip-modal {
        position: fixed;
        z-index: 10003;
        border-radius: 8px;
        padding: 15px 20px;
        max-width: 350px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 14px;
        line-height: 1.4;
    }

    .as-load-conditions-button {
        background-color: #28a745; /* Зеленый цвет */
        color: white;
        padding: 2px 5px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.7em;
        margin-left: 10px;
        transition: background-color 0.2s;
        white-space: nowrap;
        display: inline-flex; /* Для выравнивания текста и иконки */
        align-items: center; /* Выравнивание по центру по вертикали */
        gap: 2px; /* Отступ между текстом и иконкой */
    }
    .as-load-conditions-button:hover {
        background-color: #218838;
    }
    .as-load-conditions-button img {
        width: 14px;
        height: 14px;
        object-fit: contain;
    }
  `;
    document.head.appendChild(style);
    // стили для счечика дубликатов
    GM_addStyle(`
        .anime-cards__image {
            position: relative !important;
        }
.dupl-count {
    position: absolute !important;
    bottom: 41px !important;
    right: 0 !important;
    z-index: 1 !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
    color: white !important;
    padding: 3px 6px !important; /* Уменьшите это значение для вертикального сжатия */
    border-radius: 8px !important;
    font-size: 0.9em !important;
    height: auto !important; /* Добавлено */
    line-height: 2 !important; /* Добавлено */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 40px !important;
    box-sizing: border-box !important;
}
    `);

    GM_addStyle(`
    #as-cardcontrol-spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10005;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #as-cardcontrol-spinner {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #9e294f;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: as-spin 1s linear infinite;
    }
    @keyframes as-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`);


    GM_addStyle(`
    /* Основной контейнер модального окна */
    #as-tools-settings {
        background-color: transparent !important; /* Убедитесь, что основной контейнер остается прозрачным */
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        padding: 20px;
        color: #fff !important;
        border: 2px solid #FF0000 !important; /* Обводка для модального окна */
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.7) !important; /* Свечение для модального окна */
    }

    /* Псевдоэлемент, который будет держать ваш SVG-фон */
    #as-tools-settings::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -2; /* Убедитесь, что фон находится за содержимым */

        background-color: #101010fc !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Cpath fill='none' stroke-width='1' stroke-opacity='0.96' id='a' d='M0.74-509.63l485.39 352.65l-185.4 570.61h-599.97l-185.4-570.61L0.74-509.63 M0.74-510.87l-486.56 353.51l185.85 571.99h601.42L487.3-157.36L0.74-510.87L0.74-510.87z'/%3E%3C/defs%3E%3Cg transform='scale(0.667)' style='transform-origin:center'%3E%3Cg style='transform-origin:center'%3E%3Cg transform='rotate(-100.8 0 0)' style='transform-origin:center'%3E%3Cg transform='translate(1000 750)'%3E%3Cuse stroke='%23000' href='%23a' transform='rotate(6.3 0 0) scale(1.063)'/%3E%3Cuse stroke='%23600000' href='%23a' transform='rotate(12.6 0 0) scale(1.126)'/%3E%3Cuse stroke='%23690000' href='%23a' transform='rotate(18.9 0 0) scale(1.189)'/%3E%3Cuse stroke='%23730000' href='%23a' transform='rotate(25.2 0 0) scale(1.252)'/%3E%3Cuse stroke='%237e0000' href='%23a' transform='rotate(31.5 0 0) scale(1.315)'/%3E%3Cuse stroke='%23890000' href='%23a' transform='rotate(37.8 0 0) scale(1.378)'/%3E%3Cuse stroke='%23940000' href='%23a' transform='rotate(44.1 0 0) scale(1.441)'/%3E%3Cuse stroke='%239f0000' href='%23a' transform='rotate(50.4 0 0) scale(1.504)'/%3E%3Cuse stroke='%23aa0000' href='%23a' transform='rotate(56.7 0 0) scale(1.567)'/%3E%3Cuse stroke='%23b60000' href='%23a' transform='rotate(63 0 0) scale(1.63)'/%3E%3Cuse stroke='%23c20000' href='%23a' transform='rotate(69.3 0 0) scale(1.693)'/%3E%3Cuse stroke='%23ce0000' href='%23a' transform='rotate(75.6 0 0) scale(1.756)'/%3E%3Cuse stroke='%23da0000' href='%23a' transform='rotate(81.9 0 0) scale(1.819)'/%3E%3Cuse stroke='%23e60000' href='%23a' transform='rotate(88.2 0 0) scale(1.882)'/%3E%3Cuse stroke='%23f30b00' href='%23a' transform='rotate(94.5 0 0) scale(1.945)'/%3E%3Cuse stroke='%23FF2408' href='%23a' transform='rotate(100.8 0 0) scale(2.008)'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !important;
        background-attachment: fixed !important;
        background-size: cover !important;
        background-position: center center !important;
    }

    /* Стили для полупрозрачных "обводок" вокруг текста */
    #as-tools-settings h3,
    #as-tools-settings .setting-row,
    #as-tools-settings .setting-row label, /* Часто текст в label меняет цвет */
    #as-tools-settings .setting-row span, /* Если есть span с текстом внутри */
    #as-tools-settings p, /* Если есть абзацы текста */
    #as-tools-settings button { /* Этот селектор также включает кнопки, но мы будем более специфичны ниже */
        color: #fff !important; /* Убедимся, что цвет текста белый для всех этих элементов */
    }

    /* Стили для полупрозрачного фона строк настроек */
    .setting-row {
        background-color: rgba(0, 0, 0, 0.6) !important; /* Полупрозрачный черный фон (40% непрозрачности) */
        border-radius: 10px !important;
        padding: 5px 15px !important;
        margin-bottom: 5px !important;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
    }

    /* Стили для полупрозрачного фона заголовка */
    #as-tools-settings h3 {
        background-color: rgba(0, 0, 0, 0.4) !important;
        border-radius: 8px !important;
        padding: 10px 15px !important;
        margin-bottom: 15px !important;
    }

    /* 🔥 ОБНОВЛЕННЫЕ СТИЛИ ДЛЯ КНОПОК "Сохранить" / "Закрыть" 🔥 */
    #as-tools-settings button {
        background-color: rgba(0, 0, 0, 0.5) !important; /* Немного менее прозрачный фон кнопки */
        border: 1px solid #00FFFF !important; /* 🔥 Новая обводка: 1px, сплошная, бирюзовый цвет 🔥 */
        box-shadow: 0 0 8px rgba(0, 255, 255, 0.5) !important; /* 🔥 Новое свечение: бирюзовый цвет, полупрозрачный 🔥 */
        border-radius: 5px !important;
        padding: 8px 15px !important;
        margin-right: 10px !important;
        cursor: pointer !important;
        color: #fff !important; /* Цвет текста кнопки */
        transition: all 0.3s ease !important; /* Плавный переход для эффектов наведения */
    }

    /* 🔥 НОВЫЙ БЛОК: Эффект при наведении на кнопки (опционально) 🔥 */
    #as-tools-settings button:hover {
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.3) !important; /* Более сильное свечение при наведении */
        transform: translateY(-2px) !important; /* Небольшой сдвиг вверх */
    }
    /* 🔥🔥🔥 НОВЫЕ СТИЛИ ДЛЯ КНОПКИ ВЫЗОВА НАСТРОЕК (#as-tools-settings-btn) 🔥🔥🔥 */
    #as-tools-settings-btn
    {
        /* Переносим некоторые инлайновые стили сюда для удобства */
        margin-left: 10px !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        /* Основные стили кнопки */
        background-color: #333 !important; /* Темный фон для контраста */
        color: #fff !important; /* Белый текст */
        padding: 8px 15px !important; /* Отступы */
        border-radius: 8px !important; /* Скругленные углы */
        text-decoration: none !important; /* Убрать подчеркивание ссылки */
        font-weight: bold !important; /* Жирный текст */
        border: 1px solid #00FFFF !important; /* Тонкая бирюзовая обводка */

        /* Эффект свечения (неон) */
        box-shadow: 0 0 5px rgba(0, 255, 255, 0.3), /* Бирюзовое свечение */
                    0 0 10px rgba(0, 255, 255, 0.2),
                    0 0 15px rgba(0, 255, 255, 0.1) !important;

        /* Плавный переход для всех изменений (сдвиг, свечение) */
        transition: all 0.3s ease-in-out !important;
        }

        #as-tools-settings-btn:hover {
            /* Сдвиг кнопки при наведении */
            transform: translateY(-3px) !important; /* Сдвиг вверх на 3 пикселя */
            /* Усиление свечения при наведении */
            box-shadow: 0 0 8px rgba(0, 255, 255, 0.4), /* Ярче бирюзовое свечение */
                        0 0 13px rgba(0, 255, 255, 0.3),
                        0 0 18px rgba(0, 255, 255, 0.2) !important;
            background-color: #444 !important; /* Немного светлее фон при наведении */
        }

        /* Стили для иконки внутри кнопки настроек, если нужно */
        #as-tools-settings-btn img {
            width: 16px !important;
            height: 16px !important;
            object-fit: contain !important;
        }
        /* 📱 Адаптивные стили для мобильных устройств */
        @media (max-width: 768px) {
            #as-tools-settings {
                max-height: 90vh !important; /* Ограничиваем высоту окна */
                overflow-y: auto !important; /* Включаем вертикальную прокрутку при необходимости */
                width: 95vw !important;      /* Уменьшаем ширину под экран телефона */
                padding: 15px !important;    /* Меньше отступы */
                box-sizing: border-box !important; /* Учитываем padding в ширине */
            }

            #as-tools-settings h3 {
                font-size: 1.2em !important;
                padding: 8px 12px !important;
            }

            .setting-row {
                padding: 8px 10px !important;
            }

            #as-tools-settings button {
                padding: 6px 12px !important;
                font-size: 0.9em !important;
            }


        /* Обновим прокрутку — Chrome, Edge */
        #as-tools-settings::-webkit-scrollbar {
            width: 8px;
        }

        #as-tools-settings::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        #as-tools-settings::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 255, 0.4);
            border-radius: 4px;
            border: 1px solid rgba(0, 255, 255, 0.7);
        }

        /* Firefox */
        #as-tools-settings {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 255, 255, 0.4) rgba(255, 255, 255, 0.05);
        }
        `);
GM_addStyle(`
    /* ------------------------------------------- */
    /* Стили для кастомной подсказки с изображением */
    /* ------------------------------------------- */

    .info-icon {
        position: relative;
    }

    .custom-tooltip {
        position: fixed;
        z-index: 2147483640;
        padding: 10px;
        background: #222;
        border: 1px solid #444;
        border-radius: 8px;
        max-width: 350px; /* Базовая ширина для компактного режима (текст) */
        pointer-events: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        display: none;
        color: #f0f0f0;
        line-height: 1.4;
        font-size: 13px;
        text-align: left;
    }

    .custom-tooltip img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin-bottom: 8px;
        border: 1px solid #555;
    }

    /* Увеличение максимальной ширины для экранов шире 1024px (для картинок) */
    @media (min-width: 1024px) {
        .custom-tooltip {
            max-width: 750px; /* Ширина для десктопа с картинкой */
        }
    }
`);
function setupCustomTooltips() {
    // Ищем иконки, у которых есть описание (текст)
    const infoIcons = document.querySelectorAll('.info-icon[data-description]');

    let tooltipEl = document.createElement('div');
    tooltipEl.className = 'custom-tooltip';
    document.body.appendChild(tooltipEl);

    function hideTooltip() {
        tooltipEl.style.display = 'none';
        tooltipEl.removeAttribute('data-active-icon');
        // Очищаем maxWidth, чтобы позволить CSS снова управлять шириной
        tooltipEl.style.maxWidth = '';
    }

    // Обработчик для скрытия по клику вне подсказки
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.info-icon') && !e.target.closest('.custom-tooltip')) {
            hideTooltip();
        }
    });

    infoIcons.forEach(icon => {
        const description = icon.getAttribute('data-description');
        const imageUrl = icon.getAttribute('data-screenshot-url');

        const iconId = 'tooltip-icon-' + Math.random().toString(36).substring(2, 9);
        icon.setAttribute('data-icon-id', iconId);
        icon.removeAttribute('data-tooltip');

        icon.addEventListener('click', (e) => {
            e.stopPropagation();

            if (tooltipEl.getAttribute('data-active-icon') === iconId) {
                hideTooltip();
                return;
            }

            // 1. Формируем содержимое
            let content = ``;
            if (imageUrl) {
                content += `<img src="${imageUrl}" alt="Скриншот функции">`;
            }
            content += `<p>${description}</p>`;

            tooltipEl.innerHTML = content;
            tooltipEl.style.display = 'block';
            tooltipEl.setAttribute('data-active-icon', iconId);

            // 2. Устанавливаем ширину перед позиционированием
            const viewportWidth = window.innerWidth;
            const isTextOnly = !imageUrl;

            if (!isTextOnly && viewportWidth >= 1024) {
                // Картинка, широкий экран: восстанавливаем 750px из медиа-запроса
                tooltipEl.style.maxWidth = '';
            } else if (isTextOnly && viewportWidth >= 600) {
                 // Только текст, широкий экран: принудительно устанавливаем компактную ширину 350px
                 tooltipEl.style.maxWidth = '350px';
            } else {
                 // Мобильные: адаптивная ширина
                 tooltipEl.style.maxWidth = `${viewportWidth - 20}px`;
            }

            // 3. Позиционируем (внутри setTimeout для корректного расчета размеров)
            setTimeout(() => {
                const viewportHeight = window.innerHeight; // Высота видимой области
                const tooltipWidth = tooltipEl.offsetWidth;
                const tooltipHeight = tooltipEl.offsetHeight;
                const margin = 10;
                const rect = icon.getBoundingClientRect();

                let topPosition;
                let leftPosition;

                const isMobile = viewportWidth < 600;

                if (isMobile) {
                    // === МОБИЛЬНЫЕ: Под иконкой ===

                    // Горизонтальное центрирование
                    leftPosition = (viewportWidth / 2) - (tooltipWidth / 2);
                    topPosition = rect.bottom + margin;

                } else {
                    // === ДЕСКТОП: ВСЕГДА ЦЕНТРИРОВАНИЕ НА ЭКРАНЕ ===

                    // Горизонтальное центрирование
                    leftPosition = (viewportWidth / 2) - (tooltipWidth / 2);

                    // ВЕРТИКАЛЬНОЕ ЦЕНТРИРОВАНИЕ ОТНОСИТЕЛЬНО ВИДИМОЙ ОБЛАСТИ
                    topPosition = (viewportHeight / 2) - (tooltipHeight / 2);
                }

                // === Общая проверка границ (Корректируем, чтобы не вылезло за края) ===

                if (leftPosition + tooltipWidth > viewportWidth - margin) {
                    leftPosition = viewportWidth - tooltipWidth - margin;
                }
                if (leftPosition < margin) {
                    leftPosition = margin;
                }
                // *** КЛЮЧЕВАЯ ПРОВЕРКА: Не выходим за верхний/нижний край ***
                if (topPosition + tooltipHeight > viewportHeight - margin) {
                    topPosition = viewportHeight - tooltipHeight - margin;
                }
                if (topPosition < margin) {
                    topPosition = margin;
                }

                tooltipEl.style.top = `${topPosition}px`;
                tooltipEl.style.left = `${leftPosition}px`;

            }, 0);
        });
    });
}
    // ==== UI: Настройки ====
    function showSettingsModal() {
        const existing = document.getElementById('as-tools-settings');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'as-tools-settings';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = 10001;
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.4)';
        modal.style.minWidth = '300px';
        modal.style.padding = '20px';
        modal.style.background = 'transparent';


        modal.innerHTML = `
    <h3 style="margin-top:0; display: flex; align-items: center; gap: 8px;">
        Настройки AS CardControl
    </h3><br>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Блокировка карт без дублей
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-block" ${settings.blockCardEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопку, которая блокирует один экземпляр карты (по id), оставляя дубликаты нетронутыми."
      data-screenshot-url="https://i.postimg.cc/FH0frF8q/izobrazenie-2025-11-29-233741095.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Кнопка "Хочу карту" в ИИ-чате
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-add" ${settings.addCardEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопку 'Хочу карту' к сообщениям от ИИ о добавлении новой карты (подписка на колоду) с подсветкой добавленой S карты."
      data-screenshot-url="https://i.postimg.cc/BZVb0PY1/izobrazenie-2025-11-30-000455763.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Кнопка "Хочу карту" там, где её нет
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-want-card-button" ${settings.initWantCardButtonFeatureEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопку 'Хочу карту' в окно просмотра карты в библиотеке, листе желаний и на странице с Аниме.">
    <i class="fal fa-info-circle"></i>
</span>
</div>
<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Превью карт в обменах
      <button id="set-trade-hotkey-btn" type="button"
        style="padding: 2px 8px; border-radius: 4px; border: 1px solid #777; background: #333; color: #70d8ff; cursor: pointer; min-width: 60px; text-align: center; font-weight: bold; font-size: 14px;">
        ${getDisplayKey(GM_getValue('tradeHotkeyCode', 'KeyT'))}
      </button>
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-preview" ${settings.previewCardEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Превью карт в обменах (с горячей клавишей): Добавляет визуальное превью карт, предлагаемых в обмене, прямо в общем списке. Позволяет быстро открывать и принимать любой обмен прямо из списка. Активирует горячую клавишу (по умолчанию T) для немедленного открытия и принятия первого обмена. Также добавляет фильтры по рангам карт в списке обменов."
      data-screenshot-url="https://i.postimg.cc/T3mZt1Hc/izobrazenie-2025-11-30-002613633.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Кнопки карт/колод аниме
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-my-cards" ${settings.showMyCardsButton ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопки для быстрого перехода к вашим картам и колодам, связанным с текущим аниме, со страницы аниме."
      data-screenshot-url="https://i.postimg.cc/MpTYGF1f/izobrazenie-2025-11-30-003239656.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      СКМ (колесико) на карте
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-middle-click-owners" ${settings.enableCardOwnersViaMiddleClickEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Позволяет открыть страницу со всеми обладателями карты, нажав колесико мыши по любой карте (откроется в фоновой вкладке).">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Прогресс уровня клуба
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-level-progress" ${settings.showLevelProgressEstimateEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Показывает приблизительное количество дней до следующего уровня клуба, исходя из текущего опыта и вклада всех 600 карт ежедневно."
      data-screenshot-url="https://i.postimg.cc/zB6fn3c6/izobrazenie-2025-11-30-003814261.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Горячая клавиша перековки
      <button id="set-remelt-hotkey-btn" type="button"
        style="padding: 2px 8px; border-radius: 4px; border: 1px solid #777; background: #333; color: #70d8ff; cursor: pointer; min-width: 60px; text-align: center; font-weight: bold; font-size: 14px;">
        ${getDisplayKey(GM_getValue('remeltHotkeyCode', 'KeyE'))}
      </button>
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-remelt-hotkey" ${settings.initRemeltHotkeyFeatureEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Позволяет назначить горячую клавишу для быстрого нажатия кнопки перековки без пролистывания страницы, (Только для ПК)">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Кнопка в прогрессе колод
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-my-cards-buttons" ${settings.addMyCardsButtonsEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопки для быстрого перехода к картам определенного аниме со страницы прогресса колод. На своем профиле это будут 'Мои карты', на чужом - 'Карты: [Ник пользователя]'."
      data-screenshot-url="https://i.postimg.cc/KYTpZWyj/izobrazenie-2025-11-30-004155789.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      История обменов (уведомления/профиль)
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-trade-history" ${settings.enableTradeHistoryInNotificationsEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопки для быстрого просмотра истории обменов с конкретным пользователем из уведомлений и его профиля."
      data-screenshot-url="https://i.postimg.cc/gj73LYVW/izobrazenie-2025-11-30-004427638.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      "Условия пользователя" в обменах
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-trade-conditions" ${settings.initAsLoadUserTradeConditionsFeatureEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Загружает в окно обмена условия пользователя из его профиля (если они есть), а также его статистику обменов, клуб и среднее время ответа."
      data-screenshot-url="https://i.postimg.cc/mrZ3n6gD/izobrazenie-2025-11-30-004715694.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>


<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Переход в коллекцию по фильтру
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-user-cards-shortcuts" ${settings.addUserCardShortcutsEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Добавляет кнопки-фильтры (по рангам: S, A, B, C...) и кнопки 'Хочет/Меняет' в профиле пользователя для быстрого перехода по нужному фильтру."
      data-screenshot-url="https://i.postimg.cc/DZF9RhbP/izobrazenie-2025-11-30-005354777.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Зарядка небесного камня
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-celestial-charge" ${settings.initCelestialStoneChargeToFullEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Автоматически заряжает кирпич энергией карт, с настройкой сколько нужно энергии и сколько дублей оставить."
      data-screenshot-url="https://i.postimg.cc/nrVCFNND/izobrazenie-2025-11-30-010602951.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="setting-row">
  <div class="switch-label">
    <div class="switch-title">
      Блокнот 3000
    </div>
    <label class="switch-toggle">
      <input type="checkbox" id="toggle-notebook" ${settings.initNotebookFeatureEnabled ? 'checked' : ''}>
      <span class="slider round"></span>
    </label>
  </div>
<span class="info-icon"
      data-description="Открывает Блокнот 3000 — окно для сохранения ссылок и для быстрого перехода на любую страницу сайта."
      data-screenshot-url="https://i.postimg.cc/dtptp7Qh/izobrazenie-2025-11-30-010821380.png">
    <i class="fal fa-info-circle"></i>
</span>
</div>

<div class="modal-footer" style="
  position: sticky;
  bottom: 0;
  background: #111;
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #333;
  z-index: 2;
">
  <button id="save-settings">СОХРАНИТЬ</button>
  <button id="close-settings">ЗАКРЫТЬ</button>
</div>
    `;
        // === НАЧАЛО: ВСТАВКА КОДА ДЛЯ КНОПКИ ===
        const setHotkeyBtn = modal.querySelector('#set-remelt-hotkey-btn');
        const setTradeHotkeyBtn = modal.querySelector('#set-trade-hotkey-btn');
        if (setTradeHotkeyBtn) {
            setTradeHotkeyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const originalText = setTradeHotkeyBtn.textContent;
                setTradeHotkeyBtn.textContent = 'Нажмите клавишу...';
                setTradeHotkeyBtn.disabled = true;
                setTradeHotkeyBtn.style.backgroundColor = '#5c0000';
                setTradeHotkeyBtn.style.color = '#fff';

                const keyHandler = async (e) => {
                    e.preventDefault();
                    const newCode = e.code;
                    const displayKey = getDisplayKey(newCode);
                    await GM_setValue('tradeHotkeyCode', newCode);
                    setTradeHotkeyBtn.textContent = displayKey;
                    setTradeHotkeyBtn.disabled = false;
                    setTradeHotkeyBtn.style.backgroundColor = '#333';
                    document.removeEventListener('keydown', keyHandler, true);
                };

                document.addEventListener('keydown', keyHandler, true);
            });
        }
        if (setHotkeyBtn) {
            setHotkeyBtn.addEventListener('click', (e) => {
                e.preventDefault();

                // 1. Меняем состояние кнопки
                const originalText = setHotkeyBtn.textContent;
                setHotkeyBtn.textContent = 'Нажмите клавишу...';
                setHotkeyBtn.disabled = true;
                setHotkeyBtn.style.backgroundColor = '#5c0000';
                setHotkeyBtn.style.color = '#fff';

                // 2. Создаем обработчик нажатия
                const keyHandler = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newCode = e.code;
                    const displayKey = getDisplayKey(newCode);

                    // 3. Сохраняем и обновляем интерфейс
                    await GM_setValue('remeltHotkeyCode', newCode);
                    setHotkeyBtn.textContent = displayKey;

                    // 4. Возвращаем кнопку в исходное состояние
                    setHotkeyBtn.disabled = false;
                    setHotkeyBtn.style.backgroundColor = '#333';

                    // 5. Удаляем обработчик, чтобы он сработал только один раз
                    document.removeEventListener('keydown', keyHandler, true);
                };

                // 3. Добавляем временный обработчик
                document.addEventListener('keydown', keyHandler, true);
            });
        }
        document.body.appendChild(modal);

        // === НАЧАЛО: КОД ДЛЯ ОБРАБОТКИ ВСПЛЫВАЮЩИХ ПОДСКАЗОК ЧЕРЕЗ МОДАЛЬНОЕ ОКНО ===
        let currentTooltipModal = null;
        function showCustomTooltipModal(text, targetIcon) {
            if (currentTooltipModal) {
                currentTooltipModal.remove();
                currentTooltipModal = null;
            }
            const isDarkThemeDoc = document.documentElement.classList.contains('dark-theme');
            const tooltipModal = document.createElement('div');
            tooltipModal.className = 'custom-tooltip-modal';
            tooltipModal.style.background = isDarkThemeDoc ? '#3a3a3a' : '#f9f9f9';
            tooltipModal.style.color = isDarkThemeDoc ? '#fff' : '#000';
            tooltipModal.style.border = `1px solid ${isDarkThemeDoc ? '#555' : '#ccc'}`;
            tooltipModal.textContent = text;
            tooltipModal.style.top = '50%';
            tooltipModal.style.left = '50%';
            tooltipModal.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(tooltipModal);
            currentTooltipModal = tooltipModal;
            targetIcon.classList.add('tooltip-active-icon');
        }

        function hideCustomTooltipModal() {
            if (currentTooltipModal) {
                currentTooltipModal.remove();
                currentTooltipModal = null;
            }
            document.querySelectorAll('.info-icon.tooltip-active-icon').forEach(icon => {
                icon.classList.remove('tooltip-active-icon');
            });
        }
        const infoIcons = modal.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            const tooltipText = icon.getAttribute('data-tooltip');
            if (tooltipText) {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (icon.classList.contains('tooltip-active-icon')) {
                        hideCustomTooltipModal();
                    } else {
                        hideCustomTooltipModal();
                        showCustomTooltipModal(tooltipText, icon);
                    }
                });
            }
        });
        document.addEventListener('click', (e) => {
            if (currentTooltipModal && !e.target.closest('.info-icon') && !e.target.closest('.custom-tooltip-modal') && !e.target.closest('#as-tools-settings')) {
                hideCustomTooltipModal();
            }
        });
        // === КОНЕЦ: КОД ДЛЯ ВСПЛЫВАЮЩИХ ПОДСКАЗОК ===

        document.getElementById('save-settings').onclick = () => {
            settings.blockCardEnabled = document.getElementById('toggle-block').checked;
            settings.addCardEnabled = document.getElementById('toggle-add').checked;
            settings.previewCardEnabled = document.getElementById('toggle-preview').checked;
            settings.showMyCardsButton = document.getElementById('toggle-my-cards').checked;
            settings.enableCardOwnersViaMiddleClickEnabled = document.getElementById('toggle-middle-click-owners').checked;
            settings.showLevelProgressEstimateEnabled = document.getElementById('toggle-level-progress').checked;
            settings.initWantCardButtonFeatureEnabled = document.getElementById('toggle-want-card-button').checked;
            settings.initRemeltHotkeyFeatureEnabled = document.getElementById('toggle-remelt-hotkey').checked;
            settings.addMyCardsButtonsEnabled = document.getElementById('toggle-my-cards-buttons').checked;
            settings.enableTradeHistoryInNotificationsEnabled = document.getElementById('toggle-trade-history').checked;
            settings.initAsLoadUserTradeConditionsFeatureEnabled = document.getElementById('toggle-trade-conditions').checked;
            settings.addUserCardShortcutsEnabled = document.getElementById('toggle-user-cards-shortcuts').checked;
            settings.initCelestialStoneChargeToFullEnabled = document.getElementById('toggle-celestial-charge').checked;
            settings.initNotebookFeatureEnabled = document.getElementById('toggle-notebook').checked;


            GM_setValue('blockCardEnabled', settings.blockCardEnabled);
            GM_setValue('addCardEnabled', settings.addCardEnabled);
            GM_setValue('previewCardEnabled', settings.previewCardEnabled);
            GM_setValue('showMyCardsButton', settings.showMyCardsButton);
            GM_setValue('enableCardOwnersViaMiddleClickEnabled', settings.enableCardOwnersViaMiddleClickEnabled);
            GM_setValue('showLevelProgressEstimateEnabled', settings.showLevelProgressEstimateEnabled);
            GM_setValue('initWantCardButtonFeatureEnabled', settings.initWantCardButtonFeatureEnabled);
            GM_setValue('initRemeltHotkeyFeatureEnabled', settings.initRemeltHotkeyFeatureEnabled);
            GM_setValue('addMyCardsButtonsEnabled', settings.addMyCardsButtonsEnabled);
            GM_setValue('enableTradeHistoryInNotificationsEnabled', settings.enableTradeHistoryInNotificationsEnabled);
            GM_setValue('initAsLoadUserTradeConditionsFeatureEnabled', settings.initAsLoadUserTradeConditionsFeatureEnabled);
            GM_setValue('addUserCardShortcutsEnabled', settings.addUserCardShortcutsEnabled);
            GM_setValue('initCelestialStoneChargeToFullEnabled', settings.initCelestialStoneChargeToFullEnabled);
            GM_setValue('initNotebookFeatureEnabled', settings.initNotebookFeatureEnabled);


            location.reload();
            modal.remove();
            hideCustomTooltipModal();
        };
        document.getElementById('close-settings').onclick = () => {
            modal.remove();
            hideCustomTooltipModal();
        };
    }

    // ==== UI: Кнопка Настроек  ====
    function addSettingsButtonToFooter() {
        const footer = document.querySelector('footer.footer');
        if (!footer || document.getElementById('as-tools-settings-btn')) return;

        const btn = document.createElement('a');
        btn.id = 'as-tools-settings-btn';
        btn.href = '#';
        btn.className = 'footer__btn btn';
        btn.style.marginLeft = '10px';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '6px';
        btn.textContent = 'Настройки';
        btn.onclick = (e) => {
            e.preventDefault();
            showSettingsModal();
            setupCustomTooltips();
        };
        footer.appendChild(btn);
    }

    // ==== Функция 1: Блокировка карт без дублей ====
    function initCardBlocker() {
        if (!location.href.includes('/user/') || !location.href.includes('/cards/')) return;

        const observer = new MutationObserver(() => {
            const actionBlock = document.querySelector(".action_lock_show_block");
            if (!actionBlock || actionBlock.querySelector(".custom-lock-visible")) return;

            const createButton = (text, iconClass, mode, colorClass) => {
                const btn = document.createElement("a");
                btn.href = "#";
                btn.className = `btn ${colorClass} c-gap-10 profile-cards__deck-btn custom-lock-visible`;
                btn.style.display = 'inline-flex';
                btn.style.alignItems = 'center';
                btn.style.gap = '6px';
                btn.innerHTML = `<i class="fal fa-${iconClass}"></i> ${text}`;
                btn.onclick = (e) => {
                    e.preventDefault();
                    toggleVisibleLocks(mode);
                };
                return btn;
            };

            actionBlock.appendChild(createButton("Блокировка карт без дублей", "lock", "lock", "btn-green"));
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function toggleVisibleLocks(mode) {
            const cards = [...document.querySelectorAll(".anime-cards__item[data-id]")].filter(card => card.offsetParent !== null);
            const trophyIds = new Set();
            for (const card of cards) {
                const icon = card.querySelector(".lock-card-btn i");
                if (icon?.classList.contains("fa-trophy-alt")) {
                    trophyIds.add(card.dataset.id);
                }
            }
            if (mode === "lock") {
                const alreadyProcessed = new Set();
                for (const card of cards) {
                    const cardId = card.dataset.id;
                    if (alreadyProcessed.has(cardId) || trophyIds.has(cardId)) continue;
                    const icon = card.querySelector(".lock-card-btn i");
                    if (!icon) continue;
                    const isLocked = icon.classList.contains("fa-lock");
                    if (!isLocked) {
                        icon.parentElement.click();
                    }
                    alreadyProcessed.add(cardId);
                }
            }
            if (mode === "unlock") {
                for (const card of cards) {
                    const icon = card.querySelector(".lock-card-btn i");
                    if (!icon) continue;
                    const isTrophy = icon.classList.contains("fa-trophy-alt");
                    const isLocked = icon.classList.contains("fa-lock");
                    if (isTrophy) continue;
                    if (isLocked) {
                        icon.parentElement.click();
                    }
                }
            }
        }
    }

    // ==== Функция 2: Кнопка "Хочу карту" в чате ИИ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ====
    function addWantButtonsToBotMessages() {
        const messages = document.querySelectorAll('.dpm-dialog-message-text.full-text:not([data-want-processed])');

        messages.forEach(msg => {
            let link = msg.querySelector('a[href^="/cards/users/"]');
            if (!link) return;

            // --- Шаг 1: Изменяем цвет текста (если необходимо) ---
            // Это действие ПЕРЕСОЗДАЕТ все элементы внутри msg, включая ссылку!
            if (msg.textContent.includes('ранга S')) {
                const sRankColor = '#FF5733'; // Оранжево-красный цвет
                msg.innerHTML = msg.innerHTML.replace('ранга S', `<span style="color: ${sRankColor}; font-weight: bold;">ранга S</span>`);

                // !!! ВАЖНО: После изменения innerHTML, нужно ЗАНОВО найти элемент-ссылку (link)
                link = msg.querySelector('a[href^="/cards/users/"]');
                if (!link) return; // Проверка на случай, если ссылка исчезла
            }

            // --- Шаг 2: Создаем кнопку, используя обновленную (или оригинальную) ссылку ---
            const href = link.getAttribute('href');
            const idMatch = href.match(/id=(\d+)/);
            if (!idMatch) return;
            const cardId = idMatch[1];

            const btn = document.createElement('button');
            btn.className = 'all-owners';
            btn.style.marginLeft = '5px';
            btn.setAttribute('data-id', cardId);
            btn.setAttribute('data-type', '0');
            btn.innerHTML = '<i class="fal fa-search"></i> Хочу карту';

            // Привязываем обработчик к новому DOM-элементу (кнопке)
            btn.onclick = function () {
                if (typeof unsafeWindow.ProposeAdd === 'function') {
                    unsafeWindow.ProposeAdd.call(this);
                }
                return false;
            };

            // Добавляем кнопку после актуальной ссылки
            link.insertAdjacentElement('afterend', btn);

            msg.setAttribute('data-want-processed', '1');
        });
    }

    // ==== Функция 3: Превью в обменах ====
    function closeTradePreviewDialog() {
        const dialog = document.querySelector("#trade-preview-dialog");
        if (dialog) {
            const iframe = dialog.querySelector("iframe");
            if (iframe) iframe.src = "about:blank";
            dialog.remove();
        }
    }

    function openTradeInDialog(tradeUrl, tradeElement) {
        let dialog = document.querySelector("#trade-preview-dialog");
        if (!dialog) {
            dialog = document.createElement("dialog");
            dialog.id = "trade-preview-dialog";
            dialog.style.cssText = `width: 650px; max-width: 100vw; height: auto; max-height: 100vh; border: none; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 0 30px rgba(0,0,0,0.5);`;
            dialog.innerHTML = `
                <div id="trade-preview-header" style="height: 40px; background-color: #2c3e50; color: white; display: flex; align-items: center; justify-content: center; cursor: move; user-select: none;">
                    <span id="trade-preview-title">Загрузка...</span>
                </div>
                <iframe id="trade-preview-iframe" style="width: 100%; height: calc(100% - 40px); border: none; opacity: 0; visibility: hidden; transition: opacity 0.2s ease-in-out;" src="about:blank"></iframe>
                <form method="dialog" style="position: absolute; top: 5px; right: 10px; z-index: 10;">
                    <button type="button" id="trade-preview-close-btn" style="font-size: 20px; background: none; border: none; color: white; cursor: pointer;">✕</button>
                </form>`;
            document.body.appendChild(dialog);
            const closeBtn = dialog.querySelector("#trade-preview-close-btn");
            closeBtn.addEventListener("click", closeTradePreviewDialog);
            const header = dialog.querySelector("#trade-preview-header");
            let isDragging = false, offsetX = 0, offsetY = 0;
            header.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                isDragging = true;
                const rect = dialog.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                dialog.style.right = 'auto';
                dialog.style.margin = '0';
            });
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const rect = dialog.getBoundingClientRect();
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
                newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
                dialog.style.left = `${newX}px`;
                dialog.style.top = `${newY}px`;
            });
            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                GM_setValue('tradePreviewPosition', { top: dialog.style.top, left: dialog.style.left });
            });
        }
        dialog.style.position = "fixed";
        dialog.style.top = "0px";
        dialog.style.right = "0px";
        dialog.style.left = "auto";
        dialog.style.margin = "0";
        const savedPos = GM_getValue('tradePreviewPosition');
        if (savedPos?.top && savedPos?.left) {
            dialog.style.top = savedPos.top;
            dialog.style.left = savedPos.left;
            dialog.style.right = 'auto';
        }
        const iframe = dialog.querySelector("iframe");
        const fullUrl = new URL(tradeUrl, window.location.origin);
        fullUrl.searchParams.set('as_preview_iframe', 'true');
        iframe.src = fullUrl.href;
        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument;
                const selectorsToHide = [".header", ".site-topbar", ".site-navbar", ".footer", ".speedbar", ".ncard-list", "#clearCacheButton", "#toggleScriptButton", "#toggleCrystalScript", "#maxWidthSliderContainer", "#asbm_container"];
                selectorsToHide.forEach(sel => { const el = doc.querySelector(sel); if (el) el.style.display = "none"; });
                const wrapperAs = doc.querySelector(".wrapper-as");
                if (wrapperAs) wrapperAs.style.setProperty("padding-top", "0px", "important");
                const controlsBlock = doc.querySelector(".trade__controls");
                if (controlsBlock) controlsBlock.scrollIntoView({ behavior: "smooth", block: "center" });
                const confirmButtonObserver = new MutationObserver(() => {
                    const confirmBtn = doc.querySelector('.ui-dialog-buttonset button:last-child');
                    if (confirmBtn && confirmBtn.textContent.trim() === "Подтвердить" && !confirmBtn.dataset._handlerAttached) {
                        confirmBtn.dataset._handlerAttached = "true";
                        confirmBtn.addEventListener("click", () => {
                            const dialogObserver = new MutationObserver(() => {
                                if (!doc.querySelector(".ui-dialog")) {
                                    closeTradePreviewDialog();
                                    if (tradeElement?.remove) tradeElement.remove();
                                    dialogObserver.disconnect();
                                }
                            });
                            dialogObserver.observe(doc.body, { childList: true, subtree: true });
                        });
                    }
                });
                confirmButtonObserver.observe(doc.body, { childList: true, subtree: true });
            } catch (e) {
                console.warn("Ошибка доступа к iframe:", e);
            } finally {
                dialog.querySelector("#trade-preview-header span").textContent = 'Превью обмена';
                if (iframe.contentDocument && iframe.contentDocument.body) {
                    iframe.contentDocument.body.style.visibility = 'visible';
                }
                iframe.style.visibility = 'visible';
                iframe.style.opacity = '1';
            }
        };
        dialog.showModal();
    }

    // Мы выносим логику из цикла, чтобы ее можно было вызывать для каждого элемента индивидуально.
    async function processSingleTradeItem(anchor) {
        if (!anchor || anchor.dataset.enhanced === "true") return;

        anchor.dataset.enhanced = "true";
        anchor.setAttribute('draggable', 'false'); // Запрещаем перетаскивание
        anchor.style.userSelect = 'none'; // Запрещаем выделение текста
        anchor.style.padding = '5px';
        const link = anchor.getAttribute("href");
        if (!link) return;

        const isOffersPage = !!document.querySelector('a[href="/trades/offers/"].is-active');

        try {
            const res = await fetch(link);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const items = doc.querySelectorAll(".trade__main-items");
            if (items.length < 2) return;

            const offeredImgs = items[0].querySelectorAll("img");
            const requestedImgs = items[1].querySelectorAll("img");
            const cardStyle = `width: 70px; height: 105px; border-radius: 6px; object-fit: cover; box-shadow: 0 0 4px rgba(0,0,0,0.15);`;
            const makeColumn = (title, imgs, color) => {
                const wrap = document.createElement("div");
                wrap.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 4px;";
                const label = document.createElement("div");
                label.textContent = title;
                label.style.cssText = `font-size: 12px; color: ${color}; margin-bottom: 4px;`;
                wrap.appendChild(label);
                const imgRow = document.createElement("div");
                imgRow.style.cssText = "display: flex; flex-wrap: wrap; gap: 4px;";
                imgs.forEach(img => {
                    const el = document.createElement("img");
                    el.src = img.dataset.src || img.src;
                    el.className = 'trade-card-img';
                    el.style = cardStyle;
                    const parent = img.closest('.anime-cards__owned-by-user, .anime-cards__owned-by-user-want');
                    if (parent) {
                        if (parent.classList.contains('anime-cards__owned-by-user')) el.classList.add('anime-cards__owned-by-user');
                        if (parent.classList.contains('anime-cards__owned-by-user-want')) el.classList.add('anime-cards__owned-by-user-want');
                    }
                    imgRow.appendChild(el);
                });
                wrap.appendChild(imgRow);
                return wrap;
            };
            const leftBlock = isOffersPage ? makeColumn("Вы получите", requestedImgs, "#4caf50") : makeColumn("Вы получите", offeredImgs, "#4caf50");
            const rightBlock = isOffersPage ? makeColumn("Вы отдадите", offeredImgs, "#f44336") : makeColumn("Вы отдадите", requestedImgs, "#f44336");
            const arrow = document.createElement("div");
            arrow.textContent = "⇄";
            arrow.style.cssText = "font-size: 22px; font-weight: bold; align-self: center;";
            const rightWithArrow = document.createElement("div");
            rightWithArrow.style.cssText = "display: flex; align-items: center; gap: 8px;";
            rightWithArrow.append(arrow, rightBlock);

            const info = anchor.querySelector(".trade__list-info");
            const header = anchor.querySelector(".trade__list-header");

            // Создаем кнопку и вешаем на нее общий обработчик клика
            const previewBtn = document.createElement("button");
            previewBtn.textContent = "Открыть";
            previewBtn.setAttribute('data-hotkey-target', 'trade-open');
            previewBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof openTradeInDialog === 'function') {
                    openTradeInDialog(link, anchor);
                } else {
                    console.error('Функция openTradeInDialog не найдена!');
                    alert('Функция открытия обмена не найдена.');
                }
            };

            // --- ЛОГИКА ДЛЯ ПК ---
            if (window.innerWidth > 768) {
                // Применяем стили для вертикальной кнопки
                previewBtn.style.cssText = `
                display: flex !important; align-items: center !important; justify-content: center !important;
                box-sizing: border-box !important; writing-mode: vertical-rl !important; text-orientation: mixed !important;
                transform: rotate(180deg); padding: 64px 26px !important; font-size: 14px !important;
                font-weight: bold !important; cursor: pointer !important; border: 1.5px solid #800000 !important;
                border-radius: 5px !important; background: #a2a2a2 !important; color: #333 !important;
                white-space: nowrap !important; transition: background-color 0.2s, border-color 0.2s !important;
                margin-left: 10px !important; z-index: 2 !important; align-self: stretch !important;
            `;
                previewBtn.onmouseover = (e) => { e.target.style.background = "#ffffff"; e.target.style.borderColor = "#008000"; };
                previewBtn.onmouseout = (e) => { e.target.style.background = "#a2a2a2"; e.target.style.borderColor = "#800000"; };

                // Собираем основной контейнер с карточками и кнопкой
                const row = document.createElement("div");
                row.style.cssText = `display: flex !important; align-items: stretch !important; justify-content: space-between !important; margin-top: 10px !important; gap: 16px !important;`;
                const tradeDetailsContainer = document.createElement('div');
                tradeDetailsContainer.style.cssText = `display: flex !important; align-items: flex-start !important; gap: 16px !important; flex-grow: 1 !important;`;

                tradeDetailsContainer.append(leftBlock, rightWithArrow);
                row.append(tradeDetailsContainer, previewBtn);
                if (info) info.appendChild(row);

            }
            // --- ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ---
            else {
                // Применяем стили для компактной горизонтальной кнопки
                previewBtn.style.cssText = `padding: 16px 8px !important; font-size: 14px !important; height: auto !important; line-height: normal !important; font-weight: 500; cursor: pointer; border: 1px solid #777; border-radius: 5px; background: #e0e0e0; color: #333; white-space: nowrap; transition: background-color 0.2s, border-color 0.2s;`;
                previewBtn.onmouseover = (e) => { e.target.style.background = "#808080"; e.target.style.borderColor = "#555"; };
                previewBtn.onmouseout = (e) => { e.target.style.background = "#e0e0e0"; e.target.style.borderColor = "#777"; };

                // Добавляем карточки в основной блок
                const row = document.createElement("div");
                row.style.cssText = "display: flex; align-items: center; margin-top: 10px; gap: 16px;";
                row.append(leftBlock, rightWithArrow);
                if (info) info.appendChild(row);

                // А кнопку добавляем в заголовок (header)
                if (header) {
                    const dateElement = header.querySelector('.trade__list-date');
                    const rightGroup = header.querySelector('.trade__list-header > div') || document.createElement('div');
                    rightGroup.style.cssText = `display: flex; align-items: center; margin-left: auto; gap: 10px;`;

                    if(dateElement && !rightGroup.contains(dateElement)) rightGroup.appendChild(dateElement);
                    rightGroup.appendChild(previewBtn);
                    if (!header.contains(rightGroup)) header.appendChild(rightGroup);
                }
            }

            // --- ОБЩАЯ ОБРАБОТКА ХЕДЕРА ---
            // (Для ПК здесь просто переносится дата, для мобильных хедер уже собран выше)
            if (header) {
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.width = '100%';
                const oldIcon = header.querySelector('i.fal.fa-exchange');
                if (oldIcon) oldIcon.remove();

                if (window.innerWidth > 768 && !header.querySelector('.trade__list-header > div')) {
                    const dateElement = header.querySelector('.trade__list-date');
                    const rightGroup = document.createElement('div');
                    rightGroup.style.cssText = `display: flex; align-items: center; margin-left: auto; gap: 10px;`;
                    if (dateElement) rightGroup.appendChild(dateElement);
                    header.appendChild(rightGroup);
                }
            }
        } catch (err) {
            console.error("Ошибка подгрузки обмена:", link, err);
            anchor.removeAttribute('data-enhanced');
        }
    }

    function initTradeItemEnhancer_Optimized() {
        // Код для работы внутри iframe превью
        if (new URLSearchParams(window.location.search).has('as_preview_iframe')) {
            const style = document.createElement('style');
            style.textContent = `body, .wrapper-as { background: transparent !important; } .wrapper-as { padding-top: 0 !important; } .header, footer.footer, .speedbar, .ncard-list, #asbm_bar, .cbtns, #notebookToggleButton, #deckToggleBtn, #maxWidthSliderContainer, #bg-control-panel, #clearCacheButton, #toggleCrystalScript, #toggleActionButtonsVisibility, #toggleScriptButton { display: none !important; }`;
            document.documentElement.appendChild(style);
            return;
        }

        if (window.self !== window.top) return;

        // Добавляем стили для адаптивности, если их еще нет
        if (!document.getElementById('trade-enhancer-styles')) {
            const style = document.createElement('style');
            style.id = 'trade-enhancer-styles';
            style.textContent = `@media (max-width: 768px) { .trade-card-img { width: 50px !important; height: 75px !important; } }`;
            document.head.appendChild(style);
        }

        // Функция-обработчик для IntersectionObserver
        const handleIntersection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Элемент стал видим, запускаем для него обработку
                    processSingleTradeItem(entry.target);
                    // Прекращаем наблюдение за этим элементом, так как он уже обработан
                    observer.unobserve(entry.target);
                }
            });
        };

        // Создаем экземпляр IntersectionObserver
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '200px', // Начинаем загрузку за 200px до появления на экране
        });

        // Функция для поиска и добавления в наблюдение новых элементов обмена
        const observeNewTrades = () => {
            const anchorsToProcess = document.querySelectorAll("a.trade__list-item:not([data-enhanced])");
            anchorsToProcess.forEach(anchor => {
                observer.observe(anchor);
            });
        };

        // Наблюдаем за основным контейнером обменов, чтобы отловить подгрузку новых (если есть пагинация через AJAX)
        const listContainer = document.querySelector('.trade__list');
        if (listContainer) {
            const listObserver = new MutationObserver(observeNewTrades);
            listObserver.observe(listContainer, { childList: true });
        }

        observeNewTrades();
    }
    // === Горячая клавиша для открытия и подтверждения обмена (финальная тихая версия) ===
    function initTradeHotkey() {
        const hotkeyCode = GM_getValue('tradeHotkeyCode', 'KeyT');

        // Вспомогательная функция для имитации полного процесса клика
        const clickElement = (el) => {
            if (el) {
                // Имитируем полный процесс клика для лучшей совместимости
                el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                el.click();
                return true;
            }
            return false;
        };

        document.addEventListener('keydown', (e) => {
            // 0. Проверяем код клавиши, повтор, включение функции и блокировку
            if (e.code !== hotkeyCode || e.repeat) return;
            if (!GM_getValue('previewCardEnabled', true)) return;
            if (document.querySelector('#set-trade-hotkey-btn[disabled]')) return;

            e.preventDefault();
            e.stopPropagation();

            const confirmBtn = Array.from(
                document.querySelectorAll('.ui-dialog-buttonpane button.ui-button, .ui-dialog-buttonset button.ui-button')
            ).find((btn) => btn.textContent.trim() === 'Подтвердить');

            if (confirmBtn) {
                // Priority 1: Кликаем "Подтвердить"
                if (clickElement(confirmBtn)) return;
            }

            const tradePreviewDialog = document.querySelector('#trade-preview-dialog');
            if (tradePreviewDialog) {
                const iframe = tradePreviewDialog.querySelector('iframe');
                if (iframe && iframe.contentDocument) {
                    const doc = iframe.contentDocument;
                    const acceptBtn = doc.querySelector('button.trade__accepted-btn');

                    // Priority 2: Кликаем "Принять обмен" внутри iFrame
                    if (acceptBtn) {
                        if (clickElement(acceptBtn)) return;
                    }
                }
            }

            if (!tradePreviewDialog) {
                const mainDocumentAcceptBtn = document.querySelector('button.trade__accepted-btn');
                // Проверяем, что кнопка существует и видна
                if (mainDocumentAcceptBtn && mainDocumentAcceptBtn.offsetWidth > 0) {
                    // Priority 3: Кликаем "Принять обмен" на основной странице
                    if (clickElement(mainDocumentAcceptBtn)) return;
                }
            }

            const customOpenBtn = document.querySelector('button[data-hotkey-target="trade-open"]');

            if (customOpenBtn && customOpenBtn.offsetWidth > 0 && customOpenBtn.offsetHeight > 0) {
                // Priority 4: Кликаем "Открыть"
                if (clickElement(customOpenBtn)) return;
            }

            if (!tradePreviewDialog && !confirmBtn && !customOpenBtn) {
                const firstTrade = document.querySelector('a.trade__list-item');
                if (firstTrade) {
                    const openBtn = firstTrade.querySelector('button');
                    if (openBtn) clickElement(openBtn);
                    else clickElement(firstTrade);
                }
            }
        });
    }
    // ==== Фунция 4: Переход в мои карты с страницы аниме ====
    function insertMyCardsButton() {
        const block = document.querySelector('.sect.pmovie__related.sbox.fixidtab.cards-carousel');
        if (!block || block.querySelector('.as-my-cards-btn')) return;
        const link = block.querySelector('.glav-s');
        const usernameElement = document.querySelector('.lgn__name span');
        const header = document.querySelector('header.pcoln__header h1[itemprop="name"]');
        if (link && usernameElement && header) {
            const username = usernameElement.textContent.trim();
            let title = header.textContent.trim().replace(/\s*аниме\s*$/i, '');
            const currentDomain = window.location.origin;
            const searchUrl = `${currentDomain}/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(title)}&sort=name`;
            const a = document.createElement('a');
            a.href = searchUrl;
            a.target = '_self';
            a.textContent = 'Перейти в мои карты';
            a.className = 'as-my-cards-btn';
            a.style.cssText = `margin-right: 10px; margin-bottom: 10px; padding: 6px 10px; font: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; border: none; border-radius: 4px; background-color: #9e294f; color: #fff;`;
            const icon = document.createElement('span');
            icon.className = 'fal fa-yin-yang';
            a.prepend(icon);
            link.parentElement.insertBefore(a, link);
        }
    }

    // ==== Фунция 4.1: Переход в колоды с страницы аниме ====
    function insertMyCardsButton2() {
        const block = document.querySelector('.sect.pmovie__related.sbox.fixidtab.cards-carousel');
        if (!block || block.querySelector('.as-my-decks-btn')) return;
        const link = block.querySelector('.glav-s');
        const usernameElement = document.querySelector('.lgn__name span');
        const header = document.querySelector('header.pcoln__header h1[itemprop="name"]');
        if (link && usernameElement && header) {
            const username = usernameElement.textContent.trim();
            let title = header.textContent.trim().replace(/\s*аниме\s*$/i, '');
            const currentDomain = window.location.origin;
            const searchUrl = `${currentDomain}/user/${encodeURIComponent(username)}/cards_progress/?search=${encodeURIComponent(title)}&sort=name`;
            const a = document.createElement('a');
            a.href = searchUrl;
            a.target = '_self';
            a.textContent = 'Перейти в мои колоды';
            a.className = 'as-my-decks-btn';
            a.style.cssText = `margin-right: 10px; margin-bottom: 10px; padding: 6px 10px; font: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; border: none; border-radius: 4px; background-color: #9e294f; color: #fff;`;
            const icon = document.createElement('span');
            icon.className = 'fal fa-trophy-alt';
            a.prepend(icon);
            link.parentElement.insertBefore(a, link);
        }
    }

    // ==== Функция 5: Подсчет опыта клуба ====
    function showLevelProgressEstimate() {
        if (!location.pathname.startsWith("/clubs/")) return;
        const levelBlocks = Array.from(document.querySelectorAll(".nclub-enter__lvl"));
        const levelBlock = levelBlocks.find(block => block.querySelector(".nclub-enter__lvl-info"));
        if (!levelBlock) return;
        const infoBlock = levelBlock.querySelector(".nclub-enter__lvl-info");
        if (!infoBlock) return;
        const textParts = infoBlock.textContent.replace(/\s+/g, " ").trim().match(/(\d+)\s*\/\s*(\d+)/);
        if (!textParts) return;
        const currentXP = parseInt(textParts[1], 10);
        const requiredXP = parseInt(textParts[2], 10);
        const xpPerDay = 6000;
        const remainingXP = requiredXP - currentXP;
        const daysLeft = Math.ceil(remainingXP / xpPerDay);
        const span = infoBlock.querySelector("span");
        if (span && !span.textContent.includes("ещё")) {
            span.textContent += ` (ещё ${remainingXP.toLocaleString("ru-RU")})`;
        }
        if (!levelBlock.querySelector(".level-days-left")) {
            const bar = levelBlock.querySelector(".nclub-enter__lvl-bar");
            if (bar) {
                const info = document.createElement("div");
                info.className = "level-days-left";
                info.style.cssText = "text-align: right; margin-top: 4px; font-size: 13px; color: #999;";
                info.textContent = `До следующего уровня: ~${daysLeft} дн (600 карт в день)`;
                bar.insertAdjacentElement("afterend", info);
            }
        }
    }

    // ==== Функция 6: Кнопка "Хочу карту" на странице библиотеки ====
    function initWantCardButtonFeature() {
        // Внутренняя функция для добавления кнопки. Ее логика верна и остается без изменений.
        function addWantCardButton() {
            const modal = document.querySelector('#card-modal');
            if (!modal) return;

            const isAnotherUserInventory = modal.querySelector('.anime-cards__controls button[title*="среди карт пользователя"]');
            if (isAnotherUserInventory) {
                return;
            }

            const controls = modal.querySelector('.anime-cards__controls');
            if (!controls) return;

            if (controls.querySelector('.want-card-btn, button[onclick^="ProposeAdd"]')) return;

            const favBtn = controls.querySelector('.fav-btn-card[data-id]');
            if (!favBtn) return;

            const cardId = favBtn.getAttribute('data-id');
            if (!cardId) return;

            const btn = document.createElement('button');
            btn.className = 'all-owners want-card-btn';
            btn.setAttribute('data-id', cardId);
            btn.setAttribute('data-type', '0');
            btn.innerHTML = '<i class="fal fa-search"></i> Хочу карту';
            btn.onclick = function () {
                if (typeof unsafeWindow.ProposeAdd === 'function') {
                    unsafeWindow.ProposeAdd.call(this);
                } else {
                    console.error('AS CardControl: Функция ProposeAdd не найдена на странице!');
                }
                return false;
            };

            const allOwnersBtn = controls.querySelector('.all-owners');
            if (allOwnersBtn) {
                allOwnersBtn.insertAdjacentElement('afterend', btn);
            } else {
                controls.prepend(btn);
            }

            controls.querySelectorAll('.all-owners').forEach((el, index) => {
                el.style.marginLeft = index === 0 ? '0px' : '5px';
            });
        }
        const observer = new MutationObserver(() => addWantCardButton());

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==== Функция 7: Горячая клавиша перековки ====
    function initRemeltHotkeyFeature() {
        // ЭТОТ КОД ДОЛЖЕН ОСТАТЬСЯ, так как он следит за тем, какая клавиша назначена.
        let hotkeyCode = GM_getValue('remeltHotkeyCode', 'KeyE');
        let remeltButton = null;

        const observer = new MutationObserver(() => {
            const btn = document.querySelector('.remelt__start-btn');
            if (btn) remeltButton = btn;
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // ЭТОТ КОД ДОЛЖЕН ОСТАТЬСЯ, так как он запускает перековку при нажатии клавиши.
        document.addEventListener('keydown', function (event) {
            // Обновляем hotkeyCode, чтобы он использовал новое значение, если оно было изменено в настройках
            hotkeyCode = GM_getValue('remeltHotkeyCode', 'KeyE');

            if (event.code === hotkeyCode) {
                if (remeltButton) remeltButton.click();
                else console.warn('Кнопка перековки пока не найдена.');
            }
        });
    }

    // === функция 8: переход в мои карты из колод ===
    function addMyCardsButtons() {
        const currentDomain = window.location.origin;
        const pathMatch = window.location.pathname.match(/^\/user\/([^\/]+)\//);
        if (!pathMatch) return;
        const username = pathMatch[1];
        const decodedUsername = decodeURIComponent(username);
        const loggedInUsername = document.querySelector('.lgn__name span')?.textContent.trim();
        const isOwnProfile = decodedUsername === loggedInUsername;
        document.querySelectorAll('.user-anime:not([data-my-cards-btn-processed])').forEach(block => {
            block.setAttribute('data-my-cards-btn-processed', 'true');
            const titleElement = block.querySelector('.user-anime__title');
            const countDiv = block.querySelector('.user-anime__card-count');
            if (!titleElement || !countDiv) return;
            const animeTitle = titleElement.textContent.trim();
            if (animeTitle === 'Полные колоды') return;
            let masterContainer = countDiv.querySelector('.script-buttons-container');
            if (!masterContainer) {
                masterContainer = document.createElement('div');
                masterContainer.className = 'script-buttons-container';
                masterContainer.style.cssText = 'display: inline-flex; align-items: center; gap: 5px; margin-left: 10px;';
                countDiv.style.display = 'inline-flex';
                countDiv.style.alignItems = 'center';
                countDiv.appendChild(masterContainer);
            }
            let cardControlContainer = masterContainer.querySelector('.card-control-buttons');
            if (!cardControlContainer) {
                cardControlContainer = document.createElement('div');
                cardControlContainer.className = 'card-control-buttons';
                const deckTrackerContainer = masterContainer.querySelector('.deck-tracker-buttons');
                masterContainer.insertBefore(cardControlContainer, deckTrackerContainer);
            }
            const animeUrl = `${currentDomain}/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(animeTitle)}&sort=name`;
            const newBtn = document.createElement('a');
            newBtn.href = animeUrl;
            newBtn.target = '_self';
            newBtn.className = 'custom-open-btn-global';
            const label = isOwnProfile ? 'Мои карты' : `Карты: ${decodedUsername}`;
            newBtn.innerHTML = `${label}`;
            newBtn.style.cssText = `padding: 6px 10px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; text-decoration: none; border: none; border-radius: 4px; background-color: #079009; color: white; font: inherit; white-space: nowrap;`;
            cardControlContainer.appendChild(newBtn);
        });
    }

    // ==== Функция 9: перехода в историю обмена через уведомления и профиль ====
    function enableTradeHistoryInNotifications() {
        const selector = '.dropdown-item[id^="delete-"]';
        const btnClass = 'custom-trade-history';

        // --- получаем имя текущего пользователя (твой ник) ---
        const currentUser = document.querySelector('.lgn__name span')?.textContent?.trim() || '';

        function createTradeButton(username) {
            // формируем ссылку в новом формате
            const tradeBtn = document.createElement('a');
            tradeBtn.href = `/trades/history/?name=${encodeURIComponent(currentUser)}&trader=${encodeURIComponent(username)}`;
            tradeBtn.title = `История обменов с ${username}`;
            tradeBtn.className = btnClass;
            tradeBtn.innerHTML = `<i class="fal fa-user-clock"></i>`;
            Object.assign(tradeBtn.style, {
                margin: '0 6px',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '90%',
                display: 'inline-block',
                verticalAlign: 'middle',
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
                background: 'none',
                padding: '0'
            });
            tradeBtn.onfocus = () => tradeBtn.blur();
            tradeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
            return tradeBtn;
        }

        function insertTradeButtonsInNotifications() {
            document.querySelectorAll(selector).forEach(item => {
                const tradeLink = item.querySelector('a[href^="/trades/"]');
                const userLink = item.querySelector('a[href^="/user/"]');
                const eyeIcon = item.querySelector('.fa-eye');
                const alreadyInserted = item.querySelector(`.${btnClass}`);
                if (!tradeLink || !userLink || !eyeIcon || alreadyInserted) return;
                const username = userLink.textContent.trim();
                const tradeBtn = createTradeButton(username);
                eyeIcon.before(tradeBtn);
            });
        }

        function insertTradeButtonOnProfile() {
            const oldContainer = document.querySelector('.usn__name.d-flex');
            const oldH1 = oldContainer?.querySelector('h1');
            const oldUsername = oldH1?.textContent?.trim();
            const alreadyInsertedOld = oldContainer?.querySelector(`.${btnClass}`);

            // профиль старого формата
            if (oldContainer && oldH1 && oldUsername && !alreadyInsertedOld && oldUsername !== currentUser) {
                const tradeBtn = createTradeButton(oldUsername);
                tradeBtn.style.marginLeft = '8px';
                oldH1.after(tradeBtn);
                return;
            }

            // профиль нового формата
            const newH1 = document.querySelector('.ncard__main-title-2');
            const userLink = newH1?.querySelector('a[href^="/user/"]');
            const newUsername = userLink?.textContent?.trim();
            const alreadyInsertedNew = newH1?.querySelector(`.${btnClass}`);

            if (newH1 && newUsername && !alreadyInsertedNew && newUsername !== currentUser) {
                const tradeBtn = createTradeButton(newUsername);
                tradeBtn.style.marginLeft = '8px';
                newH1.appendChild(tradeBtn);
            }
        }

        const observer = new MutationObserver(() => {
            insertTradeButtonsInNotifications();
            insertTradeButtonOnProfile();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        insertTradeButtonsInNotifications();
        insertTradeButtonOnProfile();

        if (!document.querySelector('#trade-history-style')) {
            const style = document.createElement('style');
            style.id = 'trade-history-style';
            style.textContent = `a.${btnClass}::before, a.${btnClass}::after { display: none !important; content: none !important; }`;
            document.head.appendChild(style);
        }
    }


// ==== Функция 10: Открытие списка обладателей через СКМ (колесико) по карточке ====
function enableCardOwnersViaMiddleClick() {

    // 1. Вешаем ОДИН обработчик на весь документ.
    document.body.addEventListener('mousedown', (e) => {

        // 2. Проверяем, что это был клик колесиком. Если нет, мгновенно выходим.
        if (e.button !== 1) return;

        // 3. Ищем внешний контейнер карточки.
        const card = e.target.closest('.lootbox__card, .anime-cards__item, .deck__item, .card-show__placeholder');

        // 4. Проверки на наличие карточки и ID.
        if (!card) return;
        const cardId = card.dataset.id || card.getAttribute('data-id');
        if (!cardId) return;

        // 5. Получаем ранг карты.
        const cardRank = (card.dataset.rank || card.getAttribute('data-rank') || '').toLowerCase();

        // 6. Если все проверки пройдены, выполняем действие.
        e.preventDefault();
        const baseUrl = window.location.origin;
        let url;

        // 7. 🚀 Формируем URL в зависимости от ранга 🚀
        if (cardRank === 'sss') {
            // Если SSS-карта, используем ваш специальный путь
            // для просмотра обеих форм ('variant=all').
            url = `${baseUrl}/cards/${encodeURIComponent(cardId)}/awakened/?variant=all`;
        } else {
            // Для всех остальных карт используем стандартный путь к списку обладателей.
            url = `${baseUrl}/cards/users/?id=${encodeURIComponent(cardId)}`;
        }

        // 8. Открываем URL в новой вкладке.
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(url, { active: false, insert: true });
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    });
}
// ==== Функция 11: Загрузка условий обмена (Финальная версия, сохранение рабочего чекбокса) ====
function initAsLoadUserTradeConditionsFeature() {

    const waitForElement = (selector, container = document) => {
        return new Promise(resolve => {
            const el = container.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const el = container.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(container, { childList: true, subtree: true });
        });
    };

    (async () => {
        const container = await waitForElement('.noffer[data-receiver]');
        const username = container.getAttribute('data-receiver');
        if (!username) return;

        const conditionsDiv = await waitForElement('.noffer__right', container);
        const conditionsH3 = await waitForElement('h3', conditionsDiv);
        const targetUl = await waitForElement('ul', conditionsDiv);

        conditionsH3.style.display = 'flex';
        conditionsH3.style.justifyContent = 'space-between';
        conditionsH3.style.alignItems = 'center';

        // --- Логика добавления/поиска кнопок ---
        let buttonsContainer = conditionsH3.querySelector('.as-load-conditions-container');

        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('as-load-conditions-container');
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.alignItems = 'center';
            conditionsH3.appendChild(buttonsContainer);
        }

        let loadButton = buttonsContainer.querySelector('.as-load-conditions-button');
        if (!loadButton) {
            loadButton = document.createElement('button');
            loadButton.innerHTML = `Условия пользователя`;
            loadButton.classList.add('as-load-conditions-button');
            // Используем prepend, чтобы кнопка загрузки была слева от "Авто"
            buttonsContainer.prepend(loadButton);
        }

        let autoToggleDiv = buttonsContainer.querySelector('.as-auto-toggle-button');
        if (!autoToggleDiv) {
            // Создание кнопки "Авто"
            autoToggleDiv = document.createElement('div');
            autoToggleDiv.classList.add('as-auto-toggle-button');
            autoToggleDiv.style.cssText = `position: relative; width: 20px; height: 38px; cursor: pointer; margin-left: 0; border: 1px solid #444; border-radius: 5px; display: flex; justify-content: center; align-items: center;`;
            const autoToggleText = document.createElement('span');
            autoToggleText.textContent = 'Авто';
            autoToggleText.style.cssText = `color: #fff; font-size: 12px; font-weight: bold; transform: rotate(-90deg);`;
            autoToggleDiv.appendChild(autoToggleText);
            buttonsContainer.appendChild(autoToggleDiv);
        }

        let isAutoOpenEnabled = GM_getValue('as_auto_open_conditions', false);
        const updateToggleUI = () => {
            autoToggleDiv.style.backgroundColor = isAutoOpenEnabled ? 'green' : 'red';
        };
        updateToggleUI();

        autoToggleDiv.addEventListener('click', () => {
            isAutoOpenEnabled = !isAutoOpenEnabled;
            GM_setValue('as_auto_open_conditions', isAutoOpenEnabled);
            updateToggleUI();
        });


        // ----------------------------------------------------------
        // ЛОГИКА ЗАГРУЗКИ: СОХРАНЯЕМ ЧЕКБОКС И ВОССТАНАВЛИВАЕМ
        // ----------------------------------------------------------
        const loadAndDisplayConditions = async () => {
            loadButton.disabled = true;
            loadButton.textContent = 'Загрузка...';

            // 1. НАЙТИ И СОХРАНИТЬ РАБОЧИЙ DOM-ЭЛЕМЕНТ ЧЕКБОКСА
            // Ищем элемент <li>, который содержит <input name="trade_demand">
            const statsToggleLi = targetUl.querySelector('li .checkbox input[name="trade_demand"]')?.closest('li');
            let workingCheckboxElement = null;
            if (statsToggleLi) {
                // Сохраняем сам DOM-узел, чтобы сохранить его функциональность
                workingCheckboxElement = statsToggleLi;
            }

            // 2. ПОЛНОСТЬЮ ОЧИЩАЕМ UL (Удаление стандартных условий)
            targetUl.innerHTML = '';

            // Создаем новый LI для вставки нашего контента
            const infoLi = document.createElement('li');

            try {
                const profileUrl = `/user/${encodeURIComponent(username)}/`;
                const response = await fetch(profileUrl);
                if (response.ok) {
                    const responseText = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(responseText, 'text/html');

                    // --- КОД ПАРСИНГА (ОСТАВЛЕН БЕЗ ИЗМЕНЕНИЙ) ---
                    let aboutMeContent = null;
                    const aboutMeLiProfile = doc.querySelector('li.usn-list__wide');
                    if (aboutMeLiProfile && aboutMeLiProfile.querySelector('span')?.textContent.trim() === 'О себе:') {
                        const spanEndIndex = aboutMeLiProfile.innerHTML.indexOf('</span>');
                        if (spanEndIndex !== -1) {
                            let content = aboutMeLiProfile.innerHTML.substring(spanEndIndex + '</span>'.length);
                            content = content.replace(/<img[^>]*>/gi, '');
                            content = content.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');
                            content = content.replace(/<div\s+class="quote"[\s\S]*?<\/div>/gi, '');
                            content = content.trim().replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, '');
                            aboutMeContent = content;
                        }
                    }

                    let clubName = 'Не состоит в клубе';
                    const clubItem = doc.querySelector('.usn__club-item a[href*="/clubs/"]');
                    if (clubItem) {
                        clubName = `<a href="${clubItem.getAttribute('href')}" target="_blank">${clubItem.textContent.trim()}</a>`;
                    }

                    let lastOnline = 'Нет данных';
                    let avgConfirmTime = null;
                    const infoLines = doc.querySelectorAll('.usn__info-line');

                    infoLines.forEach(onlineInfo => {
                        const text = onlineInfo.textContent.trim();
                        const nowWatching = onlineInfo.querySelector('a.now_watch_anime');
                        if (nowWatching) {
                            lastOnline = 'Смотрит аниме';
                            return;
                        }
                        if (text.startsWith('В сети:')) {
                            lastOnline = text.replace('В сети:', '').trim();
                        } else if (text.startsWith('Время мысли:')) {
                            avgConfirmTime = text.replace('Время мысли:', '').trim();
                        }
                    });

                    const statsBlock = doc.querySelector('.usn-sect .shop__get-coins');
                    let tradeToday = 'N/A';
                    let tradeWeek = 'N/A';
                    let tradeAll = 'N/A';

                    if (statsBlock) {
                        const lis = Array.from(statsBlock.querySelectorAll('li'));
                        const tradeAllLi = lis.find(li => li.textContent.includes('Успешных обменов -'));
                        if (tradeAllLi) tradeAll = tradeAllLi.textContent.match(/\d+/)?.[0] || 'N/A';
                        const tradeTodayLi = lis.find(li => li.textContent.includes('Успешных обменов сегодня'));
                        const tradeWeekLi = lis.find(li => li.textContent.includes('Успешных обменов за неделю'));
                        if (tradeTodayLi) tradeToday = tradeTodayLi.textContent.match(/сегодня\s*-\s*(\d+)/i)?.[1] || 'N/A';
                        if (tradeWeekLi) tradeWeek = tradeWeekLi.textContent.match(/неделю\s*-\s*(\d+)/i)?.[1] || 'N/A';
                        if (!avgConfirmTime) {
                           const avgTimeLi = lis.find(li => li.textContent.includes('Среднее время подтверждения обменов'));
                           if (avgTimeLi) avgConfirmTime = avgTimeLi.textContent.replace('Среднее время подтверждения обменов -', '').trim();
                        }
                    }
                    // --- КОНЕЦ ПАРСИНГА ---

                    // Формирование вывода
                    let finalContent = `
                        <div style="padding: 8px 10px; border-radius: 8px; background: rgba(0, 123, 255, 0.08); border: 1px solid rgba(0, 123, 255, 0.25); margin-bottom: 10px;">
                            <b>Клуб:</b> ${clubName}<br>
                            <b>В сети:</b> ${lastOnline}
                        </div>
                        <div style="padding: 8px 10px; border-radius: 8px; background: rgba(255, 200, 0, 0.08); border: 1px solid rgba(255, 200, 0, 0.25); margin-bottom: 10px;">
                            ${aboutMeContent || 'Информация о себе отсутствует.'}
                        </div>
                        <div style="padding: 8px 10px; border-radius: 8px; background: rgba(64, 255, 128, 0.08); border: 1px solid rgba(64, 255, 128, 0.25);">
                            <b>Статистика обменов:</b><br>
                            За сегодня: ${tradeToday}<br>
                            За неделю: ${tradeWeek}<br>
                            Всего: ${tradeAll}
                            ${avgConfirmTime ? `<br> <b>Ср. время ответа:</b> ${avgConfirmTime}` : ''}
                        </div>
                    `;

                    infoLi.innerHTML = finalContent;

                    // 3. ДОБАВЛЯЕМ ВАШ КОНТЕНТ
                    targetUl.appendChild(infoLi);

                    // 4. ВОССТАНАВЛИВАЕМ РАБОЧИЙ ЧЕКБОКС (если был найден)
                    if (workingCheckboxElement) {
                        targetUl.appendChild(workingCheckboxElement);
                    }

                    targetUl.style.maxHeight = '380px';
                    targetUl.style.overflowY = 'auto';

                } else {
                    // Если ошибка загрузки, восстанавливаем UL с сообщением об ошибке и чекбоксом
                    targetUl.innerHTML = '<li>Информация не найдена.</li>';
                    if (workingCheckboxElement) {
                        targetUl.appendChild(workingCheckboxElement);
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки условий:', error);
                targetUl.innerHTML = '<li>Ошибка загрузки. Попробуйте еще раз.</li>';
                if (workingCheckboxElement) {
                        targetUl.appendChild(workingCheckboxElement);
                    }
            } finally {
                loadButton.disabled = false;
                loadButton.innerHTML = `Условия пользователя`;
            }
        };

        // Запускаем логику при инициализации, если включено автооткрытие
        if (isAutoOpenEnabled) {
            loadAndDisplayConditions();
        }

        // Добавляем слушателя клика (стандартная логика)
        loadButton.addEventListener('click', loadAndDisplayConditions);

    })();
}

    // ==== Фильтр обменов по рангу (превью обменов) ====
    function initTradePreviewRankFilter() {
        if (document.getElementById("trade-rank-filter")) return;

        // Вспомогательная функция для показа/скрытия спиннера
        function showLoadingSpinner() {
            const overlay = document.createElement('div');
            overlay.id = 'as-cardcontrol-spinner-overlay';
            overlay.innerHTML = '<div id="as-cardcontrol-spinner"></div>';
            document.body.appendChild(overlay);
            return () => overlay.remove();
        }

        const btnContainer = document.createElement("div");
        btnContainer.id = "trade-rank-filter";
        btnContainer.style.cssText = "margin-top: -5px; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; width: 100%;";

        const ranks = ["S", "A", "B", "C", "D", "E", "Все"];
        let activeBtn = null;

        function applyActiveStyle(btn) {
            btn.style.background = "#d33a64";
            btn.style.color = "#fff";
            btn.style.border = "1px solid #d33a64";
        }

        function applyInactiveStyle(btn) {
            btn.style.background = "#111";
            btn.style.color = "#fff";
            btn.style.border = "1px solid #fff";
        }

        ranks.forEach(rank => {
            const btn = document.createElement("a");
            btn.textContent = rank;
            btn.className = "btn btn-sm";
            btn.style.cssText = "padding: 4px 10px; border-radius: 4px; font-weight: bold; text-align: center; cursor: pointer; transition: background 0.2s, border 0.2s;";
            applyInactiveStyle(btn);
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                if (btn === activeBtn) return;
                const hideSpinner = showLoadingSpinner();

                // 1. Находим все еще не загруженные обмены
                const unloadedTrades = Array.from(document.querySelectorAll("a.trade__list-item:not([data-enhanced])"));

                if (unloadedTrades.length > 0) {
                    console.log(`AS CardControl: Обнаружено ${unloadedTrades.length} незагруженных обменов. Запускаю принудительную загрузку...`);
                    // 2. Создаем массив промисов для всех незагруженных элементов
                    const processingPromises = unloadedTrades.map(trade => processSingleTradeItem(trade));
                    // 3. Ждем, пока ВСЕ обмены загрузятся
                    await Promise.all(processingPromises);
                }

                // 4. Скрываем спиннер
                hideSpinner();
                document.querySelectorAll("#trade-rank-filter a").forEach(el => applyInactiveStyle(el));
                applyActiveStyle(btn);
                activeBtn = btn;

                // 5. Запускаем фильтр, теперь он "видит" все обмены
                filterTradesByRank(rank);
            });

            btn.addEventListener("mouseenter", () => {
                if (btn !== activeBtn) btn.style.background = "#333";
            });
            btn.addEventListener("mouseleave", () => {
                if (btn !== activeBtn) btn.style.background = "#111";
            });

            btnContainer.appendChild(btn);

            if (rank === "Все" && !activeBtn) {
                applyActiveStyle(btn);
                activeBtn = btn;
            }
        });

        const container = document.querySelector(".trade__list");
        if (container) container.before(btnContainer);
    }

    function filterTradesByRank(rank) {
        document.querySelectorAll("a.trade__list-item").forEach(trade => {
            const imgs = trade.querySelectorAll("img.trade-card-img");
            let hasRank = false;
            imgs.forEach(img => {
                const match = img.src.match(/\/cards_image\/\d+\/([a-z])\//i);
                if (match && match[1].toUpperCase() === rank) {
                    hasRank = true;
                }
            });
            trade.style.display = (rank === "Все" || hasRank) ? "" : "none";
        });
    }

    // ==== Счётчик обменов на вкладках (ИСПРАВЛЕНО) ====
    function initTradesCounter() {
        // проверяем, что это страница обменов
        if (!location.pathname.startsWith("/trades")) return;

        const observer = new MutationObserver(updateCounters);

        function updateCounters() {
            // считаем только видимые обмены (они отфильтрованы по рангам)
            const visibleTrades = document.querySelectorAll("a.trade__list-item:not([style*='display: none'])");
            const count = visibleTrades.length;

            // ищем кнопки вкладок обменов
            const tradeTabs = document.querySelectorAll(".ncard__tabs-btn");
            tradeTabs.forEach(tab => {
                // 1. Получаем базовую метку, удаляя любой существующий счетчик (наш или сайта)
                let label = tab.textContent.replace(/\s*\(\d+\)$/, "");

                // 2. Обновляем счетчик ТОЛЬКО для активной вкладки
                if (tab.classList.contains("is-active")) {
                    // Обновляем только вкладки "Предложения" и "Отправленные"
                    if (label.includes("Предложения") || label.includes("Отправленные")) {
                        tab.textContent = `${label} (${count})`;
                    }
                }
                // Если вкладка НЕ активна, мы НИЧЕГО не делаем,
                // сохраняя счетчик, предоставленный сайтом.
            });
        }

        // следим за изменениями списка обменов
        const tradeList = document.querySelector(".trade__list");
        if (tradeList) {
            observer.observe(tradeList, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
        }
        updateCounters();
    }

    // ==== Добавление выпадающего списка страниц пагинации ====
    function addPaginationDropdown() {
        const navExts = document.querySelectorAll('.pagination__pages .nav_ext');

        navExts.forEach(navExt => {
            // Проверяем, был ли уже создан выпадающий список для этого элемента
            if (navExt.nextElementSibling && navExt.nextElementSibling.classList.contains('as-pages-dropdown')) {
                return;
            }

            const lastVisibleLink = navExt.previousElementSibling;
            const nextVisibleLink = navExt.nextElementSibling;

            const startPage = parseInt(lastVisibleLink.textContent, 10) + 1;
            let endPage = null;

            if (nextVisibleLink && nextVisibleLink.tagName === 'A') {
                endPage = parseInt(nextVisibleLink.textContent, 10);
            } else {
                const lastPageLink = document.querySelector('.pagination__pages > a:last-child');
                endPage = parseInt(lastPageLink.textContent, 10);
            }

            if (isNaN(startPage) || isNaN(endPage) || endPage <= startPage) return;

            // Создаем контейнер для всплывающего списка
            const dropdownContainer = document.createElement('div');
            dropdownContainer.classList.add('as-pages-dropdown');
            dropdownContainer.style.position = 'absolute';
            dropdownContainer.style.zIndex = '1000';
            dropdownContainer.style.background = '#282b30';
            dropdownContainer.style.border = '1px solid #444';
            dropdownContainer.style.borderRadius = '8px';
            dropdownContainer.style.padding = '10px';
            dropdownContainer.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.5)';
            dropdownContainer.style.display = 'none';
            dropdownContainer.style.maxHeight = '200px';
            dropdownContainer.style.overflowY = 'auto';
            dropdownContainer.style.minWidth = '50px';
            dropdownContainer.style.textAlign = 'center';

            // Заполняем всплывающий список
            for (let i = startPage; i < endPage; i++) {
                const pageLink = document.createElement('a');
                const url = new URL(window.location.href);
                url.searchParams.set('page', i);
                pageLink.href = url.href;
                pageLink.textContent = i;
                pageLink.style.display = 'block';
                pageLink.style.padding = '4px 8px';
                pageLink.style.color = '#fff';
                pageLink.style.textDecoration = 'none';
                pageLink.style.borderRadius = '4px';
                pageLink.style.fontSize = '14px';

                pageLink.addEventListener('mouseenter', () => {
                    pageLink.style.backgroundColor = '#444';
                });
                pageLink.addEventListener('mouseleave', () => {
                    pageLink.style.backgroundColor = 'transparent';
                });
                dropdownContainer.appendChild(pageLink);
            }

            navExt.after(dropdownContainer);
            navExt.addEventListener('click', (e) => {
                e.preventDefault();
                const rect = navExt.getBoundingClientRect();
                dropdownContainer.style.left = `${navExt.offsetLeft}px`;
                dropdownContainer.style.bottom = `${window.innerHeight - rect.top + 5}px`;

                const isVisible = dropdownContainer.style.display === 'block';
                dropdownContainer.style.display = isVisible ? 'none' : 'block';
            });

            // Скрываем список, если клик был вне его
            document.addEventListener('click', (e) => {
                if (!navExt.contains(e.target) && !dropdownContainer.contains(e.target)) {
                    dropdownContainer.style.display = 'none';
                }
            });
        });
    }
// функция авто зарядки кирпича (ИСПРАВЛЕНО: Умное ожидание)
function initCelestialStoneChargeToFull() {
    if (!location.href.includes('/celestial_stone')) return;

    const MAX_CARDS = 70;
    let stopFlag = false;
    let currentPageNumber = 1;

    function getCurrentPageFromDOM() {
        const select = document.querySelector('#choose_stone_filter_page');
        currentPageNumber = select ? parseInt(select.value, 10) || 1 : 1;
        return currentPageNumber;
    }

    function getTotalPagesFromDOM() {
        const select = document.querySelector('#choose_stone_filter_page');
        return select ? select.options.length : 1;
    }

    function getCurrentlySelectedCount() {
        const mainItems = document.querySelector('.stone__main-items');
        if (mainItems) {
            return mainItems.querySelectorAll('.stone__main-item').length;
        }
        return 0;
    }

    const sortSelect = document.querySelector('.sort-block select');
    if (sortSelect && sortSelect.value !== 'name') {
        sortSelect.value = 'name';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function createCounter(id, label, initialValue, min, max, step = 1) {
        return `
            <div style="display: flex; align-items: center; gap: 5px;">
                <div style="white-space: nowrap;">${label}</div>
                <div class="counter-control" style="display: flex; align-items: center;">
                    <button class="btn btn-counter" data-id="${id}" data-action="decrement"
                        style="padding: 5px 8px; font-size: 16px; line-height: 1; border-radius: 4px 0 0 4px;">
                        &lt;
                    </button>
                    <input type="number" id="${id}" value="${initialValue}" min="${min}" max="${max}" step="${step}"
                        style="width: 50px; text-align: center; padding: 5px 0; border: none;
                                 background: #333; color: #fff; border-radius: 0; appearance: textfield;" disabled>
                    <button class="btn btn-counter" data-id="${id}" data-action="increment"
                        style="padding: 5px 8px; font-size: 16px; line-height: 1; border-radius: 0 4px 4px 0;">
                        &gt;
                    </button>
                </div>
            </div>`;
    }

    const panel = document.createElement('div');
    panel.className = 'stone__charge-panel';
    panel.style = `
        margin:10px 0;
        padding:10px;
        border:1px solid #666;
        border-radius:8px;
        background:rgba(0,0,0,0.45);
        color:#fff;
        text-align: center;`;

    panel.innerHTML = `
        <div><b>⚡ Зарядка небесного кирпича</b></div>
        <div style="color:#ffcc00;margin-top:5px;font-weight:bold;">
            ⚠️ ВНИМАНИЕ: Выберите ранг карты (A, B, C, D, E) для обмена!
        </div>

        <div id="controls_row_1"
            style="display:flex;align-items:center;gap:15px;flex-wrap:wrap;justify-content: center; margin-top: 10px;">
            ${createCounter('stone_keep_count', 'Оставить дублей', 1, 0, 10)}
            ${createCounter('energy_goal', 'Цель энергии', 1000, 1000, 20000, 1000)}
        </div>

        <div id="controls_row_2"
            style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content: center; margin-top: 10px;">
            <button id="charge_start" class="btn btn-green">⚡ Набрать</button>
            <button id="stop_charge" class="btn btn-red">⛔ Стоп</button>
        </div>

        <div id="charge_status" style="margin-top:8px;color:#9effff;">Ожидание...</div>
    `;
    document.querySelector('.stone__inventory')?.before(panel);

    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-counter');
        if (!btn) return;
        const input = document.getElementById(btn.dataset.id);
        if (!input) return;
        const min = +input.min, max = +input.max, step = +input.step || 1;
        let val = +input.value;
        if (btn.dataset.action === 'increment') val = Math.min(val + step, max);
        else val = Math.max(val - step, min);
        input.value = val;
    });

    const btnExchange = document.querySelector('.stone__send-trade-btn');
    const nowEnergyEl = document.getElementById('now_energy');
    const futureEnergyEl = document.getElementById('future-energy');
    const statusEl = document.getElementById('charge_status');

    async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // НОВАЯ ФУНКЦИЯ "УМНОГО ОЖИДАНИЯ" (ИСПРАВЛЕНО: принимает nowEnergyEl как аргумент)
    async function waitForEnergyUpdate(initialEnergy, nowEnergyEl, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const currentEnergy = nowEnergyEl ? parseInt(nowEnergyEl.textContent, 10) : initialEnergy;

                // Условие 1: Энергия успешно увеличилась
                if (currentEnergy > initialEnergy) {
                    clearInterval(interval);
                    resolve(true); // Успех
                    return;
                }

                // Условие 2: Прошло слишком много времени (тайм-аут)
                if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('Тайм-аут: энергия не обновилась вовремя.'));
                }
            }, 200); // Проверяем каждые 200 миллисекунд
        });
    }

    function getVisibleCards() {
        return Array.from(document.querySelectorAll('.stone__inventory-item'))
            .filter(el => el.offsetParent !== null);
    }

    function groupCards(cards) {
        const map = new Map();
        for (const c of cards) {
            const key = c.querySelector('img')?.src || c.dataset.id;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(c);
        }
        return map;
    }

    async function clickCard(card) {
        card.click();
        // Увеличенная скорость (было 150-350 мс)
        await sleep(50 + Math.random() * 100);
    }

    async function goToPage(page) {
        const select = document.querySelector('#choose_stone_filter_page');
        if (select) {
            if ([...select.options].some(o => o.value === String(page))) {
                select.value = String(page);
                select.dispatchEvent(new Event('change', { bubbles: true }));
                await sleep(500);
                return true;
            }
        }
        return false;
    }

    async function goToPrevPage() {
        const prevBtn = document.querySelector('#prev_filter_page button');
        if (prevBtn && !prevBtn.closest('.stone-filter-list__pagination-item--disabled')) {
            prevBtn.click();
            await sleep(1500);
            return true;
        }
        return false;
    }

    // --- Пакет обмена ---
    async function oneExchangeBatch(keepCount, startPage, totalPages) {
        let currentPage = startPage;
        let selected = getCurrentlySelectedCount();
        const goal = +document.getElementById('energy_goal').value;

        // Если уже всё заполнено (ПЕРВЫЙ БЛОК ОБМЕНА)
        if (selected >= MAX_CARDS) {
            statusEl.style.color = '#9effff';
            statusEl.textContent =
                `📦 Обмен... Инвентарь полон: ${selected} карт (+${parseInt(futureEnergyEl.textContent || '0', 10)} энергии).`;

            // СТАРЫЙ БЛОК ЗАМЕНЕН НА НОВЫЙ
            if (!stopFlag) {
                const energyBeforeExchange = +nowEnergyEl.textContent || 0;
                btnExchange.click();

                try {
                    // ИСПРАВЛЕНИЕ: передаем nowEnergyEl
                    await waitForEnergyUpdate(energyBeforeExchange, nowEnergyEl, 10000);
                    statusEl.textContent = '✅ Обмен успешен, энергия обновлена.';
                } catch (error) {
                    console.error('[AS CardControl] Ошибка ожидания обновления энергии:', error.message);
                    statusEl.textContent = '⚠️ Не удалось подтвердить обмен. Остановка.';
                    stopFlag = true;
                }
            }
            return !stopFlag;
        }

        // Переход на стартовую
        const domPage = getCurrentPageFromDOM();
        if (startPage !== domPage) {
            await goToPage(startPage);
        }
        currentPage = getCurrentPageFromDOM();

        statusEl.style.color = '#9effff';
        statusEl.textContent =
            `🔋 ${+nowEnergyEl.textContent}/${goal}. 📄 Выбор карт на странице ${currentPage} из ${totalPages}. Еще нужно: ${MAX_CARDS - selected}...`;

        while (!stopFlag && selected < MAX_CARDS) {

            const cards = getVisibleCards();
            const updatedCurrent = +nowEnergyEl.textContent || 0;

            // *** УДАЛЕНА ЛОГИКА ОСТАНОВКИ НА ПУСТОЙ 1-й СТРАНИЦЕ ***

            const grouped = groupCards(cards);
            let hasSelectable = false;

            for (const [, group] of grouped) {
                if (group.length <= keepCount) continue;
                hasSelectable = true;

                for (let card of group.slice(keepCount)) {
                    if (stopFlag || selected >= MAX_CARDS) break;
                    await clickCard(card);

                    selected = getCurrentlySelectedCount();

                    statusEl.style.color = '#9effff';
                    statusEl.textContent =
                        `🔋 ${+nowEnergyEl.textContent}/${goal}. 📄 Выбор карт на странице ${currentPage} из ${totalPages}. Еще нужно: ${MAX_CARDS - selected}...`;
                }
            }

            // *** На 1-й странице, но ничего выбирать нельзя ***
            if (!hasSelectable && currentPage === 1) {
                statusEl.style.color = '#ff4444';
                statusEl.textContent =
                    `🛑 ${updatedCurrent}/${goal}. 📄 На странице 1 нет подходящих карт — остановка.`;
                stopFlag = true;
                return false;
            }

            if (!stopFlag && selected < MAX_CARDS) {
                const moved = await goToPrevPage();

                // Если не удалось перейти на предыдущую страницу (дошли до 1-й)
                if (!moved) {
                    if (selected === 0) {
                        // Набрали 0 карт и не смогли перейти с 1-й -> карт больше нет.
                        statusEl.style.color = '#ff4444';
                        statusEl.textContent =
                            `🛑 ${updatedCurrent}/${goal}. Обход завершен на странице 1, набрано 0 карт — остановка.`;
                        stopFlag = true;
                        return false;
                    } else {
                        // Набрали > 0 карт и дошли до 1-й -> пора обменивать.
                        break;
                    }
                }

                const newPage = getCurrentPageFromDOM();
                if (newPage !== currentPage) {
                    currentPage = newPage;
                    statusEl.style.color = '#9effff';
                    statusEl.textContent =
                        `🔋 ${+nowEnergyEl.textContent}/${goal}. 📄 Выбор карт на странице ${currentPage} из ${totalPages}. Еще нужно: ${MAX_CARDS - selected}...`;
                }
            }
        }

        if (stopFlag || selected === 0) return false;

        const batchEnergy = parseInt(futureEnergyEl.textContent || '0', 10);
        statusEl.style.color = '#9effff';
        statusEl.textContent =
            `📦 Выбрано ${selected} карт (+${batchEnergy} энергии). Обмениваем...`;

        // ВТОРОЙ БЛОК ОБМЕНА
        // СТАРЫЙ БЛОК ЗАМЕНЕН НА НОВЫЙ
        if (!stopFlag) {
            const energyBeforeExchange = +nowEnergyEl.textContent || 0;
            btnExchange.click();

            try {
                // ИСПРАВЛЕНИЕ: передаем nowEnergyEl
                await waitForEnergyUpdate(energyBeforeExchange, nowEnergyEl, 10000);
                statusEl.textContent = '✅ Обмен успешен, энергия обновлена.';
            } catch (error) {
                console.error('[AS CardControl] Ошибка ожидания обновления энергии:', error.message);
                statusEl.textContent = '⚠️ Не удалось подтвердить обмен. Остановка.';
                stopFlag = true;
            }
        }

        return !stopFlag;
    }

    // --- Основной цикл ---
    async function chargeCycle() {
        const keepCount = +document.getElementById('stone_keep_count').value;
        const goal = +document.getElementById('energy_goal').value;
        let prevEnergy = +nowEnergyEl.textContent || 0;

        const totalPages = getTotalPagesFromDOM();
        let startPageNumber = getCurrentPageFromDOM();

        // 🚩 ЛОГИКА ПЕРВОНАЧАЛЬНОГО ПЕРЕХОДА (ТОЛЬКО ПРИ ЗАПУСКЕ)
        if (startPageNumber === 1 && totalPages > 1) {
            statusEl.textContent = `➡️ Запуск с 1-й страницы. Переходим на последнюю (${totalPages})...`;
            await goToPage(totalPages);
            startPageNumber = getCurrentPageFromDOM(); // Обновляем текущую страницу
            await sleep(500);
        }

        statusEl.style.color = '#9effff';
        statusEl.textContent =
            `🚀 Начинаем зарядку. Обход начнется с ${startPageNumber} страницы (всего ${totalPages}). Цель: ${goal}. Текущий заряд: ${prevEnergy}/${goal}`;

        while (!stopFlag) {
            const current = +nowEnergyEl.textContent || 0;

            if (current >= goal) {
                statusEl.textContent = `✅ Цель достигнута! (${current}/${goal})`;
                return;
            }

            // Используем текущую страницу, на которой остановились
            const currentPageToStart = getCurrentPageFromDOM();

            statusEl.style.color = '#9effff';
            statusEl.textContent =
                `⚡ Текущий заряд: ${current}/${goal}. Обход начнется с ${currentPageToStart} (всего ${totalPages}).`;

            // oneExchangeBatch начинает с текущей страницы и идет назад
            const ok = await oneExchangeBatch(keepCount, currentPageToStart, totalPages);

            if (!ok || stopFlag) {
                 // Если oneExchangeBatch вернул false (остановился из-за отсутствия карт или ошибки), завершаем цикл.
                 return;
            }

            await sleep(1500);

            const newEnergy = +nowEnergyEl.textContent || 0;
            if (newEnergy <= prevEnergy) {
                statusEl.style.color = '#ff4444';
                statusEl.textContent =
                    `⚠ Энергия не увеличилась. Карты закончились или произошла ошибка. Завершение.`;
                return;
            }

            prevEnergy = newEnergy;
            statusEl.textContent =
                `⚡ Текущий заряд: ${newEnergy}/${goal}. Обмен успешен. Продолжаем обход (начнет с 1й стр. и остановится).`;

            // 🛑 НЕТ ПЕРЕХОДА НА ПОСЛЕДНЮЮ СТРАНИЦУ ПОСЛЕ ОБМЕНА.
        }
    }

    document.getElementById('charge_start').addEventListener('click', () => {
        statusEl.style.color = '#9effff';
        statusEl.textContent = '🚀 Запуск цикла зарядки...';
        stopFlag = false;
        chargeCycle();
    });

    document.getElementById('stop_charge').addEventListener('click', () => {
        stopFlag = true;
        statusEl.style.color = '#ff4444';
        statusEl.textContent = '⛔ Остановка: дальнейший обмен отменён.';
    });
}


    let isFirstRun = true;
    function getDisplayKey(keyCode) {
        if (!keyCode) return 'НЕТ';
        // Удаляем стандартные префиксы (например, 'Key' из 'KeyE', 'Digit' из 'Digit1')
        return keyCode
            .replace(/^(Key|Digit|Numpad)/, '')
            .replace('Space', 'Пробел') // Для удобочитаемости
            .toUpperCase();
    }
    function initPackFeatures() {
        // 1. Самостоятельная проверка страницы
        if (!window.location.pathname.includes('/cards/pack')) {
            return;
        }

        // Константы
        const COLOR = '#8b00ff';
        const CLUB_ICON_HTML = `
        <span style="margin-left: 5px;">
        </span>
    `;
        const PACK_COUNTER_SELECTOR = '.lootbox__counter__s';
        const PURCHASE_OPTIONS_SELECTOR = '.lootbox__middle';

        // =========================================================================
        // Логика: Динамический расчет оставшихся камней до S-карты
        // =========================================================================

        // Используем существующую в вашем коде waitForElement
        waitForElement(PACK_COUNTER_SELECTOR, (packSpan) => {
            const parentLi = packSpan.closest('li');
            const brElement = parentLi.querySelector('br');
            let wrapper = parentLi.querySelector('.s-counter-info');

            if (!wrapper) {
                // Создание контейнера для вставки (только если его нет)
                wrapper = document.createElement('span');
                wrapper.className = 's-counter-info';
                wrapper.style.marginLeft = '5px';

                if (brElement) {
                    brElement.insertAdjacentElement('beforebegin', wrapper);
                } else {
                    parentLi.appendChild(wrapper);
                }
            }

            const updateDisplay = () => {
                const packsRemaining = parseInt(packSpan.textContent.trim(), 10);

                if (isNaN(packsRemaining) || packsRemaining <= 0) {
                    wrapper.innerHTML = '';
                    wrapper.style.display = 'none';
                    return;
                }

                // Находим активную опцию покупки для динамического курса
                const activeOption = document.querySelector('.lootbox__middle-item--active');

                let stonesCost = 0;
                if (activeOption) {
                    // Если есть активная опция, рассчитываем стоимость по ее курсу
                    const activeCount = parseInt(activeOption.dataset.count, 10);
                    const priceText = activeOption.querySelector('.lootbox__middle-price').textContent.trim();
                    const activePrice = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

                    if (activeCount > 0) {
                        // Формула: (Паков осталось / Паков в лоте) * Цена лота
                        stonesCost = (packsRemaining / activeCount) * activePrice;
                    }
                } else {
                    // Запасной вариант, если активная опция не найдена
                    stonesCost = packsRemaining * 100;
                }

                const roundedStones = Math.ceil(stonesCost);

                wrapper.style.display = 'inline';
                wrapper.innerHTML = `
                <span style="color: ${COLOR}; font-weight: bold;">
                    (≈ ${roundedStones} камней)
                </span>
                ${CLUB_ICON_HTML}
            `;
            };

            updateDisplay();

            // Наблюдатели для автоматического обновления
            // 1. Наблюдатель для счетчика паков (после покупки)
            const counterObserver = new MutationObserver(updateDisplay);
            counterObserver.observe(packSpan, {
                characterData: true,
                subtree: true,
                childList: true
            });
            // 2. Наблюдатель для опций (при переключении 1/6/20 паков)
            waitForElement(PURCHASE_OPTIONS_SELECTOR, (optionsContainer) => {
                const optionsObserver = new MutationObserver(updateDisplay);
                optionsObserver.observe(optionsContainer, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['class']
                });
            });
        });
    }
    // ====== Добавляем: функция добавления ссылок/кнопок в профиле пользователя ======
    function addUserCardShortcuts(profileSelector = 'a.usn-sect__title[href*="/user/cards/?name="]') {
        const profileLink = document.querySelector(profileSelector);
        if (!profileLink) return;

        const url = new URL(profileLink.href, window.location.origin);
        const userName = url.searchParams.get('name');
        if (!userName) return;

        const baseDomain = window.location.origin;

        const currentUserLink = document.querySelector('a[href*="/user/"]:not([href*="cards"])');
        const currentUser = currentUserLink ? new URL(currentUserLink.href, baseDomain).pathname.split('/').pop() : null;

        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginLeft: '8px',
            verticalAlign: 'middle'
        });

        const ranks = ['', 'sss', 'ass', 's', 'a', 'b', 'c', 'd', 'e'];
        const labels = { '': 'Все',sss: 'SSS', ass: 'ASS', s: 'S', a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' };

        function makeLink(text, href, icon = null) {
            const link = document.createElement('a');
            link.href = href;
            link.style.display = 'inline-flex';
            link.style.alignItems = 'center';
            link.style.gap = '3px';
            link.style.padding = '2px 6px';
            link.style.border = '1px solid #888';
            link.style.borderRadius = '6px';
            link.style.background = '#222';
            link.style.color = '#eee';
            link.style.textDecoration = 'none';
            link.style.cursor = 'pointer';
            link.style.fontSize = '12px';
            link.style.transition = 'background 0.2s';
            link.addEventListener('mouseover', () => { link.style.background = '#444'; });
            link.addEventListener('mouseout', () => { link.style.background = '#222'; });

            if (icon) {
                const i = document.createElement('i');
                i.className = icon;
                i.style.fontSize = '12px';
                link.appendChild(i);
            }

            if (text) {
                const span = document.createElement('span');
                span.textContent = text;
                link.appendChild(span);
            }

            return link;
        }

        // Фильтры по рангам
        ranks.forEach(rank => {
            const href = `${baseDomain}/user/cards/?name=${encodeURIComponent(userName)}${rank ? `&rank=${rank}` : ''}`;
            container.appendChild(makeLink(labels[rank], href));
        });

        const rankSeparator = document.createElement('span');
        rankSeparator.textContent = ' | ';
        rankSeparator.style.color = '#aaa';
        rankSeparator.style.margin = '0 4px';
        container.appendChild(rankSeparator);

        if (!currentUser || currentUser.toLowerCase() !== userName.toLowerCase()) {
            const heartLink = makeLink('', `${baseDomain}/user/cards/?name=${encodeURIComponent(userName)}&locked=0&in_list=1&sort=name`, 'fal fa-leaf');
            heartLink.title = 'Карты, которые ты хочешь и которые есть у этого пользователя';
            container.appendChild(heartLink);
        }
        const sep = document.createElement('span');
        sep.textContent = ' | ';
        sep.style.color = '#aaa';
        sep.style.margin = '0 4px';
        container.appendChild(sep);

        container.appendChild(makeLink('Хочет', `${baseDomain}/user/cards/need/?name=${encodeURIComponent(userName)}`));
        container.appendChild(makeLink('Меняет', `${baseDomain}/user/cards/trade/?name=${encodeURIComponent(userName)}`));

        profileLink.insertAdjacentElement('afterend', container);
    }
    // ====== Конец addUserCardShortcuts ======
    // --- НОВЫЙ ФУНКЦИОНАЛ: КНОПКА "В СПИСКЕ" (IN_LIST) ---

    function addNewInListButton() {
        'use strict';
        const tabsMenu = document.querySelector('.usertabs .tab__menu');
        const copyButton = document.getElementById('CopyThisPage');

        if (!tabsMenu || !copyButton) {
            return;
        }
        const clearSearchButton = tabsMenu.querySelector('[title="Очистить поиск по картам"]');

        if (!clearSearchButton) {
            return;
        }

        const onclickAttr = clearSearchButton.getAttribute('onclick');
        if (!onclickAttr) {
            return;
        }

        const match = onclickAttr.match(/name=([^&';]+)/);
        const username = match ? match[1] : null;

        if (!username) {
            return;
        }

        const newButton = document.createElement('button');
        const targetUrl = `/user/cards/?name=${username}&locked=0&in_list=1`;

        newButton.className = 'tabs__item tabs__navigate__lock tabs__navigate__inlist';
        newButton.title = 'Карты, добавленные в список желаний (открытые)';
        newButton.setAttribute('data-locked', '0');
        newButton.setAttribute('href', '#');
        newButton.innerHTML = '<i class="fal fa-heart"></i>';

        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = targetUrl;
        });

        tabsMenu.insertBefore(newButton, clearSearchButton);
    }

    function initInListButtonFeature(settings) {
        // Проверка, что находимся на странице карт пользователя
        if (window.location.pathname.startsWith('/user/cards/')) {
            setTimeout(addNewInListButton, 500);
        }
    }
    // --- КОНЕЦ НОВОГО ФУНКЦИОНАЛА ---
    function initNotebook() {
if (window.self !== window.top) {
        return;
    }
        (function() {
            'use strict';
            const DATA_STORAGE_KEY = 'notebookData';
            const STATE_STORAGE_KEY = 'notebookState';

            let data = GM_getValue(DATA_STORAGE_KEY, {});

            function getNotebookState() {
                try {
                    const state = JSON.parse(sessionStorage.getItem(STATE_STORAGE_KEY));
                    return state || { isModalOpen: false, expandedGroups: [], scrollPosition: 0 };
                } catch (e) {
                    return { isModalOpen: false, expandedGroups: [], scrollPosition: 0 };
                }
            }

            let notebookState = getNotebookState();

            function saveNotebookState() {
                sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(notebookState));
            }

            function saveData() {
                GM_setValue(DATA_STORAGE_KEY, data);
            }

            function debounce(func, delay) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }
            // === 📦 API переноса без блокирующих окон ===

            const OLD_REQ = "AS_NOTEBOOK_GET_DATA";
            const OLD_RESP = "AS_NOTEBOOK_DATA_RESPONSE";

            function findOldNotebookDataSimple() {
                return new Promise((resolve) => {
                    let resolved = false;

                    function handler(ev) {
                        if (ev.data && ev.data.type === OLD_RESP) {
                            resolved = true;
                            window.removeEventListener("message", handler);
                            resolve(ev.data.payload || null);
                        }
                    }

                    window.addEventListener("message", handler);

                    // Запрос старику
                    try { window.postMessage({ type: OLD_REQ }, "*"); } catch(e){}

                    // Фоллбек через unsafeWindow
                    setTimeout(() => {
                        if (resolved) return;

                        try {
                            if (
                                typeof unsafeWindow !== 'undefined' &&
                                unsafeWindow.asNotebookAPI &&
                                typeof unsafeWindow.asNotebookAPI.getData === 'function'
                            ) {
                                const d = unsafeWindow.asNotebookAPI.getData();
                                if (d && typeof d === "object") {
                                    window.removeEventListener("message", handler);
                                    resolve(d);
                                    return;
                                }
                            }
                        } catch(e){}

                        resolve(null);
                    }, 400);
                });
            }

            function mergeOldNotebookSimple(oldObj) {
                let addedGroups = 0;
                let addedItems = 0;

                for (const groupName of Object.keys(oldObj)) {
                    const items = oldObj[groupName];
                    if (!Array.isArray(items)) continue;

                    if (!data[groupName]) {
                        data[groupName] = [];
                        addedGroups++;
                    }

                    const existing = new Set(data[groupName].map(i => i.title.trim().toLowerCase()));

                    for (const it of items) {
                        const t = String(it.title || "");
                        const u = it.url || "";

                        if (!existing.has(t.toLowerCase())) {
                            data[groupName].push({ title: t, url: u });
                            addedItems++;
                        }
                    }
                }

                saveData();
                return { addedGroups, addedItems };
            }

            // === Главное действие ===
            async function runSyncTransfer() {
                const oldData = await findOldNotebookDataSimple();

                if (!oldData) {
                    showToast("Старый блокнот не найден.");
                    return;
                }

                const res = mergeOldNotebookSimple(oldData);
                renderGroups();

                showToast(`Импорт завершён: групп +${res.addedGroups}, записей +${res.addedItems}`);
            }

            // === Неблокирующее всплывающее уведомление ===
            function showToast(text) {
                let t = document.createElement("div");
                t.style = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        padding: 10px 18px;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        z-index: 99999999;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        backdrop-filter: blur(4px);
    `;
                t.textContent = text;
                document.body.appendChild(t);

                setTimeout(() => {
                    t.style.transition = "0.3s";
                    t.style.opacity = "0";
                    setTimeout(() => t.remove(), 300);
                }, 2200);
            }

            function addButton() {
                const btn = document.createElement('button');
                btn.innerHTML = '<i class="fal fa-book" aria-hidden="true"></i>';

                btn.id = 'notebookToggleButton';
                btn.title = 'Твой личный архив "А вдруг пригодится?"';
                btn.style = `
        position: fixed;
        bottom: 46px;
        left: 0;
        width: 45px;
        height: 45px;
        /* ИЗМЕНЕНИЕ 4: Делаем прямоугольной/квадратной */
        border-radius: 0;

        background: rgba(52, 152, 219, 0.25);
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(8px);
        font-size: 24px;
        color: white;
        cursor: pointer;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
                btn.onclick = () => {
                    const existing = document.getElementById('notebookModal');
                    if (existing) {
                        existing.remove();
                        notebookState.isModalOpen = false;
                    } else {
                        openModal();
                        notebookState.isModalOpen = true;
                    }
                    saveNotebookState();
                };
                document.body.appendChild(btn);

                if (!document.getElementById('notebook-fscr-styles')) {
                    const style = document.createElement('style');
                    style.id = 'notebook-fscr-styles';
                    style.textContent = `
                body.fscr-active #notebookToggleButton {
                    display: none !important;
                }
            `;
                    document.head.appendChild(style);
                }
            }

            function openDialog(options) {
                return new Promise((resolve) => {
                    const existing = document.getElementById('dialogModal');
                    if (existing) existing.remove();

                    const modal = document.createElement('div');
                    modal.id = 'dialogModal';
                    modal.style = `
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000000;
                font-family: Arial, sans-serif;
            `;

                    const box = document.createElement('div');
                    box.style = `
                background: #222831;
                padding: 20px;
                border-radius: 10px;
                width: 320px;
                color: white;
                box-shadow: 0 8px 24px rgba(0,0,0,0.8);
            `;

                    if (options.title) {
                        const title = document.createElement('div');
                        title.textContent = options.title;
                        title.style = 'font-weight: bold; font-size: 18px; margin-bottom: 12px;';
                        box.appendChild(title);
                    }

                    const form = document.createElement('form');
                    form.style = 'display: flex; flex-direction: column; gap: 12px;';

                    const inputs = {};

                    if (options.fields && options.fields.length) {
                        options.fields.forEach(f => {
                            const label = document.createElement('label');
                            label.style = 'display: flex; flex-direction: column; font-size: 14px;';
                            label.textContent = f.label;
                            const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
                            input.type = f.type || 'text';
                            input.value = f.value || '';
                            input.style = `
                        margin-top: 6px;
                        padding: 6px;
                        border-radius: 5px;
                        border: none;
                        font-size: 14px;
                        resize: vertical;
                    `;
                            if (f.type === 'textarea') {
                                input.rows = 2;
                            }
                            label.appendChild(input);
                            form.appendChild(label);
                            inputs[f.label] = input;
                        });
                    } else if (options.message) {
                        const msg = document.createElement('div');
                        msg.textContent = options.message;
                        msg.style = 'margin-bottom: 20px; font-size: 15px;';
                        box.appendChild(msg);
                    }

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.style = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;';

                    const cancelBtn = document.createElement('button');
                    cancelBtn.type = 'button';
                    cancelBtn.textContent = 'Отмена';
                    cancelBtn.style = `
                background: #b33939;
                border: none;
                padding: 6px 14px;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-weight: bold;
            `;
                    cancelBtn.onclick = () => {
                        modal.remove();
                        resolve(null);
                    };

                    const okBtn = document.createElement('button');
                    okBtn.type = 'submit';
                    okBtn.textContent = options.confirmText || 'OK';
                    okBtn.style = `
                background: #00b894;
                border: none;
                padding: 6px 14px;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-weight: bold;
            `;

                    buttonsDiv.appendChild(cancelBtn);
                    buttonsDiv.appendChild(okBtn);
                    form.appendChild(buttonsDiv);

                    form.onsubmit = (e) => {
                        e.preventDefault();
                        const results = {};
                        if (options.fields && options.fields.length) {
                            for (const f of options.fields) {
                                const val = inputs[f.label].value.trim();
                                if (f.required && !val) {
                                    alert(`Пожалуйста, заполните поле "${f.label}"`);
                                    return;
                                }
                                results[f.label] = val;
                            }
                            modal.remove();
                            resolve(results);
                        } else {
                            modal.remove();
                            resolve(true);
                        }
                    };

                    box.appendChild(form);
                    modal.appendChild(box);
                    document.body.appendChild(modal);

                    if (options.fields && options.fields.length) {
                        inputs[options.fields[0].label].focus();
                    }
                });
            }

            function showMessage(message, title = 'Сообщение') {
                return openDialog({title, message, confirmText: 'Закрыть'});
            }

            function openModal() {
                const modal = document.createElement('div');
                modal.id = 'notebookModal';
                modal.style = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 320px;
            height: 90vh;
            background: rgba(25,25,35,0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            color: #fff;
            z-index: 1000000;
        `;

                modal.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight:bold">Блокнот 3000</span>
                <button id="nbClose" title="Закрыть окно"
                    style="background:none;border:none;color:white;cursor:pointer;font-size:18px; padding: 0;">
                    ✖️
                </button>
            </div>

            <div id="notebookHeaderControls" style="display:flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start;">
                <button id="syncBtn"
                    title="Синхронизация данных из старого скрипта (если был)"
                    style="background:#95a5a6; border:none; border-radius:4px; padding:2px 8px; color:#fff; cursor:pointer; flex-grow: 1; min-width: 80px;">
                    Синхро
                </button>

                <button id="addGroupBtn"
                    title="Добавить новую группу"
                    style="background:#3498db; border:none; border-radius:4px; padding:2px 8px; color:#fff; cursor:pointer; flex-grow: 1; min-width: 80px;">
                    + Группа
                </button>

                <button id="importBtn"
                    title="Загрузить группу из файла"
                    style="background:#8e44ad; border:none; border-radius:4px; padding:2px 8px; color:#fff; cursor:pointer; flex-grow: 1; min-width: 80px;">
                    📂 Импорт
                </button>

            </div>
        </div>

        <div id="groupsList" style="flex:1; overflow-y:auto; padding: 10px;"></div>

        <div style="padding:10px; border-top:1px solid rgba(255,255,255,0.1);">
            <input id="searchInput" type="text" placeholder="Поиск..."
                style="width:100%; padding:6px; border-radius:6px; border:none; background:#2c3e50; color:#fff;">
        </div>
    `;

                document.body.appendChild(modal);

                document.getElementById('syncBtn').onclick = runSyncTransfer;

                document.getElementById('nbClose').onclick = () => {
                    modal.remove();
                    notebookState.isModalOpen = false;
                    saveNotebookState();
                };

                document.getElementById('searchInput').oninput = renderGroups;

                const groupsList = document.getElementById('groupsList');
                groupsList.onscroll = debounce(() => {
                    notebookState.scrollPosition = groupsList.scrollTop;
                    saveNotebookState();
                }, 250);

                const importBtn = document.getElementById('importBtn');

                // Переносим обработчик на новую кнопку
                importBtn.onclick = () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/json';
                    input.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        try {
                            const text = await file.text();
                            const parsed = JSON.parse(text);

                            if (!parsed.items || !Array.isArray(parsed.items)) {
                                await showMessage('Файл не содержит корректных данных.', 'Ошибка');
                                return;
                            }

                            const defaultName = file.name.replace(/^notebook-/, '').replace(/\.json$/i, '');
                            let groupName = defaultName;
                            let counter = 1;
                            while (data[groupName]) {
                                groupName = `${defaultName} (${counter++})`;
                            }

                            data[groupName] = parsed.items;
                            saveData();
                            renderGroups();

                        } catch (err) {
                            await showMessage('Ошибка при чтении файла.', 'Ошибка');
                        }
                    };
                    input.click();
                };

                // document.getElementById('addGroupBtn').after(importBtn); // Удаляем, так как importBtn теперь в HTML

                document.getElementById('addGroupBtn').onclick = async () => {
                    const result = await openDialog({
                        title: 'Добавить новую группу',
                        fields: [{label: 'Название группы:', type: 'text', required: true}],
                        confirmText: 'Добавить'
                    });
                    if (result) {
                        const groupName = result['Название группы:'];
                        if (data[groupName]) {
                            await showMessage('Группа с таким именем уже существует.', 'Ошибка');
                        } else {
                            data[groupName] = [];
                            saveData();
                            renderGroups();
                        }
                    }
                };

                renderGroups();

                setTimeout(() => {
                    if (groupsList && notebookState.scrollPosition) {
                        groupsList.scrollTop = notebookState.scrollPosition;
                    }
                }, 0);
            }

            async function renderGroups() {
                const container = document.getElementById('groupsList');
                if (!container) return;

                const query = document.getElementById('searchInput').value.trim().toLowerCase();
                container.innerHTML = '';

                for (const [group, items] of Object.entries(data)) {

                    const matches = query ? items.some(i => i.title.toLowerCase().includes(query)) : true;
                    if (!matches) continue;

                    const wrapper = document.createElement('div');
                    wrapper.style = 'margin-bottom:10px;';

                    const groupHeader = document.createElement('div');
                    groupHeader.style = `
                display: flex;
                justify-content: space-between;
                align-items:center;
                background:#34495e;
                padding:6px;
                border-radius:6px;
                cursor: pointer;
            `;

                    const title = document.createElement('span');
                    title.textContent = group;
                    title.style = 'font-weight:bold; flex-grow: 1; pointer-events: none;';

                    const buttons = document.createElement('div');
                    buttons.style = 'display:flex; gap:4px;';

                    const addBtn = document.createElement('button');
                    addBtn.textContent = '+';
                    addBtn.title = 'Добавить запись';
                    addBtn.style = 'background:#27ae60;border:none;border-radius:4px;padding:2px 11px;cursor:pointer;color:#fff;';
                    addBtn.onclick = async (e) => {
                        e.stopPropagation();
                        const result = await openDialog({
                            title: `Добавить запись в группу "${group}"`,
                            fields: [
                                {label: 'Название записи:', type: 'text', required: true},
                                {label: 'Ссылка:', type: 'text', value: window.location.href, required: true}
                            ],
                            confirmText: 'Добавить'
                        });
                        if (result) {
                            data[group] = data[group] || [];
                            data[group].push({title: result['Название записи:'], url: result['Ссылка:']});
                            saveData();
                            renderGroups();
                        }
                    };

                    const editGroupBtn = document.createElement('button');
                    editGroupBtn.textContent = '✏️';
                    editGroupBtn.title = 'Переименовать группу';
                    editGroupBtn.style = 'background:#f39c12;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;color:#fff;';
                    editGroupBtn.onclick = async (e) => {
                        e.stopPropagation();
                        const result = await openDialog({
                            title: `Переименовать группу`,
                            fields: [{label: 'Новое название:', type: 'text', value: group, required: true}],
                            confirmText: 'Сохранить'
                        });
                        if (result) {
                            const newGroupName = result['Новое название:'];
                            if (data[newGroupName] && newGroupName !== group) {
                                await showMessage('Группа с таким именем уже существует.', 'Ошибка');
                                return;
                            }

                            if (newGroupName !== group) {
                                data[newGroupName] = data[group];
                                delete data[group];

                                const expandedIndex = notebookState.expandedGroups.indexOf(group);
                                if (expandedIndex > -1) {
                                    notebookState.expandedGroups[expandedIndex] = newGroupName;
                                    saveNotebookState();
                                }

                                saveData();
                                renderGroups();
                            }
                        }
                    };

                    const delBtn = document.createElement('button');
                    delBtn.textContent = '🗑️';
                    delBtn.title = 'Удалить группу';
                    delBtn.style = 'background:#e74c3c;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;color:#fff;';
                    delBtn.onclick = async (e) => {
                        e.stopPropagation();
                        const result = await openDialog({
                            title: `Подтверждение удаления группы "${group}"`,
                            message: `Введите название группы для подтверждения удаления:`,
                            fields: [{label: 'Название группы:', type: 'text', required: true}],
                            confirmText: 'Удалить'
                        });
                        if (result) {
                            if (result['Название группы:'] === group) {
                                delete data[group];

                                const index = notebookState.expandedGroups.indexOf(group);
                                if (index > -1) {
                                    notebookState.expandedGroups.splice(index, 1);
                                    saveNotebookState();
                                }

                                saveData();
                                renderGroups();
                            } else {
                                await showMessage('Название не совпадает. Отмена.', 'Ошибка');
                            }
                        }
                    };

                    buttons.appendChild(addBtn);
                    buttons.appendChild(editGroupBtn);
                    buttons.appendChild(delBtn);

                    groupHeader.appendChild(title);
                    groupHeader.appendChild(buttons);

                    const listDiv = document.createElement('div');
                    listDiv.style.marginTop = '5px';

                    items.forEach((entry, index) => {
                        if (query && !entry.title.toLowerCase().includes(query)) return;

                        const row = document.createElement('a');
                        try {
                            const url = new URL(entry.url);
                            row.href = location.origin + url.pathname + url.search + url.hash;
                        } catch (e) {
                            row.href = entry.url;
                        }
                        row.style = `
                    padding: 6px 8px;
                    margin-bottom: 4px;
                    background: #16a085;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    text-decoration: none;
                `;

                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = entry.title;
                        titleSpan.style.flexGrow = '1';

                        const editEntryBtn = document.createElement('button');
                        editEntryBtn.textContent = '✏️';
                        editEntryBtn.title = 'Редактировать запись';
                        editEntryBtn.style = 'background:#f39c12; border:none; border-radius:4px; padding:2px 6px; cursor:pointer; color:#fff; margin-left:8px;';
                        editEntryBtn.onclick = async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const result = await openDialog({
                                title: 'Редактировать запись',
                                fields: [
                                    {label: 'Название записи:', type: 'text', value: entry.title, required: true},
                                    {label: 'Ссылка:', type: 'text', value: entry.url, required: true}
                                ],
                                confirmText: 'Сохранить'
                            });

                            if (result) {
                                data[group][index].title = result['Название записи:'];
                                data[group][index].url = result['Ссылка:'];
                                saveData();
                                renderGroups();
                            }
                        };

                        const delEntryBtn = document.createElement('button');
                        delEntryBtn.textContent = '🗑️';
                        delEntryBtn.title = 'Удалить запись';
                        delEntryBtn.style = 'background:#e74c3c; border:none; border-radius:4px; padding:2px 6px; cursor:pointer; color:#fff; margin-left:8px;';
                        delEntryBtn.onclick = async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const result = await openDialog({
                                title: `Подтверждение удаления записи`,
                                message: `Удалить запись "${entry.title}"?`,
                                confirmText: 'Удалить'
                            });
                            if (result) {
                                data[group].splice(index, 1);
                                saveData();
                                renderGroups();
                            }
                        };

                        row.appendChild(titleSpan);
                        row.appendChild(editEntryBtn);
                        row.appendChild(delEntryBtn);
                        listDiv.appendChild(row);
                    });

                    const userHasExpanded = notebookState.expandedGroups.includes(group);
                    const searchForcesExpand = query && matches;

                    let isExpanded = userHasExpanded || searchForcesExpand;
                    listDiv.style.display = isExpanded ? 'block' : 'none';

                    groupHeader.oncontextmenu = async (e) => {
                        e.preventDefault();

                        const result = await openDialog({
                            title: 'Сохранить группу?',
                            message: `Скачать группу "${group}" как файл?`,
                            confirmText: 'Скачать'
                        });

                        if (!result) return;

                        const blob = new Blob([JSON.stringify({ items: data[group] }, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `notebook-${group}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    };

                    groupHeader.onclick = (e) => {
                        if (e.target.closest('button')) return;

                        isExpanded = !isExpanded;
                        listDiv.style.display = isExpanded ? 'block' : 'none';

                        const index = notebookState.expandedGroups.indexOf(group);
                        if (isExpanded && index === -1) {
                            notebookState.expandedGroups.push(group);
                        } else if (!isExpanded && index > -1) {
                            notebookState.expandedGroups.splice(index, 1);
                        }
                        saveNotebookState();
                    };

                    wrapper.appendChild(groupHeader);
                    wrapper.appendChild(listDiv);
                    container.appendChild(wrapper);
                }
            }

            addButton();

            if (notebookState.isModalOpen) {
                openModal();
            }

            window.addEventListener('focus', () => {
                const latestData = GM_getValue(DATA_STORAGE_KEY, {});
                data = latestData;
                const latestState = getNotebookState();
                notebookState = latestState;

                const modalOpen = document.getElementById('notebookModal');
                if (modalOpen) {
                    renderGroups();
                    const list = document.getElementById('groupsList');
                    if (list) list.scrollTop = notebookState.scrollPosition;
                }
            });

            if (typeof GM_addValueChangeListener === 'function') {
                GM_addValueChangeListener(DATA_STORAGE_KEY, (name, oldValue, newValue, remote) => {
                    if (remote) {
                        data = newValue;
                        const modalOpen = document.getElementById('notebookModal');
                        if (modalOpen) renderGroups();
                    }
                });
            }

        })();
    }
///сколько дублей надо
(function() {
    const starCosts = {
        'S': [1, 1, 1, 1, 2],
        'A': [4, 8, 12, 16, 20],
        'B': [5, 10, 15, 20, 25],
        'C': [10, 15, 20, 25, 30],
        'D': [10, 15, 20, 25, 30],
        'E': [10, 15, 20, 25, 30]
    };

    function updateStarCalculations() {
        const orderSelect = document.getElementById('cards_order');
        const items = document.querySelectorAll('.anime-cards__item');

        items.forEach(item => {
            const duplSpan = item.querySelector('.dupl-count');
            const img = item.querySelector('img');
            if (!duplSpan || !img) return;

            // Вешаем обработчик события
            duplSpan.onmouseenter = function() {
                // ПРОВЕРКА ФИЛЬТРА: если не "По звёздам", ничего не делаем и выходим
                if (!orderSelect || orderSelect.value !== 'stars') {
                    this.title = "";
                    return;
                }

                // Извлечение данных (ранг, звезды, баланс)
                const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
                const pathParts = src.toLowerCase().split('/');

                let rank = 'C';
                const ciIndex = pathParts.indexOf('cards_image');
                if (ciIndex !== -1 && pathParts[ciIndex + 2]) {
                    const foundRank = pathParts[ciIndex + 2].toUpperCase();
                    if (['S','A','B','C','D','E'].includes(foundRank)) rank = foundRank;
                }

                const starMatch = src.match(/_stars_(\d)/);
                const currentStars = starMatch ? parseInt(starMatch[1]) : 0;
                const currentBalance = parseInt(duplSpan.textContent.split('/')[0]) || 0;

                if (currentStars >= 5) {
                    this.title = `Ранг ${rank} | 5★\nМаксимальный уровень!`;
                    return;
                }

                const costs = starCosts[rank];
                let tempBalance = currentBalance;
                let reachableStar = currentStars;
                let totalNeededToFive = 0;
                let nextStepShortage = 0;

                for (let i = currentStars; i < 5; i++) {
                    let cost = costs[i];
                    if (tempBalance >= cost) {
                        tempBalance -= cost;
                        reachableStar = i + 1;
                    } else {
                        if (nextStepShortage === 0) nextStepShortage = cost - tempBalance;
                        totalNeededToFive += (cost - tempBalance);
                        tempBalance = 0;
                    }
                }

                let info = [];
                info.push(`Ранг ${rank} | ${currentStars}★`);
                info.push(`────────────────────────`);

                if (reachableStar > currentStars) {
                    info.push(`✅ Хватит до: ${reachableStar}★`);
                }

                if (reachableStar < 5) {
                    const nextStar = reachableStar + 1;
                    info.push(`⚠️ До ${nextStar}★ не хватает: ${nextStepShortage} шт.`);
                    if (nextStar < 5) {
                        info.push(`🎯 До 5★ всего нужно: ${totalNeededToFive} шт.`);
                    }
                } else {
                    info.push(`✨ Можно сразу сделать 5★!`);
                }

                this.title = info.join('\n');
            };
        });
    }

    // Слушатель для фильтра
    const orderSelect = document.getElementById('cards_order');
    if (orderSelect) {
        orderSelect.addEventListener('change', () => {
            // Просто запускаем обновление через паузу, без агрессивной очистки атрибутов
            setTimeout(updateStarCalculations, 200);
        });
    }

    // Запуск при загрузке
    setTimeout(updateStarCalculations, 200);
})();
    function main() {
        // === ГЛОБАЛЬНЫЕ ФУНКЦИИ (запускаются только один раз при первой загрузке скрипта) ===
        if (isFirstRun) {
            addSettingsButtonToFooter();
            if (settings.initRemeltHotkeyFeatureEnabled) initRemeltHotkeyFeature();
            if (settings.initWantCardButtonFeatureEnabled) initWantCardButtonFeature();
            if (settings.enableCardOwnersViaMiddleClickEnabled) enableCardOwnersViaMiddleClick();
            if (settings.enableTradeHistoryInNotificationsEnabled) enableTradeHistoryInNotifications();
            if (settings.addUserCardShortcutsEnabled) {
                initInListButtonFeature(settings);
            }

            if (settings.initCelestialStoneChargeToFullEnabled) {
                initCelestialStoneChargeToFull();
            }

            if (settings.initNotebookFeatureEnabled) {
                initNotebook();
            }

            isFirstRun = false;
            observeUrlChanges(main);
            initPackFeatures();
        }

        // === РОУТЕР: Запускаем код только для конкретной страницы ===
        // Этот блок будет выполняться при каждой смене URL
        const path = window.location.pathname;

        // --- Страница коллекции карт (/user/.../cards/) или библиотека (/cards/) ---
        if (path.startsWith('/cards/') || (path.includes('/user/') && path.includes('/cards/'))) {
            if (!path.includes('/trade/')) {
                if (settings.blockCardEnabled && path.includes('/user/')) initCardBlocker();
                addPaginationDropdown();
                return;
            }
        }

        // === НОВЫЙ ВЫЗОВ ФУНКЦИИ ===
        // Проверка, если это страница профиля и настройка включена
        if (settings.addUserCardShortcutsEnabled && path.startsWith('/user/') && !path.includes('/cards/')) {
            addUserCardShortcuts();
        }

        // --- Страница личных сообщений (/pm/) ---
        if (path.startsWith('/pm/')) {
            if (settings.addCardEnabled) {
                waitForElement('.dpm-dialog-list', (dialogList) => {
                    const chatObserver = new MutationObserver(addWantButtonsToBotMessages);
                    chatObserver.observe(dialogList, { childList: true, subtree: true });
                    addWantButtonsToBotMessages();
                });
            }
            return;
        }

        // --- Страница создания обмена (/cards/.../trade/) ---
        if (path.includes('/cards/') && path.includes('/trade/')) {
            if (settings.initAsLoadUserTradeConditionsFeatureEnabled) {
                initAsLoadUserTradeConditionsFeature();
            }
            return;
        }

        // --- Страницы списков обменов (/trades/...) ---
        if (path.startsWith('/trades/')) {
            if (settings.previewCardEnabled) {
                initTradeItemEnhancer_Optimized();
                initTradePreviewRankFilter();
                initTradesCounter();
                initTradeHotkey();
            }
            return;
        }

        // --- Страница аниме ---
        if (path.match(/\/\d+-[^\/]+\.html/)) {
            if (settings.showMyCardsButton) {
                waitForElement('.sect.pmovie__related.sbox.fixidtab.cards-carousel', () => {
                    insertMyCardsButton();
                    insertMyCardsButton2();
                });
            }
            if (settings.addCardEnabled) {
                waitForElement('#chat-place', (chatNode) => {
                    const chatObserver = new MutationObserver(addWantButtonsToBotMessages);
                    chatObserver.observe(chatNode, { childList: true, subtree: true });
                });
            }
            return;
        }

        // --- Страница прогресса колод ---
        if (path.includes('/cards_progress/')) {
            const progressObserver = new MutationObserver(() => {
                if (settings.addMyCardsButtonsEnabled) addMyCardsButtons();
            });
            progressObserver.observe(document.body, { childList: true, subtree: true });
            if (settings.addMyCardsButtonsEnabled) addMyCardsButtons();
            return;
        }

        // --- Прочие страницы ---
        if (settings.showLevelProgressEstimateEnabled && path.startsWith('/clubs/')) showLevelProgressEstimate();
    }

    // Убедитесь, что у вас есть эта вспомогательная функция в коде
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 200);
    }

    // ==== Функция для отслеживания AJAX-переходов по сайту ====
    function observeUrlChanges(callback) {
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                setTimeout(callback, 500);
            }
        });
        observer.observe(body, { childList: true, subtree: true });
        window.addEventListener('popstate', callback);
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            callback();
        };
    }

    if (settings.previewCardEnabled) {
        initTradePreviewRankFilter();
        initTradesCounter();
    }
    main();
}
