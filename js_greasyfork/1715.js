// ==UserScript==
// @name        seeSpoilerJol
// @namespace   jolBoost
// @description Affichage en un clic de tous les spoilers de la page
// @include     http://forums.jeuxonline.info/showthread.php*
// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1715/seeSpoilerJol.user.js
// @updateURL https://update.greasyfork.org/scripts/1715/seeSpoilerJol.meta.js
// ==/UserScript==
//Recup element ou placer le nouveau bouton
var previousElt = document.getElementById('intraforums1_menu');
var div = document.createElement('DIV');
div.style.marginBottom = '5px';
div.style.textAlign = 'right';
//Bouton
var clickButton = document.createElement('BUTTON');
clickButton.className = 'button show';
clickButton.onclick = showAllSpoiler;
clickButton.id = 'allSpoilButton';
var textButton = document.createTextNode('Afficher tous les spoilers');
clickButton.appendChild(textButton);
div.appendChild(clickButton);
//Texte explicatif
var br = document.createElement('BR');
var smallElt = document.createElement('SMALL');
var emElt = document.createElement('EM');
var explainTxt = document.createTextNode('Cliquez sur le bouton pour afficher tous les contenus en Spoiler dans la page');
emElt.appendChild(explainTxt);
smallElt.appendChild(emElt);
div.appendChild(br);
div.appendChild(smallElt);
//Et on ajoute le tout ! 
previousElt.parentNode.insertBefore(div, previousElt.nextSibling);
/** Fonction d'affichage du spoiler **/
function showAllSpoiler() {
    var show = false;
    var button = document.getElementById('allSpoilButton');
    if (button.className == 'button show') {
        show = true;
    }
    var elements = document.getElementsByClassName('spoiler');
    for (var i = 0, l = elements.length; i < l; i++) {
        if (show) {
            elements[i].className = elements[i].className + ' spoiler-selected';
        } else {
            elements[i].className = 'spoiler';
        }
    }
    while (button.firstChild) {
        button.removeChild(button.firstChild);
    }
    if (show) {
        var newtextButton = document.createTextNode('Cacher');
        button.appendChild(newtextButton);
        button.className = 'button hide';
    } else {
        var newtextButton = document.createTextNode('Afficher tous les spoilers');
        button.appendChild(newtextButton);
        button.className = 'button show';
    }
}
