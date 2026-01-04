// ==UserScript==
// @name        Replicate Cookies and LocalStorage
// @namespace   Azazar's Scripts
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @run-at      document-idle
// @license     MIT
// @version     1.1
// @description A helper script to replicate cookies and localStorage data into another browser for the opened webpage
// @downloadURL https://update.greasyfork.org/scripts/499130/Replicate%20Cookies%20and%20LocalStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/499130/Replicate%20Cookies%20and%20LocalStorage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a cookie string
    function createCookieString(name, value, domain, path, expires) {
        let cookieString = `document.cookie = "${name}=${value};`;
        if (domain) {
            cookieString += ` domain=${domain};`;
        }
        if (path) {
            cookieString += ` path=${path};`;
        }
        if (expires) {
            cookieString += ` expires=${expires.toUTCString()};`;
        }
        cookieString += '";';
        return cookieString;
    }

    // Function to extract a specific attribute from the cookie string
    function getCookieAttribute(cookie, attribute) {
        const regex = new RegExp(`${attribute}=([^;]+)`);
        const match = cookie.match(regex);
        return match ? match[1] : null;
    }

    // Function to generate the script for setting cookies and localStorage
    function generateScript() {
        // Get all cookies
        const cookies = document.cookie.split('; ');

        // Generate the JavaScript code for setting cookies
        let cookieScript = '';
        cookies.forEach(cookie => {
            const [nameValue, ...attributes] = cookie.split(';').map(attr => attr.trim());
            const [name, value] = nameValue.split('=');
            const domain = getCookieAttribute(attributes.join(';'), 'domain');
            const path = getCookieAttribute(attributes.join(';'), 'path');
            const expires = getCookieAttribute(attributes.join(';'), 'expires') ? new Date(getCookieAttribute(attributes.join(';'), 'expires')) : null;

            if (name && value !== undefined) {
                cookieScript += createCookieString(name, value, domain, path, expires) + '\n';
            }
        });

        // Get all localStorage items
        let localStorageScript = '';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            localStorageScript += `localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)});\n`;
        }

        // Combine cookie and localStorage scripts
        return cookieScript + localStorageScript;
    }

    // Function to open a new tab with the script
    function openScriptTab() {
        const completeScript = generateScript();

        // Create a new HTML document with the generated script
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Replicate Cookies and LocalStorage</title>
    <link rel="stylesheet" href="https://unpkg.com/mvp.css">
    <style>
        #message {
            visibility: hidden;
            min-width: 250px;
            margin-left: -125px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            padding: 16px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            font-size: 17px;
        }
        #message.show {
            visibility: visible;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }
        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }
        @keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
    </style>
</head>
<body>
    <main>
        <h1>Replicate Cookies and LocalStorage</h1>
        <p>Copy the following script and paste it into the console of another browser to set cookies and localStorage items.</p>
        <pre><code id="scriptCode">${completeScript}</code></pre>
        <button id="copyButton">Copy to Clipboard</button>
        <div id="message">Script copied to clipboard!</div>
    </main>
    <script>
        document.getElementById('copyButton').addEventListener('click', () => {
            const scriptCode = document.getElementById('scriptCode').innerText;
            navigator.clipboard.writeText(scriptCode).then(() => {
                const message = document.getElementById('message');
                message.classList.add('show');
                setTimeout(() => {
                    message.classList.remove('show');
                }, 3000);
            }, err => {
                alert('Failed to copy script: ', err);
            });
        });
    </script>
</body>
</html>
        `;

        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Open a new tab with the Blob URL using GM_openInTab
        GM_openInTab(url, { active: true, insert: true });
    }

    // Function to copy the script to the clipboard
    function copyScriptToClipboard() {
        const completeScript = generateScript();
        GM_setClipboard(completeScript);
        const message = document.createElement('div');
        message.id = 'message';
        message.textContent = 'Script copied to clipboard!';
        document.body.appendChild(message);
        message.classList.add('show');
        setTimeout(() => {
            message.classList.remove('show');
            document.body.removeChild(message);
        }, 3000);
    }

    // Register the userscript commands
    GM_registerMenuCommand('Open Script Tab', openScriptTab);
    GM_registerMenuCommand('Copy Script to Clipboard', copyScriptToClipboard);

})();
