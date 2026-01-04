// ==UserScript==
// @name         Rutor Apostrophe Normalizer
// @namespace    local-normalizer
// @version      1.2
// @description  Заменяет ASCII-апостроф (U+0027) на типографский (U+2019) в полях и URL, теперь названия игр с апострофом в поиске на руторе будут находиться.
// @author       Leshugan
// @match        https://www.rutor.info/*
// @match        https://rutor.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546565/Rutor%20Apostrophe%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/546565/Rutor%20Apostrophe%20Normalizer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const RIGHT = '\u2019';

    function fixInputs(root=document) {
        root.querySelectorAll('input[type="search"], input[type="text"], textarea').forEach(el => {
            if (el.value && el.value.includes("'")) {
                el.value = el.value.replace(/'/g, RIGHT);
            }
        });
    }

    function fixUrl() {
        const u = new URL(location.href);
        let changed = false;

        // Параметры запроса
        for (const [k, v] of u.searchParams) {
            if (v && v.includes("'")) {
                u.searchParams.set(k, v.replace(/'/g, RIGHT));
                changed = true;
            }
        }

        // Последний сегмент пути
        const parts = u.pathname.split('/');
        if (parts.length) {
            const i = parts.length - 1;
            try {
                const dec = decodeURIComponent(parts[i]);
                if (dec.includes("'")) {
                    parts[i] = encodeURIComponent(dec.replace(/'/g, RIGHT));
                    u.pathname = parts.join('/');
                    changed = true;
                }
            } catch (e) {}
        }

        // Перезагрузка только если были изменения
        if (changed) location.replace(u.toString());
    }

    // Правим поля ввода
    fixInputs();
    // Меняем URL только если нужно
    fixUrl();

    // События на ввод и отправку формы
    document.addEventListener('input', e => {
        if (e.target && e.target.matches('input[type="search"], input[type="text"], textarea')) {
            if (e.target.value && e.target.value.includes("'")) {
                e.target.value = e.target.value.replace(/'/g, RIGHT);
            }
        }
    });

    document.addEventListener('submit', e => { fixInputs(); });

})();
