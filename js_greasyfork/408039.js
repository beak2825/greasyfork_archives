// ==UserScript==
// @name MDN: Important content first
// @namespace myfonj
// @version 2.0.0
// @description Moves compatibility and specs tables to the top. If possible, makes thinkgs more compact.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.developer.mozilla.org/*
// @downloadURL https://update.greasyfork.org/scripts/408039/MDN%3A%20Important%20content%20first.user.js
// @updateURL https://update.greasyfork.org/scripts/408039/MDN%3A%20Important%20content%20first.meta.js
// ==/UserScript==

(function() {
let css = `
/*
Changelog
2.0.0 (2025-08-19) - New layout dropped. Deleted basically everything here. Sigh. New name.
1.6.2 (2025-04-29) - Move multiple compat section to the top as well
1.6.1 (2025-03-26) - RIP styling the content of the Compatibility table. New lazy-compat-table Web Component with closed shadow root is here :sad face:
1.6.0 (2024-10-16) - "Resources" like "See also" on the top
1.5.0 (2024-04-17) - sticky header attepmt
1.4.3 (2024-03-21) - "see also" also in right order in sidebar nav
1.4.2 (2024-03-21) - reordered sidebar nav to match new order
1.4.1 (2024-03-20) - pulling up even the "no compat/spec data found" warning boxes
*/

/*

https://userstyles.org/styles/177139/edit
https://greasyfork.org/en/scripts/408039/versions/new

MDN: Compat table: first and compact

*/
/*
 Pull Browser Compatibility table to the top
*/
.reference-layout__body {
 display: flex;
 flex-direction: column;
 & > .content-section[aria-labelledby="specifications"] {
  order: -100;
 }
 & > .content-section[aria-labelledby="browser_compatibility"] {
  order: -90;
 }
 & > .content-section[aria-labelledby="see_also"] {
  order: -90;
 }
 & h2:is(
  #specifications,
  #browser_compatibility
 ) {
  height: 0 !important;
  overflow: hidden;
  margin: 0;
 }
 h2#see_also {
  font-size: 1em
 }
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
