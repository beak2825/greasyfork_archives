// ==UserScript==
// @name         GreasyFork Modern Light 2024
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom style for GreasyFork with modern light theme, rounded corners, and animations
// @author       Your Name
// @match        *://greasyfork.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505459/GreasyFork%20Modern%20Light%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/505459/GreasyFork%20Modern%20Light%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        body {
            background-color: #f5f5f5;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            transition: background-color 0.3s, color 0.3s;
        }

        .header {
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 0 0 10px 10px;
            transition: background-color 0.3s;
        }

        .header a {
            color: #333;
            transition: color 0.3s;
        }

        .header a:hover {
            color: #007bff;
        }

        .content {
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: box-shadow 0.3s, background-color 0.3s;
        }

        .content:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .footer {
            background-color: #ffffff;
            border-top: 1px solid #e0e0e0;
            border-radius: 10px 10px 0 0;
            transition: background-color 0.3s;
        }

        .button {
            background-color: #007bff;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }

        .button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }

        .button:active {
            background-color: #003d80;
            transform: scale(1);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);
})();
