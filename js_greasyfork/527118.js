// ==UserScript==
// @name         Renommer les fichiers avant SingleFile
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Renomme dynamiquement le titre de la page pour influencer le nom du fichier dans SingleFile
// @author       Toi
// @match        *://mangas-origines.fr/oeuvre/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527118/Renommer%20les%20fichiers%20avant%20SingleFile.user.js
// @updateURL https://update.greasyfork.org/scripts/527118/Renommer%20les%20fichiers%20avant%20SingleFile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let oeuvre = document.location.pathname.split("/")[2]; // Récupère le nom de l'œuvre
    let chapitre = document.location.pathname.match(/chapitre-(\d+)/); // Récupère le numéro du chapitre

    if (chapitre) {
        document.title = `${oeuvre} - Chapitre ${chapitre[1]}`;
    }
})();
