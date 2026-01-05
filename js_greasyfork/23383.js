// ==UserScript==
// @name         Bouton 
// @namespace    https://realitygaming.fr/
// @namespace    https://realitygaming.fr/chatbox/
// @version      1.0
// @description  Bouton - Weyzen
// @author       Code : Rivals / Create WZN
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23383/Bouton.user.js
// @updateURL https://update.greasyfork.org/scripts/23383/Bouton.meta.js
// ==/UserScript==

// Script crée par @Marrent


$('#happyBirthday').click(function(){
   $('textarea[placeholder="Ecrire quelque chose..."]').val('Je te souhaite un bon anniversaire '+ $('h1[itemprop="name"]').text() +' :)');
});