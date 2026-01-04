// ==UserScript==
// @name        unreaded
// @namespace   1
// @include     http://www.eador.com/B2/viewforum.php?f=29
// @include     http://eador.com/B2/viewforum.php?f=29
// @version     1
// @grant       none
// @description View unreaded themes in tab
// @downloadURL https://update.greasyfork.org/scripts/33987/unreaded.user.js
// @updateURL https://update.greasyfork.org/scripts/33987/unreaded.meta.js
// ==/UserScript==

document.title = "ТЕАТР";

var a = document.querySelectorAll('img[src="templates/Lifecod/images/icon_newest_reply.gif"]');

if(a.length)
  document.title = "(" + a.length + ") " + document.title;