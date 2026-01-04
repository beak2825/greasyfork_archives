// ==UserScript==
// @name DC - VousAvezUnMessage (fork)
// @namespace InGame
// @author Gideon, Sÿ (correctif), Odul (MAJ pour nouvelle interface), Ajira (correctifs)
// @date 06/01/2019
// @version 2.6
// @description Notification sonore qui vous signale la reception d'un message.
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/394737/DC%20-%20VousAvezUnMessage%20%28fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394737/DC%20-%20VousAvezUnMessage%20%28fork%29.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    const NOTIFICATION_SOUND = "https://opengameart.org/sites/default/files/gmae.wav";
    const MUTE_ICON = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Mute_Icon.svg";
    const UNMUTE_ICON = "https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg";
    const ICON_FILTER = "filter:invert(100%) sepia(100%) saturate(0%) hue-rotate(73deg) brightness(106%) contrast(105%);";

    var audio = document.createElement('audio');
    audio.id = "one";
    audio.setAttribute("src", NOTIFICATION_SOUND);
    document.body.appendChild(audio);

    // Se greffe sur l'évènement de réception de message
    MenuMessagerie.prototype.messageReceived = function(content){
        $(content).each(function(){
            // Clause d'exclusion
            if (typeof $(this)[0].tagName === 'undefined') { return true; }

            var folder_id = $(this)[0].tagName.toLowerCase().replace('folder_', '');
            if (folder_id == $('#current_folder').attr('data-id')) { nav.getMessagerie().openFolder(folder_id); }
            $('#zone_messagerie').trigger({
                type: 'nouveauMessage',
                id_conversation: $(this).attr('id_conversation'),
                folder_id: folder_id,
                quantity: $(this).attr('quantite')
            });

            // Joue le son de notification
            var audio = document.getElementById('one');
            audio.load();
            audio.play();
        })
    };

    // Cible l'interface de messagerie pour y insérer un bouton mute/unmute
    var messageZone = document.getElementById('zone_messagerie');
    var muteIcon = document.createElement('div');
    muteIcon.id = 'endAudio';
    muteIcon.setAttribute("class", "link");
    muteIcon.setAttribute("style", ICON_FILTER + "width:12px; height:12px; background:url('" + UNMUTE_ICON + "') no-repeat; background-size: 12px 12px; position:absolute; top:22px; right:15px;");
    messageZone.appendChild(muteIcon);

    // Actions quand on click sur le bouton mute/unmute
    muteIcon.onclick = function(event){
        // Active ou désactive le son
        document.getElementById('one').volume = (document.getElementById('one').volume == 1) ? 0 : 1;
        // Remplace l'icône
        event.target.style.backgroundImage = (document.getElementById('one').volume == 1) ? 'url(' + UNMUTE_ICON + ')' : 'url(' + MUTE_ICON + ')';
    };
})();