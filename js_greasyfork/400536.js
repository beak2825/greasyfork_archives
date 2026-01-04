// ==UserScript==
// @name         webcamdarts game result lobby hide
// @namespace    https://greasyfork.org/fr/users/505971-antoine-maingeot
// @name:fr      webcamdarts masquer resultat lobby
// @description:fr masquer les resultats de smatchs dans le lobby
// @version      0.2
// @description  don't display detail game result
// @author       You
// @match        *webcamdarts*
// @match        https://www.webcamdarts.com/GameOn/Lobby
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400536/webcamdarts%20game%20result%20lobby%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/400536/webcamdarts%20game%20result%20lobby%20hide.meta.js
// ==/UserScript==

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
addGlobalStyle('.game-result { display: none; }');
})();
