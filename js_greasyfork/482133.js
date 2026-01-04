// ==UserScript==
// @name IdlePixel plug
// @namespace com.Ethan.idlepixelplug
// @version 1.1.4
// @description Upgrade the Game...
// @author Ethan
// @license MIT
// @match *://idle-pixel.com/login/play*
// @grant none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/482133/IdlePixel%20plug.user.js
// @updateURL https://update.greasyfork.org/scripts/482133/IdlePixel%20plug.meta.js
// ==/UserScript==

(function() {
'use strict';

// Access the element with the data-key attribute
var element = document.querySelector('[data-key="username"]');

// Get the value of the data-key attribute
var username = element ? element.innerText : "name";


switch (username) {
  case "ethanlar":
      show_element('top-bar-admin-link');
      break;
  default:
      alert("bad username");
      break;
}

const plugin = new IdlePixelPlus.plugPlugin();
IdlePixelPlus.registerPlugin(plugin);
})();
