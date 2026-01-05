// ==UserScript==
// @name        jadi2.undo.it
// @namespace   Jadi_HexBoy
// @author      HexBoy
// @include     http://*.*
// @version     1
// @grant       none
// @description replace jadi.net to http://jadi2.undo.it/
// @downloadURL https://update.greasyfork.org/scripts/4494/jadi2undoit.user.js
// @updateURL https://update.greasyfork.org/scripts/4494/jadi2undoit.meta.js
// ==/UserScript==
for (var i = 0; i < document.links.length; i++)
{
  document.links[i].href = document.links[i].href.replace('jadi.net', 'jadi2.undo.it');
}