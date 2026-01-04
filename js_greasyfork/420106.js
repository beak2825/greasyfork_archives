// ==UserScript==
// @name         Original PogChamp replace
// @name:ru      Возвращение старого PogChamp
// @version      1.0.1
// @description  Replace new PogChamp emotes to old
// @description:ru  Меняет новый PogChamp на старый
// @author       yokkkoso
// @match        *://twitch.tv/*
// @match        *://*.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/726800
// @downloadURL https://update.greasyfork.org/scripts/420106/Original%20PogChamp%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/420106/Original%20PogChamp%20replace.meta.js
// ==/UserScript==

(function() {
    function getImagesByAlt(alt) {
        var allImages = document.getElementsByTagName("img");
        var images = [];
        for (var i = 0, len = allImages.length; i < len; ++i) {
            if (allImages[i].alt === alt) {
                images.push(allImages[i]);
            }
        }
        return images;
    }

    setInterval(function(){
        var PogChamps = getImagesByAlt('PogChamp');
        PogChamps.forEach(function(champ){
            if(champ.classList.contains('emote-picker__image') || champ.classList.contains('emote-picker__emote-image')){
                champ.src = "https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/1x";
                champ.srcset = "https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/1x 1.0x, https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/2x 2.0x, https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/3x 3.0x";

            }if(champ.classList.contains('chat-line__message--emote')){
                champ.src = "https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/1x";
                champ.srcset = "https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/1x 1x, https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/2x 2x, https://cdn.betterttv.net/emote/5db3d44afb4519723fb2a071/3x 4x";
            }
        })
    },100)
})();