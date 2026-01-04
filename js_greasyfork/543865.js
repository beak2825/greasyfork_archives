// ==UserScript==
// @name        bustoutmoz - Multi-Account Containers For Mozilla Links With Redirector
// @namespace   Eliot Cole Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      eliotcole
// @description 28/07/2025, 09:24:14
// @downloadURL https://update.greasyfork.org/scripts/543865/bustoutmoz%20-%20Multi-Account%20Containers%20For%20Mozilla%20Links%20With%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/543865/bustoutmoz%20-%20Multi-Account%20Containers%20For%20Mozilla%20Links%20With%20Redirector.meta.js
// ==/UserScript==

(function(){
  var anchors = document.querySelectorAll('a[href*="mozilla.org"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].href = 'https://bustoutmoz.local////' + anchors[i].href;
  }
})();