// ==UserScript==
// @name         RPS Link Colouriser
// @namespace    http://bonuswave.digital
// @version      0.1
// @description  A simple script to set link colours differently to indicate internal/external
// @author       BonusWavePilot
// @match       http://*.rockpapershotgun.com/*
// @match       https://*.rockpapershotgun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393505/RPS%20Link%20Colouriser.user.js
// @updateURL https://update.greasyfork.org/scripts/393505/RPS%20Link%20Colouriser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var external_colour = '#A69646';
    var links = document.getElementsByTagName('a');

    // Iterate through links on the page, and recolour any that do not contain 'rockpapershotgun.com'
    for (var l = 0; l < links.length; l++){
        if (links[l].href.indexOf("rockpapershotgun.com") == -1){
            links[l].style.color = external_colour;
        }
    }
})();