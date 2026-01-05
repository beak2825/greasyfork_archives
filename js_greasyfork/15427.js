// ==UserScript==
// @name        playground hustler with sound
// @namespace   namespace
// @description makes beep when theres more than one player in paid room. usefull if you're alone in lowroll so you can go on another tab while waiting.
// @include     http://chopcoin.io/*
// @version     1.1111
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15427/playground%20hustler%20with%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/15427/playground%20hustler%20with%20sound.meta.js
// ==/UserScript==


var playOnce = true;
checkPlayers();

function checkPlayers() {
    var players = chopcoin.game.leaderboard.list.length;
    var pot = chopcoin.game.pot;
    if (players > 1 && playOnce && pot != 0) {
        //alert('multiple players');
        document.head.innerHTML += "<video controls=\"\" id=\"beep\" autoplay=\"\" name=\"media\" style=\"display:none;\"><source src=\"http://www.freesfx.co.uk/rx2/mp3s/7/8494_1353333227.mp3\" type=\"audio/mpeg\" /></video>";
        playOnce = false;
        console.log('multiple players');
    }
    else if (players <= 1) {
        playOnce = true;
        beepElement = document.getElementById('beep');
        if (beepElement) beep.parentElement.removeChild(beep);
        console.log('player reset');
    }
    setTimeout(function(){ checkPlayers(); }, 200);
}
