// ==UserScript==
// @name         WK community print details opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Opens up all of the "details" elements in the pdf print
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @include      /^https?:\/\/community.wanikani.com\/.*\/print$/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441012/WK%20community%20print%20details%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/441012/WK%20community%20print%20details%20opener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll("details")].forEach(elem => elem.outerHTML = `<details open>${elem.innerHTML}</details open>`);
})();