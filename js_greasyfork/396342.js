// ==UserScript==
// @name         Redirect to Lootbits.io 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirects to lootbits site if error page is accidentally opened
// @author       bernd
// @match        https://lootbits.io/dashboard.phpundefined
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396342/Redirect%20to%20Lootbitsio.user.js
// @updateURL https://update.greasyfork.org/scripts/396342/Redirect%20to%20Lootbitsio.meta.js
// ==/UserScript==

(function() {
        if(location.href == "https://lootbits.io/dashboard.phpundefined")
        {
            location.href = "https://lootbits.io/dashboard.php";
        }
})();