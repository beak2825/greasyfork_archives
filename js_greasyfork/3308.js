// ==UserScript==
// @name        SauvegardeMessagerie
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     1.01
// @grant       none
// @description Parcourt tous vos messages de tous vos dossiers et produit une sortie HTML à copier dans un fichier sur votre machine.
// @downloadURL https://update.greasyfork.org/scripts/3308/SauvegardeMessagerie.user.js
// @updateURL https://update.greasyfork.org/scripts/3308/SauvegardeMessagerie.meta.js
// ==/UserScript==

(function() {   
    
    alert("Il va vous falloir pas mal de patience. Le processus va durer un bon moment, si vous avez de nombreux messages surement des heures. Laissez tourner le script sur un onglet ouvert pendant que vous vacquez a vos occupations. Un pop up vous previendra quand c est termine, avec la marche a suivre pour sauvegarder sur votre machine vos messages. Ne faites pas attention a la tronche de ce qui s affiche, ca sera (un peu) plus lisible que ca sur votre fichier final. Le script va parcourir tous les messages de tous les dossiers à l'exception de celui des messages envoyés. Si vous voulez suivre l'évolution, clic droit puis console."); 
    
    $.ajaxSetup({async: false});
    var text = "";   
    
    var liste_dossier = $("#folder_list .folder");
    for(var k = 0; k < liste_dossier.length; k++)
    {        
        var idFolder = liste_dossier[k].id.replace(/folder_(\d+)$/, '$1');
        if(idFolder != "folder_-1")
        {
           $.post("Menu/Messaging/OpenFolder", {
              id_folder: idFolder
           }, function (b) {
              $("#liste_messages .content").html($(b).find("folder_content").xml());
           })
            

    
            loadMessages(idFolder);

            var liste_messages = $("#liste_messages .content .message");
            for(var i = 0; i < liste_messages.length; i++)
            {
                var id = liste_messages[i].id.replace(/message_(\d+)$/, '$1');
                var textConv = "";
                var auteur =  $(liste_messages[i]).find(".message_auteur")[0].innerHTML;
                var sujet = $(liste_messages[i]).find(".message_titre")[0].innerHTML;
                console.log("["+$(liste_dossier[k]).find(".name").text()+"] "+ sujet+" "+ (i+1) +"/"+liste_messages.length);


                var url = 'Menu/Messaging/action=OpenMessage&id_conversation=' + id;


                $.get(url, function (xml) {
                    if (xml_result(xml)) {
                        var messages = $(xml).find(".conversation");
                        for(j = 0; j < messages.size(); j++)
                        {
                            var idMess = messages[j].id.replace(/convers_(\d+)$/, '$1');

                            var textMessage = "<div id='message"+id+"_"+idMess+"' class='messageClass'>";

                            var tmp = $(xml).find(".conversation")[j];
                            var date = $(tmp).find("span")[0].innerHTML;
                            var nom = $(tmp).find("span")[1].innerHTML.replace("Message de ", "");

                            textMessage +="<div class='nomdateMessage'>"+nom +" "+date+"</div>";

                            var urlMessage = 'Menu/Messaging/action=ReadMessage&id_message=' + idMess + '&id_conversation=' + id;

                            $.get(urlMessage, function (xml2) {
                               if (xml_result(xml2)) {                           
                                   textMessage += $(xml2).find("message")[0].innerHTML;
                               } 
                            });
                            textConv = textMessage + "</div> "+textConv;
                        }
                    }           
                });

                if(k===0)
                   textConv = "<div id='messagesConvDiv' class='messageConvClass'>" + "<div class='titreMessage'>"+ auteur+" : "+sujet+"</div>" + textConv + "</div>";
                else
                    textConv = "<div id='messagesConvDiv' class='messageConvClass'>" + "<div class='titreMessage'>["+ $(liste_dossier[k]).find(".name").text()  +"] " + auteur+" : "+sujet+"</div>" + textConv + "</div>";
                text += textConv;    
            }
        }
    }
    
    $("#ingame").html(" ");
    $("#ingame").css("background","none");
    $("head").html(" ");
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.titreMessage { border-bottom : 1px solid; font-size: 20px; line-height:20px; text-transform:uppercase;}';
    style.innerHTML += '.nomdateMessage { color: green; }';
    style.innerHTML += '.messageClass { padding: 10px 10px 5px; border: 1px solid rgb(204, 204, 204); border-radius: 15px; margin: 10px 0px 20px; box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3) inset; background: none repeat scroll 0% 0% rgb(254, 254, 254);}';
    style.innerHTML += '.messageConvClass { width: auto; background: none repeat scroll 0% 0% #D3D8D7; margin: 10px 0px 20px; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3) inset; border-radius: 20px; padding: 20px 20px 10px; border: 2px solid black; }';

    document.getElementsByTagName('head')[0].appendChild(style);
    
    var header = $("head").html();
    $("#ingame").html("");
    $("#ingame").text("<html><head>"+header+"</head><body style='background-color:black;'>"+text+"</body></html>");
    
    alert("La recuperation est terminee. Maintenant copie l integralite du texte de la fenetre (une fois ce popup ferme) en faisant un petit ctrl a. Ouvre un nouveau fichier sur ta machine, enregistre le avec l extension .html, colle le texte copie dedans et hop. T as ta sauvegarde. Te reste plus qu a ouvrir ce fichier avec ton navigateur habituel. Les conversations sont ordonnees de la plus recente a la plus anciennce. Par contre au sein d une conversation les messages sont ordonnes du plus vieux au plus recent pour faciliter la lecture dans l ordre chonologique de la conversation.");

})();


function loadMessages(id_folder) {
    if ($('#zone_messagerie .loader').data('canLoad') == false)
      return true;
    
    var numero = $('#zone_messagerie .content li:last-child');
        numero = numero.length ? numero.attr('data-numero') : 0;
    $('#zone_messagerie .loader').css('visibility', 'visible');
    $('#zone_messagerie .loader').data('canLoad', false);
    $.post('./Menu/Messaging/OpenFolder', {
        id_folder: id_folder,
        numero: numero
    }, function (xml) {
        $('#zone_messagerie .loader').css('visibility', 'hidden');
        setTimeout($('#zone_messagerie .loader').data('canLoad', true), 1000);
        if (xml_result(xml)) {
            newResults = false;
            $(xml).find('folder_content li').each(function () { 
                $(this).clone().appendTo($('#zone_messagerie .content ul'));
                newResults = true;
            });
            
            nav.getMessagerie().handleDrag();
            
            if(newResults == true)
            {
               loadMessages(id_folder);
            }
         }
    });
}