// ==UserScript==
// @name        Mise en Page - uness.fr.user.js
// @namespace   Violentmonkey Scripts
// @match       https://livret.uness.fr/lisa/Fiche_LiSA:*
// @grant       none
// @version     1.2
// @author      Propoflow
// @license MIT
// @description 25/05/2022, 08:00:00
// @downloadURL https://update.greasyfork.org/scripts/433446/Mise%20en%20Page%20-%20unessfruserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/433446/Mise%20en%20Page%20-%20unessfruserjs.meta.js
// ==/UserScript==

/Il faut que le site soit paramétré avec le thème VECTOR pour avoir un bon rendu avec l'impression de page WEB /

var days = document.getElementsByClassName('navbox'), i;
for (var i = 0; i < days.length; i++) { days[i].style.display = 'none'; }

var count = document.getElementsByClassName('minerva__tab-container'), i;
for (var i = 0; i < count.length; i++) { count[i].style.display = 'none'; }

var counter = document.getElementsByClassName('page-actions-menu'), i;
for (var i = 0; i < counter.length; i++) { counter[i].style.display = 'none'; }

var count = document.getElementsByClassName('d-print-none h3 text-center alert alert-success pt-3 pb-3'), i;
for (var i = 0; i < count.length; i++) { count[i].style.display = 'none'; }

var counter2 = document.getElementsByClassName('mw-specialite'), i;
for (var i = 0; i < counter2.length; i++) { counter2[i].style.display = 'none'; }

var counter99 = document.getElementsByClassName('minerva-footer'), i;
for (var i = 0; i < counter99.length; i++) { counter99[i].style.display = 'none'; }

var counter21 = document.getElementsByTagName('hr'), i;
for (var i = 0; i < counter21.length; i++) { counter21[i].style.display = 'none'; }

var counter22 = document.getElementsByTagName('br'), i;
for (var i = 0; i < counter22.length; i++) { counter22[i].style.display = 'none'; }

var counter3 = document.getElementsByTagName('h1'), i;
for (var i = 0; i < counter3.length; i++) { counter3[i].style.fontFamily = "Roboto Condensed,regular, sans-serif"; counter3[i].style.textAlign = "center"; }
  
var counter4 = document.getElementsByTagName('ul'), i;
for (var i = 0; i < counter4.length; i++) { counter4[i].style.fontFamily = "Roboto Slab,sans-serif"; counter4[i].style.textAlign = "left";counter4[i].style.fontStyle = "italic"; counter4[i].style.fontSize = "small";}

var counter5 = document.getElementsByTagName('p'), i;
for (var i = 0; i < counter5.length; i++) { counter5[i].style.fontFamily = "Roboto,sans-serif"; counter5[i].style.textAlign = "justify";}