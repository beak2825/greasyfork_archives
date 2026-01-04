// ==UserScript==
// @name         XKCD - Display Title Below Comic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display the title text ("alt-text") of XKCD comics below the comic
// @author       Jonah Lawrence (youtube.com/DevProTips)
// @match        *://*.xkcd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412182/XKCD%20-%20Display%20Title%20Below%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/412182/XKCD%20-%20Display%20Title%20Below%20Comic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // when the page has loaded
    window.addEventListener("load", function () {
        // search for the first element in the comic with a title attribute
        const titleElement = document.querySelector("#comic [title]")

        // if the element exists
        if (titleElement) {
            // get the title attribute of the element
            const title = titleElement.title

            // create a paragraph element
            let p = document.createElement("p")

            // set the text to the title attribute
            p.innerText = title

            // create object to contain styles
            const styles = {
                fontVariant: 'none',    // remove small caps font variant
                background: '#aaaaaa',  // add a light gray background
                padding: '15px',        // add padding around the text
                maxWidth: '100vw',      // set the max width to the viewport width
                margin: '5px auto'      // Add 5px on top and bottom and center horizontally
            }

            // apply all styles to the paragraph
            Object.assign(p.style, styles)

            // append the paragraph at the end of the comic
            document.querySelector("#comic").append(p)
        }
    }, false)
})();