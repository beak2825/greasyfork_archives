// ==UserScript==
// @name         ChatGPT UI Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhance ChatGPT.com UI with modern elements, headers, footers, and icons
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512047/ChatGPT%20UI%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/512047/ChatGPT%20UI%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    GM_addStyle(`
        /* Header Style */
        #custom-header {
            background-color: #4A4A4A;
            color: #ffffff;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        /* Footer Style */
        #custom-footer {
            background-color: #4A4A4A;
            color: #ffffff;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            position: relative;
            z-index: 1000;
        }

        /* Sidebar Icons */
        .sidebar-icon {
            width: 20px;
            height: 20px;
            margin: 0 8px;
            vertical-align: middle;
        }

        /* Chat Container */
        .chat-container {
            max-height: none !important; /* Remove height restriction */
            height: auto !important; /* Ensure chat can expand */
            padding: 15px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* Update chat bubbles */
        .chat-bubble {
            max-width: 90% !important;
            padding: 15px !important;
            border-radius: 12px !important;
            margin: 10px 0 !important;
        }

        /* Modernize Input Field */
        .input-field {
            border-radius: 20px !important;
            padding: 10px !important;
            border: 1px solid #ccc;
        }

        /* General UI Modernization */
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }

        /* Main chat window */
        .main-chat-window {
            margin: 20px auto;
            max-width: 800px;
            padding: 10px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    `);

    // Create Header
    const header = document.createElement('div');
    header.id = 'custom-header';
    header.innerHTML = '<h1>ChatGPT Enhanced</h1>';
    document.body.prepend(header);

    // Create Footer
    const footer = document.createElement('div');
    footer.id = 'custom-footer';
    footer.innerHTML = '<p>ChatGPT Enhancement Script - 2024</p>';
    document.body.appendChild(footer);

    // Function to add icons to the sidebar
    function addIconsToSidebar() {
        const sidebar = document.querySelector('.sidebar'); // Adjust selector based on actual sidebar class
        if (sidebar) {
            const icons = ['🔍', '💬', '⚙️']; // Sample icons
            sidebar.innerHTML += icons.map(icon => `<span class="sidebar-icon">${icon}</span>`).join('');
        }
    }

    // Call the function to add icons
    addIconsToSidebar();

})();
