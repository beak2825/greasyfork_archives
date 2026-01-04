// ==UserScript==
// @name        BHPOculusQuest
// @namespace   BHPOculusQuest
// @description Play a sound if Oculus Rift S is in stock
// @version     1
// @@include    https://www.bhphotovideo.com/c/product/1503554-REG/oculus_301_00170_01_quest_all_in_one_virtual_reality.html*
// @include     https://www.bhphotovideo.com/c/product/1503555-REG/oculus_301_00171_01_quest_all_in_one_virtual_reality.html*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401978/BHPOculusQuest.user.js
// @updateURL https://update.greasyfork.org/scripts/401978/BHPOculusQuest.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.bestbuy.com/site/oculus-rift-s-pc-powered-vr-gaming-headset-black/6343150.p?skuId=6343150

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if ((/In Stock/i.test (document.body.innerHTML)))
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}