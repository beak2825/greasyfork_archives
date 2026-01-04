// ==UserScript==
// @name         Google Docs/Slides Enhanced Modern Material Design
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Apply an extended modern, rounded Material Design UI to Google Docs and Google Slides with enhanced animations and transitions
// @author       Your Name
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508184/Google%20DocsSlides%20Enhanced%20Modern%20Material%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/508184/Google%20DocsSlides%20Enhanced%20Modern%20Material%20Design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extended CSS styles for more comprehensive Material Design
    const styles = `
        /* Base Material Design styles with extended features */

        /* Rounded Corners for Containers */
        .docs-titlebar, .docs-title-input, .punch-viewer-nav-container, 
        .kix-appview, .punch-filmstrip-scrollable, .punch-viewer-body, 
        .punch-slide-thumbnail, .docs-material, .goog-control, .docs-butterbar-container {
            border-radius: 12px !important;
        }

        /* Material Design Shadows - Deeper and Subtle Shadow Layers */
        .docs-titlebar, .punch-viewer-nav-container, .kix-appview, 
        .punch-filmstrip-scrollable, .punch-slide-thumbnail, .docs-butterbar-container, 
        .goog-toolbar-button, .docs-material-button, .goog-control {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 
                        0 3px 6px rgba(0, 0, 0, 0.10);
        }

        /* Buttons with Rounded Corners and Animations */
        .goog-toolbar-button, .docs-material-button, .punch-viewer-nav-button, 
        .goog-inline-block, .docs-menu-button, .docs-butterbar-button {
            border-radius: 10px !important;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            padding: 8px 12px;
            font-weight: bold;
        }

        /* Smooth hover animations for buttons */
        .goog-toolbar-button:hover, .docs-material-button:hover, 
        .punch-viewer-nav-button:hover, .docs-butterbar-button:hover {
            background-color: rgba(0, 0, 0, 0.08) !important;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18), 
                        0 4px 8px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }

        /* Active state with Material design press effect */
        .goog-toolbar-button:active, .docs-material-button:active, 
        .punch-viewer-nav-button:active, .docs-butterbar-button:active {
            background-color: rgba(0, 0, 0, 0.15) !important;
            transform: translateY(0);
        }

        /* Rounded Input Fields with Padding */
        .docs-title-input, .docs-text-input, .kix-cursor-caret, 
        .punch-filmstrip-scrollable, .goog-inline-block {
            border-radius: 10px !important;
            padding: 12px 16px;
            font-size: 14px;
            font-family: 'Roboto', sans-serif !important;
        }

        /* Adding smooth focus transitions to input fields */
        .docs-title-input:focus, .docs-text-input:focus {
            border-color: #6200EE !important;
            box-shadow: 0 4px 8px rgba(98, 0, 238, 0.3) !important;
        }

        /* General rounded and padded containers */
        .kix-appview, .punch-viewer-nav-container, 
        .punch-slide-thumbnail-container, .punch-viewer-body, 
        .docs-butterbar-container {
            border-radius: 16px !important;
            padding: 12px;
        }

        /* Animation Transitions for all elements */
        * {
            transition: all 0.4s ease-in-out;
        }

        /* Material Design Color Scheme */
        body, .docs-titlebar, .punch-viewer-nav-container, 
        .kix-appview, .punch-slide-thumbnail {
            background-color: #FAFAFA !important;
            color: #212121 !important;
        }

        /* Accent colors for Material Design */
        .docs-titlebar, .docs-menu-button, .goog-toolbar-button, 
        .punch-viewer-nav-button, .docs-material-button {
            background-color: #6200EE !important;
            color: white !important;
        }

        /* Hover state with accent colors */
        .docs-menu-button:hover, .goog-toolbar-button:hover, 
        .punch-viewer-nav-button:hover, .docs-material-button:hover {
            background-color: #3700B3 !important;
        }

        /* Smooth Color Transition Effects */
        .docs-menu-button, .goog-toolbar-button, .docs-butterbar-button, 
        .docs-material-button, .punch-viewer-nav-button {
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Focused button states */
        .docs-menu-button:focus, .goog-toolbar-button:focus, 
        .punch-viewer-nav-button:focus, .docs-material-button:focus {
            box-shadow: 0 0 10px rgba(98, 0, 238, 0.5) !important;
            outline: none;
        }

        /* Font settings with modern typography */
        body, .goog-toolbar-button, .docs-material-button, 
        .docs-title-input, .punch-slide-thumbnail {
            font-family: 'Roboto', sans-serif !important;
            font-size: 16px;
            letter-spacing: 0.5px;
        }

        /* Applying rounded edges to document content containers */
        .kix-appview, .docs-editor-container, .docs-material, 
        .docs-butterbar-container, .punch-viewer-body {
            border-radius: 16px !important;
            margin: 12px;
        }

        /* Enhanced hover and focus state animations */
        .docs-butterbar-container:hover, .punch-viewer-nav-container:hover, 
        .kix-appview:hover, .docs-titlebar:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 
                        0 6px 10px rgba(0, 0, 0, 0.10);
            transform: translateY(-2px);
        }

        /* Smooth scrollbars with rounded edges */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(98, 0, 238, 0.6);
            border-radius: 10px;
            border: 2px solid #FAFAFA;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(98, 0, 238, 0.8);
        }
        ::-webkit-scrollbar-track {
            background-color: #E0E0E0;
            border-radius: 10px;
        }

    `;

    // Append the extended styles to the document head
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
})();
