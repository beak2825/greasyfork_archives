// ==UserScript==
// @name         Modernize Forum Design (Dark Theme)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply dark theme with rounded corners to the forum
// @author       Falcon
// @match        https://forum.cheatengine.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529832/Modernize%20Forum%20Design%20%28Dark%20Theme%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529832/Modernize%20Forum%20Design%20%28Dark%20Theme%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Injecting dark theme CSS
    GM_addStyle(`
        /* General Body Styling */
        body {
            background-color: #121212;
            font-family: 'Arial', sans-serif;
            color: #e0e0e0;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        /* Container for all content */
        .bodyline {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1f1f1f;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Header Styling */
        header {
            background-color: #1a73e8;
            padding: 20px 0;
            color: white;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            border-radius: 12px;
        }

        header a {
            color: white;
            text-decoration: none;
        }

        header a:hover {
            text-decoration: underline;
        }

        /* Navigation Bar Styling */
        .nav {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .nav a {
            margin: 0 15px;
            color: #1a73e8;
            font-weight: 500;
            text-decoration: none;
        }

        .nav a:hover {
            color: #0c5bb6;
            text-decoration: underline;
        }

        /* Forum List Styling */
        .forumline {
            background-color: #2c2c2c;
            border-radius: 12px;
            overflow: hidden;
            margin-top: 20px;
            border: 1px solid #444;
        }

        .forumline th {
            background-color: #1a73e8;
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: 600;
            text-align: left;
        }

        .forumline td {
            padding: 12px 15px;
            border-bottom: 1px solid #444;
            font-size: 13px;
        }

        .forumline td a {
            color: #1a73e8;
            text-decoration: none;
        }

        .forumline td a:hover {
            text-decoration: underline;
        }

        /* Post Styling */
        .postbody {
            padding: 20px;
            background-color: #333;
            border: 1px solid #444;
            border-radius: 12px;
            margin-top: 15px;
            font-size: 14px;
            line-height: 1.8;
        }

        /* Quote and Code Block Styling */
        .code, .quote {
            background-color: #2a2a2a;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 10px;
            font-family: 'Courier New', Courier, monospace;
            color: #c6c6c6;
        }

        /* Buttons Styling */
        input[type="submit"], .button, .liteoption {
            background-color: #1a73e8;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        input[type="submit"]:hover, .button:hover, .liteoption:hover {
            background-color: #0c5bb6;
        }

        input[type="submit"]:focus, .button:focus, .liteoption:focus {
            outline: none;
        }

        /* Form Inputs */
        input, textarea, select {
            width: 100%;
            padding: 12px;
            margin-top: 5px;
            border: 1px solid #444;
            border-radius: 8px;
            background-color: #2c2c2c;
            color: #e0e0e0;
            font-size: 14px;
        }

        /* Forum Categories */
        .cattitle {
            color: #1a73e8;
            font-weight: bold;
            font-size: 16px;
            text-transform: uppercase;
        }

        .cattitle a {
            color: #1a73e8;
            text-decoration: none;
        }

        .cattitle a:hover {
            color: #0c5bb6;
            text-decoration: underline;
        }

        /* Footer and Copyright */
        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
        }

        footer a {
            color: #777;
            text-decoration: none;
        }

        footer a:hover {
            color: #e0e0e0;
            text-decoration: underline;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #1a73e8;
            border-radius: 8px;
        }

        ::-webkit-scrollbar-track {
            background-color: #121212;
        }

        /* Responsive Design for Mobile Devices */
        @media (max-width: 768px) {
            .bodyline {
                padding: 15px;
            }

            .nav {
                flex-direction: column;
                align-items: center;
            }

            .forumline {
                margin-top: 10px;
            }
        }
    `);
})();
