// ==UserScript==
// @name         Siemens Mobility Academy
// @namespace    https://greasyfork.org/users/305651
// @version      2.2
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://entitlement.siemens.com/SSO/Login*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/389671/Siemens%20Mobility%20Academy.user.js
// @updateURL https://update.greasyfork.org/scripts/389671/Siemens%20Mobility%20Academy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function siemens_mobility_academy() {


        // Misc
        var feld_username = document.getElementById('inputEmail');
        var feld_password = document.getElementById('inputPassword');


        if(feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            var login = document.getElementById('email-remember-label');
            if(login) {
                login.insertAdjacentHTML('afterend', '<br><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern" class="css-checkbox"><label for="benutzerdaten_speichern" class="css-label">Benutzerdaten speichern</label>');
            }


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
        siemens_mobility_academy();
    } else {
        document.addEventListener('DOMContentLoaded', siemens_mobility_academy, false);
    }

})();