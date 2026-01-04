// ==UserScript==
// @name        DoodleGone_modded
// @namespace   google
// @description Replace Doodle with the normal logo
// @version     1.2
// @include     http://*.google.*/*
// @include     https://*.google.*/*
// @resource    logo https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/442741/DoodleGone_modded.user.js
// @updateURL https://update.greasyfork.org/scripts/442741/DoodleGone_modded.meta.js
// ==/UserScript==
//

var oldLogo = document.getElementById('hplogo');
if(!oldLogo) return;

var newLogo = document.createElement('img');
newLogo.id = "User-logo";
newLogo.border = 'no'
newLogo.src = GM_getResourceURL ("logo");

if(oldLogo.parentNode.childNodes[0].srcset != "")
{
  var oldsource = oldLogo.parentNode.childNodes[0];
  oldsource.srcset = newLogo.src;
  oldLogo.parentNode.replaceChild(oldsource, oldsource);
}
oldLogo.parentNode.replaceChild(newLogo, oldLogo);

