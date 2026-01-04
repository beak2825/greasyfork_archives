// ==UserScript==
// @name         Monstercockland - remove view limit
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Elimina una cookie específica para evitar el límite de carga por dirección IP
// @match        https://monstercockland.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467990/Monstercockland%20-%20remove%20view%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/467990/Monstercockland%20-%20remove%20view%20limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cookiePrefix = "vids";

    var cookies = document.cookie.split(";");

    cookies.forEach(function(cookie) {
        var parts = cookie.split("=");
        var cookieName = parts[0].trim();

        if (cookieName.startsWith(cookiePrefix)) {
            // Borra la cookie en todos los posibles paths
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=monstercockland.com;";
        }
    });
})();
