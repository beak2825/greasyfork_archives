// ==UserScript==
// @name         forum.qnap.com css fix
// @namespace    https://github.com/appel/userscripts
// @version      0.1
// @description  Removes the "?assets_version=135" query string bit from any css link on forum.qnap.com.
// @author       Ap
// @match        https://forum.qnap.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524076/forumqnapcom%20css%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/524076/forumqnapcom%20css%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href]');
    cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.endsWith('?assets_version=135')) {
            const newHref = href.replace('?assets_version=135', '');
            link.setAttribute('href', newHref);
        }
    });
})();