// ==UserScript==
// @name        html.it Video Widget Remover
// @namespace   https://userscripts.org
// @description remove the video widget from html.it pages
// @include     http://www.html.it/*
// @include     http://forum.html.it/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/522/htmlit%20Video%20Widget%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/522/htmlit%20Video%20Widget%20Remover.meta.js
// ==/UserScript==

document.getElementById("video_contenitore").innerHTML="<b>Bye Bye<br /><br />by kylon :)</b>";
var targetDiv = document.getElementById("social-share-like");
targetDiv.parentElement.removeChild(targetDiv);