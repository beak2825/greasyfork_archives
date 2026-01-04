// ==UserScript==
// @name         Thad-ify the Data Doctor Cemeteries Report
// @namespace    http://*.wikitree.com/wiki/
// @version      2025-07-31.2
// @description  Makes the Cemeteries Reports Easier to Process
// @author       Thadius Wynter
// @match        https://plus.wikitree.com/Categories/FindAGraveCemeteries/*MultipleCemeteriesSmall.htm
// @match        https://plus.wikitree.com/Categories/FindAGraveCemeteries/*MultipleCemeteriesBig.htm
// @match        https://plus.wikitree.com/Categories/FindAGraveCemeteries/*PartialCemeteriesSmall.htm
// @match        https://plus.wikitree.com/Categories/FindAGraveCemeteries/*PartialCemeteriesBig.htm
// @icon64URL    https://i.imgur.com/hoNlFrW.png
// @grant        GM_addStyle
// @license      GNU GPLv3
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/544229/Thad-ify%20the%20Data%20Doctor%20Cemeteries%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/544229/Thad-ify%20the%20Data%20Doctor%20Cemeteries%20Report.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
        .content table tbody tr td div {
            grid-template-rows: unset !important;
            grid-auto-flow: unset !important;
            grid-template-columns: repeat(4, auto);
            text-align: right;
        }
    ` );

    GM_addStyle (` .content table tbody tr td div div { white-space: nowrap } `);  // Forces cells to not wrap regardless of length
    GM_addStyle (` a:link[href*="Special:EditPerson"] { color: #FCB815 !important; font-weight: 700 !important; } `);  // Makes unvisited "add" links bright orange
    GM_addStyle (` a:visited[href*="Special:EditPerson"] { color: purple !important; } `);  // Makes previously visited "add" links purple
    GM_addStyle (` div:has(> img[src$="bullet50.gif"]) { text-decoration-line: line-through; opacity: 0.5; } `);  // Makes locked profiles (Public) less visible
    GM_addStyle (` div:has(> img[src$="bullet40.gif"]) { text-decoration-line: line-through; opacity: 0.5; } `);  // Makes locked profiles (Private with Public Bio & Tree) less visible
    GM_addStyle (` div:has(> img[src$="bullet30.gif"]) { text-decoration-line: line-through; opacity: 0.5; } `);  // Makes locked profiles (Private with Public Tree) less visible
    GM_addStyle (` div:has(> img[src$="bullet20.gif"]) { text-decoration-line: line-through; opacity: 0.5; } `);  // Makes locked profiles (Private with Public Bio) less visible
    GM_addStyle (` div:has(> img[src$="bullet10.gif"]) { text-decoration-line: line-through; opacity: 0.5; } `);  // Makes locked profiles (Private) less visible
    GM_addStyle (` div:has(> img[src$="bullet*.gif"]) a[href*="Special:EditPerson"] { color: var(--wbe-colour) !important } `);  // Makes the add links of locked profiles less visible

})();