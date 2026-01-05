// ==UserScript==
// @name         Réponses prédéfinies lors de la création d'un MP
// @namespace    https://realitygaming.fr
// @version      1.0
// @description  Script permettant de faire fonctionner les réponses prédéfinies d'un membre lors de la création d'une conversation.
// @author       Rivals 
// @match        https://realitygaming.fr/conversations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24289/R%C3%A9ponses%20pr%C3%A9d%C3%A9finies%20lors%20de%20la%20cr%C3%A9ation%20d%27un%20MP.user.js
// @updateURL https://update.greasyfork.org/scripts/24289/R%C3%A9ponses%20pr%C3%A9d%C3%A9finies%20lors%20de%20la%20cr%C3%A9ation%20d%27un%20MP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        var basicURL = getCookie('basicURLConversation');
        console.log(basicURL);
        
        // on ajoute les réponses seulements lorsque le lien de la conversation a été définie
        if(basicURL !== "")
        {
            $('input[placeholder="Titre de la conversation..."]').after('<div id="reponsesContainer"></div>');
            $('#reponsesContainer').css('margin-top', '10px');
            $('#reponsesContainer').css('margin-bottom', '-8px');
            console.log(basicURL + " .reponsesPredefinies");
            $('#reponsesContainer').load(basicURL + " .reponsesPredefinies", function(){
               $('.buttonMessagePredef').click(function(){
                    var message = $(this).attr('data-message');
                    var visiteur = $('a[title="Voir votre profil"').text();

                    //indications horaires
                    var d = new Date();
                    var heure = d.getHours();

                    //signature
                    var signature;
                    if (heure >= 0 && heure < 5) {
                        signature = 'Bonne fin de nuit,\n[i]'+visiteur+'[/i]';
                    }
                    else if (heure >= 5 && heure < 12) {
                        signature = 'Bonne journée,\n[i]'+visiteur+'[/i]';
                    }
                    else if (heure >= 12 && heure < 15) {
                        signature = 'Bonne après-midi,\n[i]'+visiteur+'[/i]';
                    }
                    else if (heure >= 15 && heure < 18) {
                        signature = 'Bonne fin d\'après-midi,\n[i]'+visiteur+'[/i]';
                    }
                    else if (heure >= 18 && heure < 21) {
                        signature = 'Bonne soirée,\n[i]'+visiteur+'[/i]';
                    }
                    else if (heure >= 21 && heure < 24) {
                        signature = 'Bonne fin de soirée,\n[i]'+visiteur+'[/i]';
                    }
                    else {
                        signature = 'A+ !\n [i]'+visiteur+'[/i]';
                    }
               
			        var messageFinal = message + "\n\n" + signature;
                    messageFinal = messageFinal.replace(/\n/g, '<br />');
                    messageFinal = messageFinal.replace('[membre]', '');

                    $('iframe.redactor_textCtrl').contents().find('body').html(messageFinal);
                    $('iframe.redactor_textCtrl').contents().find('body').select();
                    $('iframe.redactor_textCtrl').contents().find('body').focus();

               });      
            });
        }
        else
        {
            //on check si on est sur la page d'une conversation
            if($('.conversation_view').length >= 1)
            {
                alert("Cette conversation est désormais votre conversation d'initialisation.");
                document.cookie = createCookie('basicURLConversation', document.URL);
                console.log('Cookie sauvegardé');
            }
        }
    });
    
    //fonctions trouvées sur le site W3Schools
    function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
   }
    
   function createCookie(name,value,days) {
    if (days) {
       var date = new Date();
       date.setTime(date.getTime()+(days*24*60*60*1000));
       var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
       document.cookie = name + "=" + value + expires +"; path=/"; 
    }
})();