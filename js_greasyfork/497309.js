// ==UserScript==
// @name           Google Search disattiva SafeSearch+newwindows on
// @description    disattiva SafeSearch , risultati di ricerca in una nuova finestra + 30 risultati per pagina
// @namespace      https://greasyfork.org/users/237458
// @author         figuccio
// @version        0.2
// @match          https://*.google.com/*
// @match          https://*.google.it/*
// @match          https://*.google.fr/*
// @match          https://*.google.es/*
// @match          https://*.google.de/*
// @run-at         document-start
// @icon           https://www.google.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/497309/Google%20Search%20disattiva%20SafeSearch%2Bnewwindows%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/497309/Google%20Search%20disattiva%20SafeSearch%2Bnewwindows%20on.meta.js
// ==/UserScript==
(function() {
  var url = new URL(window.location.href);
  var params = url.searchParams;

  // Controlla se il parametro 'newwindows' è già impostato su '1'
  if (params.get('newwindow') !== '1') {
    params.set('newwindow', '1');
    window.location.replace(url.toString());
  }
    /////////////////////
  // Controlla se il parametro 'safe' è già impostato su 'off'
  if (params.get('safe') !== 'off') {
    params.set('safe', 'off');
    window.location.replace(url.toString());
  }
   //30 risultati per pagina
   if (params.get('num') !== '30') {
    params.set('num', '30');
    window.location.replace(url.toString());
  }

})();
