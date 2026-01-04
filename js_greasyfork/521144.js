// ==UserScript==
// @name         default lzt
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ВЫБОРОЧНО удаляет новогодние шапки, мамонтов и изменяет лого
// @author       zalupenec
// @license      MIT
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521144/default%20lzt.user.js
// @updateURL https://update.greasyfork.org/scripts/521144/default%20lzt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ЕСЛИ ХОТИТЕ ЧТО-ТО ВКЛЮЧИТЬ, ТО ПОМЕНЯЙТЕ С true НА false

    const removeNewYearHatsEnabled = true; //включить/выключить удаление новогодних шапок
    const removeSnowEffectEnabled = true;   //включить/выключить удаление мамонтов
    const changeLogoEnabled = true;          //включить/выключить смену аним лого

    //убрать шапки
    function removeNewYearHats() {
        if (removeNewYearHatsEnabled) {
            const hats = document.querySelectorAll('.newyearhat, .new_year_hat_2025');
            hats.forEach(hat => {
                hat.remove();
            });
        }
    }

    //убить мамонтов
    function removeSnowElement() {
        if (removeSnowEffectEnabled) {
            const snowElement = document.querySelector('div[style*="position: absolute; inset: 0px;"]');
            if (snowElement) {
                snowElement.remove();
            }
        }
    }

    //смена аним лого
    if (changeLogoEnabled) {
        const newLogoUrl = 'https://lolz.live/styles/brand/download/logos/LolzTeam-Logo-Green.svg';
        const css = `
            #lzt-logo {
                background-image: url('${newLogoUrl}') !important;
            }
        `;
        GM_addStyle(css);
    }


    window.addEventListener('load', () => {
        removeNewYearHats();
        removeSnowElement();
    });

    const observer = new MutationObserver(() => {
        removeNewYearHats();
        removeSnowElement();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        removeNewYearHats();
        removeSnowElement();
    }, 20);
})();
