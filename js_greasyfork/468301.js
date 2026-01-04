// ==UserScript==
// @name         FutuReddit
// @namespace    https://github.com/tonioriol/userscripts
// @version      0.0.2
// @description  Automatically redirects old Reddit to modern Reddit interface
// @author       Toni Oriol
// @match        *://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/468301/FutuReddit.user.js
// @updateURL https://update.greasyfork.org/scripts/468301/FutuReddit.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.location.href = window.location.href.replace(
    "old.reddit.com",
    "www.reddit.com"
  );
})();
