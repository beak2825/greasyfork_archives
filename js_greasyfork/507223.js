// ==UserScript==
// @name         Google Slides Advanced UI Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhances Google Slides UI with Material Design Lite, custom shapes, tools, and animations inspired by PowerPoint
// @author       You
// @match        https://docs.google.com/presentation/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507223/Google%20Slides%20Advanced%20UI%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/507223/Google%20Slides%20Advanced%20UI%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom styles
    GM_addStyle(`
        /* Make UI elements bigger and rounder */
        .docs-title-input, .docs-title-input-container, .docs-explore-button, .docs-material-button {
            font-size: 1.2em !important;
            border-radius: 8px !important;
            padding: 10px !important;
        }

        /* Increase the size of buttons and input fields */
        .docs-material-button, .docs-material-button-content {
            font-size: 1em !important;
        }

        /* Make the toolbar more ribbon-like */
        .docs-explore-button-container {
            border-radius: 12px !important;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.2) !important;
            background-color: #ffffff !important;
        }

        /* Apply Material Design Lite styles */
        .docs-slide-viewer, .docs-slide-content, .docs-slide-editor {
            border-radius: 8px !important;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1) !important;
        }

        /* Add drawing and PowerPoint-like themes */
        .docs-slide-content {
            background-color: #fafafa !important;
        }

        .docs-drawing-editor {
            border: 2px dashed #e0e0e0 !important;
            border-radius: 8px !important;
        }

        .docs-powerpoint-theme {
            background-color: #ffffff !important;
            color: #333333 !important;
            border-radius: 12px !important;
        }

        /* Add more shapes and tools */
        .docs-shape-button {
            border-radius: 50% !important;
            background-color: #eeeeee !important;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.2) !important;
            padding: 10px !important;
            margin: 5px !important;
        }

        .docs-shape-button:hover {
            background-color: #dddddd !important;
            cursor: pointer;
        }

        /* Animations for shape and tool interactions */
        .docs-shape-button, .docs-material-button {
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .docs-shape-button:active, .docs-material-button:active {
            transform: scale(0.95);
        }

        /* Style for additional tool panels */
        .docs-tool-panel {
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.1) !important;
            background-color: #ffffff !important;
            padding: 10px !important;
            margin: 10px !important;
        }

        /* Add specific shapes for the drawing tools */
        .docs-drawing-rectangle {
            border: 2px solid #009688 !important;
            border-radius: 4px !important;
        }

        .docs-drawing-circle {
            border: 2px solid #009688 !important;
            border-radius: 50% !important;
        }

        .docs-drawing-line {
            border-top: 2px solid #009688 !important;
            width: 100% !important;
        }
    `);

    // Add custom JavaScript for advanced functionality
    function addCustomTools() {
        // Add additional shapes or tools to the toolbar or interface
        // This could involve injecting additional HTML/CSS/JS
        console.log('Custom tools and shapes can be added here.');
    }

    // Initialize custom tools after the page loads
    window.addEventListener('load', addCustomTools);
})();
