// ==UserScript==
// @name         CS173 Prettifier
// @namespace    elddc
// @version      1.0
// @description  Adds custom CSS to the CS173 website
// @author       Elddc
// @match        https://courses.grainger.illinois.edu/cs173/*
// @match        https://courses.engr.illinois.edu/cs173/*
// @match        https://mfleck.cs.illinois.edu/*
// @match        http*://bcosman.web.illinois.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=illinois.edu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458380/CS173%20Prettifier.user.js
// @updateURL https://update.greasyfork.org/scripts/458380/CS173%20Prettifier.meta.js
// ==/UserScript==

const styles = document.createElement('style');
styles.innerHTML = `
	body {
        font-family: -apple-system ,BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        line-height: 1.6;
        font-size: 18px;
        margin: 20px 15% 50px;
    }
    table {
        width: 100% !important;
        border-spacing: 0;
        border: none;
        border-bottom: 2px solid black;
        border-left: 2px solid black;
    }
    th, td {
        padding: .4em !important;
        border-top: 2px solid black;
        border-right: 2px solid black;
    }
    tr th:first-child, tr td:first-child {
        width: 5em;
        text-align: center;
    }

    @media (max-width: 750px) {
        body {
            margin: 20px auto 50px;
            max-width: 500px;
        }
    }
`;
document.head.appendChild(styles);
