// ==UserScript==
// @name         Z.ai Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dark mode for Z.ai chat platform (including splash screen)
// @author       Alf
// @match        https://chat.z.ai/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544231/Zai%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/544231/Zai%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add dark mode styles
    // This section defines CSS custom properties (variables) for the dark theme
    // and applies them to various elements of the Z.ai interface
    GM_addStyle(`
        :root {
            /* Color palette definition for dark mode */
            --bg-primary: #141618;      // Main background color
            --bg-secondary: #1a1d1f;    // Secondary background color
            --bg-tertiary: #26282a;     // Tertiary background color
            --text-primary: #e6e6e6;    // Primary text color
            --text-secondary: #b0b0b0;  // Secondary text color
            --border-color: #333333;    // Border color
            --accent-color: #4a9eff;    // Accent color for highlights
            --hover-bg: #2a2d2f;        // Background color for hover states
        }

        /* Splash Screen styles */
        // Ensures the splash screen (loading screen) uses dark background
        #splash-screen {
            background: var(--bg-primary) !important;
        }
        html.dark #splash-screen {
            background: var(--bg-primary) !important;
        }

        /* Main background and text colors */
        // Applies dark background and light text to the entire page
        body {
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }

        /* Main app container */
        // Styles the main application container
        .app {
            background-color: var(--bg-primary) !important;
        }

        /* Sidebar styles */
        // Styles the sidebar where chat history is displayed
        #sidebar {
            background-color: var(--bg-secondary) !important;
            color: var(--text-primary) !important;
        }

        /* Chat container */
        // Styles the main chat area container
        #chat-container {
            background-color: var(--bg-primary) !important;
        }

        /* Messaging area */
        // Styles the container where messages are displayed
        #messages-container {
            background-color: var(--bg-primary) !important;
        }

        /* User messages */
        // Styles messages sent by the user
        .user-message {
            background-color: var(--bg-tertiary) !important;
        }

        /* AI messages */
        // Styles messages from the AI (using a specific class selector)
        .message-1b947bb6-f02a-4677-ab4a-dbf085648cf8 {
            background-color: var(--bg-secondary) !important;
        }

        /* Input fields */
        // Styles text areas and input fields
        textarea, input {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
            border-color: var(--border-color) !important;
        }

        /* Buttons */
        // Styles all buttons on the page
        button {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
            border-color: var(--border-color) !important;
        }
        button:hover {
            background-color: var(--hover-bg) !important;
            border-radius: 16px !important;
        }

        /* Navigation */
        // Styles navigation elements
        nav {
            background-color: var(--bg-secondary) !important;
        }

        /* Model selector */
        // Styles the AI model selection button
        .modelSelectorButton {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
        }

        /* Chat list */
        // Styles the chat list menu items
        .chatItemMenu {
            background-color: var(--bg-tertiary) !important;
        }

        /* New chat button */
        // Styles the button for creating a new chat
        .siderNewChatButton {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
        }

        /* Search box */
        // Styles the chat search input
        #chat-search {
            background-color: var(--bg-tertiary) !important;
        }

        /* Dropdown menus */
        // Styles dropdown menu elements
        [data-melt-dropdown-menu-trigger=""] {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
        }

        /* Other general elements */
        // Overrides specific classes that might be setting light colors
        .bg-white {
            background-color: var(--bg-secondary) !important;
        }
        .text-gray-700 {
            color: var(--text-primary) !important;
        }
        .bg-[#F4F6F8] {
            background-color: var(--bg-primary) !important;
        }
        .dark\\:bg-[#141618] {
            background-color: var(--bg-primary) !important;
        }
        .dark\\:text-white\\/80 {
            color: var(--text-primary) !important;
        }
        .border-black\\/5 {
            border-color: var(--border-color) !important;
        }

        /* Hover effects */
        // Styles hover effects for interactive elements
        .hover-bg-color:hover {
            background-color: var(--hover-bg) !important;
        }

        /* Links */
        // Styles all links on the page
        a {
            color: var(--accent-color) !important;
        }

        /* CodeMirror editor dark mode */
        // Styles the code editor if present (used for code blocks or input)
        .ͼ3 .cm-content {
            caret-color: white !important;
            background-color: var(--bg-secondary) !important;
            color: var(--text-primary) !important;
        }
        .ͼ3 .cm-gutters {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-secondary) !important;
        }
        .ͼ3 .cm-panels {
            background-color: var(--bg-tertiary) !important;
            color: var(--text-primary) !important;
        }

        /* Markdown content */
        // Styles markdown content in messages
        .markdown-prose {
            color: var(--text-primary) !important;
        }
        .markdown-prose p {
            color: var(--text-primary) !important;
        }

        /* Scrollbar styles */
        // Customizes the scrollbar appearance to match the dark theme
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--hover-bg);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #444;
        }

        /* Splash screen animations */
        // Defines animation for the splash screen loading indicator
        @keyframes pulse {
            50% {
                opacity: 0.65;
            }
        }
        .animate-pulse-fast {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    `);

    // Activate dark mode when the page is fully loaded
    // This ensures that dark mode is applied after all elements are rendered
    window.addEventListener('load', function() {
        // Add the 'dark' class to the HTML element
        document.documentElement.classList.add('dark');

        // Change the default theme setting in localStorage
        // This helps maintain the dark mode preference across sessions
        if (localStorage) {
            localStorage.theme = 'dark';
        }

        // Update the meta theme color for mobile browsers
        // This changes the color of the browser UI on mobile devices
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#141618');
        }
    });

    // Early intervention for splash screen
    // This code runs as early as possible to ensure the splash screen appears in dark mode
    // It prevents a "flash of light theme" before the script fully loads
    if (document.readyState === 'loading') {
        // If the document is still loading, wait for DOMContentLoaded event
        document.addEventListener('DOMContentLoaded', function() {
            applyDarkModeToSplash();
        });
    } else {
        // If the document is already loaded, apply immediately
        applyDarkModeToSplash();
    }

    // Function to apply dark mode to the splash screen
    function applyDarkModeToSplash() {
        // Find the splash screen element
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            // Apply dark background to splash screen
            splashScreen.style.background = '#141618';
        }

        // Add dark mode class to HTML element
        document.documentElement.classList.add('dark');

        // Apply styles directly to HTML element
        document.documentElement.style.backgroundColor = '#141618';
        document.documentElement.style.color = '#e6e6e6';
    }
})();