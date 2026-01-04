// ==UserScript==
// @name         Nitro Math Auto Reload
// @namespace    Nitro Math Auto Reload
// @version      1.0
// @description  Automatically realods your page after finishing the race!
// @author       Cosmo
// @match        https://www.nitromath.com/play
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484284/Nitro%20Math%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/484284/Nitro%20Math%20Auto%20Reload.meta.js
// ==/UserScript==



(function () {
  'use strict';

  function reloadPage() {
    location.reload();
  }

  setInterval(reloadPage, 95000);
})();