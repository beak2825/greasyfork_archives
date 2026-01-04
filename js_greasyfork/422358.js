// ==UserScript==
// @name         Google - bigger page's numbers, next and previous buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google - bigger buttons for page's numbers, next and previous
// @author       ClaoDD
// @include      https://www.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422358/Google%20-%20bigger%20page%27s%20numbers%2C%20next%20and%20previous%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/422358/Google%20-%20bigger%20page%27s%20numbers%2C%20next%20and%20previous%20buttons.meta.js
// ==/UserScript==

(function(){ var style = document.createElement('style'), styleContent = document.createTextNode('#foot .AaVjTc a { font-size: 34px !important; }'); style.appendChild(styleContent ); var caput = document.getElementsByTagName('head'); caput[0].appendChild(style); })();

(function(){ var style = document.createElement('style'), styleContent = document.createTextNode('.AaVjTc td { font-size: 40px !important; }'); style.appendChild(styleContent ); var caput = document.getElementsByTagName('head'); caput[0].appendChild(style); })();