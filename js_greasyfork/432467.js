// ==UserScript==
// @name         bemuse-pitch-shift-remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes hit miss pitch shift
// @author       James Murphy (jmorpheus)
// @match        https://bemuse.ninja/*
// @icon         https://www.google.com/s2/favicons?domain=bemuse.ninja
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432467/bemuse-pitch-shift-remove.user.js
// @updateURL https://update.greasyfork.org/scripts/432467/bemuse-pitch-shift-remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // intercept creation of scripts on the page
    var c = document.createElement;
    document.createElement = function (tag) {
        // rename the tag to something special we can read later
        if (tag === "script") {
            tag = "intercept:script"
        }
        return c.call(document, tag);
    };
    document.addEventListener('DOMNodeInserted', function (event) {
        // when a script is inserted, it will have our custom tag
        var el = event.target;
        if (!el.nodeName || el.nodeName.toLowerCase() !== 'intercept:script') return;
        // retrieve the source code
        var req = new XMLHttpRequest();
        req.open("GET", el.src, false);
        try {
            req.send();
            // then create a new script tag
            var newEl = c.call(document, "script");
            newEl.type = "text/javascript";
            // if the script tag is `app.[hash].js`, inject the patch
            if (/\/app.*\.js/.test(el.src)) {
                // find where the method `bad()` is - this is responsible for the pitch shift effect
                var match = req.responseText.match(/bad\(\)\{.*\}destroy/);
                var start = match.index;
                var end = start + match[0].indexOf("}") + 1;
                // this effectively replaces the implementation of `bad()` with an empty function
                newEl.innerHTML = req.responseText.substring(0, start) + "bad(){}" + req.responseText.substring(end);
            }
            // if this isn't the `app.[hash].js` script, use its source code without changes
            else newEl.innerHTML = req.responseText;
            document.head.appendChild(newEl);
        } catch(e) {}
    });
})();