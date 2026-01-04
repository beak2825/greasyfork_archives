// ==UserScript==
// @name         vndb 10/10 percentage calculator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Calculates the percentage of 10/10 ratings on vndb compared to total ratings
// @author       You
// @match        https://vndb.org/v*
// @exclude      https://vndb.org/v
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vndb.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479778/vndb%201010%20percentage%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/479778/vndb%201010%20percentage%20calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const graphs = document.querySelectorAll('.graph');
    const graphTexts = [];
    graphs.forEach(graph => {
        graphTexts.push(Number(graph.innerText));
    });

    const tenRatings = graphTexts[0];

    const totalRatings = graphTexts.reduce((acc, curr) => acc + curr, 0);

    const tenPercent = ((tenRatings / totalRatings) * 100).toFixed(2);

    const title = document.querySelectorAll('h1')[1];
    title.innerText += ` (${tenPercent}%)`;
})();