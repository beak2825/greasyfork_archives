// ==UserScript==
// @name        NoBlockBlock - Nice Matin & Var Matin
// @include     *://*nicematin.com/*
// @include     *://*varmatin.com/*
// @description Désactive l'anti-adBlock 
// @version     1.0.2
// @namespace   Ahahaha
// @author		  owintwist
// @supportURL   
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34390/NoBlockBlock%20-%20Nice%20Matin%20%20Var%20Matin.user.js
// @updateURL https://update.greasyfork.org/scripts/34390/NoBlockBlock%20-%20Nice%20Matin%20%20Var%20Matin.meta.js
// ==/UserScript==
$('div.modalRhoo').remove()
$('div.RhooBg').remove()