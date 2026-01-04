// ==UserScript==
// @name        Always Draggable Images
// @namespace   Violentmonkey Scripts
// @grant       none
// @description  Make images always draggable. It adds "draggable" attribute to it.
// @version     1.0
// @include     *example.com*
// @grant    GM_addStyle
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446745/Always%20Draggable%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/446745/Always%20Draggable%20Images.meta.js
// ==/UserScript==

    
document.addEventListener("mousemove", function() {
  for (var e of document.getElementsByTagName('img')) e.setAttribute('draggable', true);
});