// ==UserScript== 
// @name                Le Scienze Paywall Bypass Edicola 09/2024
// @namespace           Science
// @version             1.1.3
// @description         Rimuove il paywall su lescienze.it senza necessità di autenticazione
// @author              Science
// @match               https://www.lescienze.it/*
// @grant               GM_addStyle
// @license             GPL version 3 or any later version http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/508162/Le%20Scienze%20Paywall%20Bypass%20Edicola%20092024.user.js
// @updateURL https://update.greasyfork.org/scripts/508162/Le%20Scienze%20Paywall%20Bypass%20Edicola%20092024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Rimuove elementi del paywall dal DOM
     */
    const removePaywall = () => {
        // Selettori di elementi paywall
        const paywallSelectors = [
            '.paywall-container',      // Contenitore del paywall
            '.paywall-message',        // Messaggio del paywall
            '#ph-paywall',             // Banner del paywall
            '#paywall-banner',         // Banner alternativo
            '.paywall-overlay',        // Overlay che copre l'articolo
            '.premium-blocked'         // Contenuto bloccato per utenti non premium
        ];

        // Rimozione degli elementi del paywall
        paywallSelectors.forEach(selector => {
            const paywallElement = document.querySelector(selector);
            if (paywallElement) {
                paywallElement.remove();
                console.log('Elemento paywall rimosso:', selector);
            }
        });

        // Ripristina visibilità del contenuto nascosto
        const premiumContent = document.querySelectorAll('.premium, .premium-article');
        premiumContent.forEach(content => {
            content.style.display = 'block';
            content.style.visibility = 'visible';
            content.style.opacity = '1';
            content.style.maxHeight = 'none';
            content.style.overflow = 'visible';
        });
        console.log('Contenuto premium sbloccato.');
    };

    /**
     * Osserva modifiche nel DOM e rimuove paywall caricati dinamicamente
     */
    const observeDOMChanges = () => {
        const observer = new MutationObserver(() => {
            removePaywall();  // Rimuove eventuali nuovi paywall
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Funzione principale
    const main = () => {
        removePaywall();     // Rimuove il paywall al caricamento della pagina
        observeDOMChanges(); // Osserva eventuali modifiche dinamiche nel DOM
    };

    // Esegui la funzione principale quando la pagina è completamente caricata
    window.addEventListener('load', main);

    // Aggiungi uno stile per rendere sempre visibile il contenuto premium
    GM_addStyle(`
        .premium, .premium-article {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            max-height: none !important;
            overflow: visible !important;
        }
    `);

})();
