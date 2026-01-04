// ==UserScript==
// @name         MediaWiki Heading Links
// @version      0.1
// @description  Add visible anchor links to section headings on MediaWiki sites (like Wikipedia, Arch Wiki)
// @match        *://*.wikipedia.org/*
// @match        *://wiki.archlinux.org/*
// @match        *://*/*wiki*
// @grant        none
// @namespace    https://github.com/aidan-gibson/
// @downloadURL https://update.greasyfork.org/scripts/545850/MediaWiki%20Heading%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/545850/MediaWiki%20Heading%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addAnchors() {
        // Select headings inside the article content
        const headings = document.querySelectorAll(
            '#content h2, #content h3, #content h4, #content h5, #content h6, ' +
            '.mw-parser-output h2, .mw-parser-output h3, .mw-parser-output h4, .mw-parser-output h5, .mw-parser-output h6'
        );

        headings.forEach(h => {
            // Skip if already processed
            if (h.classList.contains('anchor-added')) return;

            const id = h.querySelector('.mw-headline')?.id || h.id;
            if (!id) return;

            // Build the link
            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = '¶'; // you can swap this with 🔗 or a link icon
            link.className = 'heading-anchor';

            // Style the link
            link.style.marginLeft = '0.3em';
            link.style.fontSize = '0.8em';
            link.style.opacity = '0.6';
            link.style.textDecoration = 'none';
            link.style.visibility = 'hidden';

            // Show only on hover
            h.addEventListener('mouseenter', () => { link.style.visibility = 'visible'; });
            h.addEventListener('mouseleave', () => { link.style.visibility = 'hidden'; });

            // Insert link
            h.appendChild(link);
            h.classList.add('anchor-added');
        });
    }

    // Run once DOM is ready
    if (document.readyState !== 'loading') {
        addAnchors();
    } else {
        document.addEventListener('DOMContentLoaded', addAnchors);
    }
})();
