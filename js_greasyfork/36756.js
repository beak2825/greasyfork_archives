// ==UserScript==
// @name         Agar Copy & Paste
// @namespace    Agar Copy & Paste
// @version      1.1
// @description  Copy leaderboard names, cell names and your score straight from the game! Mod made by Ghost_assassin
// @author       Ghost_asassin
// @license      PSL
// @match        http://agma.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/36756/Agar%20Copy%20%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/36756/Agar%20Copy%20%20Paste.meta.js
// ==/UserScript==
function inject(type, code) {
   switch(type) {
      case 'javascript':
         var inject  = document.createElement('script');
         inject.type = 'text/javascript';
         inject.appendChild(document.createTextNode(code));
      break;
      case 'stylesheet':
         var inject  = document.createElement('style');
         inject.type = 'text/css';
         inject.appendChild(document.createTextNode(code));
      break;
   }
   (document.head || document.documentElement).appendChild(inject);
}