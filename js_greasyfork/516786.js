// ==UserScript==
// @name         Userscript gen
// @namespace    http://tampermonkey.net/
// @version      1
// @description  can make simple userscripts
// @author       Gosh227
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516786/Userscript%20gen.user.js
// @updateURL https://update.greasyfork.org/scripts/516786/Userscript%20gen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a simple form for userscript generation
    const formHtml = `
        <div id="script-generator" style="position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 1000;">
            <h3>Userscript Generator</h3>
            <label for="scriptName">Script Name:</label><br>
            <input type="text" id="scriptName" placeholder="Enter script name"><br>
            <label for="scriptDescription">Description:</label><br>
            <input type="text" id="scriptDescription" placeholder="Enter description"><br>
            <label for="scriptMatch">Match URL:</label><br>
            <input type="text" id="scriptMatch" placeholder="Enter match URL (e.g., https://example.com/*)"><br>
            <button id="generateScript">Generate Script</button>
            <h4>Generated Script:</h4>
            <textarea id="generatedScript" rows="10" cols="30" readonly></textarea>
        </div>
    `;

    // Append the form to the body
    document.body.insertAdjacentHTML('beforeend', formHtml);

    // Function to generate the userscript
    const generateUserscript = () => {
        const name = document.getElementById('scriptName').value;
        const description = document.getElementById('scriptDescription').value;
        const match = document.getElementById('scriptMatch').value;

        const generatedScript = `// ==User  Script==\n` +
            `// @name         ${name}\n` +
            `// @namespace    http://tampermonkey.net/\n` +
            `// @version      0.1\n` +
            `// @description  ${description}\n` +
            `// @author       Your Name\n` +
            `// @match        ${match}\n` +
            `// @grant        none\n` +
            `// ==/User  Script==\n\n` +
            `(function() {\n` +
            `    'use strict';\n\n` +
            `    // Your code here...\n` +
            `})();`;

        document.getElementById('generatedScript').value = generatedScript;
    };

    // Add event listener to the button
    document.getElementById('generateScript').addEventListener('click', generateUserscript);

})();