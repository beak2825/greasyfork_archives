// ==UserScript==
// @name        settlersestore
// @namespace   settlersestore
// @description Play a sound and make a popup if stuff comes in stock
// @version     1
// @include https://www.settlersestore.com/p/pokemon-hidden-fates-elite-trainer-box
// @author      Tala
// @downloadURL https://update.greasyfork.org/scripts/420885/settlersestore.user.js
// @updateURL https://update.greasyfork.org/scripts/420885/settlersestore.meta.js
// ==/UserScript==



var player = document.createElement('audio');
player.src = 'https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3';
player.preload = 'auto';

Title = "Watching: ";
document.title =  Title.concat(document.title);


if (!(/out of stock/i.test(document.body.innerHTML) )) {
    document.title = "IN STOCK!";
    

    player.play()
  alert("IN STOCK");
} else {
setTimeout(function(){ location.reload(); }, 4*1000);
};




