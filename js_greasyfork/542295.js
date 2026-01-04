// ==UserScript==
// @name         Accessible Page Title
// @namespace    npm/vite-plugin-monkey
// @version      0.1.0
// @author       pacexy <pacexy@gmail.com>
// @description  Enhances page title accessibility on specific webpages
// @license      MIT
// @icon         https://github.com/favicon.ico
// @homepage     https://github.com/pacexy/userscript-accessible-page-title#readme
// @homepageURL  https://github.com/pacexy/userscript-accessible-page-title#readme
// @source       https://github.com/pacexy/userscript-accessible-page-title.git
// @supportURL   https://github.com/pacexy/userscript-accessible-page-title/issues
// @match        https://github.com/search?*
// @downloadURL https://update.greasyfork.org/scripts/542295/Accessible%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/542295/Accessible%20Page%20Title.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function update() {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q");
    if (!query) {
      return;
    }
    const title = query.trim() + ` - ${document.title}`;
    document.title = title;
  }
  update();
  document.addEventListener("soft-nav:end", update);

})();