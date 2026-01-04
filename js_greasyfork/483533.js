// ==UserScript==
// @name         BLACK SCREEN FIX
// @namespace    https://hordes.io
// @version      2024-01-01
// @description  Hordes.io Loading Screen Fixer
// @license      FU!
// @author       ChatGPT-6
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483533/BLACK%20SCREEN%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/483533/BLACK%20SCREEN%20FIX.meta.js
// ==/UserScript==

'use strict';
window.stop();
(() => {
    fetch('play').then(h => h.text()).then((h, s) => {
        document.open().write(h.replace(/<script\s+[^>]*\s*src\s*=\s*["']?([^"']+)["']?\s*[^>]*>[^<]*<\/script>/gi, (_, h) => (s = h, '')));
        document.body.appendChild(Object.assign(document.createElement('script'), {src: s}));
        document.close();
    })
})
();