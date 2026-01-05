// ==UserScript==
// @name        Viadeo Pop-up Killer
// @namespace   Viadeo Pop-up Killer
// @description No more subscribe pop-up on Viadeo
// @description:fr Supprime la pop-up "Pour voir le profil complet de ****, inscrivez-vous" 
// @include     http*://*.viadeo.com/*
// @version     1.2
// @grant       GM_addStyle
// @license     GPL
// run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/12916/Viadeo%20Pop-up%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/12916/Viadeo%20Pop-up%20Killer.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(".hide-overflow { overflow: scroll !important; }");
    GM_addStyle(".popin-overlay { display: none !important; }");
    GM_addStyle(".popin-container { display: none !important; }");
    GM_addStyle("#registrationView .formProfile { display: none !important;  }");
})();
