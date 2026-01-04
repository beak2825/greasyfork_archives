// ==UserScript==
// @name         Hide StackOverflow in Google Search
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  hide stackoverflow. research independently.
// @author       You
// @match        https://www.google.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521671/Hide%20StackOverflow%20in%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/521671/Hide%20StackOverflow%20in%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
// the search area
    const area = document.querySelector("div#search")
    // the results
    const first_result = area.childNodes[0].childNodes[1].childNodes[0]
    const other_results = area.childNodes[0].childNodes[1].childNodes[2].childNodes
    let results = [first_result]
    for(let i=0; i<other_results.length; i++) {
        results.push(other_results[i])
    }
    for(let i=0; i<results.length; i++) {
        let spans = results[i].querySelectorAll("span + div > div >span")
        for(let j=0; j<spans.length; j++) {
            let span=spans[j];
            if (span.textContent === "Stack Overflow"|| span.textContent==="Ask Ubuntu" || span.textContent==="Super User" ) {
                console.log(results[i]);
                results[i].style.display = "none";
                break;
            }
        }
    }
})();