// ==UserScript==
// @name         Liens Permanants Onche
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ajoute un bouton "Lien Permanant" aux messages sur onche
// @author       posi
// @match        https://onche.org/topic/*
// @match        http://onche.org/topic/*
// @icon         https://onche.org/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447392/Liens%20Permanants%20Onche.user.js
// @updateURL https://update.greasyfork.org/scripts/447392/Liens%20Permanants%20Onche.meta.js
// ==/UserScript==

(function() {
    const boutons = document.getElementsByClassName("right");

    for(var i = 2 ; i < (boutons.length-1) ; i++){
        boutons[i].innerHTML = `<div class="mdi mdi-link-variant" data-message-quote="" onclick="alert('https://onche.org/topic/16405/liens-permanents/1#message_${boutons[i].parentElement.parentElement.parentElement.getAttribute("data-id")}');"></div>`.concat(boutons[i].innerHTML);
    };
})();