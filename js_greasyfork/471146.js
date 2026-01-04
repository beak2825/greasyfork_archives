// ==UserScript==
// @name         Wikipedia Simplifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simplifies the layout of Wikipedia articles for easier reading with additional customization options
// @author       Kiwv
// @match        https://en.wikipedia.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471146/Wikipedia%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/471146/Wikipedia%20Simplifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options
    const config = {
        removeSidebar: true, // Whether to remove the sidebar
        removeTableOfContents: true, // Whether to remove the table of contents
        removeFooter: true, // Whether to remove the footer
        adjustFontSize: true, // Whether to adjust font size for readability
        fontSize: '16px', // Font size for paragraphs
        lineHeight: '1.5' // Line height for paragraphs
    };

    // Remove clutter elements
    function removeElements() {
        if (config.removeSidebar) {
            const sidebar = document.getElementById('mw-navigation');
            if (sidebar) {
                sidebar.remove();
            }
        }

        if (config.removeTableOfContents) {
            const toc = document.getElementById('toc');
            if (toc) {
                toc.remove();
            }
        }

        if (config.removeFooter) {
            const footer = document.getElementById('footer');
            if (footer) {
                footer.remove();
            }
        }
    }

    // Simplify layout and formatting
    function simplifyLayout() {
        const content = document.getElementById('content');
        if (content) {
            content.style.width = '100%';
        }

        const bodyContent = document.getElementById('bodyContent');
        if (bodyContent) {
            bodyContent.style.margin = '0';
            bodyContent.style.padding = '0';
        }

        if (config.adjustFontSize) {
            const paragraphs = document.querySelectorAll('#bodyContent p');
            for (let i = 0; i < paragraphs.length; i++) {
                paragraphs[i].style.fontSize = config.fontSize;
                paragraphs[i].style.lineHeight = config.lineHeight;
            }
        }
    }

    // Main function to simplify the Wikipedia article
    function simplifyWikipedia() {
        removeElements();
        simplifyLayout();
    }

    // Run the simplification process when the page has finished loading
    window.addEventListener('load', simplifyWikipedia);
})();
