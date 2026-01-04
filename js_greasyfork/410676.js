// ==UserScript==
// @name         arrow-key-nexter
// @namespace    http://movementarian.org/
// @version      0.1
// @description  make the left/right arrow keys useful
// @author       John Levon
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410676/arrow-key-nexter.user.js
// @updateURL https://update.greasyfork.org/scripts/410676/arrow-key-nexter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* NB: we already tested for prefix/suffix, so this RE is OK. */
    function wholeWordMatch(haystack, needle) {
        let r = new RegExp("\\s" + needle + "\\s");
        return r.test(haystack);
    };

    const LEFT_KEY_CODE = 37;
    const RIGHT_KEY_CODE = 39;

    const prevStrings = [
        "previous page",
        "previous",
        "prev"
    ];

    const nextStrings = [
        "next page",
        "next"
    ];

    document.addEventListener("keyup", function(e) {

        if (!e) {
            e = window.event;
        }

        if (e.isComposing) {
            return;
        }

        switch (e.target.tagName) {
            case "TEXTAREA":
            case "INPUT":
                return;
        }

        const key = e.keyCode ? e.keyCode : e.which;

        var matches = undefined;

        if (key == LEFT_KEY_CODE) {
            matches = prevStrings;
        } else if (key == RIGHT_KEY_CODE) {
            matches = nextStrings;
        } else {
            return;
        }

        let found = undefined;
        let score = 0;

        document.querySelectorAll("a").forEach((link) => {
            let strs = [ link.textContent ];

            if (!link.href) {
                return;
            }

            /* This is often a good match if the text itself isn't. */
            if (link.attributes["aria-label"]) {
                strs.push(link.attributes["aria-label"].nodeValue);
            }

            for (let str of strs) {
                if (typeof str === "undefined") {
                    return;
                }

                str = str.toLowerCase();

                /*
                 * There's no perfect way to find the "best" link, but in
                 * practice this works on a reasonable number of sites: an exact
                 * match, or exact prefix or suffix, always wins; otherwise, we
                 * match a whole-word sub-string: "Go to prev <<" will match,
                 * but not "dpreview.com".
                 */
                for (let match of matches) {
                    if (str === match) {
                        found = link;
                        break;
                    }

                    if (str.startsWith(match) || str.endsWith(match)) {
                        found = link;
                        break;
                    }

                    if (score < 1 && wholeWordMatch(str, match)) {
                        found = link;
                        score = 1;
                    }
                }
            }
        });

        if (found) {
            found.click();
        }

  }, true);
})();
