// ==UserScript==
// @name         TicketSwap - Clicker
// @version      0.3
// @description  Click the buy button instantly
// @author       mr.Jelle-Beat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ticketswap.com
// @match        https://www.ticketswap.com/listing/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/1022287
// @downloadURL https://update.greasyfork.org/scripts/459484/TicketSwap%20-%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/459484/TicketSwap%20-%20Clicker.meta.js
// ==/UserScript==

var player = document.createElement('audio');
    player.allow="autoplay"
    player.src = 'https://cdn.freesound.org/previews/171/171671_2437358-lq.mp3';
    player.preload = 'auto';

// V2
var buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerHTML == "Buy ticket") {
        player.play();
        buttons[i].click();
    }
}
