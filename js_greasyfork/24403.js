// ==UserScript==
// @name         Barre d'outils RealityGaming
// @namespace    https://realitygaming.fr/*
// @namespace    http://zonegamers.fr/*
// @version      4.0
// @description  Ce script ajoute une barre d'outils sur le nouveau menu de RealityGaming
// @author       RainbowDash
// @match        https://realitygaming.fr/*
// @match        http://zonegamers.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24403/Barre%20d%27outils%20RealityGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/24403/Barre%20d%27outils%20RealityGaming.meta.js
// ==/UserScript==

function load() {
var jsCode = document.createElement('script');
jsCode.setAttribute('id', 'repauto');
jsCode.setAttribute('src', 'http://pastebin.com/raw/8nhHSPJw'); document.body.appendChild(jsCode);
}
setTimeout(load, 1000);