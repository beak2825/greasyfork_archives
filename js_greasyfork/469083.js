// ==UserScript==
// @name         wirelyre pc solver dark mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  dark mode to prevent blindness
// @author       13pake
// @match        https://wirelyre.github.io/tetra-tools/pc-solver.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469083/wirelyre%20pc%20solver%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/469083/wirelyre%20pc%20solver%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("body { color: #fff; background-color: #363941; font-family: 'Lucidia Console', monospace; }");
    GM_addStyle("#query { border-color: transparent; }");
    GM_addStyle("#queue { color: #fff; border: 1px solid rgba(0,0,0,0.3); }");
    GM_addStyle("#query details, #query details[open] { color: #ccc; }");
    GM_addStyle("#initial-info, #query div.label { font-family: 'Lucidia Console', monospace; }");
    GM_addStyle("#initial>input:nth-child(-n+10) { border-top: 1px solid rgba(0,0,0,0.3); }");
    GM_addStyle("#initial>input:nth-child(10n+1) { border-left: 1px solid rgba(0,0,0,0.3); }");
    GM_addStyle("#initial>input { background-color: rgba(0,0,0,0.2); border-right: 1px solid rgba(0,0,0,0.3); border-bottom: 1px solid rgba(0,0,0,0.3); }");
    GM_addStyle("#queue { background-color: rgba(0,0,0,0.2); }");
    GM_addStyle("mino-board rect[fill='#F3F3ED'] { fill: rgba(0,0,0,0.2); }");
    GM_addStyle("mino-board rect[fill='#E7E7E2'] { fill: rgba(0,0,0,0.2); }");

})();