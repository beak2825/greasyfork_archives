// ==UserScript==
// @name         LZT_Trophy
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      2.0
// @description  Отображение всех трофеев в профиле пользователя
// @author       llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         https://cdn-icons-png.flaticon.com/512/2830/2830919.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472293/LZT_Trophy.user.js
// @updateURL https://update.greasyfork.org/scripts/472293/LZT_Trophy.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.textContent = `.HiddenTrophy { display: inline-block !important; }`;
    (document.head || document.documentElement).appendChild(style);

    const initTrophyDisplay = () => {
        const container = document.querySelector('.memberViewTrophies');
        if (!container) return;

        container.querySelectorAll('.HiddenTrophy').forEach(el => {
            el.classList.remove('HiddenTrophy');
        });

        container.querySelectorAll('.moreButton, #trophy-switcher-closer').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.replaceWith(newBtn);
        });
    };

    const handleClicks = (e) => {
        const target = e.target.closest('.memberViewTrophies .moreButton, .memberViewTrophies #trophy-switcher-closer');
        if (!target) return;

        const container = document.querySelector('.memberViewTrophies');
        if (!container) return;

        const titleSelect = container.querySelector('#trophy-title-select');
        const moreButton = container.querySelector('.moreButton');

        if (!titleSelect || !moreButton) return;

        const isHidden = getComputedStyle(titleSelect).display === 'none';
        titleSelect.style.display = isHidden ? '' : 'none';
        moreButton.style.display = isHidden ? 'none' : '';
    };

    document.addEventListener('DOMContentLoaded', initTrophyDisplay);
    document.addEventListener('click', handleClicks, true);
})();