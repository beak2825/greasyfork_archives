// ==UserScript==
// @name         Sortowanie statusów zwrotów
// @version      1.0
// @author       Dawid
// @description  Sortowanie statusów według własnych ustawień
// @match        https://premiumtechpanel.sellasist.pl/admin/returns/*
// @grant        none
// @license      Proprietary
// @namespace    https://greasyfork.org/users/1396754
// @downloadURL https://update.greasyfork.org/scripts/518058/Sortowanie%20status%C3%B3w%20zwrot%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/518058/Sortowanie%20status%C3%B3w%20zwrot%C3%B3w.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
        const desiredOrder = [
            "Nowe zgłoszenie",
            "Odebrano zwrot",
            "Zwrot weryfikacja",
            "Zwrot płatności (całkowita wartość)",
            "Częściowy zwrot płatności",
            "Odmowa zwrotu płatności",
            "Zwrot/reklamacja zakończona"
        ];
        const statusGroup = document.querySelector(
            '.m-orders-status-panel__list[data-group="statusy-zwrotow"]'
        );
        if (!statusGroup) return;
        const elements = Array.from(
            statusGroup.querySelectorAll('.m-orders-status-panel__list-element')
        );
        elements.sort((a, b) => {
            const nameA = a.dataset.name;
            const nameB = b.dataset.name;
            return (
                desiredOrder.indexOf(nameA) - desiredOrder.indexOf(nameB)
            );
        });
        statusGroup.innerHTML = '';
        elements.forEach(el => statusGroup.appendChild(el));
    });
})();