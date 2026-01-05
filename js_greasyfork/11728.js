// ==UserScript==
// @name         DiamondHunt Chat IRC Replacer
// @version      0.4
// @description  Replaces the chat with IRC
// @author       Arunesh90
// @match        http://www.diamondhunt.co/game.php
// @grant        none
// @namespace https://greasyfork.org/users/14315
// @downloadURL https://update.greasyfork.org/scripts/11728/DiamondHunt%20Chat%20IRC%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/11728/DiamondHunt%20Chat%20IRC%20Replacer.meta.js
// ==/UserScript==
var chatNode = document.getElementById("chat-box-area");
while (chatNode.firstChild) {
    chatNode.removeChild(chatNode.firstChild);
}

$(document).ready(function() {
    $("#chat-box-area").html("<iframe src='https://kiwiirc.com/client/irc.kiwiirc.com/?nick=Diamondhunt|?#Diamondhunt' style='border:0; width:100%; height:450px;'></iframe>");  
});