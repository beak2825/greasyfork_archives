// ==UserScript==
// @name JC2Map Zoom Further
// @description Allows zooming in much further on the Just Cause 2 map on jc2map.info
// @namespace https://jacobbundgaard.dk
// @version 1.0
// @match http://jc2map.info/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377937/JC2Map%20Zoom%20Further.user.js
// @updateURL https://update.greasyfork.org/scripts/377937/JC2Map%20Zoom%20Further.meta.js
// ==/UserScript==

(function() {
  window.map.options.maxZoom = 10;
  window.map._layers[21].options.maxNativeZoom = 5;
})();