// ==UserScript==
// @name         Disboard Remover
// @version      0.1
// @description  Removes servers that aren't new from displaying on disboard
// @author       VeryPogChamp
// @match        *://disboard.org/*
// @run-at document-end
// @grant        none
// @namespace https://greasyfork.org/users/732623
// @downloadURL https://update.greasyfork.org/scripts/420893/Disboard%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/420893/Disboard%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allcards = document.querySelectorAll('.main > .container > .columns > .column.is-one-third-desktop')
for(var i = 0;i<allcards.length;i++){
   if(allcards[i].getElementsByClassName("is-new").length == 0){
   allcards[i].style = "display:none;"
   }
}
})();