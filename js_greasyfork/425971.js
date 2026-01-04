// ==UserScript==
// @name         Auto Refresh Hideout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes every 4 hour hideou.co
// @author       You
// @match        https://hideout.co/watch.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425971/Auto%20Refresh%20Hideout.user.js
// @updateURL https://update.greasyfork.org/scripts/425971/Auto%20Refresh%20Hideout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(ctrlF5, 4 * 3600000)
})();

function ctrlF5() {
  var meta = document.createElement('meta');
  meta.httpEquiv = "Cache-control";
  meta.content = "no-cache";
  document.getElementsByTagName('head')[0].appendChild(meta);

  meta = document.createElement('meta');
  meta.httpEquiv = "Expires";
  meta.content = "1";
  document.getElementsByTagName('head')[0].appendChild(meta);

  location.reload(true);
}