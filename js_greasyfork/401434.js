// ==UserScript==
// @name        WalmartOculusRiftS
// @namespace   WalmartOculusRiftS
// @description Play a sound if Oculus Rift S is in stock
// @version     2
// @include 	https://www.walmart.com/ip/Oculus-Rift-S-PC-Powered-VR-Gaming-Headset/231668381*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/401434/WalmartOculusRiftS.user.js
// @updateURL https://update.greasyfork.org/scripts/401434/WalmartOculusRiftS.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.walmart.com/ip/Oculus-Rift-S-PC-Powered-VR-Gaming-Headset/231668381

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (!(/Technical difficulties/i.test (document.body.innerHTML) ))
{ 
  if (!(/font-bold">Out of stock/i.test (document.body.innerHTML) ))
  {
    document.title = "MATCH";
    player.play()
  }
  else {
  setTimeout(function(){ location.reload(); }, 15*1000);
  }
}
else {
  setTimeout(function(){ location.reload(); }, 10*1000);
}