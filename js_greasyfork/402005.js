// ==UserScript==
// @name        TargetSwitch (Local Pickup)
// @namespace   TargetSwitch (Local Pickup)
// @description Play a sound if Nintendo Switch is in stock
// @version     3
// @include 	https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001*
// @include     https://www.target.com/p/nintendo-switch-with-gray-joy-con/-/A-77464002*
// @include     https://www.target.com/p/nintendo-switch-lite-yellow/-/A-77419249*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/402005/TargetSwitch%20%28Local%20Pickup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402005/TargetSwitch%20%28Local%20Pickup%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/298f95e1bf9136124592c8d4825a06fc/file-sounds-1105-rush.mp3';
player.preload = 'auto';

if (!(/Temporarily out of stock/i.test (document.body.innerHTML) ) || (/In stock/i.test (document.body.innerHTML) )
    || ((/Pick up/i.test (document.body.innerHTML) ) && (/Ship to store/i.test (document.body.innerHTML) )) || (/Ship it/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 6*1000);
}