// ==UserScript==
// @name         Panzoid Clipmaker Custom Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom style for Panzoid Clipmaker 3
// @author       You
// @match        https://panzoid.com/tools/gen3/clipmaker
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507557/Panzoid%20Clipmaker%20Custom%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/507557/Panzoid%20Clipmaker%20Custom%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS for Panzoid Clipmaker
    const css = `
        /* Custom Scrollbar Style */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-track {
            background-color: #222;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #555;
        }

        /* Custom background color for the container */
        #container {
            background-color: #1a1a1a !important;
        }

        /* Custom header styling */
        .header {
            background-color: #000 !important;
            color: #fff !important;
            padding: 20px;
            font-size: 18px;
        }

        /* Style for editor and preview panes */
        #panecontainer {
            display: flex;
            height: 100vh;
            background-color: #111;
        }

        #editorpane, #previewpane {
            border: 1px solid #333;
            margin: 10px;
        }

        #editorpane {
            width: 50%;
            background-color: #222;
        }

        #previewpane {
            width: 50%;
            background-color: #111;
        }

        /* Styling for canvas and preview */
        #c_main {
            width: 100%;
            height: 100%;
            background-color: #000;
        }

        /* Button customization */
        button {
            background-color: #444;
            color: #fff;
            border: none;
            padding: 10px;
            cursor: pointer;
        }

        button:hover {
            background-color: #555;
        }
    `;

    // Create a style element and inject CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // Append the style to the document head
    document.head.appendChild(style);

})();
