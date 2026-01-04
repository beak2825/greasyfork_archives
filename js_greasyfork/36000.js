// ==UserScript==
// @name         MyDeals+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Améliorations optionnelles pour les styles MyOldDeals et MyNewDeals !
// @author       Alexandreou
// @match        https://www.dealabs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36000/MyDeals%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/36000/MyDeals%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // S'il l'on est dans les bons plans.
    var hauteur = document.getElementsByClassName("thread cept-sale-event-thread thread--deal");
    // S'il l'on est dans les codes promo.
    if(hauteur.length === 0)
        hauteur = document.getElementsByClassName("thread cept-sale-event-thread thread--voucher");
    // S'il l'on est dans le forum.
    if(hauteur.length === 0)
        hauteur = document.getElementsByClassName("thread cept-sale-event-thread thread--discussion");

    hauteur = hauteur[0].offsetHeight;
    var test = document.getElementsByClassName("js-options bg--em bRad--a space--h-3 space--v-3 space--mt-3 text--b size--all-s")[0].offsetTop;

    // S'il y a le style MyNewDeals.
    if(test == 524)
        document.getElementsByClassName("js-options bg--em bRad--a space--h-3 space--v-3 space--mt-3 text--b size--all-s")[0].style.borderBottomWidth = hauteur-626 + "px";

    // Sinon s'il y a le style MyOldDeals.
    else if(test == 447)
        document.getElementsByClassName("js-options bg--em bRad--a space--h-3 space--v-3 space--mt-3 text--b size--all-s")[0].style.borderBottomWidth = hauteur-527 + "px";

    // Sinon s'il l'on est dans le forum.
    else if(test == 148 || test == 130)
        document.getElementsByClassName("js-options bg--em bRad--a space--h-3 space--v-3 space--mt-3 text--b size--all-s")[0].style.borderBottomWidth = hauteur-149-(test-130) + "px";

})();