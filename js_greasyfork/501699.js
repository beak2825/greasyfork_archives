// ==UserScript==
// @name         Moomoo.io Unreal Mod Welcome and Auth
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Welcome message and authentication for Unreal mod on moomoo.io
// @match        *://*.moomoo.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501699/Moomooio%20Unreal%20Mod%20Welcome%20and%20Auth.user.js
// @updateURL https://update.greasyfork.org/scripts/501699/Moomooio%20Unreal%20Mod%20Welcome%20and%20Auth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const obfuscatedUsername = [119, 97, 116].map(char => String.fromCharCode(char)).join('');
    const obfuscatedPassword = [100, 101, 118].map(char => String.fromCharCode(char)).join('');
    const obfuscatedKey = [109, 101, 103, 97].map(char => String.fromCharCode(char)).join('');

    let authenticated = false;
    let authBox, keyBox, overlay;
    let attempts = 0;
    const maxAttempts = 1;

    // Function to create and show the welcome message
    function showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.style.position = 'fixed';
        welcomeDiv.style.top = '50%';
        welcomeDiv.style.left = '50%';
        welcomeDiv.style.transform = 'translate(-50%, -50%)';
        welcomeDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        welcomeDiv.style.color = 'white';
        welcomeDiv.style.padding = '20px';
        welcomeDiv.style.borderRadius = '10px';
        welcomeDiv.style.zIndex = '9999';
        welcomeDiv.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.textContent = 'Welcome to Unreal Mod';
        welcomeDiv.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your Discord ID';
        input.style.marginBottom = '10px';
        input.style.width = '100%';
        input.style.padding = '5px';
        welcomeDiv.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Submit';
        button.style.padding = '5px 10px';
        welcomeDiv.appendChild(button);

        document.body.appendChild(welcomeDiv);

        button.addEventListener('click', function() {
            const discordId = input.value.trim();
            if (discordId) {
                console.log(`Discord status set to: Playing Unreal Mod`);
                welcomeDiv.innerHTML = `
                    <h2>Welcome to Unreal Mod!</h2>
                    <p>Made by wat, VirusterDev, and some other ppl</p>
                    <p>Please enjoy our script!</p>
                `;
                setTimeout(() => {
                    welcomeDiv.remove();
                    createAuthUI();
                }, 3000);
            } else {
                alert('Please enter your Discord ID');
            }
        });
    }

    function createAuthUI() {
        // ... (rest of the createAuthUI function remains the same)
    }

    function showSuccessMessage() {
        // ... (remains the same)
    }

    function animateShader(element, baseColor) {
        // ... (remains the same)
    }

    function checkAuthentication() {
        // ... (remains the same)
    }

    function lockScript() {
        // ... (remains the same)
    }

    // Show the welcome message when the page loads
    window.addEventListener('load', showWelcomeMessage);

    setInterval(checkAuthentication, 100);

    const observer = new MutationObserver((mutations) => {
        // ... (remains the same)
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Prevent console access and tampering
    const originalConsole = window.console;
    Object.defineProperty(window, 'console', {
        get: function() {
            return {
                log: function() {},
                warn: function() {},
                error: function() {},
                info: function() {},
                debug: function() {}
            };
        },
        set: function() {}
    });

    // Prevent tampering with the script
    Object.freeze(window.console);
    Object.freeze(window);
    Object.freeze(Document.prototype);
    Object.freeze(Element.prototype);

    // Additional security measures
    window.eval = function() { throw new Error('Eval is disabled'); };
    window.Function = function() { throw new Error('Function constructor is disabled'); };
    Object.freeze(window.eval);
    Object.freeze(window.Function);
})();