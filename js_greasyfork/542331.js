// ==UserScript==
// @name        Windows Admin Center fix for Firefox
// @description Fixes Windows Admin Center in Firefox
// @namespace   charles25565
// @match       *://*/*
// @grant       GM_addStyle
// @run-at      document-end
// @version     0.1.11
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542331/Windows%20Admin%20Center%20fix%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/542331/Windows%20Admin%20Center%20fix%20for%20Firefox.meta.js
// ==/UserScript==

(() => {
  if (document.title.includes("Windows Admin Center")) {
    Object.defineProperty(location, "ancestorOrigins", {
      value: []
    });
    GM_addStyle("nav > div.sme-layout-float-left { float: unset }");
  }
})();