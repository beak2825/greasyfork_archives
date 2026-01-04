// ==UserScript==
// @name         FFXIV Guide: Toggle language columns
// @name:ko      FFXIV Guide: 언어별 세로단 토글
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Add language toggle buttons that work across multiple tables correctly + description toggle
// @description:ko 언어별로 세로단을 가리는 버튼을 추가하는 스크립트 입니다
// @match        https://ffxivguide.akurosia.org/translate/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533076/FFXIV%20Guide%3A%20Toggle%20language%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/533076/FFXIV%20Guide%3A%20Toggle%20language%20columns.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const languageMap = {
        en: { label: '🇺🇸 EN', headers: ['Singular_en', 'Name_en', 'Description_en', 'Text_en'] },
        de: { label: '🇩🇪 DE', headers: ['Singular_de', 'Name_de', 'Description_de', 'Text_de'] },
        fr: { label: '🇫🇷 FR', headers: ['Singular_fr', 'Name_fr', 'Description_fr', 'Text_fr'] },
        ja: { label: '🇯🇵 JA', headers: ['Singular_ja', 'Name_ja', 'Description_ja', 'Text_ja'] },
        cn: { label: '🇨🇳 CN', headers: ['Singular_cn', 'Name_cn', 'Description_cn', 'Text_cn'] },
        ko: { label: '🇰🇷 KO', headers: ['Singular_ko', 'Name_ko', 'Description_ko', 'Text_ko'] },
    };

    const hiddenLangs = new Set();
    const buttonRefs = {};
    let descriptionHidden = false;

    function toggleLanguage(langKey) {
        const { headers } = languageMap[langKey];
        const shouldHide = !hiddenLangs.has(langKey);

        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const ths = table.querySelectorAll('thead tr th');
            const indexes = [];

            ths.forEach((th, i) => {
                const text = th.textContent.trim();
                if (headers.includes(text)) {
                    if (descriptionHidden && text.startsWith('Description_')) return;
                    indexes.push(i + 1);
                }
            });

            indexes.forEach(index => {
                const cells = table.querySelectorAll(`th:nth-child(${index}), td:nth-child(${index})`);
                cells.forEach(cell => {
                    cell.style.display = shouldHide ? 'none' : '';
                });
            });
        });

        if (shouldHide) hiddenLangs.add(langKey);
        else hiddenLangs.delete(langKey);

        updateButtonStyle(langKey);
    }

    function updateButtonStyle(langKey) {
        const btn = buttonRefs[langKey];
        if (!btn) return;
        const isHidden = hiddenLangs.has(langKey);
        btn.style.opacity = isHidden ? '0.4' : '1';
        btn.style.backgroundColor = isHidden ? '#222' : '#444';
    }

    function toggleDescriptionColumns() {
        descriptionHidden = !descriptionHidden;

        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const ths = table.querySelectorAll('thead tr th');
            const indexes = [];

            ths.forEach((th, i) => {
                const text = th.textContent.trim();
                const match = text.match(/^Description_(\w{2})$/);
                if (match) {
                    const langKey = match[1];
                    if (!hiddenLangs.has(langKey)) {
                        indexes.push(i + 1);
                    }
                }
            });

            indexes.forEach(index => {
                const cells = table.querySelectorAll(`th:nth-child(${index}), td:nth-child(${index})`);
                cells.forEach(cell => {
                    cell.style.display = descriptionHidden ? 'none' : '';
                });
            });
        });

        const btn = buttonRefs['description'];
        if (btn) {
            btn.style.opacity = descriptionHidden ? '0.4' : '1';
            btn.style.backgroundColor = descriptionHidden ? '#222' : '#444';
        }
    }

    function insertToggleButtons() {
        const searchButton = document.getElementById('submit');
        if (!searchButton || !searchButton.parentElement) {
            setTimeout(insertToggleButtons, 300);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.style.margin = '10px 0';

        // Language buttons
        Object.entries(languageMap).forEach(([key, { label }]) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            styleButton(btn);
            btn.addEventListener('click', () => toggleLanguage(key));
            wrapper.appendChild(btn);
            buttonRefs[key] = btn;
        });

        // Description-only toggle
        const descBtn = document.createElement('button');
        descBtn.textContent = '📝 아이템 설명';
        styleButton(descBtn);
        descBtn.addEventListener('click', toggleDescriptionColumns);
        wrapper.appendChild(descBtn);
        buttonRefs['description'] = descBtn;

        searchButton.parentElement.insertAdjacentElement('afterend', wrapper);
    }

    function styleButton(btn) {
        btn.style.marginRight = '5px';
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '12px';
        btn.style.cursor = 'pointer';
        btn.style.background = '#444';
        btn.style.color = '#fff';
        btn.style.border = '1px solid #888';
        btn.style.borderRadius = '4px';
        btn.style.transition = 'all 0.2s ease';
    }

    insertToggleButtons();
})();
