// ==UserScript==
// @name        NewEggOculusQuest(RIFT Alert)
// @namespace   NewEggOculusQuest(RIFT Alert)
// @description Play a sound if Oculus Rift S is in stock
// @version     1
// @include 	https://www.newegg.com/oculus-rift-s-head-mounted-display/p/N82E16826910011*
// @include     https://www.newegg.com/oculus-quest-head-mounted-display/p/N82E16826910013*
// @include     https://www.newegg.com/oculus-quest-head-mounted-display/p/N82E16826910012*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401970/NewEggOculusQuest%28RIFT%20Alert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401970/NewEggOculusQuest%28RIFT%20Alert%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/oculus-rift-s-pc-powered-vr-gaming-headset-black/6343150.p?skuId=6343150

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (((/Option:Oculus Rift S/i.test (document.body.innerHTML)) || (/Option:Rift S/i.test (document.body.innerHTML)) || (/Option:Oculus Rift/i.test (document.body.innerHTML)) || (/Option:Rift/i.test (document.body.innerHTML))) )
{
  document.title = "RIFT MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}