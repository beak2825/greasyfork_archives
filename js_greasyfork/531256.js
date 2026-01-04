// ==UserScript==
// @name        Select all deleted torrents on page
// @namespace   Violentmonkey Scripts
// @match       https://gazellegames.net/torrents.php?*action=delete_notify*
// @grant       none
// @version     0.1
// @author      Nyannerz
// @description 22/03/2025, 15:55:30
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531256/Select%20all%20deleted%20torrents%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/531256/Select%20all%20deleted%20torrents%20on%20page.meta.js
// ==/UserScript==

(function() {

  /*var x = document.createElement("INPUT");
  x.setAttribute("type", "checkbox");
  $('td.center')[0].appendChild(x);*/

  var newButton = $('input[name="submit"]').first().clone();
  newButton.attr("value", "Select all");
  newButton.click(function () {$('input:checkbox').each(function () {
       this.checked= true;
  });});
  newButton.appendTo( "span.center" );
  })();
