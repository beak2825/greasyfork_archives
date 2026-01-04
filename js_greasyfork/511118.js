// ==UserScript==
// @name         Shadow V1
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds shadows and changes up the website a bit
// @author       raws_robert
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511118/Shadow%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/511118/Shadow%20V1.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Add custom CSS to the webpage
GM_addStyle(`
    /* Compact Dark Mode and Rounded Corners */

    * {
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }


        body {
            background-color: #333;
            color: #fff;
            font-family: Arial, sans-serif;
        }

        a {
            color: #66d9ef;
            text-decoration: none;
        }

        a:hover {
            color: #fff;
        }

        button, input[type="button"], input[type="submit"] {
            background-color: #444;
            border: 1px solid #555;
            color: #fff;
            cursor: pointer;
            padding: 5px 10px;
            height: 25px;
        }

        button:hover, input[type="button"]:hover, input[type="submit"]:hover {
            background-color: #555;
        }

        input[type="text"], input[type="password"], textarea {
            background-color: #444;
            border: 1px solid #555;
            color: #fff;
            padding: 5px;
        }

        input[type="text"]:focus, input[type="password"]:focus, textarea:focus {
            background-color: #555;
        }

        select {
            background-color: #444;
            border: 1px solid #555;
            color: #fff;
            padding: 5px;
        }

        select:focus {
            background-color: #555;
        }

        option {
            background-color: #444;
            color: #fff;
        }

        option:hover {
            background-color: #555;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #555;
            padding: 5px;
            text-align: left;
        }

        th {
            background-color: #444;
            color: #fff;
        }

        td {
            background-color: #333;
            color: #fff;
        }

        td:hover {
            background-color: #444;
        }

        /* Compact Mode Styles */

        .rbx-body {
            background-color: #333;
            opacity: 0.9;
        }

        .rbx-header {
            background-color: #444;
            color: #fff;
            opacity: 0.9;
            padding: 5px;
        }

        .rbx-navbar {
            background-color: #444;
            color: #fff;
            opacity: 0.9;
            padding: 5px;
        }

        .rbx-navbar li {
            border-bottom: 1px solid #555;
            padding: 5px;
        }

        .rbx-navbar li:hover {
            background-color: #555;
        }

        .rbx-navbar a {
            color: #66d9ef;
        }

        .rbx-navbar a:hover {
            color: #fff;
        }

        .rbx-footer {
            background-color: #444;
            color: #fff;
            opacity: 0.9;
            padding: 5px;
        }

        /* Compact Mode Box Styles */

        .box, .container, .panel {
            background-color: #444;
            border: 1px solid #555;
            padding: 5px;
            opacity: 0.9;
        }

        .box:hover, .container:hover, .panel:hover {
            background-color: #555;
        }
    `);
})();