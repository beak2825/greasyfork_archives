// ==UserScript==
// @name         Shoptet Adm+ [FrameStar] - zobrazení váhy objednávky
// @namespace    http://framestar.cz/
// @version      1.1
// @description  Skript zobrazí váhu objednávky (update skriptu od Zuzana Nyiri)
// @author       Jiri Poucek
// @match        */admin/objednavky-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461426/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20zobrazen%C3%AD%20v%C3%A1hy%20objedn%C3%A1vky.user.js
// @updateURL https://update.greasyfork.org/scripts/461426/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20zobrazen%C3%AD%20v%C3%A1hy%20objedn%C3%A1vky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    $(document).ready(function(){
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