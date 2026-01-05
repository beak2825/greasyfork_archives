// ==UserScript==
// @name         Réponse Prédéfinis 
// @namespace    https://realitygaming.fr/
// @version      1.0
// @description  RealityGaming
// @author       Rivals, Westiix
// @match        https://realitygaming.fr/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24967/R%C3%A9ponse%20Pr%C3%A9d%C3%A9finis.user.js
// @updateURL https://update.greasyfork.org/scripts/24967/R%C3%A9ponse%20Pr%C3%A9d%C3%A9finis.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('input[value="Poster votre réponse"]').click(function(event){
            event.preventDefault();
            var content = $('iframe.redactor_textCtrl').contents().find('body').html();
            var replace1 = "Bonsoir";
            var replace2 = "Salut";
            var replace3 = "Why Not";
            var replace4 = "Salut :membre:";
            $('iframe.redactor_textCtrl').contents().find('body').html(content.replace('[membre]', $('#pageDescription').find('a.username').html()).replace('[5]', replace1).replace('[test1]', replace2).replace('[text3]', replace3).replace('[text4]', replace4));
            $('input[value="Poster votre réponse"]').submit();
        });
    });
})();