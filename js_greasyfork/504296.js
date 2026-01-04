// ==UserScript==
// @name         Enlarge Like Button on the Stupid Twitter
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  MAKE IT LARGER.
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL https://update.greasyfork.org/scripts/504296/Enlarge%20Like%20Button%20on%20the%20Stupid%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/504296/Enlarge%20Like%20Button%20on%20the%20Stupid%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style")
    style.innerHTML = `[data-testid=like], [data-testid=unlike] { padding: 1.5rem 2.5rem 1.5rem 1rem !important; margin: -1.5rem -2.5rem -1.5rem -1rem !important; }`
    document.head.appendChild(style)
})();