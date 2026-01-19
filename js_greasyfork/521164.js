// ==UserScript==
// @name        Apple iCloud: add Plans
// @description Add Plans in iCloud menus
// @version     1.0.1
// @namespace   https://breat.fr
// @homepageURL https://usercssjs.breat.fr/a/apple-icloud
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @match       https://*.icloud.com/*
// @author      BreatFR
// @copyright   2024, BreatFR (https://breat.fr)
// @icon        https://breat.fr/static/images/userscripts-et-userstyles/a/apple-icloud/icon.jpg
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/521164/Apple%20iCloud%3A%20add%20Plans.user.js
// @updateURL https://update.greasyfork.org/scripts/521164/Apple%20iCloud%3A%20add%20Plans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Image encodée en Base64
    const plansIconBase64 = 'data:image/png;base64,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';

    // Fonction pour ajouter l'application Plans dans le menu principal
    function addPlansAppToMainMenu() {
        const appIconContainer = document.querySelector('.app-icon-container');
        if (appIconContainer) {
            if (!appIconContainer.querySelector('[aria-label="Ouvrir l\'app Plans"]')) {
                const plansLink = document.createElement('a');
                plansLink.href = 'https://beta.maps.apple.com/';
                plansLink.className = 'IconLink app-icon-link';
                plansLink.target = '_blank';
                plansLink.rel = 'noreferrer';
                plansLink.setAttribute('aria-label', "Ouvrir l'app Plans");
                plansLink.setAttribute('aria-hidden', 'false');

                const appIcon = document.createElement('div');
                appIcon.className = 'app-icon';
                appIcon.setAttribute('role', 'presentation');

                const appIconImg = document.createElement('img');
                appIconImg.src = plansIconBase64;
                appIconImg.style.width = '70px';
                appIconImg.style.height = '70px';
                appIconImg.alt = 'Plans Icon';
                appIconImg.setAttribute('loading', 'lazy');
                appIcon.appendChild(appIconImg);

                const appDisplayName = document.createElement('div');
                appDisplayName.className = 'app-displayname';
                appDisplayName.setAttribute('role', 'presentation');
                appDisplayName.textContent = 'Plans';

                plansLink.appendChild(appIcon);
                plansLink.appendChild(appDisplayName);

                appIconContainer.appendChild(plansLink);
            }
        }
    }

    // Fonction pour ajouter l'application Plans au menu déroulant
    function addPlansAppToDropdownMenu() {
        const dropdownMenu = document.querySelector('ui-menu-scroll-container');
        if (dropdownMenu) {
            // Vérifiez si l'application Plans existe déjà dans le menu
            if (!dropdownMenu.querySelector('[aria-label="Ouvrir l\'app Plans"]')) {
                // Définir l'élément de référence (2ème titre du menu déroulant)
                const referenceElement = dropdownMenu.querySelector('ui-menu-item.app-switcher-wide-item.app-switcher-heading:nth-of-type(2)');
                if (referenceElement) {
                    // Créer un nouveau lien pour l'application Plans
                    const plansLink = document.createElement('a');
                    plansLink.href = 'https://beta.maps.apple.com/';
                    plansLink.target = '_blank';
                    plansLink.rel = 'noreferrer';
                    plansLink.setAttribute('aria-label', "Ouvrir l'app Plans");
                    plansLink.role = 'menuitem';
                    plansLink.tabIndex = -1;
                    plansLink.className = 'app-switcher-grid-cell';

                    // Créer l'icône pour Plans
                    const appIcon = document.createElement('div');
                    appIcon.className = 'app-icon';
                    appIcon.setAttribute('role', 'presentation');

                    const appIconImg = document.createElement('img');
                    appIconImg.src = plansIconBase64;
                    appIconImg.alt = 'Plans Icon';
                    appIconImg.setAttribute('aria-hidden', 'true');
                    appIconImg.style.width = '54px';
                    appIconImg.style.height = '54px';
                    appIcon.appendChild(appIconImg);

                    // Créer le nom pour Plans
                    const appDisplayName = document.createElement('div');
                    appDisplayName.className = 'app-switcher-app-name';
                    appDisplayName.setAttribute('role', 'presentation');
                    appDisplayName.textContent = 'Plans';

                    // Ajouter l'icône et le nom à plansLink
                    plansLink.appendChild(appIcon);
                    plansLink.appendChild(appDisplayName);

                    // Ajouter le lien Plans juste avant le 2ème titre
                    dropdownMenu.insertBefore(plansLink, referenceElement);
                }
            }
        }
    }

    // Observer pour détecter les changements et ajouter les liens
    function observeMenuPlans() {
        const observer = new MutationObserver(() => {
            addPlansAppToMainMenu();
            addPlansAppToDropdownMenu();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Lancer l'observateur
    window.addEventListener('load', () => {
        addPlansAppToMainMenu();
        addPlansAppToDropdownMenu();
        observeMenuPlans();
    });
})();
