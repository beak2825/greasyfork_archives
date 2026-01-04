// ==UserScript==
// @name        Gemini Wide Screen and Input Box Height Adjuster
// @namespace   http://www.jeffbyers.com
// @match       https://gemini.google.com/*
// @grant       none
// @version     2.0
// @author      Jeff Byers <jeff@jeffbyers.com>
// @license     GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright   Copyright (C) 2024, by Jeff Byers <jeff@jeffbyers.com>
// @icon        https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png
// @description Makes the Google Gemini conversation window the full width of the browser window and adds buttons to change the input text area height.
// @icon        https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png
// @downloadURL https://update.greasyfork.org/scripts/496373/Gemini%20Wide%20Screen%20and%20Input%20Box%20Height%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/496373/Gemini%20Wide%20Screen%20and%20Input%20Box%20Height%20Adjuster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // global toggles
    let wideModeEnabled = localStorage.getItem('geminiWideModeEnabled') === 'true';
    let buttonCreated = false;
    let pageReady = false;

    // global variables for max rows (load from sessionStorage if available)
    let maxRowsWide = parseInt(sessionStorage.getItem('maxRowsWide'), 10) || 12;
    let minRowsWide = parseInt(sessionStorage.getItem('minRowsWide'), 10) || 6;
    let minRowsNormal = parseInt(sessionStorage.getItem('minRowsNormal'), 10) || 3;
    let maxRowsNormal = parseInt(sessionStorage.getItem('maxRowsNormal'), 10) || 8;

    // custom trusted types handling
    let needsTrustedHTML = false;
    const passThroughFunc = (string, sink) => string;
    const TTPName = "geminiStylePolicy";
    let TP = {
        createHTML: passThroughFunc,
        createScript: passThroughFunc,
        createScriptURL: passThroughFunc,
    };

    try {
        if (
            typeof window.isSecureContext !== "undefined" &&
            window.isSecureContext
        ) {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                if (trustedTypes.defaultPolicy) {
                    TP = trustedTypes.defaultPolicy;
                } else {
                    TP = window.trustedTypes.createPolicy(TTPName, TP);
                }
                needsTrustedHTML = true;
            }
        }
    } catch (e) {
        // log trusted types initialization error
        console.error("Error initializing Trusted Types:", e);
    }

    function trustedHTML(string) {
        try {
            return needsTrustedHTML ? TP.createHTML(string) : string;
        } catch (error) {
            console.error("Error in trustedHTML:", error, "Original string:", string);
            // fallback to returning the original string (unsafe, but allows debugging)
            return string;
        }
    }

    function getNonce() {
        const cspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspHeader) return null;
        const cspContent = cspHeader.content;
        const nonceMatch = cspContent.match(/nonce-(.+?)[';]/);
        return nonceMatch ? nonceMatch[1] : null;
    }

    function resizeStuff() {
        // directly set max-width
        const elementsToSetMaxWidth = document.querySelectorAll(
            'div.bottom-container, ' +
            'div.input-area-container, ' +
            'div.conversation-container, ' +
            '.text-input-field'
        );
        elementsToSetMaxWidth.forEach((element) => {
            element.style.maxWidth = wideModeEnabled ? '100%' : '';
        });

        // set --textarea-max-rows dynamically based on wideModeEnabled
        document.documentElement.style.setProperty('--textarea-max-rows', wideModeEnabled ? maxRowsWide : maxRowsNormal);
        document.documentElement.style.setProperty('--textarea-min-rows', wideModeEnabled ? Math.max(3, minRowsWide) : Math.max(3, minRowsNormal));

        // find and adjust rich-textarea .ql-editor
        const qlEditors = document.querySelectorAll('rich-textarea .ql-editor');
        qlEditors.forEach((editor) => {
            // Set --textarea-max-rows directly on the rich-textarea element
            editor.style.setProperty(
                '--textarea-max-rows',
                wideModeEnabled ? maxRowsWide : maxRowsNormal
            );

            editor.style.minHeight = 'calc((var(--textarea-min-rows, 0)) * 24px)';
            editor.style.maxHeight = 'calc((var(--textarea-max-rows, 0)) * 24px)';
        });
    }

    function toggleWideMode() {
        wideModeEnabled = !wideModeEnabled;
        resizeStuff();
        updateButtonIcon(); // update the icon
    }

    function windowSizeUp() {
        const preFullscreenElements = document.querySelectorAll('.pre-fullscreen');
        if (preFullscreenElements.length > 0 && wideModeEnabled) {
            maxRowsWide++; // increase max rows for wide mode if in fullscreen
            sessionStorage.setItem('maxRowsWide', maxRowsWide); // store in sessionStorage
        } else if (preFullscreenElements.length > 0 && !wideModeEnabled) {
            maxRowsNormal++; // increase max rows for normal mode if in fullscreen
            sessionStorage.setItem('maxRowsNormal', maxRowsNormal);
        } else if (!wideModeEnabled) {
            minRowsNormal++; // increase min rows for normal mode if not in fullscreen
            sessionStorage.setItem('minRowsNormal', minRowsNormal);
        } else {
            minRowsWide++; // increase min rows for wide mode if not in fullscreen
            sessionStorage.setItem('minRowsWide', minRowsWide);
        }
        resizeStuff(); // reapply styles to reflect the changes
    }

    function windowSizeDown() {
        const preFullscreenElements = document.querySelectorAll('.pre-fullscreen');
        if (preFullscreenElements.length > 0 && wideModeEnabled) {
            maxRowsWide = Math.max(minRowsWide, maxRowsWide - 1); // decrease max rows for wide mode if in fullscreen (but not below minRowsWide)
            sessionStorage.setItem('maxRowsWide', maxRowsWide); // store in sessionStorage

        } else if (preFullscreenElements.length > 0 && !wideModeEnabled) {
            maxRowsNormal = Math.max(minRowsNormal, maxRowsNormal - 1); // decrease max rows for normal mode if in fullscreen (but not below minRowsNormal)
            sessionStorage.setItem('maxRowsNormal', maxRowsNormal);

        } else if (!wideModeEnabled) {
            minRowsNormal = Math.max(1, minRowsNormal - 1); // decrease min rows for normal mode if not in fullscreen (but not below 1)
            sessionStorage.setItem('minRowsNormal', minRowsNormal);

        } else {
            minRowsWide = Math.max(1, minRowsWide - 1); // decrease min rows for wide mode if not in fullscreen (but not below 1)
            sessionStorage.setItem('minRowsWide', minRowsWide);
        }
        resizeStuff(); // reapply styles to reflect the changes
    }

    // modified addGlobalStyle using CSSStyleSheet (with fallback)
    function addGlobalStyle(css) {
        if (window.CSSStyleSheet && CSSStyleSheet.prototype.replaceSync) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(trustedHTML(css));
            document.adoptedStyleSheets = [sheet];
        } else {
            let head = document.head || document.getElementsByTagName('head')[0];
            if (!head) return;
            let style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = trustedHTML(css);
            head.appendChild(style);
        }
    }

    // function to create and insert the button (with error handling)
    function createToggleButton() {
        try {
            const inputButtonsWrapperBottom = document.querySelector('.input-buttons-wrapper-bottom');
            const inputButtonsWrapperTop = document.querySelector('.input-buttons-wrapper-top');

            if (!inputButtonsWrapperBottom || !inputButtonsWrapperTop) {
                console.log("One or both wrappers not found. Retrying...");
                setTimeout(createToggleButton, 100); // Retry after a delay
                return; // Exit the function if either wrapper is not found
            }

            // Check for existing buttons using a unique identifier (e.g., aria-label)
            if (inputButtonsWrapperTop.querySelector('[aria-label="Toggle Wide Mode"]') ||
                inputButtonsWrapperBottom.querySelector('[aria-label="Window Size Up"]') ||
                inputButtonsWrapperBottom.querySelector('[aria-label="Window Size Down"]')) {
                console.log("Buttons already exist. Skipping creation.");
                return; // Exit the function if any button already exists
            }

            // Create the buttons using Trusted Types
            const toggleButtonHTML = trustedHTML(`
                <div class="speech-dictation-mic-button ng-star-inserted">
                    <button data-node-type="speech_dictation_mic_button" maticonsuffix="" mat-icon-button=""
                        mattooltip="Wide Mode" aria-label="Toggle Wide Mode"
                        class="wide-screen-button mat-mdc-tooltip-trigger speech_dictation_mic_button mdc-icon-button mat-mdc-icon-button gmat-mdc-button-with-prefix mat-unthemed mat-mdc-button-base gmat-mdc-button">
                        <span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>
                        <div>
                            <span class="mat-icon notranslate google-symbols mat-icon-no-color" id="wide_screen_image" data-mat-iic class="material-symbols-outlined"></span>
                        </div>
                        <span class="mat-mdc-focus-indicator"></span>
                        <span class="mat-mdc-button-touch-target"></span>
                    </button>
                </div>
            `);

            const SizeButtonsHTML = trustedHTML(`
<div class="speech-dictation-mic-button ng-star-inserted">
      <button data-node-type="speech_dictation_mic_button" maticonsuffix="" mat-icon-button=""
        mattooltip="Size Down" aria-label="Window Size Down"
        class="wide-screen-button mat-mdc-tooltip-trigger speech_dictation_mic_button mdc-icon-button mat-mdc-icon-button gmat-mdc-button-with-prefix mat-unthemed mat-mdc-button-base gmat-mdc-button">
        <span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>
        <div>
          <span class="mat-icon notranslate google-symbols mat-icon-no-color" data-mat-iic class="material-symbols-outlined">keyboard_arrow_down</span>
        </div>
        <span class="mat-mdc-focus-indicator"></span>
        <span class="mat-mdc-button-touch-target"></span>
      </button>
    </div>
    <div class="speech-dictation-mic-button ng-star-inserted">
      <button data-node-type="speech_dictation_mic_button" maticonsuffix="" mat-icon-button=""
        mattooltip="Size Up" aria-label="Window Size Up"
        class="wide-screen-button mat-mdc-tooltip-trigger speech_dictation_mic_button mdc-icon-button mat-mdc-icon-button gmat-mdc-button-with-prefix mat-unthemed mat-mdc-button-base gmat-mdc-button">
        <span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>
        <div>
          <span class="mat-icon notranslate google-symbols mat-icon-no-color" data-mat-iic class="material-symbols-outlined">keyboard_arrow_up</span>
        </div>
        <span class="mat-mdc-focus-indicator"></span>
        <span class="mat-mdc-button-touch-target"></span>
      </button>
    </div>
  `);

            // use insertAdjacentHTML to add the buttons
            inputButtonsWrapperTop.insertAdjacentHTML('afterbegin', toggleButtonHTML);
            inputButtonsWrapperBottom.insertAdjacentHTML('afterend', SizeButtonsHTML);

            // add click event listeners
            const toggleButton = document.querySelector('[aria-label="Toggle Wide Mode"]');
            const sizeUpButton = document.querySelector('[aria-label="Window Size Up"]');
            const sizeDownButton = document.querySelector('[aria-label="Window Size Down"]');

            toggleButton.addEventListener('click', toggleWideMode);
            sizeUpButton.addEventListener('click', windowSizeUp);
            sizeDownButton.addEventListener('click', windowSizeDown);

            buttonCreated = true;
            console.log('Buttons created successfully! We\'re done.');
        } catch (error) {
            console.error("Error in createToggleButton:", error);
        }
    }

    // have to set pre-fullscreen globally as the elements don't exist when the page loads
    addGlobalStyle(trustedHTML(`
        div .pre-fullscreen {
            height: auto !important;
        }
        div .input-buttons-wrapper-top {
            right: 8px !important;
        }
        div .isFullscreen {
            max-height: 100% !important;
        }
    `));

    // function to update the button icon based on wideModeEnabled
    function updateButtonIcon() {
        const iconSpan = document.getElementById("wide_screen_image");
        if (iconSpan) {
            iconSpan.textContent = wideModeEnabled ? 'remove' : 'add';
        }
        // Store the updated state in localStorage
        localStorage.setItem('geminiWideModeEnabled', wideModeEnabled);
    }

    // function to check if page is loaded and ready for our button
    function checkIfPageReadyForButton() {
        if (document.readyState === 'complete' && !buttonCreated) {
            pageReady = true;
            console.log('Page is ready. Now make the button.');
            createToggleButton();
        }
    }

    // callback function for the MutationObserver
    function mutationObserverCallback() {
        checkIfPageReadyForButton(); // check if button needs to be created
        updateButtonIcon();
        resizeStuff(); // apply or update styles
    }

    // initial check and then MutationObserver to handle potential changes
    checkIfPageReadyForButton();

    const observer = new MutationObserver(mutationObserverCallback);
    observer.observe(document.body, { childList: true, subtree: true });
})();