// ==UserScript==
// @name         MihauoNaprawiacz
// @namespace    http://adiq.eu/
// @version      0.2.2
// @description  MihauoNaprawiacz - przywraca standardowy odtwarzacz YouTube
// @author       kasper93, Adrian Zmenda
// @match        *://www.wykop.pl/*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/15016/MihauoNaprawiacz.user.js
// @updateURL https://update.greasyfork.org/scripts/15016/MihauoNaprawiacz.meta.js
// ==/UserScript==

window.jwplayer = function() {
    this.setup = this.remove = function() {}
    this.on = function(name, callback) {
        if (name === "setupError")
            callback();
    }
    return this
}

// Prevent autoplaying of first video
window.firstVideoStopped = false;

function replaceCustomPlayers() {

    var players = document.getElementsByClassName('jwplayer');

    for(var i = 0; i < players.length; i++) {

        var player = players[i];
        var vid = player.id.substring(3);
        var width = player.clientWidth;
        var height = Math.floor(width*0.5627198);
        if ( height < 315 ) {
            height = 315;
        }
        // Insert original player
        var newPlayer = getRegularPlayer(vid, height);
        player.parentNode.insertBefore(newPlayer, player);
        // Remove custom player
        player.parentNode.removeChild(player);

    }

}


function runReplacements() {
    replaceCustomPlayers();
    window.setTimeout(function() {
        replaceCustomPlayers();
        window.setTimeout(function() {
            replaceCustomPlayers();
        }, 350);
    }, 50);
}


function getRegularPlayer(vid, height) {

    var args = "?rel=0";

    if(window.location.pathname.substring(0, 5) != "/link" || window.firstVideoStopped) {
        args += '&autoplay=1';
    } else {
        window.firstVideoStopped = true;
    }

    var player = document.createElement("iframe"); 
    player.setAttribute("src", "https://www.youtube.com/embed/"+ vid + "?" + args); 
    player.setAttribute("allowfullscreen", "");
    player.setAttribute("frameborder", 0);
    player.style.width = "100%";
    player.style.height = height + "px";    

    return player;

}

// Assure to use new YT player
if(window.location.pathname.substring(0, 5) == "/link" || window.location.pathname.substring(0, 2) == "/+") {
    runReplacements();
}