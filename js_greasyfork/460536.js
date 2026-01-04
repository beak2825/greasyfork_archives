// ==UserScript==
// @name         bing improvent
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to improve the Bing search experiense
// @author       charles
// @match        https://www.bing.com/search?*
// @icon         https://th.bing.com/th/id/OIP.HXLPdESYC5xlVIDJxAx1ngHaHa?pid=ImgDet&rs=1
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460536/bing%20improvent.user.js
// @updateURL https://update.greasyfork.org/scripts/460536/bing%20improvent.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Set the color of unvisited links to blue, similar to Google search results
  GM_addStyle("ol a:link{color:rgb(125, 187, 247) !important}");
})();
