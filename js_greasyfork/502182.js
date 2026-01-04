// ==UserScript==
// @name         1_Send Page HTML to Flask Server
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send current page HTML to Flask server
// @author       Something begins
// @license      none
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502182/1_Send%20Page%20HTML%20to%20Flask%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/502182/1_Send%20Page%20HTML%20to%20Flask%20Server.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    let button = document.createElement('button');
    button.innerHTML = 'Send HTML to Flask';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Add click event to the button
    button.addEventListener('click', () => {
        let pageHTML = document.documentElement.outerHTML;

        fetch('https://alexdiscordbot.eu.pythonanywhere.com/save_html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: pageHTML }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert('Page HTML sent to Flask server');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send HTML to Flask server');
        });
    });
})();
