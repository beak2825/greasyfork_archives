// ==UserScript==
// @name         tigrou
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sticker tigrou
// @author       ussou
// @match        https://onche.org/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onche.org
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477215/tigrou.user.js
// @updateURL https://update.greasyfork.org/scripts/477215/tigrou.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Sélectionnez toutes les balises div avec la classe "sticker"
    var divs = document.querySelectorAll('div.sticker');

    // Parcourez toutes les balises div sélectionnées
    divs.forEach(function(div) {
        // Vérifiez si la balise div contient une balise img
        if (div.querySelector('img')) {
            // Créez une nouvelle balise img avec l'attribut src souhaité
            var newImg = document.createElement('img');
            newImg.setAttribute('src', 'https://cloud.onche.org/7000843d-8daf-470b-9df0-2bd436ce549d!EKe4SuR6Hp/128');
            newImg.setAttribute('width', '64');
            newImg.setAttribute('height', '48');


            // Remplacez la balise div par la nouvelle balise img
            div.parentNode.replaceChild(newImg, div);
        }
    });
})();
