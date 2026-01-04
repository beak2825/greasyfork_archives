// ==UserScript==
// @name           CookieClicker mod Menu
// @namespace      CookieClicker cheat
// @include        *orteil.dashnet.org/cookieclicker/*
// @description    Extension for Cookie Clicker press Tab to open cheat menu.
// @version        1.3
// @grant          none
// @license        MIT 
// @downloadURL https://update.greasyfork.org/scripts/523470/CookieClicker%20mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/523470/CookieClicker%20mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables pour suivre l'état des triches
    const state = {
        bigCookieClicker: false,
        autoPurchaseObjects: false,
        autoPurchaseUpgrades: false,
        autoGetCookies: false, // Auto farm de cookies
    };

    // Fonction pour activer/désactiver une fonctionnalité
    function toggleFeature(feature, callbackActivate, callbackDeactivate) {
        state[feature] = !state[feature];
        if (state[feature]) {
            callbackActivate();
        } else {
            callbackDeactivate();
        }
    }

    // Fonction pour obtenir des cookies instantanément
    function getmorecookie() {
        let ta = atob(Game.WriteSave(1).replace(/%3D/g, '').replace(/%21END%21/g, ''));
        ta = ta.replace(/([^\|])\|([\w.e+]+);/, (a, b, c) => b + '|' + Number.MAX_VALUE + ';');
        ta = btoa(ta) + '%21END%21';
        Game.LoadSave(ta);
        Game.WriteSave();
    }

    // Menu HTML
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10%';
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    menu.style.color = '#fff';
    menu.style.padding = '15px';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
    menu.style.zIndex = '9999';
    menu.style.display = 'none';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.innerHTML = `
        <h3 style="margin-top: 0; text-align: center;">Cookie Clicker Cheats</h3>
        <ul style="list-style: none; padding: 0;">
            <li><button id="toggleBigCookie" style="width: 100%; margin-bottom: 5px;">Big Cookie Clicker</button></li>
            <li><button id="toggleAutoObjects" style="width: 100%; margin-bottom: 5px;">Auto Purchase Objects</button></li>
            <li><button id="toggleAutoUpgrades" style="width: 100%; margin-bottom: 5px;">Auto Purchase Upgrades</button></li>
            <li><button id="toggleAutoCookies" style="width: 100%; margin-bottom: 5px;">Cookie spammer</button></li>
            <li><button id="resetGame" style="width: 100%; margin-bottom: 5px; background-color: #f44336;">Reset Game</button></li>
        </ul>
        <button id="closeMenu" style="width: 100%; background-color: #555;">Close Menu</button>
    `;

    document.body.appendChild(menu);

    // Ajouter les événements pour les boutons
    document.getElementById('toggleBigCookie').onclick = () => {
        toggleFeature(
            'bigCookieClicker',
            () => {
                state.bigCookieClickerInterval = setInterval(() => Game.ClickCookie(), 5);
                console.log('Big Cookie Clicker Activated');
            },
            () => {
                clearInterval(state.bigCookieClickerInterval);
                console.log('Big Cookie Clicker Deactivated');
            }
        );
    };

    document.getElementById('toggleAutoObjects').onclick = () => {
        toggleFeature(
            'autoPurchaseObjects',
            () => {
                state.autoPurchaseObjectsInterval = setInterval(() => {
                    const products = document.querySelectorAll('#products .enabled');
                    if (products.length > 0) products[products.length - 1].click();
                }, 100);
                console.log('Auto Purchase Objects Activated');
            },
            () => {
                clearInterval(state.autoPurchaseObjectsInterval);
                console.log('Auto Purchase Objects Deactivated');
            }
        );
    };

    document.getElementById('toggleAutoUpgrades').onclick = () => {
        toggleFeature(
            'autoPurchaseUpgrades',
            () => {
                state.autoPurchaseUpgradesInterval = setInterval(() => {
                    const upgrades = document.querySelectorAll('#upgrades .enabled');
                    if (upgrades.length > 0) upgrades[0].click();
                }, 100);
                console.log('Auto Purchase Upgrades Activated');
            },
            () => {
                clearInterval(state.autoPurchaseUpgradesInterval);
                console.log('Auto Purchase Upgrades Deactivated');
            }
        );
    };

    document.getElementById('toggleAutoCookies').onclick = () => {
        toggleFeature(
            'autoGetCookies',
            () => {
                state.autoGetCookiesInterval = setInterval(() => {
                    getmorecookie();
                }, 100);
                console.log('Auto Get Cookies Activated');
            },
            () => {
                clearInterval(state.autoGetCookiesInterval);
                console.log('Auto Get Cookies Deactivated');
            }
        );
    };

    document.getElementById('resetGame').onclick = () => {
        Game.Reset(true);
        console.log('Game Reset!');
    };

    document.getElementById('closeMenu').onclick = () => {
        menu.style.display = 'none';
    };

    // Afficher/Masquer le menu avec la touche Tab
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });

})();
