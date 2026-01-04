// ==UserScript==
// @name         docs.rs font and size fixes
// @namespace    http://tampermonkey.net/
// @version      1.9.17
// @description  change the default fonts on rust docs sites
// @author       You
// @match        *://docs.rs/*
// @match        *://doc.rust-lang.org/*
// @match        *://crates.io/*
// @match        *://rust-lang.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docs.rs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489809/docsrs%20font%20and%20size%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/489809/docsrs%20font%20and%20size%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // THIS RUNS FIRST! The ordering matters (eg: for `p`).

    // Select all elements with a class containing "font"
    const bodyElements = document.querySelectorAll("body, h1, h2, h3, h4, h5, h6, div, a, ol, li, ul, p, .font");

    // Loop through each element
    bodyElements.forEach(element => {
        // https://stackoverflow.com/questions/38454240/using-css-important-with-javascript
        element.style = "line-height: normal !important";
    });

    // THIS RUNS LAST! The ordering matters (eg: for `p`).

    // Select all elements with a class containing "font" (common for code blocks)
    const fontSizeElements = document.querySelectorAll("pre, code, p");

    // Loop through each element
    fontSizeElements.forEach(element => {
        // https://stackoverflow.com/questions/38454240/using-css-important-with-javascript
        element.style = "font-size: 12pt !important";
    });

})();