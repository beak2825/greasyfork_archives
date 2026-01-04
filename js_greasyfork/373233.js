
// ==UserScript==
// @name        Brofist.io Respawn (Un-Ghost) (2PA)
// @namespace   Brofist.io Respawn After Ghost
// @include     http://brofist.io/modes/twoPlayer/c/index.html
// @version     1.4
// @description Copy and paste this code into console or use tampermonkey or greasemonkey (may not work). This code will allow you to press '1' and teleport to the start of the level as a playable character after you have ghosted. It can be extremely useful. I have found a bug where after using this code buttons do not work so I am trying to find a way to fix it.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373233/Brofistio%20Respawn%20%28Un-Ghost%29%20%282PA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373233/Brofistio%20Respawn%20%28Un-Ghost%29%20%282PA%29.meta.js
// ==/UserScript==
var oldName = client.name;
var oldSkin = client.skin;
document.onkeydown = function(event){
    if (event.keyCode == 49)
client.start();
};
