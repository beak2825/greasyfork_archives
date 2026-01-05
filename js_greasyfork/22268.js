// ==UserScript==
// @name        WowPets
// @namespace   lander_scripts
// @description Ajust various aspects of wowpets.com
// @include     https://www.warcraftpets.com/*
// @version     1.01
// @grant       none
// @icon        http://brithewebguy.com/images/warcraftpets-logo.png
// @downloadURL https://update.greasyfork.org/scripts/22268/WowPets.user.js
// @updateURL https://update.greasyfork.org/scripts/22268/WowPets.meta.js
// ==/UserScript==

console.info('WoWPets Script Loaded');

//My Pet Collection Box
SetLocation();
$(window).resize(SetLocation);

function SetLocation() {
  $('#col-status').css({
    position:'absolute',
    top:60,
    right:(($(document).width()-1020)/2)
  });
}
$('#header').css('background','white');
$('.filter_c.petlist-container').css('width','99%');

//Body Resize
$('#content').css('width','755px');
$('.homeblock').css('width','100%');