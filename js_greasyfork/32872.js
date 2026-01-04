// ==UserScript==
// @name         Animeflv iframe autoplay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://s3.animeflv.com/embed.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32872/Animeflv%20iframe%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/32872/Animeflv%20iframe%20autoplay.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    //console.log("======== Animeflv iframe autoplay start ! =======");

    var autostart = function() {
        setTimeout(function() {
            var player = jwplayer();
            var state = player.getState();
            player.play(true);
            //console.log("player state: " + state);
            if(state != "playing"){
                autostart();
            }
        }, 100);
    };
    
    autostart();
    
})();