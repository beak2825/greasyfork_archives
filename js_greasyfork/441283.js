// ==UserScript==
// @name         Sonarcloud mark uncovered code
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  mark uncovered code
// @license      MIT
// @author       IgnaV
// @license      -
// @match        https://sonarcloud.io/*
// @icon         https://sonarcloud.io/favicon.ico
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/464852/Sonarcloud%20mark%20uncovered%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/464852/Sonarcloud%20mark%20uncovered%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    'background-color: #ffd3db;'

    const codeLine = `div.js-source-line`;
    const newLineChild = `div > div[data-testid="new-code-underline"]`;
    const uncoveredChild = `div > div[aria-label="Not covered by tests."]`;
    const issueChild = `div > a[aria-label="There is a Code Smell on this line"]`;

    const oldLine = `${codeLine}:not(:has(${newLineChild})):not(:has(${issueChild}))`;
    const old3SeparetedLine = `
        ${oldLine}
        + ${oldLine}
        + ${oldLine}
        + ${oldLine}:not(:has(
            + ${codeLine} > ${newLineChild},
            + ${codeLine} + ${codeLine} > ${newLineChild},
            + ${codeLine} + ${codeLine} + ${codeLine} > ${newLineChild}
        ), :has(
            + ${codeLine} > ${issueChild},
            + ${codeLine} + ${codeLine} > ${issueChild},
            + ${codeLine} + ${codeLine} + ${codeLine} > ${issueChild}
        ))
    `;
    // Not covered: bg-color = red
    GM_addStyle(`${codeLine}:has(${uncoveredChild}) > ${newLineChild} { background-color: #ff000033 !important; }`);
    // Old lines separated by three lines: display None
    GM_addStyle(`${old3SeparetedLine} { display: none !important; }`);
})();