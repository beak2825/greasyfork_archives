// ==UserScript==
// @name        Apple iCloud: add TV
// @description Add TV in iCloud menus
// @version     1.0.0
// @namespace   https://breat.fr
// @homepageURL https://usercssjs.breat.fr/a/apple-icloud
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @match       https://*.icloud.com/*
// @author      BreatFR
// @copyright   2024, BreatFR (https://breat.fr)
// @icon        https://breat.fr/static/images/userscripts-et-userstyles/a/apple-icloud/icon.jpg
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/521417/Apple%20iCloud%3A%20add%20TV.user.js
// @updateURL https://update.greasyfork.org/scripts/521417/Apple%20iCloud%3A%20add%20TV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Image encodée en Base64
    const tvIconBase64 = 'data:image/png;base64,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';

    // Fonction pour ajouter l'application tv dans le menu principal
    function addTvAppToMainMenu() {
        const appIconContainer = document.querySelector('.app-icon-container');
        if (appIconContainer) {
            if (!appIconContainer.querySelector('[aria-label="Ouvrir l\'app TV"]')) {
                const tvLink = document.createElement('a');
                tvLink.href = 'https://tv.apple.com/';
                tvLink.className = 'IconLink app-icon-link';
                tvLink.target = '_blank';
                tvLink.rel = 'noreferrer';
                tvLink.setAttribute('aria-label', "Ouvrir l'app TV");
                tvLink.setAttribute('aria-hidden', 'false');

                const appIcon = document.createElement('div');
                appIcon.className = 'app-icon';
                appIcon.setAttribute('role', 'presentation');

                const appIconImg = document.createElement('img');
                appIconImg.src = tvIconBase64;
                appIconImg.style.width = '70px';
                appIconImg.style.height = '70px';
                appIconImg.alt = 'TV Icon';
                appIconImg.style.borderRadius = '1em';
                appIconImg.setAttribute('loading', 'lazy');
                appIcon.appendChild(appIconImg);

                const appDisplayName = document.createElement('div');
                appDisplayName.className = 'app-displayname';
                appDisplayName.setAttribute('role', 'presentation');
                appDisplayName.textContent = 'TV';

                tvLink.appendChild(appIcon);
                tvLink.appendChild(appDisplayName);

                appIconContainer.appendChild(tvLink);
            }
        }
    }

    // Fonction pour ajouter l'application tv au menu déroulant
    function addTvAppToDropdownMenu() {
        const dropdownMenu = document.querySelector('ui-menu-scroll-container');
        if (dropdownMenu) {
            // Vérifiez si l'application tv existe déjà dans le menu
            if (!dropdownMenu.querySelector('[aria-label="Ouvrir l\'app TV"]')) {
                // Définir l'élément de référence (2ème titre du menu déroulant)
                const referenceElement = dropdownMenu.querySelector('ui-menu-item.app-switcher-wide-item.app-switcher-heading:nth-of-type(2)');
                if (referenceElement) {
                    // Créer un nouveau lien pour l'application tv
                    const tvLink = document.createElement('a');
                    tvLink.href = 'https://tv.apple.com/';
                    tvLink.target = '_blank';
                    tvLink.rel = 'noreferrer';
                    tvLink.setAttribute('aria-label', "Ouvrir l'app TV");
                    tvLink.role = 'menuitem';
                    tvLink.tabIndex = -1;
                    tvLink.className = 'app-switcher-grid-cell';

                    // Créer l'icône pour tv
                    const appIcon = document.createElement('div');
                    appIcon.className = 'app-icon';
                    appIcon.setAttribute('role', 'presentation');

                    const appIconImg = document.createElement('img');
                    appIconImg.src = tvIconBase64;
                    appIconImg.alt = 'TV Icon';
                    appIconImg.style.borderRadius = '1em';
                    appIconImg.setAttribute('aria-hidden', 'true');
                    appIconImg.style.width = '54px';
                    appIconImg.style.height = '54px';
                    appIcon.appendChild(appIconImg);

                    // Créer le nom pour tv
                    const appDisplayName = document.createElement('div');
                    appDisplayName.className = 'app-switcher-app-name';
                    appDisplayName.setAttribute('role', 'presentation');
                    appDisplayName.textContent = 'TV';

                    // Ajouter l'icône et le nom à tvLink
                    tvLink.appendChild(appIcon);
                    tvLink.appendChild(appDisplayName);

                    // Ajouter le lien TV juste avant le 2ème titre
                    dropdownMenu.insertBefore(tvLink, referenceElement);
                }
            }
        }
    }

    // Observer pour détecter les changements et ajouter les liens
    function observeMenuTv() {
        const observer = new MutationObserver(() => {
            addTvAppToMainMenu();
            addTvAppToDropdownMenu();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Lancer l'observateur
    window.addEventListener('load', () => {
        addTvAppToMainMenu();
        addTvAppToDropdownMenu();
        observeMenuTv();
    });
})();
