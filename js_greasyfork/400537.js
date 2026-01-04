// ==UserScript==
// @name         webcamdarts font size
// @namespace    https://greasyfork.org/fr/users/505971-antoine-maingeot
// @name:fr      webcamdarts écriture
// @version      0.2
// @description  font size and space
// @description:fr taille barre menu
// @author       You
// @match        *webcamdarts*
// @match        https://www.webcamdarts.com/GameOn/Lobby
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400537/webcamdarts%20font%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/400537/webcamdarts%20font%20size.meta.js
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

    addGlobalStyle('#nav {position: relative;  font: initial; }');
    addGlobalStyle('#tray {padding: 0 0 0 0; }');
    addGlobalStyle('.social_menu { display: none; }');
    addGlobalStyle('.motds a { font-size: 12px; }');
    addGlobalStyle('#nav { top: 0px; }');
    addGlobalStyle('.mt35 {margin-top: 0px!important; }');
    addGlobalStyle('nav.primary ul li a {font-size: 12px;line-height: 12px; padding: 0 7px; }');
    addGlobalStyle('.username {display: none; }');
   // addGlobalStyle('.k-splitbar-static-vertical {display:none; }');
    //addGlobalStyle('.k-splitbar-static-horizontal {display:none; }');
})();
