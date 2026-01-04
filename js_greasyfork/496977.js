// ==UserScript==
// @name Pi responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description Pi website is more suitable for wide screens.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/pi
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pi.ai/*
// @downloadURL https://update.greasyfork.org/scripts/496977/Pi%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/496977/Pi%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    .\\32xl\\:max-w-\\[47rem\\] {
        max-width: 98%;
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
