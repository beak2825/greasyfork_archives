// ==UserScript==
// @name         INFONIQA TIME Web
// @namespace    https://greasyfork.org/users/305651
// @version      1.4
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        https://timeweb.krz.de/TIME2010/Default.aspx*
// @match        https://timeweb.owl-it.de/TIME2010/Default.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/389670/INFONIQA%20TIME%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/389670/INFONIQA%20TIME%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function infoniqa_time_web() {


        // Misc
        var feld_username = document.getElementById('ctl00_ContentPlaceHolder1_PanelLogin_PageControl_Login1_UserName_I');
        var feld_password = document.getElementById('ctl00_ContentPlaceHolder1_PanelLogin_PageControl_Login1_Password_I');


        if(feld_username && feld_password) {

            // Speichern-Checkbox hinzufügen
            var login = document.getElementById('ctl00_ContentPlaceHolder1_PanelLogin_PageControl_Login1_btnApgLogin');
            if(login) {
                login.insertAdjacentHTML('beforebegin', '<label for="benutzerdaten_speichern"><input type="checkbox" name="benutzerdaten_speichern" id="benutzerdaten_speichern" style="margin-top: 10px;margin-bottom: 10px;margin-left: 0px;">&nbsp;Benutzerdaten speichern</label><br>');
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
        infoniqa_time_web();
    } else {
        document.addEventListener('DOMContentLoaded', infoniqa_time_web, false);
    }

})();