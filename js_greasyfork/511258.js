// ==UserScript==
// @name         UPJV Moodle Login
// @namespace    Bookertie's Scripts
// @version      1.0.1
// @description  Redirige directement sur "Mes cours" sans passer sur "Accueil" de Moodle & Redirige directement sur la page de connexion, en cas de deconnexion.
// @author       bookertie

// @match        https://pedag.u-picardie.fr/moodle/upjv/*

// @run-at       document-start
// @grant        none

// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/511258/UPJV%20Moodle%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/511258/UPJV%20Moodle%20Login.meta.js
// ==/UserScript==

function redirect_login() {
    window.location.replace("https://cas.u-picardie.fr/login?service=https%3A%2F%2Fpedag.u-picardie.fr%2Fmoodle%2Fupjv%2Flogin%2Findex.php%3FauthCAS%3DCAS");
}

(function() {
    'use strict';

    const url = window.location.href;
    // Si la connexion ne s'est pas faite, le prog redirige directement sur la page connexion au moyen du compte : "Université de Picardie Jules Verne", directement.
    if (url === "https://pedag.u-picardie.fr/moodle/upjv/?redirect=0" || url === "https://pedag.u-picardie.fr/moodle/upjv/alternate/login.php") {
        redirect_login();
    }

    //Permet l'acces à la catégorie "MES COURS" sans passer par "ACCUEIL".
    if (url === "https://pedag.u-picardie.fr/moodle/upjv/" || url === "https://pedag.u-picardie.fr/moodle/upjv/?") {
        window.location.replace("https://pedag.u-picardie.fr/moodle/upjv/my/");
    }
})();

