// ==UserScript==
// @name         VOIS Intranet-Auskunft
// @namespace    https://greasyfork.org/users/305651
// @version      1.1
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://vois.gkdpb.de/auskunft/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/405063/VOIS%20Intranet-Auskunft.user.js
// @updateURL https://update.greasyfork.org/scripts/405063/VOIS%20Intranet-Auskunft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function vois_meso() {


        // Misc
        var feld_mandant = document.getElementById('input-principal');
        var feld_username = document.getElementById('input-username');
        var feld_password = document.getElementById('input-password');


        if(feld_mandant && feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            var loginbutton = document.getElementById('btn-login');
            if(loginbutton) {
                loginbutton.insertAdjacentHTML('beforebegin', '<div style="margin-top: 5px;vertical-align: middle;font-size: .75em;font-family: sans-serif;cursor: pointer;"><label for="benutzerdaten_speichern" class="control-label"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern"><span id="username-text">&nbsp;Benutzerdaten speichern</span></label></div>');
            }


            // Benutzerdaten laden
            var benutzerdaten_mandant = GM_getValue('benutzerdaten_mandant', '');
            var benutzerdaten_username = GM_getValue('benutzerdaten_username', '');
            var benutzerdaten_password = GM_getValue('benutzerdaten_password', '');
            var benutzerdaten_speichern_checked = GM_getValue('benutzerdaten_speichern_checked', 0);

            function benutzerdaten_laden() {
                if(benutzerdaten_mandant) { feld_mandant.value = benutzerdaten_mandant; }
                if(benutzerdaten_username) { feld_username.value = benutzerdaten_username; }
                if(benutzerdaten_password) { feld_password.value = benutzerdaten_password; }
                if(benutzerdaten_speichern_checked) { document.getElementById('benutzerdaten_speichern').checked = 1; }
            }


            // Benutzerdaten speichern
            function benutzerdaten_speichern() {
                if(document.getElementById('benutzerdaten_speichern').checked) {
                    GM_setValue('benutzerdaten_mandant', feld_mandant.value);
                    GM_setValue('benutzerdaten_username', feld_username.value);
                    GM_setValue('benutzerdaten_password', feld_password.value);
                    GM_setValue('benutzerdaten_speichern_checked', 1);
                } else {
                    GM_deleteValue('benutzerdaten_mandant');
                    GM_deleteValue('benutzerdaten_username');
                    GM_deleteValue('benutzerdaten_password');
                    GM_deleteValue('benutzerdaten_speichern_checked');
                    location.reload();
                }
            }


            // EventListener
            document.body.addEventListener('mouseover', benutzerdaten_laden, { once : true });
            document.getElementById('benutzerdaten_speichern').addEventListener('input', benutzerdaten_speichern, false);

            if(benutzerdaten_speichern_checked) {
                feld_mandant.addEventListener('change', benutzerdaten_speichern, false);
                feld_username.addEventListener('input', benutzerdaten_speichern, false);
                feld_password.addEventListener('input', benutzerdaten_speichern, false);
            }

        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        vois_meso();
    } else {
        document.addEventListener('DOMContentLoaded', vois_meso, false);
    }

})();