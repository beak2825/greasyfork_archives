// ==UserScript==
// @name        Picarto 18+ always preview
// @namespace   Anonymous
// @description makes it so you don't have to hover
// @include     https://www.picarto.tv/live/explore.php
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10662/Picarto%2018%2B%20always%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/10662/Picarto%2018%2B%20always%20preview.meta.js
// ==/UserScript==

function do_hover() {
  var channels = $('[class^="maskchannel"]')
  channels.trigger("onmouseover");
  channels.attr("onmouseout", null);
}

var container = document.getElementById("container");
var observer = new MutationObserver(do_hover);
observer.observe(container, {childList: true});
