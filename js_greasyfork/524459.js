// ==UserScript==
// @name        ETB
// @namespace   ETB
// @description Play a sound if ETB is in stock
// @version     3
// @include 	https://www.target.com/p/-/A-93954435
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/524459/ETB.user.js
// @updateURL https://update.greasyfork.org/scripts/524459/ETB.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/-/A-93954435
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1222-did-it.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if (!document.getElementById('addToCartButtonOrTextIdFor93954435').disabled)
    {
      document.title = "MATCH";
      player.play()
    }
    else {
      setTimeout(function(){ location.reload(); }, 10*1000);
    }
  }, 5*1000)