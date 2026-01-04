// ==UserScript==
// @name        Portail Famille Berger Levrault - Planning plein écran
// @namespace   Violentmonkey Scripts
// @match       https://portail.berger-levrault.fr/*/activites/planning
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 11/05/2023 21:32:15
// @downloadURL https://update.greasyfork.org/scripts/466083/Portail%20Famille%20Berger%20Levrault%20-%20Planning%20plein%20%C3%A9cran.user.js
// @updateURL https://update.greasyfork.org/scripts/466083/Portail%20Famille%20Berger%20Levrault%20-%20Planning%20plein%20%C3%A9cran.meta.js
// ==/UserScript==

// Fonction pour modifier le CSS
function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

// Cacher l'entête avec l'image
$("body > header").hide();

// Modification du padding de la zone du planning
addCss("#wrapper { padding-top:0px;} /* more CSS here */");