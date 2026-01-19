// ==UserScript==
// @name        Apple iCloud: full weekday names
// @description Replace abbreviated weekday names with full names based on browser language
// @version     1.0.0
// @namespace   https://breat.fr
// @homepageURL https://usercssjs.breat.fr/a/apple-icloud
// @match       https://www.icloud.com/applications/calendar/*
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @author      BreatFR
// @copyright   2024, BreatFR (https://breat.fr)
// @icon        https://breat.fr/static/images/userscripts-et-userstyles/a/apple-icloud/icon.jpg
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/520936/Apple%20iCloud%3A%20full%20weekday%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/520936/Apple%20iCloud%3A%20full%20weekday%20names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtenir les abréviations de jours dans la langue du navigateur
    function getAbbreviatedDays() {
        const formatterShort = new Intl.DateTimeFormat(navigator.language, { weekday: 'short' });
        const formatterLong = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
        const abbreviatedToFull = {};

        // Créer une correspondance entre les abréviations et les noms complets
        for (let i = 0; i < 7; i++) {
            const date = new Date(Date.UTC(2024, 0, 1 + i)); // Une semaine fictive en janvier 2024
            const shortName = formatterShort.format(date).replace('.', '').trim(); // Supprime les points
            const fullName = formatterLong.format(date).trim();
            abbreviatedToFull[shortName] = fullName;
        }

        return abbreviatedToFull;
    }

    const daysMap = getAbbreviatedDays();

    // Fonction pour remplacer les abréviations
    function replaceDays() {
        const elements = document.querySelectorAll('span.css-1fdlgye, span.css-p0zmmh, div.css-1ttvfef');
        elements.forEach(el => {
            const text = el.textContent.trim().replace('.', ''); // Supprime le point final
            if (daysMap[text]) {
                el.textContent = daysMap[text];
            }
        });
    }

    // Observer pour détecter les modifications dynamiques
    const observer = new MutationObserver(replaceDays);
    observer.observe(document.body, { childList: true, subtree: true });

    // Appliquer la transformation au chargement
    replaceDays();
})();
