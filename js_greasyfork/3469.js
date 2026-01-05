// ==UserScript==
// @name           GameGuardian Logo Replacer
// @description    Changes the color of the GameGuardian logo to the default theme (red).
// @include        http://gameguardian.net/forum/*
// @version 0.0.1.20140721012059
// @namespace https://greasyfork.org/users/3725
// @downloadURL https://update.greasyfork.org/scripts/3469/GameGuardian%20Logo%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/3469/GameGuardian%20Logo%20Replacer.meta.js
// ==/UserScript==

var theImages = document.getElementsByTagName('img');
for(i=0; i<theImages.length; i++) {
   if(theImages[i].src.indexOf('http://gameguardian.net/forum/public/style_images/revolutionred345/logo.png') != -1) theImages[i].src = 'http://i.imgur.com/JUyrihW.png';
}