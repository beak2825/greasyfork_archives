// ==UserScript==
// @name        GGn Scroll buttons
// @namespace   Violentmonkey Scripts
// @match       https://gazellegames.net/forums.php*action=viewthread*
// @grant       none
// @version     1.0
// @author      Nyannerz
// @license     MIT
// @description 22/03/2025, 15:55:30
// @downloadURL https://update.greasyfork.org/scripts/531896/GGn%20Scroll%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/531896/GGn%20Scroll%20buttons.meta.js
// ==/UserScript==

(function() {
  $('div.center').append('<a class="scrolldownbutton" href="#0" style="font-size: 1em;">[Scroll]</a>');
  $('form.center').append('<a class="scrollupbutton" href="#0" style="font-size: 1em;">[Scroll]</a>');
  $('.scrolldownbutton').click( (event) => window.scrollTo(0, (document.body.scrollHeight-1400)) );
  $('.scrollupbutton').click( (event) => window.scrollTo(0, 0) );
  })();
