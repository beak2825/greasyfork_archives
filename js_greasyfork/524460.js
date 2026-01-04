// ==UserScript==
// @name        Poster collection
// @namespace   Poster collection
// @description Play a sound if Poster collection is in stock
// @version     6.2
// @include 	https://www.target.com/p/-/A-93803457
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/524460/Poster%20collection.user.js
// @updateURL https://update.greasyfork.org/scripts/524460/Poster%20collection.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.target.com/p/-/A-93803457
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/storage/sounds/file-sounds-1222-did-it.mp3';
player.preload = 'auto';
 
  setTimeout(function(){
    if (document.getElementById('addToCartButtonOrTextIdFor93803457').disabled)
    {
      document.getElementById('notifyMe').click()
      document.getElementById('addToCartButtonOrTextIdFor93803457').click()
      console.log('match!')
      document.title = 'MATCH';
      player.play()
    }
    else {
      location.reload();
    }
  }, 5*1000)