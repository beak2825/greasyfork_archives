// ==UserScript==
// @name         Shoptet "Váha zásilky v detailu objednávky"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.15
// @description  Zobrazí váhu zásilky v detailu objednávky. Probliknutí černého pole nápovědy u políčka Číslo zásilky je nezbytné.
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405647/Shoptet%20%22V%C3%A1ha%20z%C3%A1silky%20v%20detailu%20objedn%C3%A1vky%22.user.js
// @updateURL https://update.greasyfork.org/scripts/405647/Shoptet%20%22V%C3%A1ha%20z%C3%A1silky%20v%20detailu%20objedn%C3%A1vky%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        // Najdeme tooltip ikonu
        const tooltipIcon = $('.show-tooltip.tooltip-icon');
        if (tooltipIcon.length) {
            // Vygenerování tooltipu
            tooltipIcon.mouseenter().mouseleave();

            // Počkáme na jeho zobrazení
            setTimeout(function () {
                const tooltipContent = $('.tooltip-content[data-testid="tooltipText"]').text();

                if (tooltipContent.includes('Váha balíku:')) {
                    const match = tooltipContent.match(/Váha balíku: ([\d.]+) kg/);

                    if (match) {
                        // Najdeme cílový kontejner
                        const targetContainer = $('.grid.grid--4.grid--v2form .grid__v2formCol').last();

                        if (targetContainer.length) {
                            // Přidáme váhu balíku do posledního sloupce
                            targetContainer.append('<div class="v2FormField"><span class="v2FormField__label">Váha balíku</span><div class="v2FormField__input"><span>' + match[1] + ' kg</span></div></div>');
                        } else {
                            console.error('Cílový kontejner nebyl nalezen.');
                        }
                    } else {
                        console.error('Váha balíku nebyla nalezena v textu tooltipu.');
                    }
                } else {
                    console.error('Tooltip neobsahuje text s váhou balíku.');
                }
            }, 50); // Mírně zvýšený timeout pro jistotu
        } else {
            console.error('Tooltip ikona nebyla nalezena.');
        }
    });
})();
