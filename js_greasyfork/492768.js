// ==UserScript==
// @name         AutoConnect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Connexion automatique à hentaiheroes.com
// @author       Votre nom
// @match        https://www.hentaiheroes.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492768/AutoConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/492768/AutoConnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Identifiants de connexion
    var username = "votre_nom_utilisateur";
    var password = "votre_mot_de_passe";

    // Vérifie si nous sommes sur la page de connexion
    if (window.location.href === "https://www.mon-site.com/login") {
        // Remplir les champs d'identification
        document.getElementById("username").value = username;
        document.getElementById("password").value = password;

        // Envoyer le formulaire de connexion
        document.getElementById("loginForm").submit();
    }
})();
