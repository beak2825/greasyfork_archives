// ==UserScript==
// @name         Page Confiscation with Code Entry
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to turn the page black with a message and code entry for downloading website files.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504360/Page%20Confiscation%20with%20Code%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/504360/Page%20Confiscation%20with%20Code%20Entry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a unique code
    function generateCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate a 6-character code
    }

    // Function to start the confiscation process
    function startConfiscation() {
        // Hide the button and create the black screen with message
        document.getElementById('confiscation-button').style.display = 'none';

        // Generate a unique code
        const code = generateCode();

        document.body.innerHTML = `
            <div id="confiscation-screen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; color: green; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: monospace; text-align: center; z-index: 10000;">
                <h1>Your device has been confiscated</h1>
                <p>Enter the code to regain access:</p>
                <input type="text" id="code-input" placeholder="Enter code" style="font-size: 20px; text-align: center; margin-bottom: 10px; padding: 5px; width: 200px;">
                <button id="submit-code" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">Submit Code</button>
                <p id="code-display" style="position: absolute; top: 10px; right: 10px; color: green; font-size: 18px;">Code: ${code}</p>
            </div>
        `;

        // Function to handle code submission
        function handleCodeSubmission() {
            const inputCode = document.getElementById('code-input').value.trim();
            if (inputCode === code) {
                // Code is correct, prepare to download website data
                setTimeout(() => {
                    const htmlContent = document.documentElement.outerHTML;
                    const cssContent = Array.from(document.querySelectorAll('style')).map(style => style.innerHTML).join('\n');
                    const jsContent = Array.from(document.querySelectorAll('script')).map(script => script.innerHTML).join('\n');
                    
                    const combinedContent = `
                        <html>
                            <head>
                                <title>Saved Page</title>
                                <style>${cssContent}</style>
                            </head>
                            <body>
                                ${htmlContent}
                                <script>${jsContent}</script>
                            </body>
                        </html>
                    `;

                    const blob = new Blob([combinedContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'saved_page.html';
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 1000); // 1 second delay for download
            } else {
                alert('Incorrect code. Please try again.');
            }
        }

        // Attach event listener to the submit button
        document.getElementById('submit-code').addEventListener('click', handleCodeSubmission);
    }

    // Create and display the confiscation button
    function createConfiscationButton() {
        const button = document.createElement('button');
        button.id = 'confiscation-button';
        button.textContent = 'Confiscate Device';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#f44336'; // Red color for high visibility
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.zIndex = '9999';
        document.body.appendChild(button);

        button.addEventListener('click', startConfiscation);
    }

    // Create the button when the page loads
    window.addEventListener('load', createConfiscationButton);
})();
