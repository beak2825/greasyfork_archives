// ==UserScript==
// @name        NewEggOculusQuest(RiftAlert)
// @namespace   NewEggOculusQuest(RiftAlert)
// @description Play a sound if Rift is in stock on Oculus Quest page
// @version     1
// @include 	https://www.newegg.com/oculus-quest-head-mounted-display/p/N82E16826910013*
// @include 	https://www.newegg.com/oculus-quest-head-mounted-display/p/N82E16826910012*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401977/NewEggOculusQuest%28RiftAlert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401977/NewEggOculusQuest%28RiftAlert%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/oculus-rift-s-pc-powered-vr-gaming-headset-black/6343150.p?skuId=6343150

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';
if ((/Option:Oculus Rift S/i.test (document.body.innerHTML)) || (/Option:Rift S/i.test (document.body.innerHTML))) 
{
  document.title = "MATCH";
  player.play()
}
else if ((/399.00/i.test (document.body.innerHTML)) || (/499.00/i.test (document.body.innerHTML)))
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}
