// ==UserScript==
// @name DuckDuckGo Wacom scroll fix
// @description Wacom tablets with touch enabled send left and right arrow keypresses when you scroll sideways, which is annoying for DDG users.
// @grant unsafeWindow
// @version 0.1
// @match        *://*.duckduckgo.com/*
// @namespace https://pureandapplied.com.au/DDGWacomFix


// @downloadURL https://update.greasyfork.org/scripts/427038/DuckDuckGo%20Wacom%20scroll%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/427038/DuckDuckGo%20Wacom%20scroll%20fix.meta.js
// ==/UserScript==
(function(){
unsafeWindow.document.addEventListener('keydown', function(e) {

  if (e.keyCode === 37 || e.keyCode === 39) {
    // block left and right keypresses to DDG
      e.stopImmediatePropagation();
    return;
  }
}, true);
})();