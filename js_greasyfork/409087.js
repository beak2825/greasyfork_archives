// ==UserScript==
// @name MDN: Header to Footer (Content First)
// @namespace myfonj
// @version 3.0.0
// @description Moves main content to the top, so the header with dropdown menus lands above footer.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.developer.mozilla.org/*
// @downloadURL https://update.greasyfork.org/scripts/409087/MDN%3A%20Header%20to%20Footer%20%28Content%20First%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409087/MDN%3A%20Header%20to%20Footer%20%28Content%20First%29.meta.js
// ==/UserScript==

(function() {
let css = `
/*
    https://userstyles.world/style/4280/mdn-content-first-header-to-footer
    https://greasyfork.org/en/scripts/409087/versions/new
    Changelog
    2025-08-19 (3.0.0) - New layout, drop everything, start small. Sigh.
    2025-08-11 (2.2.3) - Fix the Playground.
    2025-05-23 (2.2.3) - fix: breadcrumbs are back at the top (right)
    2024-03-21 (2.2.2) - compacted play even more
    2024-03-21 (2.2.1) - fixed sidebar compacting a bit
    2024-03-21 (2.2.0) - compacting /play sandbox and pushing up
    2024-03-20 (2.1.1) - compact sidebar (preliminary)
    2022-12-14 (2.1.0) - breadcrumbs back to top, compact search
    2020-12-15 they switched to "signle column grid"
    With explicity set template-row, that matches matural source order.
    Makes no sense to me. Education? Showing off? Questions…
    You know what?
    Flexbox is fine. I think. Natural order, no need to keep track, no overlays.
    2021-03-11 switched to shallow grid with aside and main besides each other
    2022-03-23 new version - new structure hit production
    2022-04-21 new structure
  */
/*
 Pull the main content above everything.
 (Layout is now grid, so it works without any ado.)
*/
:root {
--sticky-header-height: 0;
}
.page-layout__main {
 order: -1;
}
/*
§ TODO move breadcrumbs and actions back to top (?)
*/
/*
§ TODO  Also compacts /play sandbox.
*/

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
