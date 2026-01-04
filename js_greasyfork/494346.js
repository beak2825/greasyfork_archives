// ==UserScript==
// @name        Show autoplay toggle youtube.com
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       none
// @license     MIT
// @version     1.0
// @author      Micah Bucy
// @description 5/7/2024, 4:14:29 PM
// @downloadURL https://update.greasyfork.org/scripts/494346/Show%20autoplay%20toggle%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/494346/Show%20autoplay%20toggle%20youtubecom.meta.js
// ==/UserScript==

(function(){
  var css = '*[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: inline-block !important; }';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  head.appendChild(style);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
})();