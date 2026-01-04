// ==UserScript==
// @name     Enable Flash on some sites [Firefox 69+]
// @version  1
// @grant    none
// @description Bypasses detection of Flash Player on websites using SwfObject.
// @namespace https://greasyfork.org/users/410274
// @downloadURL https://update.greasyfork.org/scripts/393130/Enable%20Flash%20on%20some%20sites%20%5BFirefox%2069%2B%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/393130/Enable%20Flash%20on%20some%20sites%20%5BFirefox%2069%2B%5D.meta.js
// ==/UserScript==

window.eval("var originalSwfObject = {};\
Object.defineProperty(window, \"swfobject\", {\
  set: function(x){\
    originalSwfObject = x;\
    originalSwfObject.ua.pv = [32,0,0];\
  },\
  get: function(){\
   return originalSwfObject; \
  }\
});");
