// ==UserScript==
// @name          mostra feed recenti Facebook figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.2
// @author        figuccio
// @description   icona facebook e icona home reindirizzano ai feed piu recenti 2023
// @match         https://*.facebook.com/*
// @match         https://*.facebook.com/me/*
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?domain=facebook.com
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/460517/mostra%20feed%20recenti%20Facebook%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460517/mostra%20feed%20recenti%20Facebook%20figuccio.meta.js
// ==/UserScript==
(function recent() {
    window.setTimeout(recent,1000);
    ////////////////////home e logo/////////////////////////////
   if(location.href.match(/facebook\.com\/?$/))
   window.location.href="https://www.facebook.com/?sk=h_chr";
    ////////////////////////////////////////////////////////////
  })();




