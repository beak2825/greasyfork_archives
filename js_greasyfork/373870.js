// ==UserScript==
// @name         YouTube - Channel redirector
// @description  Redirects the channel from featured to videos tab. Only for direct URL access.
// @namespace    var512
// @author       var512
// @version      1.0.0
// @supportURL   https://gitlab.com/var512
// @supportURL   https://github.com/var512
// @include      /^https?:\/\/(www\.)?youtube\.com\/(channel|user)\/([a-zA-Z0-9_-]+)\/?(featured)?$/
// @icon         https://youtube.com/favicon.ico
// @license      MIT
// @noframes
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373870/YouTube%20-%20Channel%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/373870/YouTube%20-%20Channel%20redirector.meta.js
// ==/UserScript==

(() => {
  'use strict';

  window.stop();
  const newUrl = document.URL.replace(/(\/featured)?(\/)?$/, '');

  window.location.replace(`${newUrl}/videos`);
})();
