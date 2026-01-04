// ==UserScript==
// @name        bloomberg archive.ph remove ai
// @description Hides a specific div ancestor of path elements on archive.ph
// @match       https://archive.ph/*
// @version 0.0.1.20250718081600
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542009/bloomberg%20archiveph%20remove%20ai.user.js
// @updateURL https://update.greasyfork.org/scripts/542009/bloomberg%20archiveph%20remove%20ai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideDivAncestorByPath(pathSelector, divLevel) {
        const path = document.querySelector(`path[d^="${pathSelector}"]`);
        if (path) {
            let ancestor = path.parentElement;
            let divCount = 0;
            while (ancestor) {
                if (ancestor.tagName === 'DIV') {
                    divCount++;
                    if (divCount === divLevel) {
                        ancestor.style.cssText = 'display: none !important';
                        return true;
                    }
                }
                ancestor = ancestor.parentElement;
            }
        }
        return false;
    }

    function hideTarget() {
        return hideDivAncestorByPath("M14.25 6.25L15.1875 4.1875L17.25", 3) ||
               hideDivAncestorByPath("m19 9 1.25-2.75L23", 2);
    }

    if (hideTarget()) return;

    const observer = new MutationObserver(function() {
        if (hideTarget()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();