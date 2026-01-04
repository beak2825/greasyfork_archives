// ==UserScript==
// @name         Castle Clash Promo Hub (Multilingual & Optimized)
// @name:en      Castle Clash Promo Hub (Multilingual & Optimized)
// @name:ru      Центр промокодов Castle Clash (многоязычный и оптимизированный)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Менеджер промокодов с переключателем языка для Castle Clash
// @description:en Promo-code manager with language switcher for Castle Clash
// @description:ru Менеджер промокодов с переключателем языка для Castle Clash
// @match        https://castleclash.igg.com/event/cdkey*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537975/Castle%20Clash%20Promo%20Hub%20%28Multilingual%20%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537975/Castle%20Clash%20Promo%20Hub%20%28Multilingual%20%20Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Обновлённые промокоды (с новейших к старым) ---
    const PROMO_CODES = [
        'QNEMMH',
        'IGG19TH',
        'ZRX6NB',
        'GDEJ9E',
        'DN72M7',
        'QYFUF6',
        'NYQZKQ',
        'KJYJT3'
    ];

    // --- Переводы интерфейса ---
    const TRANSLATIONS = {
        en: {
            title: 'Choose a promo code:',
            switchLabel: 'Language:'
        },
        ru: {
            title: 'Выберите промокод:',
            switchLabel: 'Язык:'
        }
    };

    // --- Определяем текущий язык (по параметру lang в URL) ---
    const urlParams = new URLSearchParams(location.search);
    const currentLang = TRANSLATIONS.hasOwnProperty(urlParams.get('lang'))
        ? urlParams.get('lang')
        : 'en';
    const t = TRANSLATIONS[currentLang];

    // --- Функция для генерации URL с указанным языком ---
    const buildLangUrl = (lang) => {
        const base = location.origin + location.pathname;
        return `${base}?lang=${lang}`;
    };

    // --- Вставляем собственные CSS-стили ---
    const style = document.createElement('style');
    style.textContent = `
        #promo-hub {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border: 1px solid #ccc;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            font-family: sans-serif;
            max-width: 320px;
            text-align: center;
        }
        #promo-hub h3 {
            margin: 0 0 10px;
            font-size: 16px;
        }
        .promo-btn {
            margin: 4px 2px;
            padding: 8px 12px;
            background: #28a745;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: inline-block;
        }
        .promo-btn:hover {
            background: #218838;
        }
        #promo-lang-switch {
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        #promo-lang-switch a {
            text-decoration: none;
            font-size: 14px;
            color: #007bff;
        }
        #promo-lang-switch a.active {
            font-weight: bold;
            cursor: default;
        }
    `;
    document.head.appendChild(style);

    // --- Построение UI ---
    function buildUI() {
        const container = document.createElement('div');
        container.id = 'promo-hub';

        // Блок переключения языка
        const langSwitcher = document.createElement('div');
        langSwitcher.id = 'promo-lang-switch';
        langSwitcher.innerHTML = `<span>${t.switchLabel}</span>`;
        Object.keys(TRANSLATIONS).forEach(lang => {
            const link = document.createElement('a');
            link.href = buildLangUrl(lang);
            link.textContent = lang.toUpperCase();
            if (lang === currentLang) {
                link.classList.add('active');
            }
            langSwitcher.appendChild(link);
        });
        container.appendChild(langSwitcher);

        // Заголовок
        const titleEl = document.createElement('h3');
        titleEl.textContent = t.title;
        container.appendChild(titleEl);

        // Кнопки промокодов (без дубликатов)
        const uniqueCodes = [...new Set(PROMO_CODES)];
        uniqueCodes.forEach((code, idx) => {
            const btn = document.createElement('button');
            btn.className = 'promo-btn';
            btn.textContent = `${idx + 1}. ${code}`;
            btn.addEventListener('click', () => insertCode(code));
            container.appendChild(btn);
        });

        document.body.appendChild(container);
    }

    // --- Логика вставки кода в поле ввода ---
    function insertCode(code) {
        const input = document.querySelector('#cdkey');
        if (input) {
            input.value = code;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            alert(currentLang === 'ru'
                ? 'Поле для ввода не найдено!'
                : 'Input field not found!');
        }
    }

    // --- Инициализация при загрузке страницы ---
    window.addEventListener('load', buildUI);
})();
