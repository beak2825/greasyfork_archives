// ==UserScript==
// @name         WWN Planauskunft
// @namespace    https://greasyfork.org/users/305651
// @version      1.2
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://gis.ww-energie.com/login.aspx
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/386553/WWN%20Planauskunft.user.js
// @updateURL https://update.greasyfork.org/scripts/386553/WWN%20Planauskunft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wwn_planauskunft() {


        // Misc
        var feld_username = document.getElementById('username');
        var feld_password = document.getElementById('userpwd');


        if(feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            document.getElementById('scriptContainer').insertAdjacentHTML('beforeend', '<span style="display:table; margin-top:10px; margin-right:auto; margin-bottom:10px; margin-left:auto;"><label for="benutzerdaten_speichern"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern"><span id="username-text" style="font-family:Tahoma,Helvetica;font-size:small;">&nbsp;Benutzerdaten speichern</span></label></span>');


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
        wwn_planauskunft();
    } else {
        document.addEventListener('DOMContentLoaded', wwn_planauskunft, false);
    }

})();