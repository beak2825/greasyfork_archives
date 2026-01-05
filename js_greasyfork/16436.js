// ==UserScript==
// @name         spectate cycle
// @version      1.1
// @description  press right to cycle through spectate next position, left to go to higthroll then back to original room
// @author       You
// @match        https://chopcoin.io/*
// @match        https://www.chopcoin.io/*
// @grant        none
// @namespace https://greasyfork.org/users/17934
// @downloadURL https://update.greasyfork.org/scripts/16436/spectate%20cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/16436/spectate%20cycle.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.addEventListener("keydown", dealWithKeyboard, false);

//start from top with another button?

function dealWithKeyboard(e) {
    if (e.keyCode == "39") chopcoin.game.send("spectate");
    else if (e.keyCode == "37") {
        for(var i=0; i<chopcoin.game.leaderboard.list.length-1; i++) chopcoin.game.send("spectate");
        /*document.getElementById('paidselect').click();
        setTimeout(function(){ document.getElementById('faucetselect').click(); }, 500);
        setTimeout(function(){ document.getElementById('faucetselect').click(); }, 750); // sometimes takes twice?
        console.log(chopcoin.game.server_id);
        var originalRoom = chopcoin.game.server_id;
        if(originalRoom == 'lowrollers') document.getElementById('faucet').childNodes[1].getElementsByClassName('btn')[0].click();
        else document.getElementById('lowrollers').childNodes[1].getElementsByClassName('btn')[0].click();
        setTimeout(function(){ document.getElementById(originalRoom).childNodes[1].getElementsByClassName('btn')[0].click(); }, 500);
        setTimeout(function(){ document.getElementById(originalRoom).childNodes[1].getElementsByClassName('btn')[0].click(); }, 700);
        //setTimeout(function(){ document.getElementById('spectate').click(); }, 500);*/
    }
    //else console.log(e.keyCode);
}



