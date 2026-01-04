// ==UserScript==
// @name           Google Search 30 per pagina figuccio
// @description    Mostra 30 risultati di ricerca per pagina Google
// @namespace      https://greasyfork.org/users/237458
// @author         figuccio
// @version        0.1
// @match          https://*.google.com/*
// @match          https://*.google.it/*
// @match          https://*.google.fr/*
// @match          https://*.google.es/*
// @match          https://*.google.de/*
// @exclude        https://drive.google.com/*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-start
// @icon           https://www.google.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/503224/Google%20Search%2030%20per%20pagina%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/503224/Google%20Search%2030%20per%20pagina%20figuccio.meta.js
// ==/UserScript==
//////////////////////30 risultati per pagina
(function() {
  'use strict';
  if (GM_getValue('Amount of results to Show') === undefined) //Se la quantità di risultati da mostrare non è definita
  { //Avvia la condizione if
    GM_setValue('Amount of results to Show', 30); //Imposta la quantità predefinita di risultati da mostrare come 30/100
  } //Termina la condizione if

  if (location.pathname === '/search' && location.href.match('&num=' + GM_getValue('Amount of results to Show') ) === null) //If the current search doesn't have the user choices applied
  { //Avvia la condizione if
    location.href = location.href += '&num=' + GM_getValue('Amount of results to Show') ; //Reindirizza per aggiungere le scelte dell'utente
  } //Termina la condizione if
})();