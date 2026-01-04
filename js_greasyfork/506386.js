// ==UserScript==
// @name         Advanced Draggable Font Changer with Language Selector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change fonts and translate text with a draggable GUI. Adjust font based on device (iPhone/iPad).
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/506386/Advanced%20Draggable%20Font%20Changer%20with%20Language%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/506386/Advanced%20Draggable%20Font%20Changer%20with%20Language%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add jQuery UI CSS
    GM_addStyle(`
        .font-changer-gui {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 300px;
            background: white;
            border: 2px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        .font-changer-gui input, .font-changer-gui select, .font-changer-gui button {
            width: 100%;
            padding: 5px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 14px;
        }
        .font-changer-gui button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
        }
        .font-changer-gui button:hover {
            background-color: #45a049;
        }
        .font-changer-header {
            cursor: move;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
    `);

    // Detect if the device is an iPhone or iPad
    function isAppleDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // Define default fonts based on the device
    const defaultFont = isAppleDevice() ? 'San Francisco' : 'Arial';

    // Create the GUI HTML
    const guiHTML = `
        <div class="font-changer-gui">
            <div class="font-changer-header">Font Changer</div>
            <textarea id="text-input" placeholder="Type or paste your text here..."></textarea>
            <select id="language-selector">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <!-- Add more languages as needed -->
            </select>
            <select id="font-selector">
                <option value="${defaultFont}">${defaultFont}</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <!-- Add more fonts as needed -->
            </select>
            <button id="translate-and-change-font">Translate & Change Font</button>
        </div>
    `;
    $('body').append(guiHTML);

    // Make the GUI draggable
    $('.font-changer-gui').draggable({
        handle: '.font-changer-header'
    });

    // Translate and change font function
    $('#translate-and-change-font').click(async function() {
        let text = $('#text-input').val();
        let language = $('#language-selector').val();
        let font = $('#font-selector').val();

        // Translate the text using an API (example using LibreTranslate)
        const translatedText = await translateText(text, language);

        // Apply the translated text and change the font
        $('#text-input').val(translatedText).css('font-family', font);
    });

    // Function to translate text
    async function translateText(text, targetLang) {
        try {
            const response = await fetch(`https://libretranslate.com/translate`, {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: "auto",
                    target: targetLang,
                    format: "text"
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            alert('Translation failed. Please try again.');
            return text;
        }
    }
})();
