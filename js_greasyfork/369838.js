// ==UserScript==
// @name         passetoncode.fr au clavier!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       LLG
// @match        https://www.passetoncode.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369838/passetoncodefr%20au%20clavier%21.user.js
// @updateURL https://update.greasyfork.org/scripts/369838/passetoncodefr%20au%20clavier%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var authorizedLetters = '1234ABCDabcd';
     $('body').on('keyup', function (ev) {
        var letter = String.fromCharCode(ev.which).toUpperCase();

        if(letter==1){letter='A';}
        if(letter==2){letter='B';}
        if(letter==3){letter='C';}
        if(letter==4){letter='D';}
        if (authorizedLetters.indexOf(letter) > -1) {
            $('span#Lien' + letter).click();
       }

         if (ev.which == 13){
             $("button:contains('Valider')").click();
             //$('span.Lien' + 'A').click();
         }
});
})();