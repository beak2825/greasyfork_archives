// ==UserScript==
// @name         BATTLEPOINT.IO TELEPORT / SKIN HACK
// @namespace    BATTLEPOINT.IO FREE HACK
// @version      1.0
// @description  PSK-EXTENSION
// @author       PSK
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @match        http://battlepoint.io/*
// @match        https://battlepoint.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372224/BATTLEPOINTIO%20TELEPORT%20%20SKIN%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/372224/BATTLEPOINTIO%20TELEPORT%20%20SKIN%20HACK.meta.js
// ==/UserScript==

window.onload = function() {
selectPlayerSkin('p6'); //SKIN HACK
startGame(document.getElementById('name_text').value);
};

document.getElementById('gifts').remove();
document.getElementById('player_options_container').remove();
document.getElementById('footer_right').remove();
document.getElementById('footer_left').remove();
document.getElementById('cookiescript_badge').remove();

document.addEventListener('keydown', function(e){
   if(e.key === 'f')
   window.UI.deathScreenUIController.onClickSpectate(); //TP HACK PATCHED
})
