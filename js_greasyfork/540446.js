// ==UserScript==
// @name         Poxel.io CTRL Combo Blocker (Only browser shortcuts!)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blochează doar combinațiile CTRL+W/A/S/D/Q/E/R/F/SPACE pe poxel.io, dar lasă tastele normale să funcționeze în joc, fără efecte secundare!
// @author       hApYeNd1337
// @match        *://*.poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540446/Poxelio%20CTRL%20Combo%20Blocker%20%28Only%20browser%20shortcuts%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540446/Poxelio%20CTRL%20Combo%20Blocker%20%28Only%20browser%20shortcuts%21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tastele care împreună cu CTRL/CMD vor fi blocate
    const blockWithCtrl = [
        'w', 'a', 's', 'd', 'q', 'e', 'r', 'f', ' ', // space
        'W', 'A', 'S', 'D', 'Q', 'E', 'R', 'F'
    ];

    window.addEventListener('keydown', function(e) {
        // Detectează dacă e apăsat CTRL sau CMD (pt Mac)
        if ((e.ctrlKey || e.metaKey) && blockWithCtrl.includes(e.key)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            // Nu trimitem nimic către joc, dar nici browserul nu reacționează!
            return false;
        }
        // Lăsăm orice altceva să treacă normal!
    }, true);

    // Nu e nevoie să blochezi keyup sau alte evenimente, pentru că browserul reacționează la keydown!
})();