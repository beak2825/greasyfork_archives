// ==UserScript==
// @name DC - Nightmode
// @namespace InGame
// @author Lorkah
// @date 08/08/2018
// @version 1.3
// @license DON'T BE A DICK PUBLIC LICENSE ; https://dbad-license.org/
// @include https://www.dreadcast.net/Main
// @description Retire les bandes bleu pour soulager vos yeux
// @downloadURL https://update.greasyfork.org/scripts/370999/DC%20-%20Nightmode.user.js
// @updateURL https://update.greasyfork.org/scripts/370999/DC%20-%20Nightmode.meta.js
// ==/UserScript==
$('#zone_gauche_inventaire').css('background-image','url("none")').css('background-color','black').css('opacity','0.8').css('box-shadow','0 0 15px -5px inset #a2e4fc');
$('#zone_droite > .grid > .grid.top').css('background','url("none")').css('background-color','black').css('opacity','0.8').css('box-shadow','0 0 15px -5px inset #a2e4fc').css('z-index','1000');
$('#zone_chat_bg').css('background-image','url("none")').css('background-color','black').css('opacity','0.8');