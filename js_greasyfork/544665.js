// ==UserScript==
// @name         Visual Search Only
// @version      1.0
// @description  redirects every pinterest pin to visual search
// @author       Audino
// @namespace   https://greasyfork.org/en/users/1501652-audino
// @match        *://*.pinterest.com/*
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544665/Visual%20Search%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/544665/Visual%20Search%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pinUrlRegex = /(\/pin\/\d+)/;

    const modifyLink = (linkElement) => {
        if (linkElement && linkElement.href && !linkElement.dataset.vsModified) {
            const match = linkElement.href.match(pinUrlRegex);
            if (match) {
                const baseUrl = new URL(linkElement.href).origin;
                const newUrl = `${baseUrl}${match[0]}/visual-search/`;
                linkElement.href = newUrl;
                linkElement.dataset.vsModified = 'true';
            }
        }
    };

    document.addEventListener('mouseover', (event) => {
        const linkElement = event.target.closest('a[href*="/pin/"]');
        if (linkElement) {
            modifyLink(linkElement);
        }
    }, true);

    document.addEventListener('click', function(event) {
        if (event.button !== 0) return;

        const linkElement = event.target.closest('a[href*="/pin/"]');
        if (linkElement && linkElement.href && linkElement.href.includes('/pin/')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            window.location.href = linkElement.href;
        }
    }, true);

})();
