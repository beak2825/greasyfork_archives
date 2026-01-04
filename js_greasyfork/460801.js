// ==UserScript==
// @name The New York Times Paywall Bypass
// @namespace https://joshcantco.de
// @version 1.2.0
// @description Removes paywalls when trying to view content on The New York Times
// @author Joshua Fountain
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match https://www.nytimes.com/slideshow*
// @match https://www.nytimes.com/live*
// @match https://www.nytimes.com/interactive*
// @include /^(?:^http.://www.nytimes.com/\d{4}\/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/460801/The%20New%20York%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/460801/The%20New%20York%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
let css = `
    #app > div > div:not([id]), #site-content {
        position: static;
    }
    #gateway-content, #standalone-header, #app > div > div:first-child > div:last-child {
        display: none;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
