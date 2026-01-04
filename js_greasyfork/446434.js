// ==UserScript==
// @name         Google - Block "People also search for" & "People also ask"
// @namespace    https://github.com/dymk/block-google-also-search-for
// @license      gpl-3.0
// @version      1.2
// @description  Block the "...also search for..." and "...also ask" boxes in Google search results. Does not rely on hardcoded class names, so it's more future proof.
// @author       dymk
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446434/Google%20-%20Block%20%22People%20also%20search%20for%22%20%20%22People%20also%20ask%22.user.js
// @updateURL https://update.greasyfork.org/scripts/446434/Google%20-%20Block%20%22People%20also%20search%20for%22%20%20%22People%20also%20ask%22.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DEBUG = false;

    function removeElements() {
        let removed = 0;
        removed += removeXpath("//*[text() = 'People also search for']/../../../../../node()");
        removed += removeXpath("//*[text() = 'People also ask']/../../../../../node()");

        if (DEBUG) {
            console.log(`Removed ${removed} "...also..." elems`);
        }
    }

    function removeXpath(path) {
        let xpath = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
        if (!xpath) { return 0; }

        let elems = [];
        for (let elem = xpath.iterateNext(); elem; elem = xpath.iterateNext()) {
            elems.push(elem);
        }

        for (let elem of elems) {
            elem.remove();
        }
        return elems.length;
    }

    // run immediately on page paint, after DOM loaded, and after every 
    // DOM update
    new MutationObserver(() => {
        removeElements();
    }).observe(document, { subtree: true, childList: true });
    document.addEventListener('DOMContentLoaded', removeElements, false);
    removeElements();
})();
