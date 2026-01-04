// ==UserScript==
// @name         Castle Clash Code Selector (Multilingual & Optimized)
// @name:en      Castle Clash Code Selector (Multilingual & Optimized)
// @name:ru      Выбор промокода Castle Clash (многоязычный и оптимизированный)
// @namespace    http://tampermonkey.net/
// @version      1.8.5
// @description  Multilingual promo-code selector and language switcher for Castle Clash
// @description:en Multilingual promo-code selector and language switcher for Castle Clash
// @description:ru Многоязычный выбор промокодов и переключатель языка для Castle Clash
// @match        https://castleclash.igg.com/event/cdkey*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531334/Castle%20Clash%20Code%20Selector%20%28Multilingual%20%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531334/Castle%20Clash%20Code%20Selector%20%28Multilingual%20%20Optimized%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- Configuration ---
    const CODES = [
        { id: '1', code: 'QYFUF6' },
        { id: '2', code: 'NYQZKQ' },
        { id: '3', code: 'KJYJT3' },
        { id: '4', code: 'DN72M7' },
        { id: '5', code: 'GDEJ9E' },
        { id: '6', code: 'ZRX6NB' } // Новый код

    ];

    const TRANSLATIONS = {
        en: { title: 'Select a promo code:', btnPrefix: '', switchLabel: 'Language:' },
        ru: { title: 'Выберите промокод:', btnPrefix: '', switchLabel: 'Язык:' }
    };

    // --- Helpers ---
    const params = new URLSearchParams(location.search);
    const currentLang = params.get('lang') in TRANSLATIONS ? params.get('lang') : 'en';
    const t = TRANSLATIONS[currentLang];

    const basePath = location.origin + '/event/cdkey';
    function langUrl(lang) {
        return `${basePath}?lang=${lang}`;
    }

    // --- Styles ---
    const css = `
        #cc-selector { position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                       background: #fff; border: 1px solid #ccc; padding: 15px; z-index:9999;
                       box-shadow:0 4px 10px rgba(0,0,0,0.2); border-radius:8px; font-family:sans-serif; }
        #cc-selector h3 { margin:0 0 10px; font-size:16px; }
        .cc-btn { margin:4px; padding:8px 12px; background:#007bff; color:#fff;
                   border:none; border-radius:4px; cursor:pointer; font-size:14px; }
        .cc-btn:hover { background:#0056b3; }
        #cc-language { margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        #cc-language a { text-decoration:none; font-size:14px; color:#007bff; }
        #cc-language a.active { font-weight:bold; cursor:default; }
    `;
    const styleNode = document.createElement('style');
    styleNode.textContent = css;
    document.head.append(styleNode);

    // --- UI Creation ---
    function buildUI() {
        const container = document.createElement('div');
        container.id = 'cc-selector';

        // Language Switcher
        const langDiv = document.createElement('div');
        langDiv.id = 'cc-language';
        langDiv.innerHTML = `<span>${t.switchLabel}</span>`;
        Object.keys(TRANSLATIONS).forEach(lang => {
            const a = document.createElement('a');
            a.href = langUrl(lang);
            a.textContent = lang.toUpperCase();
            if (lang === currentLang) a.classList.add('active');
            langDiv.append(a);
        });
        container.append(langDiv);

        // Title
        const titleEl = document.createElement('h3');
        titleEl.textContent = t.title;
        container.append(titleEl);

        // Buttons
        CODES.forEach(({ id, code }) => {
            const btn = document.createElement('button');
            btn.className = 'cc-btn';
            btn.textContent = `${id}. ${code}`;
            btn.addEventListener('click', () => insertCode(code));
            container.append(btn);
        });

        document.body.append(container);
    }

    // --- Insert & Trigger ---
    function insertCode(code) {
        const input = document.querySelector('#cdkey');
        if (input) {
            input.value = code;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // --- Init ---
    window.addEventListener('load', buildUI);
})();
