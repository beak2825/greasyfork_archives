// ==UserScript==
// @name         Remove Instagram login popup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes login popup that is shown after scroll
// @author       Can Kurt
// @match        *://www.instagram.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535373/Remove%20Instagram%20login%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/535373/Remove%20Instagram%20login%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        function removeLastElementsUntilNonDiv() {
            const lastElement = document.body.lastElementChild;

            if (lastElement && lastElement.tagName === 'DIV') {
                if(lastElement.id !== "has-finished-comet-page") {
                    lastElement.remove();
                    removeLastElementsUntilNonDiv();
                }
            }
        }

        removeLastElementsUntilNonDiv();
    }, 100);
})();