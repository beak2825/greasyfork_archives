// ==UserScript==
// @name           Auto-Login pour Educonnect / ENT
// @namespace      https://github.com/Starmania
// @version        1.1.0
// @author         Starmania
// @description    Automatically connects you to your ENT so you don't have to.
// @description:fr Pour utiliser ce script, une simple connection à votre ENT sauvegardera l'utilisateur + le mdp. Si vous voulez changer de compte, déconnectez vous avec le bouton de votre ENT, le compte sera supprimé et vous serez libre de choisir un nouveau compte.
// @license        MIT
// @match          https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=*
// @match          https://educonnect.education.gouv.fr/idp/profile/SAML2/Redirect/SSO?execution=*
// @match          https://moncompte.educonnect.education.gouv.fr/educt-self-service/connexion/deconnexion
// @match          https://educonnect.education.gouv.fr/idp/profile/Logout?*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=gouv.fr
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_log
// @grant          unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/487088/Auto-Login%20pour%20Educonnect%20%20ENT.user.js
// @updateURL https://update.greasyfork.org/scripts/487088/Auto-Login%20pour%20Educonnect%20%20ENT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var DEBUG = false;

    var deconnexion_urls = [
        new RegExp("https:\/\/moncompte\.educonnect\.education\.gouv\.fr\/educt-self-service\/connexion\/deconnexion"),
        new RegExp("https:\/\/educonnect\.education\.gouv\.fr\/idp\/profile\/Logout\?.*"),
    ];

    if (deconnexion_urls.some((url) => url.test(window.location.href))) {
        GM_log("Deconnexion");
        resetLogin();
        return;
    }

    // Check if the login form is present
    if (document.getElementById("div_connexion") === null) {
        return;
    }

    function saveNext() {
        unsafeWindow.savePass = function () {
            GM_setValue("username", document.getElementById("username").value);
            GM_setValue("password", document.getElementById("password").value);
            GM_log("Saved");
            showLogin();
        };
        document.getElementById("validerAuth").setAttribute("onsubmit", "savePass(); return checkLoginMdp();");
    }

    function showLogin() {
        GM_log(GM_getValue("username"));
        GM_log(GM_getValue("password"));
    }

    function resetLogin() {
        GM_deleteValue("username");
        GM_deleteValue("password");
    }
    unsafeWindow.showLogin = showLogin;
    unsafeWindow.resetLogin = resetLogin;

    // Check if a username and a password are already saved
    let username = GM_getValue("username");
    let password = GM_getValue("password");

    if (DEBUG) {
        GM_log("username: " + username);
        GM_log("password: " + password);
    }

    if (username && password) {
        let usernameField = document.getElementById("username");
        let passwordField = document.getElementById("password");
        if (usernameField.ariaInvalid == "true" || passwordField.ariaInvalid == "true") {
            alert("Erreur détecté lors de la connection, valider de nouveau changera le mot de passe sauvegardé");
            saveNext();
            return
        }
        // Fill the form with the saved username and password()
        usernameField.value = username;
        passwordField.value = password;

        // Submit the form
        // window.checkLoginMdp();
        document.getElementById("bouton_valider").click();
    }
    else {
        // If no username and password are saved, ask the user to enter them
        alert("Veuillez entrer votre nom d'utilisateur et votre mot de passe pour que le script puisse les enregistrer.");
        saveNext();
        }

})();