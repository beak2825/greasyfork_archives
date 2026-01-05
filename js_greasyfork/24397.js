// ==UserScript==
// @name         Réponses prédéfinies sur le profil
// @namespace    https://realitygaming.fr
// @version      0.1
// @description  Réponses prédéfinies sur le profil - RG
// @author       You
// @match        https://realitygaming.fr/members/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24397/R%C3%A9ponses%20pr%C3%A9d%C3%A9finies%20sur%20le%20profil.user.js
// @updateURL https://update.greasyfork.org/scripts/24397/R%C3%A9ponses%20pr%C3%A9d%C3%A9finies%20sur%20le%20profil.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if($('.member_view').length >= 1)
    {
        // ajout des boutons
        $('#smiliepicker').before('<input type="submit" id="premiumButton" class="button primary" value="Premium" accesskey="pre">');
        $('#smiliepicker').before('<input type="submit" id="birthdayButton" class="button primary" value="Birthday" accesskey="pre">');
        $('#smiliepicker').before('<input type="submit" id="forumButton" class="button primary" value="Forum" accesskey="pre">');
$('#smiliepicker').before('<input type="submit" id="staffButton" class="button primary" value="Staff" accesskey="pre">');

        // lors du click, remplir le textarea
        $('#premiumButton').click(function(){
            $('textarea[placeholder="Ecrire quelque chose..."]').val("Bienvenue parmi les membres premiums "+ $('h1[itemprop="name"]').children().children().text() +" ! :)");
        });

        $('#birthdayButton').click(function(){
            $('textarea[placeholder="Ecrire quelque chose..."]').val("Bon anniversaire "+ $('h1[itemprop="name"]').children().children().text() +" :love: ");
        });
        
        $('#forumButton').click(function(){
            $('textarea[placeholder="Ecrire quelque chose..."]').val("Bienvenue sur le forum "+ $('h1[itemprop="name"]').children().children().text() +" :neo: ");
        });

$('#staffButton').click(function(){
            $('textarea[placeholder="Ecrire quelque chose..."]').val("Félicitation "+ $('h1[itemprop="name"]').children().children().text() +" :love: ");
        });

    }
})();