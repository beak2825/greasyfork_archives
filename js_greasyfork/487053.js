// ==UserScript==
// @name        TikTok ByPass Login
// @name:en     TikTok ByPass Login
// @name:fr     Contourner la connexion TikTok
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @license     MIT
// @grant       none
// @version     1.9
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=boiskarine59960@gmail.com&item_name=Greasy+Fork+donation
// @author      TrouveMe
// @description Supprime la Page de Connexion TikTok
// @description:en Delete TikTok Login Page
// @description:fr Supprime la Page de Connexion TikTok
// @downloadURL https://update.greasyfork.org/scripts/487053/Contourner%20la%20connexion%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/487053/Contourner%20la%20connexion%20TikTok.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Fonction principale pour gérer la suppression du modal de connexion
    function bypassTikTokLogin() {
        // Sélecteurs pour les éléments de modal
        const modalSelectors = [
            '.css-behvuc-DivModalContainer.e1gjoq3k0',
            '.css-hwc5eg-DivBottomCommentContainer.e1mecfx04',
            '.css-whg6mn-SpanIconWrapper.e1hk3hf91',
            '.css-1pcikqk-Button.e1v8cfre0'
        ];

        // Sélecteurs pour les boutons et icônes
        const buttonSelectors = [
            '.css-whg6mn-SpanIconWrapper.e1hk3hf91>*',
            '.css-1pcikqk-Button.e1v8cfre0>*',
            '.css-1eor4vt-SpanIconWrapper.edu4zum1>*',
            '.css-rninf8-ButtonActionItem.edu4zum0>*'
        ];

        const loginButton = document.querySelector('button#header-login-button>*');


        // Supprime les modals et masques
        modalSelectors.forEach(selector => {
            const modal = document.querySelector(selector);
            if (modal) {
                // Suppression de la visibilité du modal
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                removeBodyStyles();
            }
          else if (loginButton) {
            loginButton.addEventListener('click', () => {
                modalSelectors.forEach(selector => {
                    const modal = document.querySelector(selector);
                    if (modal) {
                        // Restaure la visibilité du modal
                        modal.style.visibility = 'visible';
                        modal.style.opacity = '1';
                        modal.style.pointerEvents = 'auto';
                    }
                });
            });
        }});

        // Gestion des autres boutons
        buttonSelectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    modalSelectors.forEach(modalSelector => {
                        const modal = document.querySelector(modalSelector);
                        if (modal) {
                            // Restaure la visibilité du modal
                            modal.style.visibility = 'visible';
                            modal.style.opacity = '1';
                            modal.style.pointerEvents = 'auto';
                        }
                    });
                });
            });
        });
    };

    // Fonction pour supprimer les styles du body
    function removeBodyStyles() {
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
    }

    // Attente du chargement complet de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bypassTikTokLogin);
    } else {
        bypassTikTokLogin();
    }

    // Surveillance des changements dynamiques
    const observer = new MutationObserver(bypassTikTokLogin);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});