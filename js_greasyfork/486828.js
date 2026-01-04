// ==UserScript==
// @name         IDK
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Adds a stylish button to the page that redirects you to a Rickroll link when clicked
// @author       Joshua
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486828/IDK.user.js
// @updateURL https://update.greasyfork.org/scripts/486828/IDK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToRickroll() {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }

    // Check if the current page URL is the Rickroll link
    if (window.location.href !== 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') {
        console.log('Creating button...');
        var button = document.createElement('button');
        button.textContent = 'Click here for a surprise!';
        button.style.position = 'fixed';
        button.style.bottom = '20px'; // Moved to the bottom
        button.style.right = '20px'; // Moved to the right
        button.style.zIndex = '9999';
        button.style.padding = '15px 30px';
        button.style.border = 'none';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';
        button.style.borderRadius = '10px';
        button.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.3)';
        button.style.cursor = 'pointer';
        button.style.transition = 'transform 0.2s, box-shadow 0.2s';

        button.addEventListener('mouseenter', function() {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('mouseleave', function() {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button click action
            redirectToRickroll(); // Redirect to the Rickroll link
            button.remove(); // Remove the button
        });

        console.log('Appending button to document...');
        document.body.appendChild(button);
        console.log('Button creation complete.');
    }
})();
