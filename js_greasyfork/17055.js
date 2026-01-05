// ==UserScript==
// @name         Pururin keyboard skip
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Passe les pistes à l'aide de la touche espace : une commodité bien appréciable pour les longues sessions en mode "image cachée"
// @author       Kayseur
// @match        http://pururin.eu/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17055/Pururin%20keyboard%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/17055/Pururin%20keyboard%20skip.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


this.$ = this.jQuery = jQuery.noConflict(true);
var i = 0;

    $(document).keypress(function(e) {
        if (e.which === 32 && !$(document.activeElement).is(":input,[contenteditable]")) {
            
            if(i == 0) // si on a pas encore cliqué
            {           
                $('#repSimple').trigger('click');
            }
            else if(i == 1) // on a cliqué une fois, on passe à la suivante
            {
                $('button.submit2').trigger('click');
            }
            
            i=i+1;
            
        }
        if(i==2){
            i = 0;
        }
    }); 
