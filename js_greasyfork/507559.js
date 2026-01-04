// ==UserScript==
// @name         Panzoid Modern UI and Enhancements
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Modernize Panzoid UI and enhance features
// @author       You
// @match        https://panzoid.com/tools/clipmaker
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507559/Panzoid%20Modern%20UI%20and%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/507559/Panzoid%20Modern%20UI%20and%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply Material Design Lite-inspired styles using CSS
    GM_addStyle(`
        /* Modern Material Design-inspired UI */
        body, .app-header, .menu-bar, .side-bar, .tab-content, .tool-section {
            font-family: 'Roboto', sans-serif !important;
            background-color: #F5F5F5 !important;
            color: #212121 !important;
        }

        .menu-bar button, .side-bar button, .tab-content button, .tool-section button {
            background-color: #ffffff !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
            padding: 10px 15px !important;
            margin: 10px !important;
            font-size: 14px !important;
            color: #6200EE !important;
            border: none !important;
        }

        .menu-bar button:hover, .side-bar button:hover, .tab-content button:hover {
            background-color: #E3F2FD !important;
            color: #1A73E8 !important;
        }

        .tool-section, .tab-content {
            border-radius: 12px !important;
            padding: 15px !important;
            margin: 15px !important;
        }

        /* Rounded inputs */
        input, select, textarea {
            border-radius: 8px !important;
            border: 1px solid #BDBDBD !important;
            padding: 8px !important;
            font-size: 14px !important;
        }

        /* Custom Objects Tab */
        .tab-custom-objects .object-options {
            padding: 15px !important;
            display: flex;
            flex-wrap: wrap;
        }

        .object-options button {
            margin-right: 10px !important;
            margin-bottom: 10px !important;
        }

        /* Remove "Try Gen 4" button */
        .try-gen4-btn {
            display: none !important;
        }
    `);

    // Replace "Try Gen 4" with "LOG OUT"
    let tryGen4Btn = document.querySelector('.try-gen4-btn');
    if (tryGen4Btn) {
        tryGen4Btn.textContent = 'LOG OUT';
        tryGen4Btn.classList.remove('try-gen4-btn');
        tryGen4Btn.classList.add('logout-btn');
    }

    // Add new 3D model types in the Custom Objects tab
    const addCustom3DModels = () => {
        let customObjectsTab = document.querySelector('.tab-custom-objects');
        if (customObjectsTab) {
            let modelOptions = `
                <button>FBX</button>
                <button>DAE</button>
                <button>BLENDER</button>
                <button>More 3D Models</button>
            `;
            customObjectsTab.innerHTML += modelOptions;
        }
    };

    // Add 3D/2D shapes like Heart, Star, etc.
    const addShapes = () => {
        let customObjectsTab = document.querySelector('.tab-custom-objects');
        if (customObjectsTab) {
            let shapeOptions = `
                <button>Heart</button>
                <button>Star</button>
            `;
            customObjectsTab.innerHTML += shapeOptions;
        }
    };

    // Load the modifications after the page is fully loaded
    window.addEventListener('load', function() {
        addCustom3DModels();
        addShapes();
    });

})();
