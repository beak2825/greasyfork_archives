// ==UserScript==
// @name         Instagram Video Anti-Pause
// @namespace    https://github.com/ilyasbelfar
// @version      1.0
// @description  Prevent Instagram Videos From Pausing When Switching Web Browser Tab.
// @icon         https://cdn.iconscout.com/icon/free/png-256/instagram-53-151118.png
// @author       Ilyas Belfar
// @license      MIT
// @match        https://*.instagram.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/457455/Instagram%20Video%20Anti-Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/457455/Instagram%20Video%20Anti-Pause.meta.js
// ==/UserScript==

(function() {
   'use strict';
   window.addEventListener("visibilitychange", function(event) {
          event.stopImmediatePropagation();
   }, true);
})();
