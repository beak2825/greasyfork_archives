// ==UserScript==
// @name         Afficher la Quantité de produit en stock - Hasbro Pulse
// @name:en      Display Product Stock Quantity – Hasbro Pulse
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Afficher la Quantité de produit courant en stock sur Hasbro Pulse EU/US/UK etc.
// @description:en  Show the available stock quantity for a product on the Hasbro Pulse EU, US, UK websites
// @author       CRL - crl@starwars-universe.com
// @match        https://www.hasbropulse.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/544399/Afficher%20la%20Quantit%C3%A9%20de%20produit%20en%20stock%20-%20Hasbro%20Pulse.user.js
// @updateURL https://update.greasyfork.org/scripts/544399/Afficher%20la%20Quantit%C3%A9%20de%20produit%20en%20stock%20-%20Hasbro%20Pulse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour afficher le stock level
    function displayStockLevel(level) {
    // Détection fiable de la langue
    const htmlLang = document.documentElement.getAttribute('lang') || '';
    const lang = htmlLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';

    const badgeTexts = lang === 'fr'
        ? ["En stock", "Précommande", "Stock limité", "Épuisé"]
        : ["In Stock", "Pre-Order", "Limited Stock", "Sold-out", "Low stock"];

    const qtyText = lang === 'fr' ? `Qté dispo. : ${level}` : `Qty avail. : ${level}`;

    // Évite doublon
    if (document.getElementById('tampermonkey-qty')) return;

    // Trouver TOUS les badges correspondants
    const allBadges = Array.from(document.querySelectorAll('span.chakra-badge'));
    const targetBadge = allBadges.find(badge => badgeTexts.includes(badge.textContent.trim()));

    // Créer l’élément de stock
    const qtySpan = document.createElement('span');
    qtySpan.id = 'tampermonkey-qty';
    qtySpan.textContent = qtyText;
    qtySpan.style.marginLeft = '8px';
    qtySpan.style.fontWeight = 'bold';

    if (targetBadge) {
        // Copie le style de badge si possible
        qtySpan.className = targetBadge.className;
        targetBadge.parentNode.insertBefore(qtySpan, targetBadge.nextSibling);
    } else {
        // Fallback : insérer sous le titre du produit
        const title = document.querySelector('h1.chakra-heading');
        if (title) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.id = 'tampermonkey-qty';
            fallbackDiv.textContent = qtyText;
            fallbackDiv.style.marginTop = '8px';
            fallbackDiv.style.fontWeight = 'bold';
            title.insertAdjacentElement('afterend', fallbackDiv);
        } else {
            console.log('Aucun badge ou titre trouvé pour afficher la quantité.');
        }
    }
}


    // Fonction pour vérifier le stock level dans le script
    function checkStockLevel() {
        const script = document.getElementById('mobify-data');

        if (!script) {
            console.log('Script #mobify-data introuvable !');
            return;
        }

        try {
            const content = script.textContent;
            const data = JSON.parse(content);
            console.log('Données JSON extraites :', data);
            const stockLevel = data?.__PRELOADED_STATE__?.pageProps?.product?.inventory?.stockLevel;

            if (stockLevel !== undefined) {
                console.log('Stock Level trouvé:', stockLevel);
                displayStockLevel(stockLevel);
            } else {
                console.log('Stock Level introuvable dans les données.');
            }
        } catch (error) {
            console.error('Erreur lors du parsing ou de l\'accès aux données:', error);
        }
    }

    // Utilisation d'un MutationObserver pour surveiller le DOM
    const observer = new MutationObserver(() => {
        // Vérifiez si le script mobify-data est présent
        const script = document.getElementById('mobify-data');
        if (script) {
            checkStockLevel(); // Exécuter la fonction si le script est trouvé
            observer.disconnect(); // Arrêter l'observation une fois que le script est trouvé
        }
    });

    // Commencez à observer les changements dans le DOM
    observer.observe(document.body, {
        childList: true, //Observer les ajouts/enlèvements d'éléments enfants
        subtree: true, //Observer également les sous-arbres du DOM
    });

})();