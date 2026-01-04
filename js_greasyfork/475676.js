// ==UserScript==
// @name         Bing Chat chars limit
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Override the limit of Bing Chat to 10000 characters
// @author       Louis Lacoste
// @match        *www.bing.com/search*showconv=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475676/Bing%20Chat%20chars%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/475676/Bing%20Chat%20chars%20limit.meta.js
// ==/UserScript==

// EDIT THIS TO ADD MORE CHARS
const CHARS_LIMIT = 100000

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let rootElement;

(async function() {
    'use strict';

    while (!rootElement) {
        await delay(333);
        rootElement = document.getElementsByTagName("CIB-SERP")[0];
    }
})();

setInterval(() => {
    rootElement.shadowRoot.activeElement.shadowRoot.activeElement.shadowRoot.activeElement.maxLength = CHARS_LIMIT;

    const letterCounter = rootElement.shadowRoot.activeElement.shadowRoot.querySelectorAll(".letter-counter")[0].childNodes[3];
    letterCounter.textContent = CHARS_LIMIT
}, 2000);