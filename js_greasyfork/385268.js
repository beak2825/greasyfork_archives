// ==UserScript==
// @name         Veneficium Brightness Corrector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Un correcteur de luminosité pour Veneficium si vous avez les yeux fragiles
// @author       Miyuun
// @match        http://www.veneficium.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385268/Veneficium%20Brightness%20Corrector.user.js
// @updateURL https://update.greasyfork.org/scripts/385268/Veneficium%20Brightness%20Corrector.meta.js
// ==/UserScript==

var $ = window.$;

$(document.body).append($('<style>#wrap:before{opacity: 0.35;filter: brightness(35%);}</style>'));