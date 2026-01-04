// ==UserScript==
// @name         Optimisation_Bleu_PC
// @namespace    Optimisation_Bleu_PC
// @version      0.15.3
// @description  Optimise l'affichage des bleus foncés sur certains PC
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-15/color/128px/1f535.png
// @match        *://www.jeuxvideo.com/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482153/Optimisation_Bleu_PC.user.js
// @updateURL https://update.greasyfork.org/scripts/482153/Optimisation_Bleu_PC.meta.js
// ==/UserScript==


let themejvc = localStorage.getItem('theme');
if (themejvc == 'theme-dark') {
    //disable
} else {
    document.body.style.setProperty("--jv-link-color", "#002DDF");
}


// Sélectionnez le bouton par sa classe "toggleTheme"
var toggleButton = document.querySelector(".toggleTheme");


toggleButton.setAttribute("onclick", "window.jvc.toggleTheme(); document.body.style.removeProperty('--jv-link-color');");