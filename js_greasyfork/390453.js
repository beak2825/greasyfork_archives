

// ==UserScript==
// @name          Ad Blocker
// @namespace     Mafia Modder
// @description   Removes ads. the blank spaces in the script let you add in any link you want.(Disclaimer) do Not Post this scripts else ware or you might get banned
// @version       1.2
// @author        MAFIA MODDER
// @include       https://www.yahoo.com/
// @include       https://www.bing.com/
// @include       https://vex-3.com/*
// @include       https://www.google.com/
// @include       slither.io
// @include       moomoo.io
// @include       diep.io
// @include       kizi.com
// @include       coolmathgames.com
// @include       
// @include       
// @include       
// @include       

// @downloadURL https://update.greasyfork.org/scripts/390453/Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/390453/Ad%20Blocker.meta.js
// ==/UserScript==

var areplacer = document.getElementsByClassName("areplacer");
var count = areplacer.length;
var i;

for(i = 0;i < count;i++)
{
areplacer[0].parentNode.removeChild(areplacer[0]);
}