// ==UserScript==
// @name         Remove New Year Hats
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Удаляет элементы с новогодними шапками
// @author       ya
// @license      MIT
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520924/Remove%20New%20Year%20Hats.user.js
// @updateURL https://update.greasyfork.org/scripts/520924/Remove%20New%20Year%20Hats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeNewYearHats() {
        const hats = document.querySelectorAll('.newyearhat, .new_year_hat_2025');
        hats.forEach(hat => {
            hat.remove();
        });
    }

    window.addEventListener('load', removeNewYearHats);

    const observer = new MutationObserver(removeNewYearHats);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(removeNewYearHats, 20);
})();
