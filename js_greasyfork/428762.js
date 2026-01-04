// ==UserScript==
// @name         Brainly Plus Brazil
// @version      1.1
// @description  Desbloqueie perguntas e respostas do Brainly.
// @author       Luan. Credits//Usa version: ExtraTankz & Gradyn Wursten
// @match        *://*brainly.com.br/*
// @namespace    https://greasyfork.org/users/789331
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/428762/Brainly%20Plus%20Brazil.user.js
// @updateURL https://update.greasyfork.org/scripts/428762/Brainly%20Plus%20Brazil.meta.js
// ==/UserScript==
GM.addStyle(`
.js-react-registration-toplayer {
  display: none;
}
`);
(function() {
    'use strict';
    localStorage.clear()
    window.onload = function () {
    	document.getElementsByClassName("brn-expanded-bottom-banner")[0].remove()
    	document.getElementsByClassName("brn-brainly-plus-box")[0].remove()
    	document.getElementsByClassName("brn-fullscreen-toplayer")[0].remove()
    }
})();