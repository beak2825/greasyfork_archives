// ==UserScript==
// @name        footer link changer
// @namespace   jiggmin
// @include     http://pr2hub.com/*
// @version     1
// @grant       none
// @description easy links for lazy mods
// @downloadURL https://update.greasyfork.org/scripts/3392/footer%20link%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/3392/footer%20link%20changer.meta.js
// ==/UserScript==

var a = document.getElementsByClassName("footer_links");
var b = a[0];
b.childNodes[3].innerHTML = '<a href="http://pr2hub.com/bans">Bans</a>';
b.childNodes[5].innerHTML = '<a href="http://pr2hub.com/mod/reported_messages.php?start=0&count=100">Reports</a>';
b.childNodes[7].innerHTML = '<a href="http://pr2hub.com/mod/player_search.php">Player Search</a>';