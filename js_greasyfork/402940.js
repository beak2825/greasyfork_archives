// ==UserScript==
// @name         Ilias Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Klickt automatisch den "Mit KIT-Account anmelden" Button
// @author       You
// @match        https://ilias.studium.kit.edu/login.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402940/Ilias%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/402940/Ilias%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("f807").click();
})();