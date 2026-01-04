// ==UserScript==
// @name         Autoodświeżanie strony po zmianie statusu zamówienia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Odświeża stronę po kliknięciu przycisku „Zapisz” przy zmianie statusu zamówienia
// @match        *://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/543839/Autood%C5%9Bwie%C5%BCanie%20strony%20po%20zmianie%20statusu%20zam%C3%B3wienia.user.js
// @updateURL https://update.greasyfork.org/scripts/543839/Autood%C5%9Bwie%C5%BCanie%20strony%20po%20zmianie%20statusu%20zam%C3%B3wienia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function bindSaveButton() {
        const btn = document.getElementById('change_status_save');
        if (!btn || btn.dataset.refreshBound) return;
        btn.dataset.refreshBound = '1';
        btn.addEventListener('click', () => {
            console.log('Zapisz kliknięty – za chwilę odświeżam stronę');
            setTimeout(() => location.reload(), 800);
        });
    }
    bindSaveButton();
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.addedNodes.length) {
                bindSaveButton();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();