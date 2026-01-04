// ==UserScript==
// @name           Reddit Thumbnail Adjustment
// @namespace      www.example.com
// @version        1.0.0
// @description    Moves the Reddit post thumbnail to the right and scales it
// @author         Me
// @run-at         document-start
// @match          https://reddit.com/
// @downloadURL https://update.greasyfork.org/scripts/511069/Reddit%20Thumbnail%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/511069/Reddit%20Thumbnail%20Adjustment.meta.js
// ==/UserScript==
(function() {
    var css = "";

    if (false || (document.domain == "reddit.com" || document.domain.substring(document.domain.indexOf(".reddit.com") + 1) == "reddit.com")) {
        css += [
            "/* Move the thumbnail (preview) to the right side */",
            ".thing .thumbnail {",
            "    float: right; /* Move the thumbnail to the right */",
            "    margin-left: 10px; /* Add some spacing from the post content */",
            "    margin-right: 50px;",
            "    transform: scale(2); /* Scale the thumbnail to make it bigger */",
            "    position: relative; /* Ensures that the overlay stays within the thumbnail */",
            "}",

            "/* Adjust post content to accommodate the moved thumbnail */",
            ".thing .entry {",
            "    margin-right: 160px; /* Increase right margin to make space for the thumbnail */",
            "}"
        ].join("\n");
    }

    // Append the generated CSS to the head of the document
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
