// ==UserScript==
// @name         Bloqueur de Redirections Forcées
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bloque les redirections automatiques, empêche l'ouverture de nouveaux onglets/fenêtres.
// @author       Précieux MEHINTO
// @match        *://*/*
// @tags         redirection, popup blocker, sécurité, streaming
// @grant        none
// @licence MIT
// @downloadURL https://update.greasyfork.org/scripts/512742/Bloqueur%20de%20Redirections%20Forc%C3%A9es.user.js
// @updateURL https://update.greasyfork.org/scripts/512742/Bloqueur%20de%20Redirections%20Forc%C3%A9es.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Fonction pour bloquer l'ouverture de nouveaux onglets/fenêtres
    window.open = function(url) {
        console.log(`Tentative d'ouverture d'un nouvel onglet bloquée : ${url}`);
        alert(`Redirection bloquée vers : ${url}`);
        return null; // Bloque l'ouverture du nouvel onglet ou fenêtre
    };

    // Fonction pour intercepter et bloquer les redirections automatiques (via l'URL)
    const originalLocationAssign = window.location.assign;
    const originalLocationReplace = window.location.replace;

    window.location.assign = function(url) {
        const confirmation = confirm(`Tentative de redirection automatique vers : ${url}. Voulez-vous continuer ?`);
        if (confirmation) {
            originalLocationAssign.call(window.location, url); // Redirection autorisée
        } else {
            console.log('Redirection annulée.');
        }
    };

    window.location.replace = function(url) {
        const confirmation = confirm(`Tentative de redirection automatique vers : ${url}. Voulez-vous continuer ?`);
        if (confirmation) {
            originalLocationReplace.call(window.location, url); // Redirection autorisée
        } else {
            console.log('Redirection annulée.');
        }
    };

    // Bloquer les redirections causées par des événements onbeforeunload
    window.onbeforeunload = function() {
        return 'Une tentative de redirection est en cours. Voulez-vous vraiment quitter cette page ?';
    };

    // Option pour bloquer les balises <meta> avec "refresh"
    const metaTags = document.getElementsByTagName('meta');
    for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].httpEquiv.toLowerCase() === 'refresh') {
            console.log('Redirection via balise meta détectée et bloquée.');
            metaTags[i].parentNode.removeChild(metaTags[i]); // Supprime les balises de redirection automatique
        }
    }
})();
