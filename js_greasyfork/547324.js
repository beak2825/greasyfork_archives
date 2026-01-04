// ==UserScript==

// @name         Koray.io Skin Mod

// @namespace    http://tampermonkey.net/

// @version      1.7

// @description  Custom Skins for Koray.io - Direct Skin Editor Integration

// @author       Koray

// @match        http://agar.io/*

// @match        https://agar.io/*

// @match        http://*.agar.io/*

// @match        https://*.agar.io/*

// @grant        GM_addStyle

// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/547324/Korayio%20Skin%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/547324/Korayio%20Skin%20Mod.meta.js
// ==/UserScript==

(function() {

    'use strict';



    // Variables

    let skinEditorInterval = null;

    let isEditorConnected = false;



    // Wait for page to load completely

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        setTimeout(init, 2000);

    }



    function init() {

        replaceAgarText();

        createSkinUploadUI();

        integrateWithSkinEditor();

    }



    // Replace all Agar.io text with Koray.io

    function replaceAgarText() {

        try {

            // Change page title

            if (document.title && document.title.includes('Agar.io')) {

                document.title = document.title.replace(/Agar\.io/gi, 'Koray.io');

            }

        } catch (e) {

            console.log('Text replacement error:', e);

        }

    }



    // Integration with skin editor

    function integrateWithSkinEditor() {

        // Wait for skin editor to load

        skinEditorInterval = setInterval(() => {

            const skinEditor = findSkinEditor();

            if (skinEditor) {

                clearInterval(skinEditorInterval);

                isEditorConnected = true;

                setupSkinEditorIntegration(skinEditor);

            }

        }, 1000);

    }



    // Find skin editor

    function findSkinEditor() {

        // Search for various skin editor elements

        const possibleSelectors = [

            '.skin-editor',

            '.editor-container',

            '#skinEditor',

            '[class*="skin"] [class*="editor"]',

            '[class*="draw"]',

            '.canvas-container',

            'canvas'

        ];



        for (const selector of possibleSelectors) {

            const elements = document.querySelectorAll(selector);

            if (elements.length > 0) {

                for (const element of elements) {

                    if (element.width && element.height && element.width > 50 && element.height > 50) {

                        return element;

                    }

                }

            }

        }



        return null;

    }



    // Setup skin editor integration

    function setupSkinEditorIntegration(skinEditor) {

        try {

            // Load existing skin data

            loadSkinData();



            updateStatus("Skin editor connected", false);



            // Apply saved skin if exists

            const savedSkin = localStorage.getItem("koray_custom_skin");

            const savedBorderColor = localStorage.getItem("koray_border_color") || "#4da6ff";



            if (savedSkin) {

                applySkinToEditor(savedSkin, savedBorderColor);

            }

        } catch (e) {

            console.log('Editor integration error:', e);

            updateStatus("Editor connection error", true);

        }

    }



    // Load skin data

    function loadSkinData() {

        const borderColor = localStorage.getItem("koray_border_color");

        if (borderColor && document.getElementById('borderColorPicker')) {

            document.getElementById('borderColorPicker').value = borderColor;

        }

    }



    // Add custom CSS styles

    GM_addStyle(`

        #skinUploadContainer {

            position: fixed;

            top: 10px;

            right: 10px;

            background: rgba(0, 0, 0, 0.95);

            padding: 15px;

            border-radius: 8px;

            z-index: 9999;

            color: white;

            width: 320px;

            box-shadow: 0 0 15px rgba(0, 100, 255, 0.7);

            border: 1px solid #333;

            font-family: Arial, sans-serif;

        }



        #skinUploadContainer h3 {

            margin-top: 0;

            color: #4da6ff;

            text-align: center;

            border-bottom: 2px solid #4da6ff;

            padding-bottom: 10px;

            font-size: 18px;

            text-transform: uppercase;

            letter-spacing: 1px;

        }



        .skin-control {

            margin: 12px 0;

        }



        .skin-control label {

            display: block;

            margin-bottom: 6px;

            font-weight: bold;

            color: #4da6ff;

        }



        #skinImagePreview {

            width: 120px;

            height: 120px;

            border: 3px solid #4da6ff;

            margin: 12px auto;

            display: block;

            background-size: cover;

            border-radius: 50%;

            background-color: #222;

            box-shadow: 0 0 10px rgba(0, 100, 255, 0.5);

        }



        .upload-btn-wrapper {

            position: relative;

            overflow: hidden;

            display: inline-block;

            width: 100%;

        }



        .upload-btn-wrapper input[type=file] {

            position: absolute;

            left: 0;

            top: 0;

            opacity: 0;

            width: 100%;

            height: 100%;

            cursor: pointer;

        }



        #uploadButton {

            background: #4da6ff;

            color: white;

            border: none;

            padding: 10px 15px;

            border-radius: 5px;

            cursor: pointer;

            width: 100%;

            font-weight: bold;

            margin-top: 5px;

            text-align: center;

            display: block;

            transition: all 0.3s;

        }



        #uploadButton:hover {

            background: #3d8be0;

            transform: translateY(-2px);

            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

        }



        #saveButton {

            background: #4caf50;

            color: white;

            border: none;

            padding: 12px 15px;

            border-radius: 5px;

            cursor: pointer;

            width: 100%;

            font-weight: bold;

            margin-top: 15px;

            transition: all 0.3s;

            font-size: 16px;

            text-transform: uppercase;

            letter-spacing: 1px;

        }



        #saveButton:hover {

            background: #3d9c40;

            transform: translateY(-2px);

            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

        }



        #borderColorPicker {

            width: 100%;

            height: 40px;

            border: 2px solid #4da6ff;

            border-radius: 5px;

            cursor: pointer;

            padding: 0;

            margin: 0;

            background: #222;

        }



        .border-width-control {

            display: flex;

            align-items: center;

            margin-top: 10px;

        }



        .border-width-control label {

            margin-right: 10px;

            margin-bottom: 0;

        }



        #borderWidth {

            width: 60px;

            background: #222;

            color: white;

            border: 1px solid #444;

            border-radius: 3px;

            padding: 5px;

        }



        .size-info {

            font-size: 12px;

            color: #aaa;

            text-align: center;

            margin-top: 8px;

            font-style: italic;

        }



        .status-message {

            text-align: center;

            margin-top: 10px;

            font-size: 13px;

            color: #4da6ff;

            font-weight: bold;

        }



        .login-required {

            color: #ff5555;

            font-weight: bold;

        }



        .connecting {

            color: #ff9900;

            animation: pulse 1.5s infinite;

        }



        .success {

            color: #4caf50;

        }



        @keyframes pulse {

            0% { opacity: 1; }

            50% { opacity: 0.6; }

            100% { opacity: 1; }

        }



        .editor-status {

            display: flex;

            align-items: center;

            justify-content: center;

            margin-top: 10px;

        }



        .status-indicator {

            width: 10px;

            height: 10px;

            border-radius: 50%;

            margin-right: 8px;

        }



        .connected {

            background-color: #4caf50;

        }



        .disconnected {

            background-color: #ff5555;

        }



        .connecting-indicator {

            background-color: #ff9900;

            animation: pulse 1.5s infinite;

        }

    `);



    // Create skin upload UI

    function createSkinUploadUI() {

        if (document.getElementById('skinUploadContainer')) {

            return;

        }



        const container = document.createElement('div');

        container.id = 'skinUploadContainer';



        container.innerHTML = `

            <h3>Koray.io Skin Mod</h3>



            <div class="editor-status">

                <div id="statusIndicator" class="status-indicator connecting-indicator"></div>

                <div id="editorStatus">Connecting to editor...</div>

            </div>



            <div class="skin-control">

                <label for="skinUpload">Upload Image (512x512, 0-500KB):</label>

                <div class="upload-btn-wrapper">

                    <button id="uploadButton">Upload Image</button>

                    <input type="file" id="skinUpload" accept="image/*">

                </div>

                <div class="size-info">Max: 512x512px, 500KB</div>

            </div>



            <div id="skinImagePreview"></div>



            <div class="skin-control">

                <label for="borderColorPicker">Border Color:</label>

                <input type="color" id="borderColorPicker" value="#4da6ff">

            </div>



            <div class="skin-control border-width-control">

                <label for="borderWidth">Border Width:</label>

                <input type="number" id="borderWidth" value="4" min="1" max="20">

            </div>



            <button id="saveButton">Apply to Editor</button>



            <div id="statusMessage" class="status-message">Please upload an image first</div>

        `;



        document.body.appendChild(container);



        // Upload button functionality

        document.getElementById('uploadButton').addEventListener('click', function() {

            document.getElementById('skinUpload').click();

        });



        // Preview when file is selected

        document.getElementById('skinUpload').addEventListener('change', function(e) {

            const file = e.target.files[0];

            if (!file) return;



            if (file.size > 500 * 1024) {

                alert('File size must be less than 500KB');

                return;

            }



            const reader = new FileReader();

            reader.onload = function(e) {

                const img = new Image();

                img.onload = function() {

                    if (img.width > 512 || img.height > 512) {

                        alert('Image dimensions must be 512x512 pixels or smaller');

                        return;

                    }



                    const preview = document.getElementById('skinImagePreview');

                    preview.style.backgroundImage = `url(${e.target.result})`;

                    preview.setAttribute('data-skin-url', e.target.result);



                    updateStatus("Image uploaded! Click apply to apply to editor.", false);

                };

                img.src = e.target.result;

            };

            reader.readAsDataURL(file);

        });



        // Save button functionality

        document.getElementById('saveButton').addEventListener('click', function() {

            const preview = document.getElementById('skinImagePreview');

            const skinUrl = preview.getAttribute('data-skin-url');

            const borderColor = document.getElementById('borderColorPicker').value;

            const borderWidth = parseInt(document.getElementById('borderWidth').value) || 4;



            if (!skinUrl) {

                alert('Please upload an image first');

                return;

            }



            // Save skin data

            localStorage.setItem("koray_custom_skin", skinUrl);

            localStorage.setItem("koray_border_color", borderColor);

            localStorage.setItem("koray_border_width", borderWidth);



            // Apply to editor

            applySkinToEditor(skinUrl, borderColor, borderWidth);

        });

    }



    // Apply skin to editor

    function applySkinToEditor(skinUrl, borderColor, borderWidth = 4) {

        updateStatus("Applying to editor...", false);



        try {

            // First load the image

            const img = new Image();

            img.onload = function() {

                // Find canvas elements

                const canvases = document.querySelectorAll('canvas');

                let canvasFound = false;



                for (const canvas of canvases) {

                    try {

                        // Check if this is a skin canvas

                        if (canvas.width < 50 || canvas.height < 50) continue;



                        // Clear canvas

                        const context = canvas.getContext('2d');

                        context.clearRect(0, 0, canvas.width, canvas.height);



                        // Draw image

                        context.drawImage(img, 0, 0, canvas.width, canvas.height);



                        // Draw border

                        context.strokeStyle = borderColor;

                        context.lineWidth = borderWidth;

                        context.strokeRect(

                            borderWidth/2,

                            borderWidth/2,

                            canvas.width - borderWidth,

                            canvas.height - borderWidth

                        );



                        canvasFound = true;

                    } catch (e) {

                        console.log('Canvas processing error:', e);

                    }

                }



                if (canvasFound) {

                    updateStatus("Skin applied to editor!", false);

                    updateEditorStatus(true);



                    // Trigger saving changes

                    triggerSave();

                } else {

                    updateStatus("Canvas not found, trying alternative method...", true);

                    tryAlternativeApply(skinUrl, borderColor, borderWidth);

                }

            };

            img.src = skinUrl;

        } catch (e) {

            console.log('Editor application error:', e);

            updateStatus("Error occurred, trying alternative method...", true);

            tryAlternativeApply(skinUrl, borderColor, borderWidth);

        }

    }



    // Trigger save

    function triggerSave() {

        // Find and click save buttons

        const saveButtons = document.querySelectorAll('button, input[type="button"]');

        for (const button of saveButtons) {

            const buttonText = button.textContent || button.value || '';

            if (buttonText.toLowerCase().includes('save') ||

                buttonText.toLowerCase().includes('kaydet') ||

                buttonText.toLowerCase().includes('apply')) {

                button.click();

                break;

            }

        }

    }



    // Alternative application method

    function tryAlternativeApply(skinUrl, borderColor, borderWidth) {

        // Try to convert Base64 data directly to skin data

        try {

            // Save to localStorage

            localStorage.setItem("koray_custom_skin", skinUrl);

            localStorage.setItem("koray_border_color", borderColor);

            localStorage.setItem("koray_border_width", borderWidth);



            updateStatus("Skin data saved. Refresh page to see changes.", false);



            // Reload page

            setTimeout(() => {

                if (confirm("Skin applied. Reload page?")) {

                    location.reload();

                }

            }, 1000);

        } catch (e) {

            console.log('Alternative application error:', e);

            updateStatus("Skin could not be applied", true);

        }

    }



    // Update status message

    function updateStatus(message, isError = false) {

        const statusElement = document.getElementById('statusMessage');

        if (statusElement) {

            statusElement.textContent = message;

            statusElement.className = isError ? 'status-message login-required' : 'status-message success';

        }

    }



    // Update editor connection status

    function updateEditorStatus(connected) {

        const statusIndicator = document.getElementById('statusIndicator');

        const editorStatus = document.getElementById('editorStatus');



        if (statusIndicator && editorStatus) {

            if (connected) {

                statusIndicator.className = 'status-indicator connected';

                editorStatus.textContent = 'Editor connected';

                editorStatus.style.color = '#4caf50';

            } else {

                statusIndicator.className = 'status-indicator disconnected';

                editorStatus.textContent = 'Editor not found';

                editorStatus.style.color = '#ff5555';

            }

        }

    }

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-08-26
// @description  try to take over the world!
// @author       You
// @match        https://agar.io/#ffa
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agar.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();