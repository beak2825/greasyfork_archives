// ==UserScript==
// @name         RSS: Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Add buttons to the top of the webpage to redirect to specific URLs
// @author       You
// @match        http://192.168.1.2:1030/*
// @match        http://192.168.1.2:887/*
// @match        https://tldr.tech/*
// @match        *://*.fidelity.com/*
// @match        https://www.bloomberg.com/*
// @match        *://www.1point3acres.com/*
// @match        *://newmitbbs.com/*
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/525794
// @downloadURL https://update.greasyfork.org/scripts/525794/RSS%3A%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/525794/RSS%3A%20Navigation%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a button
    function createButton(text, url) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '0'; // Remove padding to control size explicitly
        button.style.fontSize = '14px'; // Font size
        button.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Transparent background
        button.style.color = '#000000'; // text color
        button.style.border = 'none'; // Remove default border
        button.style.borderRadius = '5px'; // Rounded corners
        button.style.cursor = 'pointer'; // Pointer cursor on hover
        button.style.transition = 'background-color 0.2s'; // Smooth hover effect
        button.style.width = '30px'; // Fixed width
        button.style.height = '30px'; // Fixed height
        button.style.display = 'flex'; // Use flexbox to center content
        button.style.justifyContent = 'center'; // Center content horizontally
        button.style.alignItems = 'center'; // Center content vertically
        button.onclick = function() {
            if (url.startsWith("http://192.168.1.2:1030") || url.includes("youtube.com")) {
                window.location.href = url;
            } else {
                window.open(url, "_blank");
            }
        };

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#0056b3'; // Darker blue on hover
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Restore original color
        });

        return button;
    }

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';  //'absolute'
    buttonContainer.style.top = '10px'; // Position at the top
    buttonContainer.style.left = '50%'; // Center horizontally
    buttonContainer.style.transform = 'translateX(-50%)'; // Adjust for exact horizontal centering
    buttonContainer.style.zIndex = '9999'; // Ensure it's on top of other elements
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row'; // Arrange buttons in a row
    buttonContainer.style.gap = '8px'; // Equal spacing between buttons
    buttonContainer.style.whiteSpace = 'nowrap'; // Prevent wrapping
    buttonContainer.style.justifyContent = 'center'; // Center buttons horizontally
    buttonContainer.style.alignItems = 'center'; // Center buttons vertically
    buttonContainer.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Transparent background
    buttonContainer.style.padding = '5px'; // Smaller padding for the container
    buttonContainer.style.borderRadius = '20px'; // Rounded corners for the container
    buttonContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)'; // Add a subtle shadow
    buttonContainer.style.minWidth = '200px'; // Minimum width to prevent shrinking

    // Array of button configurations
    const buttons = [
        { text: '⭐️', url: 'http://192.168.1.2:1030/i/?a=normal&get=s&rid=67c89dd670506&state=7&sort=c.name&order=DESC' },
        { text: '🧑🏻‍💻', url: 'http://192.168.1.2:1030/i/?a=normal&get=c_2&sort=c.name&order=DESC' },
        { text: '💬', url: 'http://192.168.1.2:1030/i/?a=normal&get=c_7&sort=c.name&order=DESC' },
        // { text: '📣', url: 'https://newmitbbs.com' },
        // { text: '1️⃣', url: 'https://www.1point3acres.com/bbs/forum.php?mod=guide&view=hot&mobile=2' },
        { text: '❗️', url: 'http://192.168.1.2:1030/i/?a=normal&get=f_7&sort=id&order=DESC&search=大道无形我有型' },
        { text: '❄️', url: 'http://192.168.1.2:1030/i/?a=normal&get=f_7&sort=title&order=ASC' },
        { text: '📧', url: 'http://192.168.1.2:1030/i/?a=normal&get=c_4&sort=id&order=DESC' },
        { text: '🪴', url: 'https://digital.fidelity.com/prgw/digital/research/market' },
        // { text: '🅱️', url: 'https://www.bloomberg.com/latest/markets-wrap' }
        { text: '🅱️', url: 'https://www.bloomberg.com/ai' }
    ];

    // Create and append buttons using the array
    buttons.forEach(buttonConfig => {
        const button = createButton(buttonConfig.text, buttonConfig.url);
        buttonContainer.appendChild(button);
    });

    // Append the container to the body
    document.body.appendChild(buttonContainer);





    // Function to add referrerpolicy to YouTube iframes
    function updateYouTubeIframes() {
        const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
        iframes.forEach(iframe => {
            if (!iframe.hasAttribute('referrerpolicy')) {
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            }
        });
    }
    // Run initially
    updateYouTubeIframes();
    // Watch for dynamically added iframes
    const observer = new MutationObserver(() => {
        updateYouTubeIframes();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });




})();