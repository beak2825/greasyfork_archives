// ==UserScript==
// @name         TMO Hentai Siempre Cascada
// @version      1.0
// @description  Hace que la página cambie de modo página a cascada
// @author       Mr.XXXXX
// @match        https://tmohentai.com/reader/*
// @grant        none
// @namespace https://greasyfork.org/users/1097413
// @downloadURL https://update.greasyfork.org/scripts/468525/TMO%20Hentai%20Siempre%20Cascada.user.js
// @updateURL https://update.greasyfork.org/scripts/468525/TMO%20Hentai%20Siempre%20Cascada.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtiene la URL actual
    var currentUrl = window.location.href;

    // Verifica si la URL contiene "paginated/1"
    if (currentUrl.includes("paginated/1")) {
        // Reemplaza "paginated/1" por "cascade?image-width=normal-width"
        var newUrl = currentUrl.replace("paginated/1", "cascade?image-width=normal-width");

        // Redirecciona a la nueva URL
        window.location.href = newUrl;
    }
})();
