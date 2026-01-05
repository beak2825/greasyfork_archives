// ==UserScript==
// @name       YouTube Title on Top
// @namespace  http://www.pitzik4.net/
// @version    0.1
// @description  Puts the titles of YouTube videos on the top.
// @match      http*://www.youtube.com/watch*
// @copyright  2014, Pitzik4
// @downloadURL https://update.greasyfork.org/scripts/4498/YouTube%20Title%20on%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/4498/YouTube%20Title%20on%20Top.meta.js
// ==/UserScript==

var header = document.getElementById("watch-header");
var headline = header.firstElementChild;
header.removeChild(headline);
header.innerHTML = '<div style="height:1.5em"></div>' + header.innerHTML;

var player = document.getElementById("player");
player.insertBefore(headline, player.firstChild);
