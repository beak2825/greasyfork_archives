// ==UserScript==
// @name         Házená - Finsko ofiko
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automaticky na konec live url přidá &&
// @author       Jarda Kořínek
// @match        https://finnhandball.torneopal.fi/taso/ottelu.php?otteluid=*
// @match        https://tulospalvelu.finnhandball.net/taso/ottelu.php?otteluid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torneopal.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458833/H%C3%A1zen%C3%A1%20-%20Finsko%20ofiko.user.js
// @updateURL https://update.greasyfork.org/scripts/458833/H%C3%A1zen%C3%A1%20-%20Finsko%20ofiko.meta.js
// ==/UserScript==

(function() {
    if (!location.href.match(/&&$/)) {
        const newUrl = location.href + "&&";

        window.history.pushState({}, "", newUrl);
    }
})();