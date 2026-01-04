//Corresponding blog entry for more info:
//https://www.gergely-szabo.com/blog/csgoloungespamblock

// ==UserScript==
// @name         CSGO Lounge Spam Block
// @namespace    https://www.gergely-szabo.com/
// @version      1.0
// @description  Deletes spam comments on trades and blocks it's sender on https://csgolounge.com/
// @author       Gergely Szabo
// @match        https://csgolounge.com/trade?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40532/CSGO%20Lounge%20Spam%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/40532/CSGO%20Lounge%20Spam%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var messages = document.getElementById("messages");
    var repliesText = messages.querySelectorAll('div.msgtxt');
    var options = messages.getElementsByClassName("opts");
    var keywords = new RegExp('cṣgogem.com|nanotrade.win|lightshoț.com|You can trade it at ↑↑↑|çs.money|çsgolounge.money|imgụr.com');

    for(var i=0; i < repliesText.length; i++){ //Goes through the list of replies and if it matches to a known spam pattern then deletes comment and blocks sender.
        if(keywords.test(repliesText[i].innerText)){
            var buttons = options[i].getElementsByClassName("button");
            buttons[0].click();
            if(buttons.length>1){
                buttons[1].click();
            }
        }
    }
})();