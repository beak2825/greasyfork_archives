// ==UserScript==
// @name        Disable Google SafeSearch automatically
// @namespace   Disable Google SafeSearch automatically
// @description Disables Google SafeSearch automatically
// @include     https://www.google.*/search*
// @include     https://www.google.*/imgres*
// @run-at      document-start
// @version     1.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/480846/Disable%20Google%20SafeSearch%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/480846/Disable%20Google%20SafeSearch%20automatically.meta.js
// ==/UserScript==

(function() {
  var url = new URL(window.location.href);
  var params = url.searchParams;

  // Check if 'safe' parameter is already set to 'off'
  if (params.get('safe') !== 'off') {
    params.set('safe', 'off');
    window.location.replace(url.toString());
  }
})();