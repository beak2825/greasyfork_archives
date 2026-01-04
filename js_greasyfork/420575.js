// ==UserScript==
// @name        Generic OOS
// @namespace   Generic OOS
// @description Play a sound and make a popup if stuff comes in stock
// @version     1
// @include		https://www.wattscards.co.uk/product-page/pok%C3%A9mon-hidden-fates-elite-trainer-box-reprint*
// @include https://www.cardie.co.uk/product-page/pokemon-hidden-fates-elite-trainer-box-pre-order*
// @author      Tala
// @downloadURL https://update.greasyfork.org/scripts/420575/Generic%20OOS.user.js
// @updateURL https://update.greasyfork.org/scripts/420575/Generic%20OOS.meta.js
// ==/UserScript==



var player = document.createElement('audio');
player.src = 'https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3';
player.preload = 'auto';

rand = Math.floor((Math.random() * 10) + 1);
Title = "Watching: ";
document.title =  Title.concat(document.title);

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

Rand = generateRandomInteger(15,35)

if (/Cloudflare/i.test (document.body.innerHTML) )
{
    document.title = "CLOUDFLARE/ERROR";
    alert("CLOUDFLARE/ERROR");
} else if (!(/out of stock/i.test(document.body.innerHTML) )) {
    document.title = "IN STOCK!";
    

    player.play()
  alert("IN STOCK");
} else {
setTimeout(function(){ location.reload(); }, Rand*1000);
};




