// ==UserScript==
// @name         Counterfeit Flair Detector
// @namespace    https://parretlabs.xyz
// @version      0.1
// @description  WE MUST PRESERVE THE VALUE OF OUR BELOVED EVENT FLAIRS. Flips counterfeit flairs upside down ingame.
// @author       Electro
// @include      https://tagpro.koalabeast.com/game
// @include      http://tagpro-maptest.koalabeast.com:8*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397944/Counterfeit%20Flair%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/397944/Counterfeit%20Flair%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    tagpro.ready(function () {
        setInterval(function(){
            Object.values(tagpro.players).forEach(function(item, idx){
                if(item.flair.description.includes("Counterfeit")) item.sprites.flair.rotation = 3.14;
            });
        }, 5000);
    });
    // Your code here...
})();