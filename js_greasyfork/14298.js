// ==UserScript==
// @name         Vulcun Looter
// @namespace    Vulcun Looter
// @version      0.02
// @description  Autoclicks the loot window, ...
// @author       soma
// @include       https://vulcun.com/user/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/14298/Vulcun%20Looter.user.js
// @updateURL https://update.greasyfork.org/scripts/14298/Vulcun%20Looter.meta.js
// ==/UserScript==

function init() { 
  console.log('vulcun auto jackpot activated.')


  setInterval(function() {
    if($('#lootEnterModal').is(':visible') && $('#lootEnterModal button#enter-lootdrop').is(':visible')) {
      $('button#enter-lootdrop').click();
       console.log('Entered loot lottery.')
       $('#lootEnterModal .close').click();
    }
    else {
      console.log('Loot box is not active yet.')
    }
  }, 29000);
 }
init();

//setTimeout(function() {
//  $('#channel-player-container').detach();
//  }, 1000);
