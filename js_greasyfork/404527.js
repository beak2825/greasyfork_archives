// ==UserScript==
// @name         Reverso Context: Remove blur from bottom results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the blur and registration notice from the bottom results on context.reverso.net. Note: it does not give access to more results than are on the page.
// @author       SUM1
// @match        https://context.reverso.net/translation/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404527/Reverso%20Context%3A%20Remove%20blur%20from%20bottom%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/404527/Reverso%20Context%3A%20Remove%20blur%20from%20bottom%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (let i of document.querySelectorAll('.example.blocked')) { //            For each blurred result,
        i.setAttribute('style', 'filter: inherit; -webkit-filter: inherit;'); // override its blur properties set in bst.style.css with inline ones set to 'inherit'.
    }
    document.querySelector('#blocked-results-banner').remove(); //               Remove the blocked results banner.
})();