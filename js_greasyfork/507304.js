// ==UserScript==
// @name         Pure Black Background with Visible Text and Links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Apply a pure black background to any website, ensure text visibility, and differentiate links
// @author       Patrick Gomes
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/507304/Pure%20Black%20Background%20with%20Visible%20Text%20and%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/507304/Pure%20Black%20Background%20with%20Visible%20Text%20and%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply pure black background and ensure text visibility
    const applyStyles = () => {
        $('*').each(function() {
            const color = $(this).css('color');
            if (color) {
                const rgb = color.match(/\d+/g);
                if (rgb) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    if (brightness < 128) {
                        $(this).css('color', '#FFFFFF');
                    }
                }
            }
            $(this).css('background-color', '#000000');
        });

        // Style links and visited links
        $('a:link').css('color', '#1E90FF'); // DodgerBlue for unvisited links
        $('a:visited').css('color', '#551A8B'); // Purple for visited links
    };

    // Initial style application
    applyStyles();

    // Observe for dynamically loaded content
    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, { childList: true, subtree: true });
})();
