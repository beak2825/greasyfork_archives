// ==UserScript==
// @name         Cyclomedia - Street Smart
// @namespace    https://greasyfork.org/users/305651
// @version      1.5
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://identity.cyclomedia.com/
// @match        https://identity.cyclomedia.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/383724/Cyclomedia%20-%20Street%20Smart.user.js
// @updateURL https://update.greasyfork.org/scripts/383724/Cyclomedia%20-%20Street%20Smart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function street_smart() {


        // Misc
        var feld_username = document.getElementById('username');
        var feld_password = document.getElementById('password');


        if(feld_username && feld_password) {

            // Passwortfeld immer anzeigen
            var password_hidden = document.getElementsByClassName('password-hidden')[0];
            if(password_hidden) {
                showPasswordField(true);
            }


            // Speichern-Checkbox hinzufügen
            password_hidden.insertAdjacentHTML('afterend', '<div class="form-group"><label for="benutzerdaten_speichern" class="control-label"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern"><span id="username-text">&nbsp;Benutzerdaten speichern</span></label></div>');


            // Login merken Checkbox ausblenden
            document.getElementsByClassName('login-remember')[0].setAttribute('style','display: none;');


            // Benutzerdaten laden
            var benutzerdaten_username = GM_getValue('benutzerdaten_username', '');
            var benutzerdaten_password = GM_getValue('benutzerdaten_password', '');
            var benutzerdaten_speichern_checked = GM_getValue('benutzerdaten_speichern_checked', 0);

            if(benutzerdaten_username) { feld_username.value = benutzerdaten_username; }
            if(benutzerdaten_password) { feld_password.value = benutzerdaten_password; }
            if(benutzerdaten_speichern_checked) { document.getElementById('benutzerdaten_speichern').checked = 1; }


            // Benutzerdaten speichern
            function benutzerdaten_speichern() {
                if(document.getElementById('benutzerdaten_speichern').checked) {
                    GM_setValue('benutzerdaten_username', feld_username.value);
                    GM_setValue('benutzerdaten_password', feld_password.value);
                    GM_setValue('benutzerdaten_speichern_checked', 1);
                } else {
                    GM_deleteValue('benutzerdaten_username');
                    GM_deleteValue('benutzerdaten_password');
                    GM_deleteValue('benutzerdaten_speichern_checked');
                    location.reload();
                }
            }


            // EventListener
            document.getElementById('benutzerdaten_speichern').addEventListener('input', benutzerdaten_speichern, false);

            if(benutzerdaten_speichern_checked) {
                feld_username.addEventListener('input', benutzerdaten_speichern, false);
                feld_password.addEventListener('input', benutzerdaten_speichern, false);
            }

        }


    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        street_smart();
    } else {
        document.addEventListener('DOMContentLoaded', street_smart, false);
    }

})();