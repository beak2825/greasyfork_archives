// ==UserScript==
// @name        Find image source clicker on lens.google.com
// @namespace   https://github.com/gslin/find-image-source-clicker
// @match       https://lens.google.com/search*
// @grant       none
// @version     0.20240308.0
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Click "Find image source" on lens.google.com automatically
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/489196/Find%20image%20source%20clicker%20on%20lensgooglecom.user.js
// @updateURL https://update.greasyfork.org/scripts/489196/Find%20image%20source%20clicker%20on%20lensgooglecom.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.querySelectorAll('button:has(svg)').forEach(el => {
    if (el.innerText === "Find image source") {
      el.click();
    }
  });
})();
