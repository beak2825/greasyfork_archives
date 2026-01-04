// ==UserScript==
// @name         Shoptet - upravit produkt jako link
// @namespace    https://greasyfork.org/en/scripts/529581-shoptet-upravit-produkt-jako-link
// @version      1.01
// @description  Make a span clickable by extracting an href and wrapping it in an anchor tag
// @author       Michal
// @include      *
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/529581/Shoptet%20-%20upravit%20produkt%20jako%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/529581/Shoptet%20-%20upravit%20produkt%20jako%20link.meta.js
// ==/UserScript==
/* globals $ */
(function() {
    'use strict';

    // Wait until the page fully loads
    function modifySpan() {
        let href = $("#bar-menu").children().eq(2) // Get the third child
            .find("ul") // Find the <ul> inside it
            .children().eq(1) // Get the second child of <ul>
            .find("a") // Find the <a> tag inside it
            .attr("href"); // Get the href attribute

        console.log("Extracted href:", href); // Output the href value

        if (href) {
            let span = $("#bar-menu").children().eq(2).find("span"); // Find the <span> inside it

            if (span.length > 0) {
                // Wrap the span inside an <a> tag
                span.wrap(`<a href="${href}" target="_blank"></a>`);
                console.log("Span successfully wrapped inside <a>");
            }
        }
    }

    // Ensure jQuery is available (most sites have it, but if not, inject it)
    function ensureJQuery(callback) {
        if (window.jQuery) {
            callback();
        } else {
            let script = document.createElement("script");
            script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            script.onload = callback;
            document.head.appendChild(script);
        }
    }

    // Run script when the page is fully loaded
    ensureJQuery(() => {
        $(document).ready(function() {
            setTimeout(modifySpan, 2000); // Delay execution to ensure elements are loaded
        });
    });

})();
