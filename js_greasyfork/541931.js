// ==UserScript==
// @name         Drawaria Translator Menu Full
// @version      2.1
// @description  (I PRIVATED THIS SCRIPT REQUESTED BY PANTHER) The ultimate, conflict-free translation tool for Drawaria.online, with multi-language support and direct chat sending. Now with integrated search in language selector!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/YOUR_USER_ID_HERE_ULTIMATE // IMPORTANT: Replace with your actual Greasy Fork User ID if you publish this
// @downloadURL https://update.greasyfork.org/scripts/541931/Drawaria%20Translator%20Menu%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/541931/Drawaria%20Translator%20Menu%20Full.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Drawaria Ultimate Translator script starting...");

    // Function to create elements in a standard way
    function dtrCreateElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'style') {
                element.style.cssText = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        return element;
    }

    // Function to make an element draggable
    function dtrMakeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.dtr-header'); // Unique class for header
        if (!header) {
            console.warn("Drawaria Ultimate Translator: Draggable element has no .dtr-header to attach drag events.");
            return;
        }
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Function to translate text using Google Translate API
    function dtrTranslateText(textToTranslate, toLang, callback) {
        const url =
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
            toLang +
            "&dt=t&q=" +
            encodeURI(textToTranslate);
        const req = new XMLHttpRequest();
        req.onload = () => {
            try {
                const data = JSON.parse(req.response);
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    callback(data[0][0][0]);
                } else {
                    console.warn("Drawaria Ultimate Translator: Translation failed or returned unexpected data:", data);
                    callback("Translation failed. Check console for details.");
                }
            } catch (error) {
                console.error("Drawaria Ultimate Translator: Error parsing JSON response for translation:", error);
                callback("Error during translation. Check console for details.");
            }
        };
        req.onerror = (e) => {
            console.error("Drawaria Ultimate Translator: Network error during translation request:", e);
            callback("Network error during translation. Check console for details.");
        };
        req.open("GET", url);
        req.send();
    }

    // Function to initialize the ultimate translator
    function dtrInitUltimateTranslator() {
        // Create the translator container
        const dtrTranslatorContainer = dtrCreateElement('div', {
            id: 'dtrTranslatorContainer', // Unique ID
            style: `
                position: fixed !important;
                top: 100px !important;
                left: 420px !important;
                background-color: #f8f9fa;
                border: 1px solid #343a40;
                border-radius: .5rem;
                padding: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 99999 !important;
                font-family: 'Open Sans', sans-serif;
                color: #343a40;
                display: none; /* Starts hidden */
                flex-direction: column;
                gap: 10px;
                width: 320px;
                max-width: 90vw;
                resize: both;
                overflow: auto;
            `
        });

        // Create the header
        const dtrHeader = dtrCreateElement('div', {
            class: 'dtr-header', // Unique class
            style: `
                font-weight: bold;
                text-align: center;
                padding-bottom: 8px;
                margin-bottom: 5px;
                border-bottom: 1px solid #ced4da;
                cursor: grab;
                font-size: 1.1em;
                color: #343a40;
            `
        }, ["Drawaria Translator Full"]);

        // Create the input text area for the text to translate
        const dtrInputText = dtrCreateElement('textarea', {
            placeholder: "Enter text...",
            rows: 3,
            id: "dtrInputText", // Unique ID
            style: `
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                resize: vertical;
                min-height: 60px;
                background-color: #fff;
                color: #343a40;
                font-size: 0.95em;
                line-height: 1.4;
            `
        });

        // Prevent default behavior on input to allow text entry
        dtrInputText.addEventListener('keydown', function(e) {
            e.stopPropagation();
        });

        dtrInputText.addEventListener('focus', function(e) {
            this.style.outline = '2px solid blue';
        });

        dtrInputText.addEventListener('blur', function(e) {
            this.style.outline = 'none';
        });

        // Language data
        const languages = {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "zh-CN": "Chinese (Simplified)",
            "ja": "Japanese",
            "ko": "Korean",
            "ar": "Arabic",
            "hi": "Hindi",
            "bn": "Bengali",
            "tr": "Turkish",
            "pl": "Polish",
            "nl": "Dutch",
            "sv": "Swedish",
            "da": "Danish",
            "no": "Norwegian",
            "fi": "Finnish",
            "el": "Greek",
            "he": "Hebrew",
            "id": "Indonesian",
            "ms": "Malay",
            "th": "Thai",
            "vi": "Vietnamese",
            "uk": "Ukrainian",
            "cs": "Czech",
            "hu": "Hungarian",
            "ro": "Romanian",
            "af": "Afrikaans",
            "sq": "Albanian",
            "am": "Amharic",
            "hy": "Armenian",
            "az": "Azerbaijani",
            "eu": "Basque",
            "be": "Belarusian",
            "bs": "Bosnian",
            "bg": "Bulgarian",
            "ca": "Catalan",
            "ceb": "Cebuano",
            "ny": "Chichewa",
            "co": "Corsican",
            "hr": "Croatian",
            "cz": "Czech (Legacy)",
            "eo": "Esperanto",
            "et": "Estonian",
            "tl": "Filipino",
            "fy": "Frisian",
            "gl": "Galician",
            "ka": "Georgian",
            "gu": "Gujarati",
            "ht": "Haitian Creole",
            "ha": "Hausa",
            "haw": "Hawaiian",
            "iw": "Hebrew (Legacy)",
            "hmn": "Hmong",
            "is": "Icelandic",
            "ig": "Igbo",
            "ga": "Irish",
            "jw": "Javanese",
            "kn": "Kannada",
            "kk": "Kazakh",
            "km": "Khmer",
            "ku": "Kurdish (Kurmanji)",
            "ky": "Kyrgyz",
            "lo": "Lao",
            "la": "Latin",
            "lv": "Latvian",
            "lt": "Lithuanian",
            "lb": "Luxembourgish",
            "mk": "Macedonian",
            "mg": "Malagasy",
            "ml": "Malayalam",
            "mt": "Maltese",
            "mi": "Maori",
            "mr": "Marathi",
            "mn": "Mongolian",
            "my": "Myanmar (Burmese)",
            "ne": "Nepali",
            "ps": "Pashto",
            "fa": "Persian",
            "pa": "Punjabi",
            "sm": "Samoan",
            "gd": "Scots Gaelic",
            "sr": "Serbian",
            "st": "Sesotho",
            "sn": "Shona",
            "sd": "Sindhi",
            "si": "Sinhala",
            "sk": "Slovak",
            "sl": "Slovenian",
            "so": "Somali",
            "su": "Sundanese",
            "sw": "Swahili",
            "tg": "Tajik",
            "ta": "Tamil",
            "te": "Telugu",
            "uz": "Uzbek",
            "xh": "Xhosa",
            "yi": "Yiddish",
            "yo": "Yoruba",
            "zu": "Zulu"
        };
        const defaultLanguageCode = "es";
        let currentSelectedLanguageCode = defaultLanguageCode;

        // --- NEW: Custom Language Dropdown Structure ---
        const dtrCustomLanguageDropdown = dtrCreateElement('div', {
            id: 'dtrCustomLanguageDropdown',
            style: `
                position: relative;
                width: 100%;
                font-size: 0.95em;
                margin-bottom: 10px;
            `
        });

        // The visible display for the selected language
        const dtrSelectedLanguageDisplay = dtrCreateElement('div', {
            id: 'dtrSelectedLanguageDisplay',
            style: `
                width: calc(100% - 18px); /* Adjust for padding and arrow */
                padding: 8px 10px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                background-color: #fff;
                color: #343a40;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `
        }, [
            dtrCreateElement('span', {}, [languages[defaultLanguageCode]]), // Initial selected language text
            dtrCreateElement('span', {style: 'font-size: 0.8em; margin-left: 5px;'}, ['▼']) // Dropdown arrow
        ]);

        // The dropdown panel itself (initially hidden)
        const dtrDropdownPanel = dtrCreateElement('div', {
            id: 'dtrDropdownPanel',
            style: `
                position: absolute;
                top: 100%; /* Position below the display */
                left: 0;
                width: 100%;
                background-color: #fff;
                border: 1px solid #ced4da;
                border-radius: .25rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 100000; /* Above other elements */
                max-height: 250px; /* Max height for scroll */
                overflow-y: auto;
                display: none; /* Hidden by default */
                flex-direction: column;
                padding: 5px;
            `
        });

        // Search input within the dropdown panel
        const dtrLanguageSearchInput = dtrCreateElement('input', {
            type: 'text',
            placeholder: 'Search languages...',
            id: 'dtrLanguageSearchInput',
            style: `
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                margin-bottom: 5px;
                background-color: #f0f0f0; /* Slightly different background */
                color: #343a40;
                font-size: 0.9em;
            `
        });
        dtrLanguageSearchInput.addEventListener('keydown', function(e) {
            e.stopPropagation(); // Prevent script's hotkeys from interfering
        });

        // List container for languages
        const dtrLanguageList = dtrCreateElement('div', {
            id: 'dtrLanguageList',
            style: `
                display: flex;
                flex-direction: column;
                gap: 2px;
            `
        });

        // Populate language list and store references
        const languageItems = {}; // Store references to div elements
        for (const langCode in languages) {
            const langName = languages[langCode];
            const langItem = dtrCreateElement('div', {
                class: 'dtr-lang-item',
                'data-lang-code': langCode,
                style: `
                    padding: 8px 10px;
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    border-radius: .20rem;
                `
            }, [langName]);

            langItem.addEventListener('mouseenter', () => {
                langItem.style.backgroundColor = '#e9ecef';
            });
            langItem.addEventListener('mouseleave', () => {
                langItem.style.backgroundColor = '';
            });

            langItem.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop propagation to prevent document click from closing immediately
                currentSelectedLanguageCode = langCode;
                dtrSelectedLanguageDisplay.querySelector('span:first-child').textContent = langName;
                dtrDropdownPanel.style.display = 'none'; // Close dropdown
                console.log(`Drawaria Ultimate Translator: Language set to ${langName} (${langCode})`);
            });
            dtrLanguageList.appendChild(langItem);
            languageItems[langCode] = langItem;
        }

        // Search functionality
        dtrLanguageSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            for (const langCode in languages) {
                const langName = languages[langCode].toLowerCase();
                if (langName.startsWith(searchTerm)) {
                    languageItems[langCode].style.display = 'block';
                } else {
                    languageItems[langCode].style.display = 'none';
                }
            }
        });

        // Toggle dropdown visibility
        dtrSelectedLanguageDisplay.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent this click from closing the dropdown via document click
            dtrDropdownPanel.style.display = dtrDropdownPanel.style.display === 'none' ? 'flex' : 'none';
            if (dtrDropdownPanel.style.display === 'flex') {
                dtrLanguageSearchInput.focus(); // Focus search when opened
                dtrLanguageSearchInput.value = ''; // Clear search on open
                dtrLanguageSearchInput.dispatchEvent(new Event('input')); // Trigger filter
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dtrCustomLanguageDropdown.contains(e.target) && dtrDropdownPanel.style.display === 'flex') {
                dtrDropdownPanel.style.display = 'none';
            }
        });

        // Append search input and language list to the dropdown panel
        dtrDropdownPanel.appendChild(dtrLanguageSearchInput);
        dtrDropdownPanel.appendChild(dtrLanguageList);

        // Append components to the custom dropdown container
        dtrCustomLanguageDropdown.appendChild(dtrSelectedLanguageDisplay);
        dtrCustomLanguageDropdown.appendChild(dtrDropdownPanel);
        // --- END NEW: Custom Language Dropdown Structure ---


        // Create the translate button
        const dtrTranslateButton = dtrCreateElement('button', {
            id: "dtrTranslateButton", // Unique ID
            style: `
                padding: 10px 15px;
                border: none;
                border-radius: .25rem;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 1em;
                font-weight: 600;
                background-color: #17a2b8;
            `
        }, ["Translate"]);

        // Create the output text area
        const dtrOutputText = dtrCreateElement('textarea', {
            placeholder: "Translation will appear here...",
            rows: 3,
            readonly: true,
            id: "dtrOutputText", // Unique ID
            style: `
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                resize: vertical;
                min-height: 60px;
                background-color: #fff;
                color: #343a40;
                font-size: 0.95em;
                line-height: 1.4;
            `
        });

        // Create the send translation button
        const dtrSendButton = dtrCreateElement('button', {
            id: "dtrSendButton", // Unique ID
            style: `
                padding: 10px 15px;
                border: none;
                border-radius: .25rem;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 1em;
                font-weight: 600;
                background-color: #007bff;
            `
        }, ["Send Translation"]);

        // Add elements to the container
        dtrTranslatorContainer.appendChild(dtrHeader);
        dtrTranslatorContainer.appendChild(dtrInputText);
        // --- NEW: Add the custom language dropdown here ---
        dtrTranslatorContainer.appendChild(dtrCustomLanguageDropdown);
        // --- END NEW ---
        dtrTranslatorContainer.appendChild(dtrTranslateButton);
        dtrTranslatorContainer.appendChild(dtrOutputText);
        dtrTranslatorContainer.appendChild(dtrSendButton);

        // Add the container to the document body
        document.body.appendChild(dtrTranslatorContainer);
        console.log("Drawaria Ultimate Translator: UI container appended to body.");

        // Make the translator UI draggable
        dtrMakeDraggable(dtrTranslatorContainer);
        console.log("Drawaria Ultimate Translator: UI made draggable.");

        // Add event listeners for the buttons
        dtrTranslateButton.addEventListener("click", () => {
            const textToTranslate = dtrInputText.value.trim();
            // --- Use the currentSelectedLanguageCode from the custom dropdown ---
            const toLang = currentSelectedLanguageCode;
            // --- END NEW ---
            if (textToTranslate) {
                console.log(`Drawaria Ultimate Translator: Translating text to ${languages[toLang]} (${toLang}):`, textToTranslate);
                dtrTranslateText(textToTranslate, toLang, (translatedText) => {
                    dtrOutputText.value = translatedText;
                    console.log("Drawaria Ultimate Translator: Translation complete:", translatedText);
                });
            } else {
                dtrOutputText.value = "Please enter text to translate.";
                console.log("Drawaria Ultimate Translator: No text to translate.");
            }
        });

        // Event listener for the "Send Translation" button
        dtrSendButton.addEventListener("click", () => {
            const translatedText = dtrOutputText.value;
            if (translatedText) {
                const chatInput = document.getElementById('chatbox_textinput');

                if (chatInput) {
                    chatInput.value = translatedText;
                    console.log("Drawaria Ultimate Translator: Text placed in chat input:", translatedText);

                    // Create and dispatch an 'Enter' keydown event to trigger sending
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    chatInput.dispatchEvent(event);
                    console.log("Drawaria Ultimate Translator: 'Enter' keydown event dispatched.");

                    const originalText = dtrSendButton.textContent;
                    dtrSendButton.textContent = "Sent!";
                    setTimeout(() => {
                        dtrSendButton.textContent = originalText;
                        dtrInputText.value = "";
                        dtrOutputText.value = "";
                    }, 1500);

                } else {
                    console.warn("Drawaria Ultimate Translator: Could not find chat input element (#chatbox_textinput).");
                    const originalText = dtrSendButton.textContent;
                    dtrSendButton.textContent = "Chat not found!";
                    setTimeout(() => {
                        dtrSendButton.textContent = originalText;
                    }, 1500);
                }
            } else {
                console.log("Drawaria Ultimate Translator: Nothing to send.");
            }
        });

        // --- Toggle Button Functionality for T+ ---
        const roomcontrols = document.getElementById('roomcontrols');
        if (roomcontrols) {
            const dtrToggleButton = dtrCreateElement('button', {
                id: 'dtrTranslateMenuUltimateToggle', // Unique ID for this button
                class: 'btn btn-outline-secondary btn-sm',
                style: 'padding: 1px 5px; margin-left: 5px;', // Added margin for spacing
                title: 'Toggle Drawaria Ultimate Translator'
            }, ['T+']);

            // Find the roomcontrols-menu button to insert next to it, or append to roomcontrols
            const menuButton = document.getElementById('roomcontrols-menu'); // The ellipsis menu button
            if (menuButton) {
                // Insert the new button after the existing menu button
                menuButton.parentNode.insertBefore(dtrToggleButton, menuButton.nextSibling);
            } else {
                // Fallback if menuButton is not found, append to roomcontrols
                roomcontrols.appendChild(dtrToggleButton);
            }

            dtrToggleButton.addEventListener('click', () => {
                if (dtrTranslatorContainer.style.display === 'none') {
                    dtrTranslatorContainer.style.display = 'flex'; // Use 'flex' as it's a flex container
                } else {
                    dtrTranslatorContainer.style.display = 'none';
                }
            });
            console.log("Drawaria Ultimate Translator: Toggle button 'T+' added to roomcontrols.");
        } else {
            console.warn("Drawaria Ultimate Translator: Could not find #roomcontrols element to add toggle button.");
        }
    }

    // Wait for the DOM to be fully loaded before initializing the translator
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', dtrInitUltimateTranslator);
    } else {
        dtrInitUltimateTranslator();
    }
})();