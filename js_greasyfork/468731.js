// ==UserScript==
// @name         ePrint Sort by Relevance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sort by relevance by default on Cryptology ePrint Archive
// @author       Maya Farber Brodsky
// @match        https://eprint.iacr.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iacr.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468731/ePrint%20Sort%20by%20Relevance.user.js
// @updateURL https://update.greasyfork.org/scripts/468731/ePrint%20Sort%20by%20Relevance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let search_divs = document.getElementsByClassName("input-group");
    for (let search_div of search_divs) {
        let hidden_input = document.createElement("input");
        hidden_input.setAttribute("type", "hidden");
        hidden_input.setAttribute("name", "relevance");
        hidden_input.setAttribute("value", "on");

        search_div.appendChild(hidden_input);
    }
})();
