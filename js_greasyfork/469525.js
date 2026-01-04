// ==UserScript==
// @name         Reddit Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove Reddit from Google Search Results
// @author       Gnol
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469525/Reddit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/469525/Reddit%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // get all result URL's
    var elements
    while (elements === undefined) {
        elements = document.querySelectorAll('cite')
    }

    // kill any that are from reddit
    elements.forEach((el) => {
        if (el.textContent.includes('https://www.reddit.com')) {
            let toKill = el
            for (let i = 0; i < 8; i++) {
                toKill = toKill.parentElement
            }
            toKill.remove()
        }
    })
})();