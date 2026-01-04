// ==UserScript==
// @name         webcamdarts color (don't use with Ultimate Webcamdarts Lobby)
// @name:fr      webcamdarts couleur (ne pas utiliser avec Webcamdarts style du lobby et filtrage)
// @version      0.2 
// @description  Avaiable and busy player color
// @description:fr colorer les joueurs dispo et occupés
// @author       You
// @match        *webcamdarts*
// @match        https://www.webcamdarts.com/GameOn/Lobby
// @match        webcamdarts
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/400534/webcamdarts%20color%20%28don%27t%20use%20with%20Ultimate%20Webcamdarts%20Lobby%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400534/webcamdarts%20color%20%28don%27t%20use%20with%20Ultimate%20Webcamdarts%20Lobby%29.meta.js
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
    addGlobalStyle(' #current-user.available, .userli.available { background-color: #4b560d60; }');
    addGlobalStyle('#current-user.busy, .userli.busy { background-color: #ff000030; }');

})();