// ==UserScript==
// @name         Optimisation_Mini_PC
// @namespace    Optimisation_Mini_PC
// @version      0.8.3
// @description  Optimise l'affichage sur mini PC et tablettes
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/android-11/128px/1f4bb.png
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        *://www.jeuxvideo.com/forums/42-*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482155/Optimisation_Mini_PC.user.js
// @updateURL https://update.greasyfork.org/scripts/482155/Optimisation_Mini_PC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var blocsPreLeft = document.querySelectorAll('.bloc-pre-left');

    if (blocsPreLeft.length > 0) {
        blocsPreLeft.forEach(function(bloc) {
            bloc.style.width = 'auto'; // Nouvelle largeur de l'élément gauche
        });
    }

})();



