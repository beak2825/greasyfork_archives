// ==UserScript==
// @name        Torn Egg Finder
// @namespace   Torn Egg Finder
// @description	Used for finding easter eggs on Torn
// @include     http://*.torn.com/*
// @include     https://*.torn.com/*
// @version     1.0.2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18638/Torn%20Egg%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/18638/Torn%20Egg%20Finder.meta.js
// ==/UserScript==

if (/access_token/i.test (document.body.innerHTML) )
{
    alert ("Egg found on page");
}


var tags = document.getElementsByTagName('img');
for (var i = 0; i < tags.length; i++) {
  tags[i].src = tags[i].src.replace('small', 'large');
}