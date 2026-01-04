// ==UserScript==
// @name         Disable Hyperlink Auditing (johanb)
// @version      1.5
// @description  A simple script that removes hyperlink auditing from all websites.
// @author       johanb
// @include      *
// @grant        none
// @run-at document-end
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406808/Disable%20Hyperlink%20Auditing%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406808/Disable%20Hyperlink%20Auditing%20%28johanb%29.meta.js
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

})();