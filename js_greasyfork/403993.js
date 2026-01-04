// ==UserScript==
// @name        - youtube.com - Clean Homepage Clutter
// @namespace   Yury Ershov
// @match       *://www.youtube.com/*
// @run-at      document-idle
// @noframes
// @grant       none
// @version     1.0
// @author      Yury Ershov
// @description Clean up Youtube's homepage (recommended videos)
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/403993/-%20youtubecom%20-%20Clean%20Homepage%20Clutter.user.js
// @updateURL https://update.greasyfork.org/scripts/403993/-%20youtubecom%20-%20Clean%20Homepage%20Clutter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  [...document.querySelectorAll("ytd-browse[page-subtype=home]")].forEach(e=>e.remove());
})();