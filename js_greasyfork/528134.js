// ==UserScript==
// @name         Stake Reload Claimer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically claims rewards on stake.bet VIP page
// @author       Sylomex
// @match        https://stake.bet/fr?tab=reload&modal=vip
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528134/Stake%20Reload%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/528134/Stake%20Reload%20Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLAIM_BUTTON_SELECTOR = '[data-testid="vip-reward-claim-reload"]';
    const RELOAD_BUTTON_SELECTOR = '[data-test="claim-reload"]';
    const REFRESH_INTERVAL = 180000; // 30 seconds
    const CLAIM_DELAY = 5000; // 5 seconds
    const TARGET_URL = 'https://stake.bet/fr?tab=reload&modal=vip';

    function simulateClick(element) {
        // Simulation d'un clic avec différentes méthodes
        try {
            element.click();
            element.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        } catch (error) {
            console.log('Erreur lors du clic:', error);
        }
    }

    function checkAndClickClaimButton() {
        // Recherche du bouton "Réclamer" avec plusieurs sélecteurs possibles
        const claimButton = document.querySelector(CLAIM_BUTTON_SELECTOR) ||
                          document.querySelector('button[data-analytics="vip-reward-claim-reload"]');

        if (claimButton && !claimButton.disabled) {
            console.log('Bouton Réclamer trouvé, tentative de clic...');
            simulateClick(claimButton);
            console.log('Clic effectué sur le bouton Réclamer, attente de 10 secondes...');

            setTimeout(() => {
                // Recherche du bouton "Demander la recharge" avec plusieurs sélecteurs possibles
                const reloadButton = document.querySelector(RELOAD_BUTTON_SELECTOR) ||
                                   document.querySelector('button[data-analytics="claim-reload"]') ||
                                   document.querySelector('button[data-testid="password-reset-button"]');

                if (reloadButton) {
                    console.log('Tentative de clic sur le bouton Demander la recharge...');
                    simulateClick(reloadButton);
                    console.log('Clic effectué sur le bouton Demander la recharge');
                } else {
                    console.log('Bouton Demander la recharge non trouvé');
                }
            }, CLAIM_DELAY);

            return true;
        }

        return false;
    }

    function init() {
        console.log('Script démarré');

        // Vérification initiale
        if (!checkAndClickClaimButton()) {
            console.log('Pas de bouton Réclamer actif, rafraîchissement dans 30 secondes...');

            // Rafraîchissement périodique si aucun bouton n'est trouvé
            setTimeout(() => {
                window.location.href = TARGET_URL;
            }, REFRESH_INTERVAL);
        }

        // Configuration du MutationObserver pour surveiller les changements du DOM
        const observer = new MutationObserver((mutations) => {
            checkAndClickClaimButton();
        });

        // Démarrage de l'observation du document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Attente du chargement complet de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
