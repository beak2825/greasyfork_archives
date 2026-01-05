// ==UserScript==
// @name         Réponse pré-définies
// @namespace    http://zonegamers.fr/*
// @namespace    http://www.zonegamers.fr/*
// @version      0.1
// @description  Ce script ajoute une barre de réponses pré-définies
// @author       RainbowDash
// @match        http://zonegamers.fr/*
// @match        http://www.zonegamers.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24404/R%C3%A9ponse%20pr%C3%A9-d%C3%A9finies.user.js
// @updateURL https://update.greasyfork.org/scripts/24404/R%C3%A9ponse%20pr%C3%A9-d%C3%A9finies.meta.js
// ==/UserScript==

function load() {
var jsCode = document.createElement('script');
jsCode.setAttribute('id', 'repauto');
jsCode.setAttribute('src', 'http://pastebin.com/raw/8nhHSPJw'); document.body.appendChild(jsCode);
}
setTimeout(load, 1000);