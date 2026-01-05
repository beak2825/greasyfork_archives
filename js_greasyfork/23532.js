// ==UserScript==
// @name           delete all my posts ever
// @description    Hello
// @namespace      none
// @include        http://www.reddit.com/user/*
// @version 0.0.1.20160926170648
// @downloadURL https://update.greasyfork.org/scripts/23532/delete%20all%20my%20posts%20ever.user.js
// @updateURL https://update.greasyfork.org/scripts/23532/delete%20all%20my%20posts%20ever.meta.js
// ==/UserScript==
setTimeout('var deleted = 0;var links = document.getElementsByTagName("a");var i = 0;var d = 0;for (i = 0; i < links.length; i++) {var l = links[i];if (l.href) {if (l.innerHTML == "delete") {toggle(l);   d = 1;  }  if (d && (l.innerHTML == "yes")) { deleted=1; change_state(l, "del", hide_thing); d = 0; } } } if (deleted) { setTimeout("location.reload(true);",100); }', 400);