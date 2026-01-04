// ==UserScript==
// @name         Disable Hyperlink Auditing
// @namespace    https://tech.jacenboy.com/hyperlink-auditing
// @version      1.3
// @description  A simple script that removes hyperlink auditing from all websites.
// @author       JacenBoy
// @match        http*://*/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/381528/Disable%20Hyperlink%20Auditing.user.js
// @updateURL https://update.greasyfork.org/scripts/381528/Disable%20Hyperlink%20Auditing.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var pings = 0;
  var hyperlinks = Array.from(document.getElementsByTagName("a"));
  hyperlinks.forEach(a => {
      if (a.hasAttribute("ping")) {
          a.removeAttribute("ping");
          pings++;
      }
      if (a.hasAttribute("data-ping-url")) {
        a.removeAttribute("data-ping-url");
        pings++;
      }
  });
  if (pings > 0) {
      console.log(`${pings} ${pings > 1 ? "links" : "link"} defused.`);
  }
})();