// ==UserScript==
// @name         Remove Print Media Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove specific @media print styles from oogartsen.nl
// @author       Private
// @match        https://www.oogartsen.nl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518213/Remove%20Print%20Media%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/518213/Remove%20Print%20Media%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find all <style> elements
    const styles = document.querySelectorAll('style');

    // Loop through styles and remove the specific one
    styles.forEach(style => {
        if (style.innerHTML.includes('@media print')) {
            style.remove();
        }
    });
})();