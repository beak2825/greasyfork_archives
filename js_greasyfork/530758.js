// ==UserScript==
// @name         Acapela Group TTS Reader - Enhanced Fixed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Transform Acapela Group demo page into a clean TTS reader with improved UI
// @author       Flejta
// @license      MIT
// @match        https://www.acapela-group.com/demos/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530758/Acapela%20Group%20TTS%20Reader%20-%20Enhanced%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/530758/Acapela%20Group%20TTS%20Reader%20-%20Enhanced%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to fully load
    window.addEventListener('load', function() {
        // Reference to the voices div
        const voicesDiv = document.getElementById('voices');
        if (!voicesDiv) return;

        // STEP 1: Remove unwanted elements from page but keep voices div intact
        const elementsToRemove = [
            '.demo-sub-footer-t7',
            '.demo-sub-footer',
            '.push-demo',
            '.mobile-header',
            '.breadcrumb',
            '.page-header',
            '.section.no-padding',
            '.footer',
            '.header-container',
            '.grid-shower',
            '.masks',
            '.fullscreen-panel',
            '.pop-up-container'
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // STEP 2: Modify the body to create a clean slate but keep voices div
        // Important: We keep voices div in its original position to maintain functionality
        document.body.innerHTML = '';

        // Center content with a container
        const container = document.createElement('div');
        container.className = 'tts-container';
        document.body.appendChild(container);

        // Add the voices div to our container
        container.appendChild(voicesDiv);

        // STEP 3: Add our custom header without touching the original DOM structure
        const header = document.createElement('header');
        header.className = 'tts-header';
        header.innerHTML = `
            <h1>Acapela TTS Reader</h1>
            <p class="subtitle">Convert text to speech with high quality voices</p>
        `;
        container.insertBefore(header, voicesDiv);

        // STEP 4: Apply styling improvements to the form without restructuring it
        const demoForm = voicesDiv.querySelector('form');
        if (demoForm) {
            // Apply classes to existing elements to style them better
            demoForm.classList.add('tts-form');

            // Find the demo content section
            const demoContent = demoForm.querySelector('.demo-content');
            if (demoContent) {
                demoContent.classList.add('tts-main');

                // Find form elements to improve their appearance
                const languageSelectWrapper = demoContent.querySelector('.select');
                if (languageSelectWrapper) {
                    languageSelectWrapper.classList.add('tts-control-item');

                    // Add labels to controls
                    const languageLabel = document.createElement('label');
                    languageLabel.htmlFor = 'voices_languages';
                    languageLabel.textContent = 'Language';
                    languageLabel.classList.add('control-label');
                    languageSelectWrapper.insertBefore(languageLabel, languageSelectWrapper.firstChild);
                }

                // Improve voice selection
                const voiceSelectWrapper = demoContent.querySelectorAll('.select')[1];
                if (voiceSelectWrapper) {
                    voiceSelectWrapper.classList.add('tts-control-item');

                    // Add label to voice select
                    const voiceLabel = document.createElement('label');
                    voiceLabel.htmlFor = 'voices_voice';
                    voiceLabel.textContent = 'Voice';
                    voiceLabel.classList.add('control-label');
                    voiceSelectWrapper.insertBefore(voiceLabel, voiceSelectWrapper.firstChild);
                }

                // Improve checkbox and terms areas - wrap in a div for styling
                const checkboxes = demoContent.querySelectorAll('.checkbox-container');
                if (checkboxes.length) {
                    const checkboxGroup = document.createElement('div');
                    checkboxGroup.className = 'tts-checkbox-group';

                    // Move checkboxes to the group
                    checkboxes.forEach(checkbox => {
                        // Give the labels nicer styling without changing the structure
                        checkbox.classList.add('improved-checkbox');
                        const label = checkbox.querySelector('.label');
                        if (label) label.classList.add('checkbox-label');
                    });

                    // Create checkbox container without removing original ones
                    // This approach preserves event listeners
                    const checkboxParent = checkboxes[0].parentNode;
                    checkboxParent.insertBefore(checkboxGroup, checkboxes[0]);

                    // Move checkboxes to our new group
                    checkboxes.forEach(checkbox => {
                        checkboxGroup.appendChild(checkbox);
                    });
                }

                // Improve textarea
                const textareaWrapper = demoContent.querySelector('.input-wrapper');
                if (textareaWrapper) {
                    textareaWrapper.classList.add('tts-textarea-wrapper');

                    const textarea = textareaWrapper.querySelector('#voices_tts');
                    if (textarea) {
                        // Remove maxlength attribute or set to very high value
                        textarea.removeAttribute('maxlength');

                        // Add placeholder
                        textarea.placeholder = "Type or paste your text here to convert it to speech...";

                        // Add a label
                        const textareaLabel = document.createElement('label');
                        textareaLabel.htmlFor = 'voices_tts';
                        textareaLabel.textContent = 'Your Text';
                        textareaLabel.classList.add('control-label', 'textarea-label');
                        textareaWrapper.insertBefore(textareaLabel, textarea);
                    }
                }

                // Style the submit/player section better
                const demoFooter = demoForm.querySelector('.demo-footer');
                if (demoFooter) {
                    demoFooter.classList.add('tts-player-section');

                    // Do NOT restructure the wrapper-btn div as it contains crucial player elements
                    const wrapperBtn = demoFooter.querySelector('.wrapper-btn');
                    if (wrapperBtn) {
                        wrapperBtn.classList.add('tts-controls-wrapper');
                    }

                    // Make sure terms checkbox is checked by default
                    const termsCheckbox = demoForm.querySelector('#terms');
                    if (termsCheckbox) {
                        termsCheckbox.checked = true;
                    }
                }
            }
        }

        // STEP 5: Add custom CSS for styling without affecting functionality
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
                color: #333;
            }

            /* Container per centrare il contenuto */
            .tts-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #voices {
                width: 90%;
                margin: 0 auto 40px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }

            .tts-header {
                text-align: center;
                width: 90%;
                margin: 0 auto 30px;
                padding: 30px 0;
                background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .tts-header h1 {
                margin: 0;
                font-size: 2.5rem;
                font-weight: 300;
            }

            .tts-header .subtitle {
                margin: 10px 0 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }

            .tts-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
                width: 100%;
            }

            .tts-main {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 30px;
            }

            /* Style controls to be inline */
            .demo-content > .select {
                display: inline-block;
                width: calc(50% - 15px);
                margin-right: 15px;
                vertical-align: top;
            }

            .tts-control-item {
                margin-bottom: 20px;
            }

            .control-label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #555;
                font-size: 14px;
            }

            .textarea-label {
                font-size: 16px;
            }

            select.simple-select {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                background-color: white;
                transition: border 0.3s;
            }

            select.simple-select:focus {
                border-color: #9d50bb;
                outline: none;
                box-shadow: 0 0 0 3px rgba(157, 80, 187, 0.2);
            }

            .tts-checkbox-group {
                display: flex;
                flex-direction: row;
                gap: 20px;
                margin-top: 10px;
                margin-bottom: 20px;
            }

            .improved-checkbox {
                display: flex;
                align-items: center;
                cursor: pointer;
                margin-bottom: 10px;
            }

            .checkbox-label {
                margin-left: 8px;
                font-size: 14px;
            }

            .tts-textarea-wrapper {
                margin-top: 15px;
                width: 100%;
            }

            textarea#voices_tts {
                width: 100%;
                min-height: 400px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                line-height: 1.5;
                resize: vertical;
                transition: border 0.3s;
                box-sizing: border-box;
            }

            textarea#voices_tts:focus {
                border-color: #9d50bb;
                outline: none;
                box-shadow: 0 0 0 3px rgba(157, 80, 187, 0.2);
            }

            .tts-player-section {
                margin-top: 20px;
                padding: 20px;
                background: #f8f8f8;
                border-radius: 8px;
            }

            .tts-controls-wrapper {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            #voices_submit {
                background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            #voices_submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(110, 72, 170, 0.3);
            }

            .play-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #f0f0f0;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.3s;
            }

            .play-btn:hover {
                background: #e0e0e0;
            }

            .player-time {
                font-family: monospace;
                font-size: 14px;
                color: #666;
            }

            @media (max-width: 768px) {
                .demo-content > .select {
                    display: block;
                    width: 100%;
                    margin-right: 0;
                }
            }

            /* Hide email field which is probably for spam protection */
            .emailjscheck {
                display: none;
            }
        `;
        document.head.appendChild(style);

        // Focus on textarea when page loads and set default language and voice
        const textarea = document.getElementById('voices_tts');
        if (textarea) {
            // Clear any default text and focus
            if (textarea.value === textarea.defaultValue) {
                textarea.value = "";
            }
            textarea.focus();
        }

        // STEP 6: Set default language and voice
        // Set Italian language
        const languageSelect = document.getElementById('voices_languages');
        if (languageSelect) {
            // Select Italian (sonid18)
            languageSelect.value = 'sonid18';

            // Trigger change event to load Italian voices
            const changeEvent = new Event('change', { bubbles: true });
            languageSelect.dispatchEvent(changeEvent);

            // Wait for voices to load and then select the preferred voice
            const checkVoices = setInterval(() => {
                const voiceSelect = document.getElementById('voices_voice');
                if (voiceSelect && voiceSelect.options.length > 0) {
                    // Check if the option we want is available
                    let targetOption = Array.from(voiceSelect.options).find(
                        option => option.value === 'Barbarabtob (neural premium voice)'
                    );

                    if (targetOption) {
                        // Select our preferred voice
                        voiceSelect.value = 'Barbarabtob (neural premium voice)';
                        // Trigger change event
                        voiceSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        clearInterval(checkVoices);
                    } else if (voiceSelect.options.length > 1) {
                        // If our specific voice isn't available but voices loaded, stop checking
                        clearInterval(checkVoices);
                    }
                }
            }, 300); // Check every 300ms

            // Set a timeout to clear the interval if it takes too long
            setTimeout(() => clearInterval(checkVoices), 5000);
        }
    });
})();