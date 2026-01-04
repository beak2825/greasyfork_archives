// ==UserScript==
// @name         Anti-Pub Total – Bloqueur de pubs, pop-ups, redirections
// @namespace    https://greasyfork.org/fr/users/000000
// @version      1.0
// @description  Bloque toutes les pubs, redirections, notifications, popups, overlays, etc. sur tous les sites web – façon AdBlock
// @author       TonNom
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544715/Anti-Pub%20Total%20%E2%80%93%20Bloqueur%20de%20pubs%2C%20pop-ups%2C%20redirections.user.js
// @updateURL https://update.greasyfork.org/scripts/544715/Anti-Pub%20Total%20%E2%80%93%20Bloqueur%20de%20pubs%2C%20pop-ups%2C%20redirections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔒 Empêcher les redirections automatiques
    Object.defineProperty(window, 'location', {
        configurable: false,
        writable: false,
        value: window.location
    });

    // ⛔ Bloquer les tentatives de changement de page
    const preventRedirect = () => {
        window.onbeforeunload = null;
        window.onunload = null;
        window.open = function() { return null; };
    };

    // 🧼 Supprimer les iframes souvent utilisés pour les pubs
    const removeIframes = () => {
        document.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.src && /ad|banner|popup|doubleclick|googlesyndication/i.test(iframe.src)) {
                iframe.remove();
            }
        });
    };

    // 🚫 Supprimer les overlays type "pub pleine page"
    const removeOverlays = () => {
        const elements = document.querySelectorAll('div, section, aside');
        elements.forEach(el => {
            const z = getComputedStyle(el).zIndex;
            const pos = getComputedStyle(el).position;
            if ((z && +z > 999) || pos === 'fixed' || pos === 'absolute') {
                const w = el.offsetWidth;
                const h = el.offsetHeight;
                if (w > window.innerWidth * 0.5 && h > window.innerHeight * 0.3) {
                    el.remove();
                }
            }
        });
    };

    // 🚷 Bloquer les notifications "push" du navigateur
    const blockNotifications = () => {
        if ('Notification' in window) {
            Notification.requestPermission = function() {
                return Promise.resolve('denied');
            };
            Object.defineProperty(window, 'Notification', {
                writable: false,
                configurable: false,
                value: function() {}
            });
        }

        navigator.permissions.query = function() {
            return Promise.resolve({ state: 'denied' });
        };
    };

    // ⛔ Empêcher les popups via window.open
    window.open = function() { return null; };

    // 🔁 Empêcher certains timers/redirects
    const blockSetTimeouts = () => {
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(fn, delay) {
            const code = fn.toString();
            if (/window\.location|document\.location|top\.location/i.test(code)) {
                return null;
            }
            return originalSetTimeout(fn, delay);
        };
    };

    // 🔄 Observer le DOM pour supprimer dynamiquement les pubs
    const observer = new MutationObserver(() => {
        removeIframes();
        removeOverlays();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    // 📦 Lancer tout ça une fois le document chargé
    window.addEventListener('DOMContentLoaded', () => {
        preventRedirect();
        blockNotifications();
        removeIframes();
        removeOverlays();
        blockSetTimeouts();
    });

})();
