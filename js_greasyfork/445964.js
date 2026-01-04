// ==UserScript==
// @name         Klikanie SORTUJ BEZ DOPASOWANIA
// @version      1.2
// @description  Automatyczne klikanie na SORTUJ BEZ DOPASOWANIA na stronie allegro.
// @author       Vomar
// @match        *://*.allegro.pl/*
// @namespace https://greasyfork.org/users/156999
// @downloadURL https://update.greasyfork.org/scripts/445964/Klikanie%20SORTUJ%20BEZ%20DOPASOWANIA.user.js
// @updateURL https://update.greasyfork.org/scripts/445964/Klikanie%20SORTUJ%20BEZ%20DOPASOWANIA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function checkButton() {
        const button = [...document.querySelectorAll('button')].find(btn => btn.innerText.includes("SORTUJ BEZ DOPASOWANIA"));
        if (button) {
            button.click();
        }
        setTimeout(checkButton, 3000);
    }
    checkButton();
})();
