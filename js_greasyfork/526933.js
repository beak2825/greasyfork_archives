// ==UserScript==
// @name         Civitai Prompt Autocomplete & Tag Wiki
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Adds tag autocomplete and wiki lookup features
// @author       AndroidXL
// @match        https://civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526933/Civitai%20Prompt%20Autocomplete%20%20Tag%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/526933/Civitai%20Prompt%20Autocomplete%20%20Tag%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // All variable declarations moved to top
    let promptInput = null;
    let negativePromptInput = null;  // Add negative prompt input reference
    let activeInput = null;  // Track which input is currently active
    let suggestionsBox = null;
    let currentSuggestions = [];
    let selectedSuggestionIndex = -1;
    let debounceTimer;
    const debounceDelay = 50;
    let lastCurrentWord = "";
    let lastStartPos = 0; // New variable to track word start position
    let wikiOverlay = null;
    let wikiSearchContainer = null;
    let wikiContent = null;
    let currentPosts = [];
    let currentPostIndex = 0;
    let wikiInitialized = false;
    let autocompleteEnabled = true; // Default state for autocomplete
    let wikiHotkey = 't'; // Default hotkey for wiki
    let settingsOpen = false;

    // Wiki history navigation variables
    let wikiHistory = [];
    let historyIndex = -1;
    let isNavigatingHistory = false;

    // Initialize customTags with defaults, will be overridden by localStorage if available
    let customTags = {
        'quality': 'masterpiece, best quality, amazing quality, very detailed',
        'quality_pony': 'score_9, score_8_up, score_7_up, score_6_up',
    };

    // Create and inject styles without GM_addStyle
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #autocomplete-suggestions-box {
            position: absolute;
            background-color: #1a1b1e;
            border: 1px solid #333;
            border-radius: 5px;
            margin-top: 2px;
            z-index: 100;
            overflow-y: auto;
            max-height: 150px;
            width: calc(100% - 6px);
            padding: 2px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        }
        #autocomplete-suggestions-box div {
            padding: 4px 8px;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #C1C2C5;
            font-size: 14px;
        }
        #autocomplete-suggestions-box div:hover {
            background-color: #282a2d;
        }
        .autocomplete-selected {
            background-color: #383a3e;
        }
        .suggestion-count {
            color: #98C379;
            font-weight: normal;
            margin-left: 8px;
            font-size: 0.9em;
        }

        .wiki-search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            overflow-y: auto;
            padding: 20px;
        }

        .wiki-search-container {
            position: relative;
            width: 90%;
            max-width: 800px;
            margin: 40px auto;
            transition: all 0.3s ease;
        }

        .wiki-search-bar {
            width: 100%;
            padding: 12px;
            background: rgba(26,27,30,0.95);
            border: 1px solid #383a3e;
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
        }

        /* Container for all buttons on the right */
        .wiki-buttons-container {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 10002;
        }

        .wiki-settings-button {
            background: rgba(26,27,30,0.95);
            color: #C1C2C5;
            border: 1px solid #383a3e;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            height: 30px;
            display: flex;
            align-items: center;
        }

        /* Wiki navigation buttons */
        .wiki-nav-history {
            display: flex;
            gap: 5px;
        }

        .wiki-nav-button {
            background: rgba(26,27,30,0.95);
            color: #C1C2C5;
            border: 1px solid #383a3e;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.7;
            transition: opacity 0.3s, background-color 0.3s;
        }

        .wiki-nav-button:hover:not(:disabled) {
            background: #383a3e;
            opacity: 1;
        }

        .wiki-nav-button:disabled {
            cursor: not-allowed;
            opacity: 0.3;
        }

        .wiki-settings-button:hover {
            background: #383a3e;
        }

        .wiki-settings-panel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            background: rgba(26,27,30,0.98);
            border: 1px solid #383a3e;
            border-radius: 8px;
            padding: 20px;
            z-index: 10003;
            color: #C1C2C5;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .wiki-settings-panel h2 {
            margin-top: 0;
            border-bottom: 1px solid #383a3e;
            padding-bottom: 10px;
        }

        .settings-section {
            margin-bottom: 20px;
        }

        .settings-section h3 {
            margin-bottom: 10px;
            font-size: 16px;
            color: #98C379;
        }

        .hotkey-setting {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .hotkey-setting label {
            margin-right: 10px;
        }

        .hotkey-setting input {
            width: 50px;
            background: #1a1b1e;
            border: 1px solid #383a3e;
            border-radius: 4px;
            padding: 5px;
            color: #fff;
            text-align: center;
        }

        .custom-tags-section {
            margin-top: 15px;
        }

        .custom-tag-row {
            display: flex;
            margin-bottom: 8px;
            gap: 10px;
        }

        .custom-tag-name,
        .custom-tag-value {
            flex: 1;
            background: #1a1b1e;
            border: 1px solid #383a3e;
            border-radius: 4px;
            padding: 5px 8px;
            color: #fff;
        }

        .custom-tag-controls {
            display: flex;
            gap: 5px;
        }

        .btn {
            background: #383a3e;
            color: #C1C2C5;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        }

        .btn:hover {
            background: #4a4c52;
        }

        .btn-save {
            background: #2c6e49;
        }

        .btn-save:hover {
            background: #358f5f;
        }

        .btn-delete {
            background: #6e2c2c;
        }

        .btn-delete:hover {
            background: #913a3a;
        }

        .btn-add {
            background: #2c4a6e;
            margin-top: 10px;
        }

        .btn-add:hover {
            background: #385d89;
        }

        .settings-panel-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #383a3e;
            gap: 10px;
        }

        .wiki-content {
            background: rgba(26,27,30,0.95);
            border-radius: 8px;
            margin-top: 20px;
            padding: 20px;
            width: 100%;
            position: relative;
        }

        .wiki-text-content {
            padding-right: 420px;
            min-height: 500px;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .wiki-description {
            line-height: 1.4;
            white-space: pre-line;
            font-size: 15px;
        }

        .wiki-image-section {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 400px;
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .wiki-image-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 10px;
            position: relative;
            height: 40px;
        }

        .image-nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            cursor: pointer;
            border-radius: 20px;
            opacity: 0.8;
            transition: opacity 0.3s, background-color 0.3s;
            font-size: 18px;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-nav-button:hover {
            opacity: 1;
            background: rgba(0,0,0,0.9);
        }

        .image-nav-button.prev {
            left: 10px;
        }

        .image-nav-button.next {
            right: 10px;
        }

        .wiki-image-container {
            width: 100%;
            height: 350px;
            position: relative;
            margin: 0;
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
            overflow: hidden;
        }

        .wiki-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 4px;
            transition: transform 0.3s ease;
        }

        .wiki-image:hover {
            transform: scale(1.03);
        }

        .wiki-image-section {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 400px;
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .wiki-image-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 10px;
        }

        .image-nav-button {
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            opacity: 0.7;
            transition: opacity 0.3s;
            font-size: 16px;
        }

        .wiki-image-container {
            width: 100%;
            height: 350px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin: 0;
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
        }

        .wiki-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
        }

        .wiki-nav-buttons {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .wiki-button {
            padding: 8px 16px;
            background: #383a3e;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            width: 100%;
            text-align: center;
        }

        .wiki-tag {
            display: inline-block;
            margin: 2px 4px;
            padding: 2px 4px;
            background: rgba(97, 175, 239, 0.1);
            border-radius: 3px;
            color: #61afef;
            cursor: pointer;
            text-decoration: underline;
        }

        .wiki-tag:hover {
            background: rgba(97, 175, 239, 0.2);
        }

        .wiki-link {
            color: #98c379;
            text-decoration: underline;
        }

        .wiki-loading {
            text-align: center;
            padding: 20px;
        }

        .wiki-description {
            line-height: 1.6;
            white-space: pre-wrap;
            font-size: 15px;
        }

        .wiki-description p {
            margin: 1em 0;
        }

        .wiki-search-suggestions {
            position: fixed;
            margin-top: 2px;
            background: rgba(26,27,30,0.95);
            border: 1px solid #383a3e;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10001;
            width: 90%;
            max-width: 800px;
            left: 50%;
            transform: translateX(-50%);
        }

        .wiki-search-suggestion {
            padding: 8px 12px;
            cursor: pointer;
            color: #fff;
        }

        .wiki-search-suggestion:hover,
        .wiki-search-suggestion.selected {
            background: #383a3e;
        }

        .no-images-message {
            color: #666;
            text-align: center;
            padding: 20px;
            font-style: italic;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .wiki-description h1 { font-size: 1.8em; margin: 0.8em 0 0.4em; }
        .wiki-description h2 { font-size: 1.6em; margin: 0.7em 0 0.4em; }
        .wiki-description h3 { font-size: 1.4em; margin: 0.6em 0 0.4em; }
        .wiki-description h4 { font-size: 1.2em; margin: 0.5em 0 0.4em; }
        .wiki-description h5 { font-size: 1.1em; margin: 0.5em 0 0.4em; }
        .wiki-description h6 { font-size: 1em; margin: 0.5em 0 0.4em; }
        .wiki-description p { margin: 0.5em 0; }

        .wiki-description ul {
            margin: 0.5em 0 0.5em 1.5em;
            padding: 0;
        }

        .wiki-description li {
            margin: 0.3em 0;
            line-height: 1.4;
        }

        /* Autocomplete toggle checkbox styles */
        .autocomplete-toggle {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-size: 0.9em;
            color: #C1C2C5;
        }

        .autocomplete-toggle input {
            margin-right: 5px;
        }

        .tag-validation-error {
            color: #f55;
            font-size: 12px;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(styleElement);

    // Load settings from localStorage
    function loadSettings() {
        try {
            // Load autocomplete preference
            const savedAutoComplete = localStorage.getItem('civitai-autocomplete-enabled');
            if (savedAutoComplete !== null) {
                autocompleteEnabled = savedAutoComplete === 'true';
            }

            // Load wiki hotkey
            const savedHotkey = localStorage.getItem('civitai-wiki-hotkey');
            if (savedHotkey) {
                wikiHotkey = savedHotkey;
            }

            // Load custom tags
            const savedTags = localStorage.getItem('civitai-custom-tags');
            if (savedTags) {
                try {
                    customTags = JSON.parse(savedTags);
                } catch (e) {
                    console.error('Error parsing custom tags:', e);
                    // If parsing fails, keep the default tags
                }
            }

            debug('Settings loaded from localStorage');
        } catch (e) {
            console.error('Error loading settings:', e);
            // Use defaults if there's an error
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('civitai-autocomplete-enabled', autocompleteEnabled);
            localStorage.setItem('civitai-wiki-hotkey', wikiHotkey);
            localStorage.setItem('civitai-custom-tags', JSON.stringify(customTags));
            debug('Settings saved to localStorage');
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    // Load settings when script starts
    loadSettings();

   // Replace handleInputEvents function
    function handleInputEvents(e) {
        const input = e.target;
        if ((input.id === 'input_prompt' || input.id === 'input_negativePrompt') && autocompleteEnabled) {
            activeInput = input; // Set the active input
            const currentWordObj = getCurrentWord(input.value, input.selectionStart);
            lastCurrentWord = currentWordObj.word;
            lastStartPos = currentWordObj.startPos;
            fetchSuggestions(lastCurrentWord);

            // Position suggestions box below the active input
            if (suggestionsBox) {
                const inputRect = input.getBoundingClientRect();
                suggestionsBox.style.position = 'absolute';
                suggestionsBox.style.left = `${inputRect.left}px`;
                suggestionsBox.style.top = `${inputRect.bottom + window.scrollY}px`;
                suggestionsBox.style.width = `${inputRect.width}px`;
            }
        }
    }

    // Create the toggle checkbox
    function createAutocompleteToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'autocomplete-toggle';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autocomplete-toggle-checkbox';
        checkbox.checked = autocompleteEnabled;

        const label = document.createElement('label');
        label.htmlFor = 'autocomplete-toggle-checkbox';
        label.textContent = 'Enable Tag Autocomplete';

        toggleContainer.appendChild(checkbox);
        toggleContainer.appendChild(label);

        checkbox.addEventListener('change', function() {
            autocompleteEnabled = this.checked;
            saveSettings();
            if (!autocompleteEnabled) {
                clearSuggestions();
            }
        });

        return toggleContainer;
    }

    function handleKeydownEvents(e) {
        if (e.target.id !== 'input_prompt' && e.target.id !== 'input_negativePrompt') return;
        
        activeInput = e.target; // Update active input
    
        if (e.key === 'ArrowDown') {
            if (suggestionsBox?.style.display === 'block' && currentSuggestions.length > 0) {
                e.preventDefault();
                selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, currentSuggestions.length - 1);
                updateSuggestionSelection();
            }
        } else if (e.key === 'ArrowUp') {
            if (suggestionsBox?.style.display === 'block' && currentSuggestions.length > 0) {
                e.preventDefault();
                selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                updateSuggestionSelection();
            }
        } else if (e.key === 'Tab' || e.key === 'Enter') {
            if (suggestionsBox?.style.display === 'block' && currentSuggestions.length > 0) {
                e.preventDefault();
                if (selectedSuggestionIndex !== -1) {
                    insertSuggestion(currentSuggestions[selectedSuggestionIndex].label);
                } else {
                    insertSuggestion(currentSuggestions[0].label);
                }
            }
        } else if (e.key === 'Escape') {
            clearSuggestions();
        }
    }

    function setupAutocomplete() {
        // Clean up old elements
        if (suggestionsBox) {
            suggestionsBox.remove();
        }

        // Remove old toggle if it exists
        const oldToggle = document.getElementById('autocomplete-toggle-checkbox');
        if (oldToggle && oldToggle.parentNode) {
            oldToggle.parentNode.remove();
        }

        // Get both input elements
        promptInput = document.getElementById('input_prompt');
        negativePromptInput = document.getElementById('input_negativePrompt');

        // Exit if neither input exists
        if (!promptInput && !negativePromptInput) return;

        // Create suggestions box (attach to document body instead of a specific input)
        suggestionsBox = document.createElement('div');
        suggestionsBox.id = 'autocomplete-suggestions-box';
        suggestionsBox.style.display = 'none';
        document.body.appendChild(suggestionsBox);

        // Create the toggle and insert it before the positive prompt if it exists
        if (promptInput) {
            const toggleContainer = createAutocompleteToggle();
            promptInput.parentNode.parentNode.parentNode.parentNode.insertBefore(
                toggleContainer,
                promptInput.parentNode.parentNode.parentNode.parentNode.firstChild
            );
        }

        // Remove old event listeners and add new ones using event delegation
        document.removeEventListener('input', handleInputEvents, true);
        document.removeEventListener('keydown', handleKeydownEvents, true);
        document.addEventListener('input', handleInputEvents, true);
        document.addEventListener('keydown', handleKeydownEvents, true);

        // Handle clicks outside
        document.addEventListener('click', (e) => {
            if ((!promptInput?.contains(e.target) && !negativePromptInput?.contains(e.target)) &&
                !suggestionsBox?.contains(e.target)) {
                clearSuggestions();
            }
        });
    }

    // Set up a more aggressive observer
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const addedNodes = Array.from(mutation.addedNodes);
            const hasPromptInput = addedNodes.some(node =>
                node.id === 'input_prompt' ||
                node.querySelector?.('#input_prompt')
            );

            if (hasPromptInput || !document.getElementById('autocomplete-suggestions-box')) {
                setupAutocomplete();
                break;
            }
        }
    });

    // Start observing with more specific config
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id']
    });

    // Initial setup
    setupAutocomplete();
    initializeWiki();

    function fetchSuggestions(term) {
        if (!term || !autocompleteEnabled) {
            clearSuggestions();
            return;
        }

        // First, check custom tags
        const matchingCustomTags = Object.keys(customTags)
            .filter(tag => tag.toLowerCase().startsWith(term.toLowerCase()))
            .map(tag => ({
                label: tag,
                count: '⭐', // Star to indicate custom tag
                isCustom: true,
                insertText: customTags[tag]
            }));

        // If we have matching custom tags, show them immediately
        if (matchingCustomTags.length > 0) {
            currentSuggestions = matchingCustomTags;
            showSuggestions();
        }

        // Continue with API request for regular tags
        const apiTerm = term.replace(/ /g, '_');

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://gelbooru.com/index.php?page=autocomplete2&term=${encodeURIComponent(apiTerm)}&type=tag_query&limit=10`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const fetchedSuggestions = data.map(item => ({
                                label: item.label.replace(/[()]/g, '\\$&'),
                                count: item.post_count,
                                isCustom: false
                            }));
                            // Combine custom and API suggestions
                            filterAndShowSuggestions([...matchingCustomTags, ...fetchedSuggestions]);
                        } catch (e) {
                            console.error("Error parsing Gelbooru API response:", e);
                            clearSuggestions();
                        }
                    } else {
                        console.error("Gelbooru API request failed:", response.status, response.statusText);
                        clearSuggestions();
                    }
                },
                onerror: function(error) {
                    console.error("Gelbooru API request error:", error);
                    clearSuggestions();
                }
            });
        }, debounceDelay);
    }

    function filterAndShowSuggestions(fetchedSuggestions) {
        const existingTags = promptInput.value.split(',').map(tag => tag.trim().toLowerCase());
        const filteredSuggestions = fetchedSuggestions.filter(suggestion => {
            return !existingTags.includes(suggestion.label.toLowerCase())
        });

        currentSuggestions = filteredSuggestions;

        showSuggestions();
    }


    function showSuggestions() {
        if (currentSuggestions.length === 0) {
            clearSuggestions();
            return;
        }

        suggestionsBox.innerHTML = '';


        currentSuggestions.forEach((suggestion, index) => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.innerHTML = `${suggestion.label} <span class="suggestion-count">[${suggestion.count}]</span>`;
            suggestionDiv.addEventListener('click', () => {
                insertSuggestion(suggestion.label);
            });
            suggestionsBox.appendChild(suggestionDiv);
        });

        suggestionsBox.style.display = 'block';
        selectedSuggestionIndex = -1;
    }

    function clearSuggestions() {
        if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
            suggestionsBox.innerHTML = '';
        }
        currentSuggestions = [];
        selectedSuggestionIndex = -1;
    }

    function insertSuggestion(suggestion) {
        // Make sure we have an active input
        if (!activeInput) return;
    
        // Find the matching suggestion object
        const suggestionObj = currentSuggestions.find(s => s.label === suggestion);
        const textToInsert = (suggestionObj?.isCustom ? suggestionObj.insertText : suggestion)
    
        // Use setRangeText to replace the current word with the suggestion
        const start = lastStartPos;
        const end = activeInput.selectionStart;
    
        // Focus the input to ensure changes register in the undo stack
        activeInput.focus();
    
        // Create a composition session to properly register in the undo stack
        // First delete the current word manually
        activeInput.setSelectionRange(start, end);
        document.execCommand('delete');
    
        // Then insert the new text with execCommand
        document.execCommand('insertText', false, textToInsert + ', ');
    
        // Simulate focus and blur to mimic user interaction
        activeInput.focus();
        activeInput.blur();
        setTimeout(() => {
            activeInput.focus();
        }, 0); // Delay refocus to allow React to process
    
        // Clear suggestions and keep focus
        clearSuggestions();
        activeInput.focus();
    }

    function updateSuggestionSelection() {
        if (!suggestionsBox) return;

        const suggestionDivs = suggestionsBox.querySelectorAll('div');
        suggestionDivs.forEach((div, index) => {
            if (index === selectedSuggestionIndex) {
                div.classList.add('autocomplete-selected');
                div.scrollIntoView({ block: 'nearest' });
            } else {
                div.classList.remove('autocomplete-selected');
            }
        });
    }

    function getCurrentWord(text, cursorPosition) {
        if (cursorPosition === undefined) cursorPosition = text.length;

        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastCommaIndex = textBeforeCursor.lastIndexOf(',');
        let startPos, word;

        if (lastCommaIndex !== -1) {
            startPos = lastCommaIndex + 1;
            word = textBeforeCursor.substring(startPos).trim();
            // Find the exact position where the trimmed word starts
            if (word) {
                const leadingSpaces = textBeforeCursor.substring(startPos).length - textBeforeCursor.substring(startPos).trimLeft().length;
                startPos = startPos + leadingSpaces;
            }
        } else {
            startPos = 0;
            word = textBeforeCursor.trim();
            // If the text has leading spaces, adjust the start position
            if (word && textBeforeCursor !== word) {
                startPos = textBeforeCursor.indexOf(word);
            }
        }
        
        return { word, startPos };
    }

    // Add debug logging function
    function debug(msg) {
        console.log(`[Wiki Debug] ${msg}`);
    }

    // Create settings panel DOM
    function createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'wiki-settings-panel';

        // Header
        const header = document.createElement('h2');
        header.textContent = 'Wiki & Autocomplete Settings';
        settingsPanel.appendChild(header);

        // Hotkey section
        const hotkeySection = document.createElement('div');
        hotkeySection.className = 'settings-section';

        const hotkeyTitle = document.createElement('h3');
        hotkeyTitle.textContent = 'Hotkeys';
        hotkeySection.appendChild(hotkeyTitle);

        const hotkeyContent = document.createElement('div');
        hotkeyContent.className = 'hotkey-setting';

        const hotkeyLabel = document.createElement('label');
        hotkeyLabel.textContent = 'Wiki search hotkey:';

        const hotkeyInput = document.createElement('input');
        hotkeyInput.type = 'text';
        hotkeyInput.value = wikiHotkey;
        hotkeyInput.maxLength = 1;
        hotkeyInput.addEventListener('keydown', function(e) {
            e.preventDefault();
            this.value = e.key.toLowerCase();
        });

        hotkeyContent.appendChild(hotkeyLabel);
        hotkeyContent.appendChild(hotkeyInput);
        hotkeySection.appendChild(hotkeyContent);
        settingsPanel.appendChild(hotkeySection);

        // Custom tags section
        const tagsSection = document.createElement('div');
        tagsSection.className = 'settings-section';

        const tagsTitle = document.createElement('h3');
        tagsTitle.textContent = 'Custom Tags';
        tagsSection.appendChild(tagsTitle);

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'custom-tags-section';

        // Create UI for each existing tag
        Object.keys(customTags).forEach(tag => {
            const tagRow = createTagRow(tag, customTags[tag]);
            tagsContainer.appendChild(tagRow);
        });

        // Add new tag button
        const addTagBtn = document.createElement('button');
        addTagBtn.className = 'btn btn-add';
        addTagBtn.textContent = '+ Add New Tag';
        addTagBtn.addEventListener('click', function() {
            const newTagRow = createTagRow('', '');
            tagsContainer.insertBefore(newTagRow, addTagBtn);
            newTagRow.querySelector('.custom-tag-name').focus();
        });

        tagsContainer.appendChild(addTagBtn);
        tagsSection.appendChild(tagsContainer);
        settingsPanel.appendChild(tagsSection);

        // Footer with buttons
        const footer = document.createElement('div');
        footer.className = 'settings-panel-footer';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', hideSettingsPanel);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-save';
        saveBtn.textContent = 'Save Settings';
        saveBtn.addEventListener('click', function() {
            const errors = validateAndSaveSettings(hotkeyInput, tagsContainer);
            if (errors.length === 0) {
                hideSettingsPanel();
            } else {
                // Display errors
                const existingError = settingsPanel.querySelector('.tag-validation-error');
                if (existingError) existingError.remove();

                const errorDiv = document.createElement('div');
                errorDiv.className = 'tag-validation-error';
                errorDiv.textContent = errors.join(', ');
                footer.insertBefore(errorDiv, cancelBtn);
            }
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);
        settingsPanel.appendChild(footer);

        return settingsPanel;
    }

    // Helper function to create a tag row
    function createTagRow(name, value) {
        const row = document.createElement('div');
        row.className = 'custom-tag-row';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'custom-tag-name';
        nameInput.placeholder = 'Tag name';
        nameInput.value = name;

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.className = 'custom-tag-value';
        valueInput.placeholder = 'Tag value (comma separated)';
        valueInput.value = value;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'custom-tag-controls';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete tag';
        deleteBtn.addEventListener('click', function() {
            row.remove();
        });

        controlsDiv.appendChild(deleteBtn);

        row.appendChild(nameInput);
        row.appendChild(valueInput);
        row.appendChild(controlsDiv);

        return row;
    }

    // Validate settings and save
    function validateAndSaveSettings(hotkeyInput, tagsContainer) {
        const errors = [];

        // Validate hotkey
        const newHotkey = hotkeyInput.value.trim();
        if (!newHotkey) {
            errors.push('Hotkey cannot be empty');
        } else {
            wikiHotkey = newHotkey;
        }

        // Validate and collect tags
        const newCustomTags = {};
        const tagRows = tagsContainer.querySelectorAll('.custom-tag-row');
        const tagNames = new Set();

        tagRows.forEach(row => {
            const nameInput = row.querySelector('.custom-tag-name');
            const valueInput = row.querySelector('.custom-tag-value');

            const name = nameInput.value.trim();
            const value = valueInput.value.trim();

            if (name && value) {
                if (tagNames.has(name)) {
                    errors.push(`Duplicate tag name: ${name}`);
                } else {
                    tagNames.add(name);
                    newCustomTags[name] = value;
                }
            } else if (name || value) {
                errors.push(`Tag ${name || 'name'} is missing ${name ? 'value' : 'name'}`);
            }
            // Skip empty rows (both name and value empty)
        });

        if (errors.length === 0) {
            customTags = newCustomTags;
            saveSettings();
        }

        return errors;
    }

    // Show settings panel
    function showSettingsPanel() {
        settingsOpen = true;

        // Remove any existing panel
        const existingPanel = document.querySelector('.wiki-settings-panel');
        if (existingPanel) existingPanel.remove();

        // Create and append new panel
        const settingsPanel = createSettingsPanel();
        wikiOverlay.appendChild(settingsPanel);
    }

    // Hide settings panel
    function hideSettingsPanel() {
        const panel = document.querySelector('.wiki-settings-panel');
        if (panel) panel.remove();
        settingsOpen = false;
    }

    // Initialize wiki interface immediately
    function initializeWiki() {
        if (wikiInitialized) {
            debug('Wiki already initialized');
            return;
        }

        debug('Initializing wiki interface');

        // Make sure settings are loaded
        loadSettings();
        
        // Continue with wiki initialization
        wikiOverlay = document.createElement('div');
        wikiOverlay.className = 'wiki-search-overlay';

        wikiSearchContainer = document.createElement('div');
        wikiSearchContainer.className = 'wiki-search-container';

        const searchBar = document.createElement('input');
        searchBar.className = 'wiki-search-bar';
        searchBar.placeholder = 'Search tag wiki...';

        // Create container for all buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'wiki-buttons-container';

        // Add navigation history buttons
        const navContainer = document.createElement('div');
        navContainer.className = 'wiki-nav-history';

        const backButton = document.createElement('button');
        backButton.className = 'wiki-nav-button back';
        backButton.textContent = '<';
        backButton.disabled = true;
        backButton.title = 'Go back to previous tag';
        backButton.addEventListener('click', navigateWikiHistory.bind(null, -1));

        const forwardButton = document.createElement('button');
        forwardButton.className = 'wiki-nav-button forward';
        forwardButton.textContent = '>';
        forwardButton.disabled = true;
        forwardButton.title = 'Go forward to next tag';
        forwardButton.addEventListener('click', navigateWikiHistory.bind(null, 1));

        navContainer.appendChild(backButton);
        navContainer.appendChild(forwardButton);

        // Add settings button
        const settingsButton = document.createElement('button');
        settingsButton.className = 'wiki-settings-button';
        settingsButton.textContent = '⚙️ Settings';
        settingsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showSettingsPanel();
        });

        // Add navigation buttons first, then settings button
        buttonsContainer.appendChild(navContainer);
        buttonsContainer.appendChild(settingsButton);

        wikiContent = document.createElement('div');
        wikiContent.className = 'wiki-content';
        wikiContent.style.display = 'none';

        wikiSearchContainer.appendChild(searchBar);
        wikiSearchContainer.appendChild(buttonsContainer);
        wikiSearchContainer.appendChild(wikiContent);
        wikiOverlay.appendChild(wikiSearchContainer);
        document.body.appendChild(wikiOverlay);

        // Separate key handler based on configurable hotkey
        document.addEventListener('keydown', function(e) {
            if (e.key.toLowerCase() === wikiHotkey.toLowerCase() && !isInputFocused()) {
                debug(`Hotkey ${wikiHotkey} pressed, showing wiki search`);
                e.preventDefault();
                showWikiSearch();
            }
        });

        searchBar.addEventListener('keydown', async function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                await loadWikiInfo(searchBar.value);
            } else if (e.key === 'Escape') {
                if (settingsOpen) {
                    hideSettingsPanel();
                } else {
                    hideWikiSearch();
                }
            }
        });

        wikiOverlay.addEventListener('click', function(e) {
            if (e.target === wikiOverlay) {
                if (settingsOpen) {
                    hideSettingsPanel();
                } else {
                    hideWikiSearch();
                }
            }
        });

        setupWikiSearchAutocomplete(searchBar);

        wikiInitialized = true;
        debug('Wiki interface initialized');
    }

    // Navigate through wiki history
    function navigateWikiHistory(direction) {
        if (!wikiHistory.length) return;

        const newIndex = historyIndex + direction;

        if (newIndex >= 0 && newIndex < wikiHistory.length) {
            isNavigatingHistory = true;
            historyIndex = newIndex;
            updateHistoryButtons();
            loadWikiInfo(wikiHistory[historyIndex]);
        }
    }

    // Update the state of history navigation buttons
    function updateHistoryButtons() {
        const backButton = document.querySelector('.wiki-nav-button.back');
        const forwardButton = document.querySelector('.wiki-nav-button.forward');

        if (!backButton || !forwardButton) return;

        backButton.disabled = historyIndex <= 0;
        forwardButton.disabled = historyIndex >= wikiHistory.length - 1;
    }

    function hideWikiSearch() {
        debug('Hiding wiki search interface');
        wikiOverlay.style.display = 'none';
        hideSettingsPanel();
    }

    // Modified showWikiSearch function
    function showWikiSearch() {
        if (!wikiInitialized) {
            debug('Attempting to show wiki before initialization');
            initializeWiki();
        }
        debug('Showing wiki search interface');
        wikiOverlay.style.display = 'block';
        const searchBar = wikiSearchContainer.querySelector('.wiki-search-bar');
        searchBar.value = '';
        searchBar.focus();
        wikiContent.style.display = 'none';

        // Reset navigation buttons when opening search
        updateHistoryButtons();
    }

    // Add keyboard shortcut for closing with escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && wikiOverlay.style.display === 'block') {
            if (settingsOpen) {
                hideSettingsPanel();
            } else {
                hideWikiSearch();
            }
        }
    });

    // Initialize wiki immediately
    initializeWiki();

    // The rest of the script remains unchanged
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }

    // Wiki helper functions
    async function loadWikiInfo(tag) {
        // Reset animation
        wikiSearchContainer.style.animation = 'none';
        wikiSearchContainer.offsetHeight; // Trigger reflow
        wikiSearchContainer.style.animation = null;

        // Update search bar value
        const searchBar = wikiSearchContainer.querySelector('.wiki-search-bar');
        searchBar.value = tag;

        // Add to history if not navigating through history
        if (!isNavigatingHistory) {
            // If we're in the middle of the history and searching a new tag,
            // remove all entries after current position
            if (historyIndex < wikiHistory.length - 1 && historyIndex >= 0) {
                wikiHistory = wikiHistory.slice(0, historyIndex + 1);
            }

            // Don't add duplicate consecutive entries
            if (wikiHistory.length === 0 || wikiHistory[wikiHistory.length - 1] !== tag) {
                wikiHistory.push(tag);
                historyIndex = wikiHistory.length - 1;
            }
        } else {
            // Reset the flag after navigation
            isNavigatingHistory = false;
        }

        // Update button states
        updateHistoryButtons();

        wikiContent.innerHTML = '<div class="wiki-loading">Loading...</div>';
        wikiContent.style.display = 'block';
        wikiSearchContainer.style.animation = 'slideUp 0.3s forwards';

        try {
            const [wikiData, postsData] = await Promise.all([
                fetchDanbooruWiki(tag),
                fetchDanbooruPosts(tag)
            ]);

            currentPosts = postsData;
            currentPostIndex = 0;

            displayWikiContent(wikiData, tag);
            if (currentPosts.length > 0) {
                displayPostImage(currentPosts[0]);
            }
        } catch (error) {
            wikiContent.innerHTML = `<div class="error">Error loading wiki: ${error.message}</div>`;
        }
    }

    function fetchDanbooruWiki(tag) {
        // Convert to lowercase and replace spaces with underscores
        const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, '_');
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://danbooru.donmai.us/wiki_pages.json?search[title]=${encodeURIComponent(formattedTag)}`,
                onload: response => resolve(JSON.parse(response.responseText)),
                onerror: reject
            });
        });
    }

    function fetchDanbooruPosts(tag) {
        const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, '_');
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(formattedTag)}&limit=10`,
                onload: response => resolve(JSON.parse(response.responseText)),
                onerror: reject
            });
        });
    }

    function displayWikiContent(wikiData, tag) {
        const hasWiki = wikiData && wikiData[0];
        const hasPosts = currentPosts && currentPosts.length > 0;

        wikiContent.innerHTML = `
            <div class="wiki-text-content">
                <h2>${tag}</h2>
                <div class="wiki-description">
                    ${hasWiki ? `<p>${formatWikiText(wikiData[0].body)}</p>` :
                    `<p>No wiki information available for this tag${hasPosts ? ', but images are available.' : '.'}</p>`}
                </div>
            </div>
            <div class="wiki-image-section">
                ${hasPosts ? `
                    <div class="wiki-image-container">
                        <button class="image-nav-button prev" title="Previous image">←</button>
                        <img class="wiki-image" src="" alt="Tag example">
                        <button class="image-nav-button next" title="Next image">→</button>
                    </div>
                    <div class="wiki-nav-buttons">
                        <button class="wiki-button view-on-danbooru">View on Danbooru</button>
                    </div>
                ` : `
                    <div class="no-images-message">No images available for this tag</div>
                `}
            </div>
        `;

        // Always attach wiki tag event listeners
        attachWikiEventListeners();

        // Only display images if we have posts
        if (hasPosts) {
            displayPostImage(currentPosts[0]);
        }
    }

    function formatWikiText(text) {
        // Remove backticks that sometimes wrap the content
        text = text.replace(/^`|`$/g, '');

        // First handle the complex patterns
        text = text
            // Handle list items with proper indentation
            .replace(/^\* (.+)$/gm, '<li>$1</li>')


            // Handle Danbooru internal paths (using absolute URLs)
            .replace(/"([^"]+)":\s*\/((?:[\w-]+\/)*[\w-]+(?:\?[^"\s]+)?)/g, (match, text, path) => {
                const fullUrl = `https://danbooru.donmai.us/${path.trim()}`;
                return `<a class="wiki-link" href="${fullUrl}" target="_blank">${text}</a>`;
            })

            // Handle named links with square brackets
            .replace(/"([^"]+)":\[([^\]]+)\]/g, '<a class="wiki-link" href="$2" target="_blank">$1</a>')

            // Handle post references
            .replace(/!post #(\d+)/g, '<a class="wiki-link" href="https://danbooru.donmai.us/posts/$1" target="_blank">post #$1</a>')

            // Handle external links with proper URL capture (must come before wiki links)
            .replace(/"([^"]+)":\s*(https?:\/\/[^\s"]+)/g, '<a class="wiki-link" href="$2" target="_blank">$1</a>')

            // Handle wiki links with display text, preserving special characters
            .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (match, tag, display) => {
                const cleanTag = tag.trim();
                return `<span class="wiki-tag" data-tag="${cleanTag}">${display}</span>`;
            })

            // Handle simple wiki links, preserving special characters
            .replace(/\[\[([^\]]+)\]\]/g, (match, tag) => {
                const cleanTag = tag.trim();
                return `<span class="wiki-tag" data-tag="${cleanTag}">${cleanTag}</span>`;
            })

            // Handle BBCode
            .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
            .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
            .replace(/\[code\](.*?)\[\/code\]/g, '<code>$1</code>')
            .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')

            // Handle headers with proper spacing
            .replace(/^h([1-6])\.\s*(.+)$/gm, (_, size, content) => `\n<h${size}>${content}</h${size}>\n`)

            // Add spacing after tag name at start of line
        // Handle line breaks and paragraphs
        text = text
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/\n\n+/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // Wrap lists in ul tags
        text = text.replace(/(<li>.*?<\/li>)\s*(?=<li>|$)/gs, '<ul>$1</ul>');

        // Wrap in paragraph if not already wrapped
        if (!text.startsWith('<p>')) {
            text = `<p>${text}</p>`;
        }

        return text;
    }

    // Separate the keyboard handler into its own function
    function handleWikiKeydown(e) {
        if (wikiOverlay.style.display === 'block') {
            if (e.key === 'ArrowLeft') navigateImage(-1);
            if (e.key === 'ArrowRight') navigateImage(1);
        }
    }

    function attachWikiEventListeners() {
        const prevButton = wikiContent.querySelector('.image-nav-button.prev');
        const nextButton = wikiContent.querySelector('.image-nav-button.next');
        const viewButton = wikiContent.querySelector('.view-on-danbooru');
        const wikiImage = wikiContent.querySelector('.wiki-image');
        const wikiTags = wikiContent.querySelectorAll('.wiki-tag');

        // Only attach image navigation related listeners if we have posts
        if (currentPosts.length > 0) {
            if (prevButton) {
                prevButton.addEventListener('click', () => navigateImage(-1));
            }
            if (nextButton) {
                nextButton.addEventListener('click', () => navigateImage(1));
            }

            // Add keyboard navigation only if we have posts
            document.removeEventListener('keydown', handleWikiKeydown);
            document.addEventListener('keydown', handleWikiKeydown);

            if (wikiImage) {
                wikiImage.addEventListener('click', () => {
                    if (currentPosts[currentPostIndex]) {
                        window.open(currentPosts[currentPostIndex].large_file_url, '_blank');
                    }
                });
            }

            if (viewButton) {
                viewButton.addEventListener('click', () => {
                    if (currentPosts[currentPostIndex]) {
                        window.open(`https://danbooru.donmai.us/posts/${currentPosts[currentPostIndex].id}`, '_blank');
                    }
                });
            }
        }

        // Wiki tag navigation works regardless of posts
        if (wikiTags) {
            wikiTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    const tagName = tag.dataset.tag;
                    loadWikiInfo(tagName);
                });
            });
        }
    }

    function displayPostImage(post) {
        const imageContainer = wikiContent.querySelector('.wiki-image-container');
        if (!imageContainer) return; // Guard against missing container

        if (!post || (!post.preview_file_url && !post.file_url)) return;

        const prevButton = imageContainer.querySelector('.image-nav-button.prev');
        const nextButton = imageContainer.querySelector('.image-nav-button.next');
        const image = imageContainer.querySelector('.wiki-image');

        if (!image) return; // Guard against missing image element

        image.src = post.large_file_url || post.preview_file_url || post.file_url;

        if (prevButton) prevButton.style.visibility = currentPostIndex <= 0 ? 'hidden' : 'visible';
        if (nextButton) nextButton.style.visibility = currentPostIndex >= currentPosts.length - 1 ? 'hidden' : 'visible';

        // Remove any existing event listeners first to prevent duplicates
        const newPrevButton = prevButton.cloneNode(true);
        const newNextButton = nextButton.cloneNode(true);

        prevButton.parentNode.replaceChild(newPrevButton, prevButton);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);

        // Attach fresh event listeners
        newPrevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateImage(-1);
        });

        newNextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateImage(1);
        });

        // Reattach image click listener
        image.addEventListener('click', () => {
            window.open(post.large_file_url || post.file_url, '_blank');
        });
    }

    function navigateImage(direction) {
        const newIndex = currentPostIndex + direction;
        if (newIndex >= 0 && newIndex < currentPosts.length) {
            currentPostIndex = newIndex;
            displayPostImage(currentPosts[newIndex]);
        }
    }

    // Add new function for wiki search autocomplete
    function setupWikiSearchAutocomplete(searchBar) {
        const suggestionsBox = document.createElement('div');
        suggestionsBox.className = 'wiki-search-suggestions';
        suggestionsBox.style.display = 'none';
        document.body.appendChild(suggestionsBox); // Append to body instead

        let selectedIndex = -1;

        // Update suggestions box position when showing
        function updateSuggestionsPosition() {
            const searchBarRect = searchBar.getBoundingClientRect();
            suggestionsBox.style.top = `${searchBarRect.bottom + window.scrollY}px`;
        }

        searchBar.addEventListener('input', () => {
            const term = searchBar.value.replace(/\s+/g, '_').trim();
            if (term) {
                fetchSuggestionsForWiki(term, suggestionsBox);
                updateSuggestionsPosition();
            } else {
                suggestionsBox.style.display = 'none';
            }
        });

        // Update position on scroll or resize
        window.addEventListener('scroll', () => {
            if (suggestionsBox.style.display === 'block') {
                updateSuggestionsPosition();
            }
        });

        window.addEventListener('resize', () => {
            if (suggestionsBox.style.display === 'block') {
                updateSuggestionsPosition();
            }
        });

        searchBar.addEventListener('keydown', (e) => {
            const suggestions = suggestionsBox.children;
            if (suggestions.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                updateWikiSuggestionSelection(suggestions, selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateWikiSuggestionSelection(suggestions, selectedIndex);
            } else if (e.key === 'Enter' && selectedIndex !== -1) {
                e.preventDefault();
                searchBar.value = suggestions[selectedIndex].textContent;
                suggestionsBox.style.display = 'none';
                loadWikiInfo(searchBar.value);
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    function fetchSuggestionsForWiki(term, suggestionsBox) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `https://gelbooru.com/index.php?page=autocomplete2&term=${encodeURIComponent(term)}&type=tag_query&limit=10`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            showWikiSuggestions(data, suggestionsBox);
                        } catch (e) {
                            console.error("Error parsing suggestions:", e);
                        }
                    }
                }
            });
        }, debounceDelay);
    }

    function showWikiSuggestions(suggestions, suggestionsBox) {
        suggestionsBox.innerHTML = '';
        if (suggestions.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'wiki-search-suggestion';
            div.textContent = suggestion.label;
            div.addEventListener('click', () => {
                const searchBar = suggestionsBox.parentNode.querySelector('.wiki-search-bar');
                searchBar.value = suggestion.label;
                suggestionsBox.style.display = 'none';
                loadWikiInfo(suggestion.label);
            });
            suggestionsBox.appendChild(div);
        });

        suggestionsBox.style.display = 'block';
    }

    function updateWikiSuggestionSelection(suggestions, selectedIndex) {
        Array.from(suggestions).forEach((suggestion, index) => {
            suggestion.classList.toggle('selected', index === selectedIndex);
            if (index === selectedIndex) {
                suggestion.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // Ensure script runs as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        loadSettings();
        setupAutocomplete();
        initializeWiki();
    });

})();