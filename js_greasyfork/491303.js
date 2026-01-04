// ==UserScript==
// @name         GitHub Gist, open Markdown links in new tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open GitHub Gist Markdown links in a new tab
// @author       Ashkin Li
// @match        https://gist.github.com/*/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/491303/GitHub%20Gist%2C%20open%20Markdown%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/491303/GitHub%20Gist%2C%20open%20Markdown%20links%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // query all tag a
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        // filter 'gist.github.com'
        if (!link.href.includes('gist.github.com')) {
            // setup _blank and rel
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
})();