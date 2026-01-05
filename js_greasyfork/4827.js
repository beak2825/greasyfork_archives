// ==UserScript==
// @namespace     http://userscripts.org/users/yz
// @name          alitrack.ru iframe killer
// @description   deletes all iframes from a alitrack.ru site
// @include       http://alitrack.ru/*
// @include       http://cabinet.alitrack.ru/*
// @version 0.0.1.20140904105011
// @downloadURL https://update.greasyfork.org/scripts/4827/alitrackru%20iframe%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/4827/alitrackru%20iframe%20killer.meta.js
// ==/UserScript==

while((el=document.getElementsByTagName('iframe')).length){el[0].parentNode.removeChild(el[0]);}

/*
var i, v = document.getElementsByTagName('iframe');
for (i=v.length-1; i >= 1; i--) {
   v[i].parentNode.removeChild(v[i]);
}
*/