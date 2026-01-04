// ==UserScript==
// @name Simple Ad Blocker
// @namespace https://bing.com
// @version 0.1
// @description A simple userscript ad blocker
// @match https://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/467625/Simple%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/467625/Simple%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A list of filters to block or hide ads
    // Each filter is an object with a type (block or hide), a pattern (a string or a regular expression), and an optional domain (a string or an array of strings)
    var filters = [
        // Block requests to URLs that contain &ad_box_
        {type: "block", pattern: "&ad_box_"},
        // Hide elements with class name b-popup on hackernoon.com
        {type: "hide", pattern: ".b-popup", domain: "hackernoon.com"},
        // Hide elements with id ads on any domain
        {type: "hide", pattern: "#ads"}
    ];

    // Get the current domain name
    var domain = window.location.hostname;

    // Loop through the filters and apply them
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        // Check if the filter matches the current domain
        if (!filter.domain || filter.domain === domain || (Array.isArray(filter.domain) && filter.domain.includes(domain))) {
            // Check if the filter is a block filter
            if (filter.type === "block") {
                // Intercept and cancel requests to URLs that match the filter pattern
                window.addEventListener("beforescriptexecute", function(e) {
                    var src = e.target.src;
                    if (src && (typeof filter.pattern === "string" && src.includes(filter.pattern) || filter.pattern.test(src))) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Blocked request to " + src);
                    }
                });
            }
            // Check if the filter is a hide filter
            else if (filter.type === "hide") {
                // Hide elements that match the filter pattern using CSS
                var style = document.createElement("style");
                style.textContent = filter.pattern + " { display: none !important; }";
                document.head.appendChild(style);
                console.log("Hid elements matching " + filter.pattern);
            }
        }
    }
})();