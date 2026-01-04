// ==UserScript==
// @name         Gemius sorok megcserélése és dátum ellenőrzés
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Megcseréli a két .row sorrendjét a https://e.gemius.com/hu/target-group/279 oldalon, és piros háttér a timemachine gombnak, ha a dátum tegnapi
// @match        https://e.gemius.com/hu/target-group/279*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e.gemius.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536320/Gemius%20sorok%20megcser%C3%A9l%C3%A9se%20%C3%A9s%20d%C3%A1tum%20ellen%C5%91rz%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/536320/Gemius%20sorok%20megcser%C3%A9l%C3%A9se%20%C3%A9s%20d%C3%A1tum%20ellen%C5%91rz%C3%A9s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Alap CSS: flex-container-t állítunk be, majd a swap osztályok segítségével cseréljük meg a .row sorrendjét.
    GM_addStyle(`
        .page-content {
            display: flex !important;
            flex-direction: column !important;
        }
        .page-content > .row.swap-first {
            order: 2 !important;
        }
        .page-content > .row.swap-second {
            order: 1 !important;
        }
    `);

    // Függvény, ami megkeresi a közvetlen .row gyerekeket, és hozzárendeli a swap osztályokat az első két elemhez.
    function swapRows() {
        const pageContent = document.querySelector('.page-content');
        if (!pageContent) return;
        // Csak a közvetlen gyermekek közül választjuk ki a .row elemeket.
        const rows = Array.from(pageContent.querySelectorAll(':scope > .row'));
        if (rows.length >= 2) {
            // Töröljük az esetleges korábbi osztályokat
            rows.forEach(row => row.classList.remove('swap-first', 'swap-second'));
            // Az első .row kapja a "swap-first", a második a "swap-second" osztályt
            rows[0].classList.add('swap-first');
            rows[1].classList.add('swap-second');
        }
    }

    // MutationObserver, ami figyeli a .page-content gyermeklistájának változását
    const observer = new MutationObserver(() => {
        swapRows();
    });

    // Megvárjuk, amíg a .page-content bejön a DOM-ba
    function init() {
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            observer.observe(pageContent, { childList: true });
            swapRows();
        } else {
            setTimeout(init, 2500);
        }
    }

    init();

    // Dátum ellenőrzés: ha a timemachine gomb dátuma tegnapi, piros háttér
    function checkTimeMachineDate() {
        const btn = document.getElementById('timemachine-dropdown-toggle');
        if (!btn) return;
        const btnDate = btn.textContent.trim();

        // Számoljuk ki a tegnapi dátumot YYYY-MM-DD formátumban
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yyyy = yesterday.getFullYear();
        let mm = yesterday.getMonth() + 1;
        let dd = yesterday.getDate();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        const yesterdayStr = `${yyyy}-${mm}-${dd}`;

        if (btnDate === yesterdayStr) {
            btn.style.background = 'red';
        }
    }

    // Várunk a gomb megjelenésére, majd ellenőrizzük a dátumot
    const dateInterval = setInterval(() => {
        const btn = document.getElementById('timemachine-dropdown-toggle');
        if (btn) {
            checkTimeMachineDate();
            clearInterval(dateInterval);
        }
    }, 2500);
})();
