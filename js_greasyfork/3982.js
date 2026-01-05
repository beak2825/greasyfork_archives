// ==UserScript==
// @name        Cyclewear Cookie Notice Deleter
// @namespace   CookieFoetsie
// @include     http://cyclewear.*/*
// @version     1.1
// @description Removes Black Cookie Notice Bar from bottom of screen
// @downloadURL https://update.greasyfork.org/scripts/3982/Cyclewear%20Cookie%20Notice%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/3982/Cyclewear%20Cookie%20Notice%20Deleter.meta.js
// ==/UserScript==

// remove cookie notice footer
var CookieFoetsie = document.getElementById('cookiesdirective');
CookieFoetsie.parentElement.removeChild(CookieFoetsie);