// ==UserScript==
// @name        Display Stonetoss Title Below Comic
// @namespace   Violentmonkey Scripts
// @match       *://*.stonetoss.com/*
// @grant       none
// @version     0.1
// @license     The Unlicense
// @author      ImpatientImport
// @description Display the title text ("alt-text") of Stonetoss comics below the comic
// @downloadURL https://update.greasyfork.org/scripts/439658/Display%20Stonetoss%20Title%20Below%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/439658/Display%20Stonetoss%20Title%20Below%20Comic.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // when the page has loaded
    window.addEventListener("load", function () {
        // search for the first element in the comic with a title attribute
        const titleElement = document.querySelector("#comic").firstElementChild
 
        // if the element exists
        if (titleElement) {
            // get the title attribute of the element
            const title = titleElement.title
 
            // create a paragraph element
            var titleText = document.createElement("h2")
 
            // set the text to the title attribute
            titleText.innerText = title
 
            // create object to contain styles
            const styles = {
                fontVariant: 'Catatan Perjalanan',
                background: '#e5dbc9',  // add a slightly darker shade of the stonetoss background
                padding: '15px',        // add padding around the text
                maxWidth: '100vw',      // set the max width to the viewport width
                margin: '5px auto'      // Add 5px on top and bottom and center horizontally
            }
            
            
            // apply all styles to the paragraph
            Object.assign(titleText.style, styles)
 
            // append the paragraph at the end of the comic
            document.querySelector("#comic").append(titleText)
            
        }
    }, false)
})();