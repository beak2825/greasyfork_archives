// ==UserScript==
// @name         Pornteengirl - Better Alias List (with IA Help)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reformat the Alias list with an space after each comma and correction for bad formatting of names (IA)
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.pornteengirl.com.ico
// @match        https://www.pornteengirl.com/model/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505266/Pornteengirl%20-%20Better%20Alias%20List%20%28with%20IA%20Help%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505266/Pornteengirl%20-%20Better%20Alias%20List%20%28with%20IA%20Help%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listeNoms = document.querySelector('.model-detail .model-detail-info span[aria-haspopup="true"][style="color:#506173;"] + .uk-dropdown');
    if (listeNoms) {
        var texte = listeNoms.textContent;
        var noms = texte.split(',');
        var nouvelleListe = noms.map(function(nom) {
            return nom.trim().replace(/(\w)\s+(\w)/g, '$1$2').replace(/([A-Z])/g, ' $1');
        }).join(', ');
        // Supprimer la virgule en début de liste si elle existe
        if (nouvelleListe.startsWith(',')) {
            nouvelleListe = nouvelleListe.substring(1);
        }
        // Supprimer l'espace en début de chaque nom si il existe
        nouvelleListe = nouvelleListe.replace(/^\s+/, '');
        listeNoms.textContent = nouvelleListe;
    }
})();