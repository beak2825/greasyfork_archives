// ==UserScript==
// @name         Eksi reklam sikici
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Eksi reklam silcici
// @author       angusyus
// @include        *eksisozluk*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469379/Eksi%20reklam%20sikici.user.js
// @updateURL https://update.greasyfork.org/scripts/469379/Eksi%20reklam%20sikici.meta.js
// ==/UserScript==

try{
   var aa = document.getElementsByClassName("ad-double-click ad-1x1 ad-banner ad-doubleclickwebinterstital ads")[0].remove();
} catch(e) {
  console.log("Reklam silinemedi");
}