// ==UserScript==
// @name         asp
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a custom button and sends data to a server using fetch API with extra permissions.
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        none
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/533132/asp.user.js
// @updateURL https://update.greasyfork.org/scripts/533132/asp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'custom-tm-xpath-button';

    // Create and inject the button
    function createButton() {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = 'Soundpad';
        button.style.marginLeft = '10px';
        button.style.padding = '6px 12px';
        button.style.fontSize = '14px';
        button.style.border = 'none';
        button.style.backgroundColor = '#272727';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.fontFamily = '"Roboto","Arial",sans-serif';
        button.style.fontWeight = 500;
        button.style.borderRadius = '99999px';
        button.onclick = () => sendDataToServer(window.location.href); // Send current video URL
        return button;
    }

    // Function to send data to the server using fetch
    function sendDataToServer(videoUrl) {
        fetch('http://localhost:8955/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Response from server:', data);
        })
        .catch(error => {
            console.error('Error sending data to server:', error);
        });
    }

    // Inject custom styles
    function injectStyles() {
        const styles = `
            #${BUTTON_ID}:hover {
                background-color: #3f3f3f;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // Function to inject both the button and styles
    function injectButtonAndStyles() {
        const xpath = '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-watch-metadata/div/div[2]/div[2]/div/div/ytd-menu-renderer';
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        const targetElement = result.singleNodeValue;

        if (!targetElement || document.getElementById(BUTTON_ID)) return;

        // Inject styles first
        injectStyles();

        // Inject button
        const button = createButton();
        targetElement.appendChild(button);

        console.log('[YouTubeButton] Custom button and stylesheet added to target XPath');
    }

    // Ensure the page is fully loaded before trying to inject the button and styles
    window.onload = function () {
        // First try after the window has fully loaded
        injectButtonAndStyles();

        // Fallback for dynamic page updates (SPA)
        const observer = new MutationObserver(() => {
            injectButtonAndStyles();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

})();
