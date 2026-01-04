// ==UserScript==
// @name         Menéame.net - Edición Autista
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  No te lleves malos ratos viendo lo que odias y sigue con tu vida "Zen" como si lo malo no existiese.
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490085/Men%C3%A9amenet%20-%20Edici%C3%B3n%20Autista.user.js
// @updateURL https://update.greasyfork.org/scripts/490085/Men%C3%A9amenet%20-%20Edici%C3%B3n%20Autista.meta.js
// ==/UserScript==

const ItemsToHide = [
    ['Ayuso'],
    ['Miguel Ángel Rodríguez'],
    ['Feijóo'],
    ['Rajoy'],
    ['Aznar'],
    ['Aguirre'],
    ['Casado'],
    ['Granados'],
    ['García-Castellón'],
    ['Carromero'],
    ['Cospedal'],
    ['Abascal'],
    ['Ortega Smith'],
    ['Ndongo'],
    ['Alvise'],
    ['Quiles'],
];

const regexItems = ItemsToHide.map(item =>
    item[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
);

const regex = new RegExp(regexItems.join('|'), 'i');

document.querySelectorAll('.news-summary').forEach(link => {
    const normalizedText = link.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (regex.test(normalizedText)) {link.style.display = 'none';
    }
});