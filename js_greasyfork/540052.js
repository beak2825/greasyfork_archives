// ==UserScript==
// @name         Colorful Page Background
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muda o fundo de qualquer site para um degradê animado
// @author       Etson Gernandes
// @match        *://*/*
// @grant        none
// @tampermonkey-safari-promotion-code-request
// @downloadURL https://update.greasyfork.org/scripts/540052/Colorful%20Page%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/540052/Colorful%20Page%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const body = document.body;
    body.style.transition = "background 5s";
    body.style.background = "linear-gradient(135deg, #ff9a9e, #fad0c4)";
})();