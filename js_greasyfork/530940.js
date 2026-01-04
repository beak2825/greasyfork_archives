// ==UserScript==
// @name         QBank Redesign for qbank.se
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Customizes the QBank interface with dark mode, removes unnecessary buttons, and hides specific elements for a cleaner and more user-friendly experience.
// @author       GhostyTongue
// @match        *://*.qbank.se/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530940/QBank%20Redesign%20for%20qbankse.user.js
// @updateURL https://update.greasyfork.org/scripts/530940/QBank%20Redesign%20for%20qbankse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            background: #f5f7fa;
            transition: background 0.3s ease, color 0.3s ease;
        }

        body.dark-mode {
            background: #121212;
            color: #fff;
        }

        header {
            background: linear-gradient(90deg, #1a73e8, #4285f4);
            padding: 20px;
            height: 80px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
        }

        header img[src*="/images/logo.png"] {
            height: 50px;
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        header img[src*="/images/logo.png"].dark-mode {
            filter: brightness(0) invert(1);
        }

        .dark-mode header {
            background: #1a1a1a;
        }

        header a[href="/selection"] {
            color: #000;
            font-weight: 500;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.9);
            transition: background 0.3s ease;
        }

        .dark-mode header a[href="/selection"] {
            color: #fff;
            background: rgba(255, 255, 255, 0.2);
        }

        .pull-right {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-left: auto;
        }

        .pull-right a {
            color: #fff;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }

        .pull-right a:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .pull-right input[type="range"] {
            width: 100px;
            accent-color: #fff;
        }

        .container {
            max-width: 1200px;
            margin: 20px auto;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            padding: 20px;
            transition: background 0.3s ease, color 0.3s ease;
        }

        .dark-mode .container {
            background: #1a1a1a;
            color: #ddd;
        }

        footer {
            display: none !important;
        }

        .addtoselection {
            display: none !important;
        }

        .default-property-id {
            display: none !important;
        }

        .dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            z-index: 1001;
            transition: background-color 0.3s ease;
        }

        .dark-mode-toggle:hover {
            background-color: #1557b0;
        }

        .dark-mode .dark-mode-toggle {
            background-color: #333;
        }

        .dark-mode .dark-mode-toggle:hover {
            background-color: #444;
        }

        .preview {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }

        .dark-mode .preview {
            background-color: #1a1a1a;
            color: #fff;
        }

        .info {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .dark-mode .info {
            background-color: #1a1a1a;
            color: #ddd;
        }

        .info dl dt, .info dl dd {
            color: inherit;
        }

        .dark-mode .info dl dt, .dark-mode .info dl dd {
            color: #ddd;
        }
    `);

    function applyDarkMode() {
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            const logo = document.querySelector('header img[src*="/images/logo.png"]');
            if (logo) logo.classList.add('dark-mode');
            toggleButton.textContent = 'Switch to Light Mode';
        } else {
            document.body.classList.remove('dark-mode');
            const logo = document.querySelector('header img[src*="/images/logo.png"]');
            if (logo) logo.classList.remove('dark-mode');
            toggleButton.textContent = 'Switch to Dark Mode';
        }
    }

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('dark-mode-toggle');
    document.body.appendChild(toggleButton);

    applyDarkMode();

    toggleButton.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            localStorage.setItem('darkMode', 'false');
        } else {
            localStorage.setItem('darkMode', 'true');
        }
        applyDarkMode();
    });
})();