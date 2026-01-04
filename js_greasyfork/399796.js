// ==UserScript==
// @name         Filmix Player Adblock Message remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes annoying Orange header inside video player
// @author       Emer
// @match        https://filmix.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399796/Filmix%20Player%20Adblock%20Message%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/399796/Filmix%20Player%20Adblock%20Message%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setTimeout(function(){
     let player = document.getElementById('oframeplayer');
    player.removeChild(player.children[21])
    console.log('Made by Emer, enjoy')
    },1000);
   
})();