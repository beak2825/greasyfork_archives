// ==UserScript==
// @name        Dota 2 Lounge 
// @namespace   http://userscripts.org/users/WernieBert
// @include     http://dota2lounge.com/mytrades
// @version     1
// @grant       none
// @description Dota 2 Lounge trade bumper
// @downloadURL https://update.greasyfork.org/scripts/2227/Dota%202%20Lounge.user.js
// @updateURL https://update.greasyfork.org/scripts/2227/Dota%202%20Lounge.meta.js
// ==/UserScript==


var buttons = document.getElementsByClassName("buttonright");

for (var i = 0; i < buttons.length; i++)
    buttons[i].click();