// ==UserScript==
// @name     sis.menu.touch
// @namespace   zhang
// @description fix menu for touch screen
// @include     http://www.sexinsex.net/*
// @include     http://www.sis001.com/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/393504/sismenutouch.user.js
// @updateURL https://update.greasyfork.org/scripts/393504/sismenutouch.meta.js
// ==/UserScript==

var items = document.querySelectorAll("#menu>ul>li[onmouseover]");
for(var i = 0; i < items.length; i++) {
  var item = items[i];
  item.setAttribute("onclick", "return false;");
}
