// ==UserScript==
// @name        Open steam pages in client
// @namespace   gjwse90gj98we
// @include     https://*steampowered.com*
// @include     https://*steamcommunity.com*
// @grant       none
// @version     1.0
// @author      anon
// @description Adds a button to open the page in steam client
// @downloadURL https://update.greasyfork.org/scripts/393615/Open%20steam%20pages%20in%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/393615/Open%20steam%20pages%20in%20client.meta.js
// ==/UserScript==

(function () {
var link = document.createElement("a");
link.className = "global_action_link"
link.href = "steam://openurl/" + window.location.href
link.appendChild(document.createTextNode("open in app"));
var page = document.getElementById("global_action_menu");
page.appendChild(link);
})();