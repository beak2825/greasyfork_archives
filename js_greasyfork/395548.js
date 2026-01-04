// ==UserScript==
// @name         Exame - Libera conteúdo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Oculta propaganda e libera conteúdo do site Exame
// @author       Fernando Mendes Fonseca
// @match        https://exame.abril.com.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395548/Exame%20-%20Libera%20conte%C3%BAdo.user.js
// @updateURL https://update.greasyfork.org/scripts/395548/Exame%20-%20Libera%20conte%C3%BAdo.meta.js
// ==/UserScript==

(function() {
    'use strict';
var adBox = document.getElementById('piano_offer');
if (adBox) {
    adBox.parentNode.removeChild(adBox);
}
})();