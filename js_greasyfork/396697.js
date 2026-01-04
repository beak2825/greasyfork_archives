// ==UserScript==
// @name VousAvezUnMessage
// @namespace InGame
// @author Gideon, Sÿ (correctif), Odul (MAJ pour nouvelle interface), MockingJay (optimisation)
// @date 29/11/2011
// @version 2.7.1
// @description Une voix vous signale la reception d'un message.
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/396697/VousAvezUnMessage.user.js
// @updateURL https://update.greasyfork.org/scripts/396697/VousAvezUnMessage.meta.js
// ==/UserScript==

const AUDIO_URL = 'https://www.dreadcast.net/sons/message.mp3'; //Lien de votre son
const VOLUME = 0.5; //Volume, 0 = pas de son, 1 = volume maximum

//========================================================================================================================================

$(document).ready(function() {

    var audio = document.createElement('audio');
    audio.id = "vaumSound";
    $('#bandeau ul')[0].insertBefore(audio,$('#bandeau ul')[0].firstChild);
    $('#vaumSound').attr('src', AUDIO_URL);
    $('#vaumSound').css('display','none');
    document.getElementById('vaumSound').load(); //Charger le son une seule fois

    MenuMessagerie.prototype.messageReceived=function(content){
        $(content).each(function(){
            if(!isset($(this)[0].tagName))
                return true;

            var folder_id = $(this)[0].tagName.toLowerCase().replace('folder_','');

            if(folder_id == $('#current_folder').attr('data-id'))
                nav.getMessagerie().openFolder(folder_id);

            $('#zone_messagerie').trigger({type:'nouveauMessage',id_conversation:$(this).attr('id_conversation'),folder_id:folder_id,quantity:$(this).attr('quantite')});

            document.getElementById('vaumSound').play();
        })
    };

    var End = document.createElement('div');
    End.id='endAudio';
    End.setAttribute("style", "width:32px;height:30px;background-image:url('https://i.imgur.com/uvIB44X.png');background-repeat: no-repeat;background-position: 33px 0;position: absolute; right: 0px;z-index: 999999;");

    var mess = document.getElementById('zone_messagerie');
    mess.appendChild(End);
    $('#endAudio').addClass('link').css({
        'background-position': '0px 0px',
        'top':'25%',
        'filter':'grayscale(0.5)'
    });

    document.getElementById('vaumSound').volume = VOLUME;

    End.onclick = function(){
        document.getElementById('vaumSound').volume = (document.getElementById('vaumSound').volume > 0) ? 0 : VOLUME;
        document.getElementById('endAudio').style.backgroundImage = (document.getElementById('vaumSound').volume == VOLUME) ? 'url(https://i.imgur.com/uvIB44X.png)' : 'url(https://i.imgur.com/8oV9IrJ.png)';
    };
});