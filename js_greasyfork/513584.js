// ==UserScript==
// @name         Inject Style to Show Hidden Element
// @version      1.0
// @author       ArVam
// @description  Show the hidden paginator on the page
// @license      MIT
// @namespace    -
// @match        https://xx.knit.bid/article/*
// @icon         https://xx.knit.bid/static/imeizi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513584/Inject%20Style%20to%20Show%20Hidden%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/513584/Inject%20Style%20to%20Show%20Hidden%20Element.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Log to confirm the Userscript is running
    console.log('Userscript is running!');
    // Function to create and append the style element
    function addStyleElement() {
        console.log('Adding style element');
        // Create a new <style> element
        var style = document.createElement('style');
        style.innerHTML = '.pagination-multi { display: block !important; }';
        // Append the <style> element to the <head>
        document.head.appendChild(style);
        console.log('Style element added to head');
    }
    // Check if the document is already loaded
    if (document.readyState === 'loading') {
        // If the DOM is still loading, use DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM fully loaded and parsed');
            addStyleElement();
        });
    } else {
        // If the DOM is already loaded, run the function immediately
        console.log('Document already loaded');
        addStyleElement();
    }
})();
