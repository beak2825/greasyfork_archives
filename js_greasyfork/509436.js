// ==UserScript==
// @name         CofoundersLab Premium Fix
// @namespace    https://greasyfork.org/it/users/79810-sciencefun
// @version      0.2
// @description  Tentativo di ripristinare temporaneamente le funzionalità Premium su CofoundersLab
// @author       Science
// @match        https://cofounderslab.com/*
// @grant        none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/509436/CofoundersLab%20Premium%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/509436/CofoundersLab%20Premium%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nascondi messaggi di avviso relativi al downgrade del tuo account
    var warnings = document.querySelectorAll('.alert.alert-warning, .alert.alert-free, .account-status-message');
    warnings.forEach(function(warning) {
        warning.style.display = 'none';
    });

    // Rendi visibili le sezioni premium o bloccate
    var premiumSections = document.querySelectorAll('.premium-feature, .locked-feature, .premium-only');
    premiumSections.forEach(function(section) {
        section.classList.remove('premium-feature', 'locked-feature', 'premium-only');
        section.style.display = 'block'; // Se nascosto, lo mostriamo
        section.style.opacity = '1';  // Aumentiamo la visibilità
        section.style.pointerEvents = 'auto';  // Abilitiamo l'interazione
    });

    // Sblocca i pulsanti o le funzionalità disabilitate per gli utenti free
    var lockedButtons = document.querySelectorAll('button[disabled], .btn-premium-disabled');
    lockedButtons.forEach(function(button) {
        button.disabled = false; // Sblocca il pulsante
        button.classList.remove('btn-premium-disabled'); // Rimuovi eventuali classi che segnalano premium
        button.style.opacity = '1'; // Rendi completamente visibile il bottone
        button.style.pointerEvents = 'auto'; // Abilita il click
    });

    // Nascondi i pulsanti di upgrade (se ci sono) per evitare di essere infastidito da avvisi
    var upgradeButtons = document.querySelectorAll('.btn-upgrade, .upgrade-prompt');
    upgradeButtons.forEach(function(button) {
        button.style.display = 'none';
    });

    // Ripristina la visibilità degli elementi nascosti da Premium
    var hiddenPremiumItems = document.querySelectorAll('.hidden-premium, .feature-blocker');
    hiddenPremiumItems.forEach(function(item) {
        item.style.display = 'block';
        item.style.opacity = '1';
    });

    // Gestione per sezioni specifiche del feed o altre pagine (es. /feed)
    if (window.location.href.includes("/feed")) {
        // Cerca elementi bloccati specifici nel feed e rimuovi le limitazioni
        var feedLockedItems = document.querySelectorAll('.feed-premium-block');
        feedLockedItems.forEach(function(feedItem) {
            feedItem.classList.remove('feed-premium-block');
            feedItem.style.display = 'block';
        });
    }

    console.log('CofoundersLab Premium Fix v2 attivo - In attesa che risolvano il problema');
})();