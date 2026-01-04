// ==UserScript==
// @name         Hide Google Logo
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Hide elements with class lnXdpd on Google.com
// @author       Your Name
// @match        https://www.google.com/*
// @grant        none
// @license     ronengyattrizzelr
// @downloadURL https://update.greasyfork.org/scripts/493841/Hide%20Google%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/493841/Hide%20Google%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply the style
    function applyStyle() {
        var elements = document.getElementsByClassName('lnXdpd');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Apply the style
        applyStyle();
    });

    // If the page content changes (due to AJAX or other dynamic updates), reapply the style
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                applyStyle();
            }
        });
    });

    // Start observing changes to the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
