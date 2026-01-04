// ==UserScript==
// @name         Feuerwerk Datenbank
// @namespace    https://greasyfork.org/users/156194
// @version      1.0
// @description  Automatisch einloggen
// @author       rabe85
// @match        https://www.feuerwerk-datenbank.de/
// @match        https://www.feuerwerk-datenbank.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/391928/Feuerwerk%20Datenbank.user.js
// @updateURL https://update.greasyfork.org/scripts/391928/Feuerwerk%20Datenbank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function feuerwerk_datenbank() {

        var logout_clicked = GM_getValue('logout_clicked', 0);

        // Login-Klick merken
        var auth_connect = document.querySelector("a[href='/auth/connect']");
        if(auth_connect) {
            function save_login() { GM_setValue('logout_clicked', 0); }
            auth_connect.addEventListener("click", save_login, false);
        }

        // Logout-Klick merken
        var auth_logout = document.querySelector("a[href='/auth/logout']");
        if(auth_logout) {
            function save_logout() { GM_setValue('logout_clicked', 1); }
            auth_logout.addEventListener("click", save_logout, false);
        }

        // Automatisch einloggen, wenn vorher nicht "Logout" angeklickt wurde
        if(logout_clicked == 0) {
            if(auth_connect) {
                GM_setValue('logout_clicked', 0);
                window.location.href = "https://www.feuerwerk-datenbank.de/auth/connect";
            }
        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        feuerwerk_datenbank();
    } else {
        document.addEventListener("DOMContentLoaded", feuerwerk_datenbank, false);
    }

})();