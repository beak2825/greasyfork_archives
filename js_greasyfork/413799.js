// ==UserScript==
// @name         all3dp adblockblockblock
// @namespace    http://tampermonkey.net/
// @version      1
// @description  block the adblock block
// @author       ggpeti
// @match        https://all3dp.com/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413799/all3dp%20adblockblockblock.user.js
// @updateURL https://update.greasyfork.org/scripts/413799/all3dp%20adblockblockblock.meta.js
// ==/UserScript==

function addStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
}

addStyle (`
    body {
        overflow: initial !important;
    }
    body > div.fc-ab-root {
        display: none !important;
    }
`);