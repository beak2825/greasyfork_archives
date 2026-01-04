// ==UserScript==
// @name        WalmartSwitch (X)
// @namespace   WalmartSwitch (X)
// @description Play a sound if switch is in stock
// @version     1
// @include     https://www.walmart.com/ip/Nintendo-Switch-Bundle*
// @include     https://www.walmart.com/ip/Nintendo-Switch-Console-with-Gray-Joy-Con/994790027*
// @include     https://www.walmart.com/ip/Nintendo-Switch-Console-with-Neon-Blue-Red-Joy-Con/709776123*
// @include     https://grocery.walmart.com/ip/Nintendo-Switch-Console-with-Neon-Blue-Red-Joy-Con/709776123*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/402096/WalmartSwitch%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402096/WalmartSwitch%20%28X%29.meta.js
// ==/UserScript==

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/b5b41fac0361d157d9673ecb926af5ae/file-sounds-727-good-morning.mp3';
player.preload = 'auto';

if (!(/Technical difficulties/i.test (document.body.innerHTML) ))
{ 
  if (!(/font-bold">Out of stock/i.test (document.body.innerHTML)) && ((/\$299.00/i.test (document.body.innerHTML)) || (/\$294.57/i.test (document.body.innerHTML))))
  {
    document.title = "MATCH";
    player.play()
  }
  else {
  setTimeout(function(){ location.reload(); }, 5*1000);
  }
}
else {
  setTimeout(function(){ location.reload(); }, 5*1000);
}