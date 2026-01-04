// ==UserScript==
// @name         PaderApps
// @namespace    https://greasyfork.org/users/305651
// @version      1.0
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://paderapps.de/administration/account/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paderapps.de
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/527224/PaderApps.user.js
// @updateURL https://update.greasyfork.org/scripts/527224/PaderApps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function paderapps() {


        // Misc
        var feld_username = document.getElementById('username');
        var feld_password = document.getElementById('password');


        if(feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            var login = document.getElementById('login_submit_button');
            if(login) {
                login.insertAdjacentHTML('afterend', '<span style="margin-left: 58px;"><label for="benutzerdaten_speichern"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern">&nbsp;Benutzerdaten speichern</label></span>');
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
        paderapps();
    } else {
        document.addEventListener('DOMContentLoaded', paderapps, false);
    }

})();