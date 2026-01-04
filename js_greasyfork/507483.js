// ==UserScript==
// @name         Google Drive File Access Overlay
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Overlay a password prompt when attempting to open a file in Google Drive.
// @author       Frxd
// @match        https://drive.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507483/Google%20Drive%20File%20Access%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/507483/Google%20Drive%20File%20Access%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DEFINE THE PASSWORD HERE
    const PWD = 'examplepassword';


    function injectOverlay() {
        const overlayHTML = `
            <div id="drivepass-container" class="container glass">
                <form id="drivepass-form">
                    <label for="password">Please enter the password to continue:</label>
                    <input type="password" id="password" name="password" required>
                    <button type="submit">Continue</button>
                </form>
            </div>
        `;

        const overlayCSS = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto');
            body {
                text-align: center;
            }
            .container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                height: 400px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1));
                backdrop-filter: blur(7px);
                -webkit-backdrop-filter: blur(7px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.18);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                padding: 20px;
                box-sizing: border-box;
                z-index: 10000;
            }
            #drivepass-form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            #drivepass-form label {
                font-family: "Roboto", sans-serif;
                font-weight: 575;
                margin-bottom: 10px;
                font-size: 1.3em;
                color: rgb(255, 255, 255);
            }
            #drivepass-form input[type="password"] {
                padding: 10px;
                margin-bottom: 20px;
                border: none;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                width: 100%;
                max-width: 300px;
                box-sizing: border-box;
            }
            #drivepass-form button {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                background-color: #00000070;
                color: white;
                font-size: 1em;
                cursor: pointer;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease;
            }
            #drivepass-form button:hover {
                background-color: #000000;
            }
            #overlay-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                backdrop-filter: blur(10px);
                z-index: 9999;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = overlayCSS;
        document.head.append(styleElement);

        const overlayBg = document.createElement('div');
        overlayBg.id = 'overlay-bg';
        document.body.append(overlayBg);

        const overlayElement = document.createElement('div');
        overlayElement.innerHTML = overlayHTML;
        document.body.append(overlayElement);

        document.getElementById('drivepass-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const password = document.getElementById('password').value;
            if (password === PWD) {
                overlayElement.remove();
                overlayBg.remove();
            } else {
                alert('Incorrect password!');
            }
        });
    }

    function monitorNavigation() {
        let isOverlayInjected = false;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.tagName === 'IFRAME' && node.src.includes('drive.google.com')) {
                            node.src = '';
                            if (!isOverlayInjected) {
                                injectOverlay();
                                isOverlayInjected = true;
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    monitorNavigation();
})();
