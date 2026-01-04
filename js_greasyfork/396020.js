// ==UserScript==
// @name         Internes Fortbildungsportal
// @namespace    https://greasyfork.org/users/305651
// @version      1.1
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://paderborn.stage-x.de/versions/kursmanagement_v3/anmeldeportal_pb/v1.0/
// @match        https://paderborn.stage-x.de/versions/kursmanagement_v3/anmeldeportal_pb/v1.0/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/396020/Internes%20Fortbildungsportal.user.js
// @updateURL https://update.greasyfork.org/scripts/396020/Internes%20Fortbildungsportal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fortbildungsportal() {


        // Misc
        var feld_username = document.getElementById('appbl_user');
        var feld_password = document.getElementById('appbl_pass_clear');


        if(feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            var login = document.querySelector("label[for=login_remember]");
            if(login) {
                login.insertAdjacentHTML('afterend', '<div class="form-group row"><label for="benutzerdaten_speichern" class="control-label"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern"><span id="username-text">&nbsp;Benutzerdaten speichern</span></label></div>');
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
        fortbildungsportal();
    } else {
        document.addEventListener('DOMContentLoaded', fortbildungsportal, false);
    }

})();