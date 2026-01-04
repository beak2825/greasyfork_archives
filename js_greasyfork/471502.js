// ==UserScript==
// @name         PDF Dark Reader
// @namespace    tolix123.github.io
// @version      0.1
// @license      MIT
// @description  as the plugin name suggests, the 'PDF Dark Reader' plugin provides you a dark PDF page. Local files are not supported due to browser restrictions.
// @author       Tolix123
// @match        *://*/*.pdf
// @match        file://*/*.pdf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471502/PDF%20Dark%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/471502/PDF%20Dark%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

var cover = document.createElement("div");
let css = `
    position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #DDDDDD;
    mix-blend-mode: difference;
    z-index: 1;
`// Change the colour in the background-color task.
cover.setAttribute("style", css);
document.body.appendChild(cover);

})();