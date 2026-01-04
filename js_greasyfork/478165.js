// ==UserScript==
// @name         Finsko - Házená
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá && k URL na stránce detailu
// @author       Michal
// @match        https://finnhandball.torneopal.fi/taso/ottelu.php*
// @icon         https://finnhandball.torneopal.fi/images/SKPL-tulospalvelu-2021.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478165/Finsko%20-%20H%C3%A1zen%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/478165/Finsko%20-%20H%C3%A1zen%C3%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.includes('/ottelu.php')) {
        if (!window.location.search.includes('&&')) {
            let newURL = window.location.href + '&&';
            window.history.replaceState(null, document.title, newURL);
        }
    }
})();