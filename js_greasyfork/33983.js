// ==UserScript==
// @name        newPM
// @namespace   1
// @include     http://www.eador.com/B2/privmsg.php?folder=*
// @include     http://eador.com/B2/privmsg.php?folder=*
// @version     1
// @grant       none
// @description Show unreaded msgs in tab
// @downloadURL https://update.greasyfork.org/scripts/33983/newPM.user.js
// @updateURL https://update.greasyfork.org/scripts/33983/newPM.meta.js
// ==/UserScript==

document.title = "✉ Почта";

var a = document.querySelectorAll('img[src="templates/Lifecod/images/folder_new.gif"]');
var i = 0;

for (var j=0; j<a.length; j++)
    i++;

if(i)
  document.title = "(" + i + ") " + document.title;