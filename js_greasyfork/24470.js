// ==UserScript==
// @name         Balise [membre]
// @namespace    https://h7k3r-app.fr/threads/
// @version      1.0
// @description  Balise [membre] qui est remplacée par le pseudonyme de l'auteur à la soumission d'une réponse.
// @author       Rivals - Editer par Weyzen
// @match        https://h7k3r-app.fr/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24470/Balise%20%5Bmembre%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/24470/Balise%20%5Bmembre%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('input[value="Poster votre réponse"]').click(function(event){
            event.preventDefault();
            
            var content = $('iframe.redactor_textCtrl').contents().find('body').html();
            $('iframe.redactor_textCtrl').contents().find('body').html(content.replace('[membre]', $('#pageDescription').find('a.username').html()));
            
            console.log('OK');
            
            $('input[value="Poster votre réponse"]').submit();
        });
    });
})();