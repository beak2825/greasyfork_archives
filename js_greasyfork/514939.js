// ==UserScript==
// @name         Capytale : Restart & clear outputs in just 1 button
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  Parce que j'en avais marre d'avoir à cliquer systématiquement sur "Noyau, Redémarrer & tout exécuter, Valider, puis encore Noyau, Redémarrer & effacer les sorties"
// @author       James Web (in the area)
// @include      https://capytale2.ac-paris.fr/p/basthon/**
// @icon         https://www.favicon.studio/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514939/Capytale%20%3A%20Restart%20%20clear%20outputs%20in%20just%201%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/514939/Capytale%20%3A%20Restart%20%20clear%20outputs%20in%20just%201%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction qui redémarre le noyau, exécute tout, efface les sorties
    function restartAndClean() {
        // Redémarrer et tout exécuter
        document.querySelector('#restart_run_all').click();
        setTimeout(()=>{
            document.querySelector('.modal-footer .btn-danger').click();
            // Redémarrer et effacer les sorties
            setTimeout(()=>{
                document.querySelector('#restart_clear_output').click();
                setTimeout(()=>{
                    document.querySelector('.modal-footer .btn-danger').click();
                }, 500)
            }, 500)
        }, 500)
    }

    // Créer un nouveau bouton
    let btnEl = document.createElement('button');
    btnEl.className = 'btn btn-default';
    btnEl.title = 'Tout exécuter + Effacer les sorties';
    btnEl.innerHTML = '<i class="fa-truck fa"></i>';
    btnEl.addEventListener('click', restartAndClean);

    // On attend le bon moment pour ajouter notre bouton
    let ticTac;
    function myCallback() {
        if (document.querySelector('#MathJax_Message')) {
            clearInterval(ticTac);
            document.querySelector('#RISE').insertAdjacentElement('afterend', btnEl);
        }
    }
    ticTac = setInterval(myCallback, 500);


})();