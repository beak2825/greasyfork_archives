// ==UserScript==
// @name         Universal Scroll to Top Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a convenient "Scroll to Top" button to all web pages
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501403/Universal%20Scroll%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/501403/Universal%20Scroll%20to%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button
    var button = document.createElement('button');
    button.innerHTML = '↑ Top';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.fontSize = '16px';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.display = 'none'; // Initially hidden

    // Add button to body
    document.body.appendChild(button);

    // Handle click event
    button.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
})();