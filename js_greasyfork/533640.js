// ==UserScript==
// @name         FSGO-Marks-Hider-4er
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрывает двойки и заменяет тройки на четвёрки в СГО (включая все модалки) 💯
// @author       UXImprover
// @match        https://netschool.edu22.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533640/FSGO-Marks-Hider-4er.user.js
// @updateURL https://update.greasyfork.org/scripts/533640/FSGO-Marks-Hider-4er.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function processMarks() {
        // Скрыть двойки
        document.querySelectorAll('a.two').forEach(el => {
            el.style.visibility = 'hidden';
        });

        // Заменить тройки на четвёрки (в таблицах)
        document.querySelectorAll('a.three').forEach(el => {
            el.classList.remove('three');
            el.classList.add('four');
            el.title = el.title.replace('3', '4');
            el.textContent = '';
        });

        // Заменить "Оценка: 3" на "Оценка: 4" во всех модалках
        document.querySelectorAll('.form-group').forEach(group => {
            const label = group.querySelector('label');
            const value = group.querySelector('.text.ng-binding');
            if (label && label.textContent.trim() === 'Оценка' && value && value.textContent.trim() === '3') {
                value.textContent = '4';
            }
        });
    }

    const observer = new MutationObserver(() => {
        processMarks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    processMarks();
})();



