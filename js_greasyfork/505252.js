// ==UserScript==
// @name        GollyJer's Auto-Expand Google Search Tools
// @description Show the Search Tools on Google search results instead of result-count and query-speed.
// @namespace   gollyjer.com
// @license     MIT
// @version     1.4
// @match       https://www.google.com/*
// @match       https://www.google.be/*
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505252/GollyJer%27s%20Auto-Expand%20Google%20Search%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/505252/GollyJer%27s%20Auto-Expand%20Google%20Search%20Tools.meta.js
// ==/UserScript==

/* globals $, waitForKeyElements */

// Hide the Search Tools button.
GM_addStyle('#hdtb-tls { display: none !important; }');

// Speed up visibility of the Seach Tools menu by removing the animation.
GM_addStyle('#hdtbMenus { transition: none !important; }');

// Show the Search Tools menu.
waitForKeyElements('#hdtb-tls', clickUntilItSticks);

function clickUntilItSticks(element) {
  var searchToolbar = $('#hdtbMenus')[0];
  console.log('searchToolbar', searchToolbar);
  var sanityCount = 1;
  var menusVisiblePoller = setInterval(function () {
    if (sanityCount < 20 && searchToolbar.offsetWidth === 0 && searchToolbar.offsetHeight === 0) {
      element.click();
    } else {
      clearInterval(menusVisiblePoller);
    }
  }, 88);
}


/*
   UNABLE TO INCLUDE SCRIPT WHEN USING GREASYFORK SO DIRECTLY INCLUDING HERE.
   Credit to https://github.com/CoeJoder/waitForKeyElements.js
   v1.2
*/
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
  if (typeof waitOnce === 'undefined') {
    waitOnce = true;
  }
  if (typeof interval === 'undefined') {
    interval = 300;
  }
  if (typeof maxIntervals === 'undefined') {
    maxIntervals = -1;
  }
  var targetNodes =
    typeof selectorOrFunction === 'function'
      ? selectorOrFunction()
      : document.querySelectorAll(selectorOrFunction);

  var targetsFound = targetNodes && targetNodes.length > 0;
  if (targetsFound) {
    targetNodes.forEach(function (targetNode) {
      var attrAlreadyFound = 'data-userscript-alreadyFound';
      var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
      if (!alreadyFound) {
        var cancelFound = callback(targetNode);
        if (cancelFound) {
          targetsFound = false;
        } else {
          targetNode.setAttribute(attrAlreadyFound, true);
        }
      }
    });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1;
    setTimeout(function () {
      waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
    }, interval);
  }
}
