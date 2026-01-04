// ==UserScript==
// @name         Huffington Post - Paywall bypass
// @namespace    https://greasyfork.org/it/users/79810-simone-pederzolli
// @version      1.0
// @description.it  Sblocca articoli e rimuove i paywall su Huffington Post, inclusi messaggi promozionali.
// @description  Unblock articles and remove paywalls on Huffington Post, including promotional messages.
// @author       Science
// @match        *://*.huffingtonpost.it/*
// @license             GPL version 3 or any later version http://www.gnu.org/copyleft/gpl.html
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/509257/Huffington%20Post%20-%20Paywall%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/509257/Huffington%20Post%20-%20Paywall%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rimuovi overlay o elementi che bloccano la pagina
    const removeBlockers = () => {
        const blockers = [
            'div[role="dialog"]',   // Dialoghi modali
            '.modal',               // Finestre modali
            '.popup',               // Pop-up
            '.paywall',             // Sezione del paywall
            '.ad-block',            // Blocchi legati alla pubblicità
            '.subscription-required', // Sezioni bloccate per abbonamenti
            '.overlay',             // Overlay che coprono il contenuto
            '#banner-overlay',      // Overlay del banner
            '.blocked-content',     // Contenuto bloccato
            '#widgetDPContent',     // Banner promozionale "Questo è un articolo a pagamento..."
            '#widgetDP',            // Overlay dell'articolo a pagamento
            '.widget__d-p'          // Overlay con classe widget__d-p
        ];

        blockers.forEach(selector => {
            let elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    };

    // Sblocca la possibilità di scorrere e leggere il contenuto
    const unlockContent = () => {
        document.body.style.overflow = 'auto'; // Rende scrollabile la pagina
        document.documentElement.style.overflow = 'auto'; // Sblocca l'overflow
    };

    // Forza la visualizzazione del contenuto
    const showArticle = () => {
        const articleSelectors = [
            '.content',           // Il contenuto dell'articolo
            '.article-body',      // Corpo dell'articolo
            '.locked-content',    // Contenuto bloccato
            '.paywalled-content'  // Sezione paywall che potrebbe nascondere l'articolo
        ];

        articleSelectors.forEach(selector => {
            let element = document.querySelector(selector);
            if (element) {
                element.style.display = 'block';   // Rende visibile il contenuto
                element.style.visibility = 'visible';
            }
        });
    };

    // Funzione che rimuove eventuali classi che limitano l'accesso
    const removeClasses = () => {
        document.body.classList.remove('paywall-active', 'no-scroll', 'blocked');  // Rimozione delle classi che bloccano la visualizzazione
    };

    // Funzione che rimuove script legati al paywall
    const removeScripts = () => {
        const scripts = [
            'script[src*="paywall"]',   // Script del paywall
            'script[src*="subscription"]',   // Script per abbonamenti
            'script[src*="ads"]'  // Script per pubblicità
        ];

        scripts.forEach(scriptSelector => {
            let script = document.querySelector(scriptSelector);
            if (script) {
                script.remove();
            }
        });
    };

    // Esecuzione ogni secondo per gestire elementi caricati dinamicamente
    const intervalId = setInterval(() => {
        removeBlockers();
        unlockContent();
        showArticle();
        removeClasses();
        removeScripts();

        // Ferma l'esecuzione se il paywall e l'overlay sono stati rimossi
        if (!document.querySelector('.paywall') && !document.querySelector('.widget__d-p')) {
            clearInterval(intervalId);
        }
    }, 1000); // Controlla ogni secondo

})();
