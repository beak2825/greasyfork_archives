// ==UserScript==
// @name         _blank sanity preserver
// @namespace    https://jvdl.dev/
// @version      1
// @description  Prevent sites from opening links in a new tab.
// @author       John van der Loo <john@jvdl.dev>
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535174/_blank%20sanity%20preserver.user.js
// @updateURL https://update.greasyfork.org/scripts/535174/_blank%20sanity%20preserver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link && link.matches("a[target='_blank']")) {
            location.href=link.href;
            e.preventDefault();
        }
    })
    // Your code here...
})();