// ==UserScript==
// @name         MusixmatchToolToTranslate
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Overlay to translate on musixmatch (Ctrl +O)
// @author       nicola02nb (https://gist.github.com/nicola02nb)
// @match        https://curators.musixmatch.com/tool*mode=translate*
// @match        https://curators-beta.musixmatch.com/tool*mode=translate*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musixmatch.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/516982/MusixmatchToolToTranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/516982/MusixmatchToolToTranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to decode HTML entities
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Function to translate text using Google Translate API
    async function translateText(text, targetLang = 'en') {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${settings.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
            }),
        });

        const data = await response.json();
        return decodeHTMLEntities(data.data.translations[0].translatedText);
    }

    async function translateLine(source, target){
        try {
            const tr = await translateText(source.textContent, settings.trLang);
            // Capitalize the first letter
            let formatted = tr.charAt(0).toUpperCase() + tr.slice(1);
            // Remove the last character if it's a period or comma
            if (formatted.endsWith('.') || formatted.endsWith(',')) {
                formatted = formatted.slice(0, -1);
            }
            target.removeAttribute('readonly');
            target.innerText = formatted;
            var event = new window.Event('change', { bubbles: true });
            target.dispatchEvent(event);
            return 1;
        } catch (error) {
            console.error(`Error translating line with id ${target.id}:`, error);
            return 0;
        }
    }

    async function translateLines(){
        console.log('Translating all lines!');
        var translated=0;
        var promises = [];
        lines.forEach((value, key) => {
            //console.log(`Translating line ${key}`);
            if(value.needTranslation || settings.overrideAlreadyPresent){
                promises.push(translateLine(value.source, value.target));
            } else{
                console.log(`Skipping line ${key}`);
            }
        });
        // Wait for all the promises to resolve
        const results = await Promise.all(promises);
        // Sum the results (1 for success, 0 for failure)
        translated = results.reduce((sum, result) => sum + result, 0);
        return translated;
    }

    function detectLines(){
        info = { totalLines: 0, sourceEmpty: 0, needsTranslation: 0 }
        let sourceLines = document.querySelectorAll('label[for^="input-"]');
        sourceLines.forEach(label => {
            // Extract the value of the 'for' attribute
            const forAttribute = label.getAttribute('for');
            // Get the part of the 'for' attribute after "input-"
            const id = forAttribute.slice(6); // "input-" is 6 characters long
            // Find the first <span> inside the label
            const firstSpan = label.querySelector('span');
            // Check if the <span> exists, then log both values
            var emptyS = label.textContent === "";

            var target = document.getElementById("input-" + id);
            var emptyT = target.textContent === "";

            lines.set(id, { source: label, target: target, needTranslation: emptyT});

            info.totalLines = lines.size;
            if(emptyS){
                info.sourceEmpty++;
            }
            if(emptyT){
                info.needsTranslation++;
            }
        });
    }

    async function translate(){
        var translated = await translateLines();
        console.log(`Translated ${translated} lines of the Total Lines(${info.totalLines})!`);
    }

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            console.log('Ctrl + O was pressed!');
            detectLines();
            console.log(info);
            showOverlay();
        }
    });

    let settings = {
        apiKey: undefined,
        trLang: "en",
        overrideAlreadyPresent: false
    }
    if(GM_getValue("mx-tr-settings")){
        settings = GM_getValue("mx-tr-settings");
    }

    let lines = new Map();
    let info = {
        totalLines: 0,
        sourceEmpty: 0,
        needsTranslation: 0
    }

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none'; // Hidden by default

    // Add overlay to the body
    document.body.appendChild(overlay);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '50%';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translate(-50%, -50%)';
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
    overlay.appendChild(buttonContainer);

    // Create a button
    const button = document.createElement('button');
    button.textContent = 'Translate';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.addEventListener('click', () => {
        if(requestApiKey()){
            translate();
            hideOverlay();
        }
    });
    buttonContainer.appendChild(button);

    // Create radio buttons
    const radioContainer = document.createElement('div');
    radioContainer.style.color = 'white';
    const radioLabel = document.createElement('label');
    radioLabel.textContent = 'Translate lines already translated: ';
    radioContainer.appendChild(radioLabel);

    const radio1 = document.createElement('input');
    radio1.type = 'radio';
    radio1.name = 'option';
    const label1 = document.createElement('label');
    label1.textContent = 'Yes';

    const radio2 = document.createElement('input');
    radio2.type = 'radio';
    radio2.name = 'option';
    radio2.checked = true;
    const label2 = document.createElement('label');
    label2.textContent = 'No';

    // Event listener for radio buttons (when user selects a radio option)
    radio1.addEventListener('change', () => {
        if (radio1.checked) {
            settings.overrideAlreadyPresent = true;
        }
    });

    radio2.addEventListener('change', () => {
        if (radio2.checked) {
            settings.overrideAlreadyPresent = false;
        }
    });

    radioContainer.appendChild(radio1);
    radioContainer.appendChild(label1);
    radioContainer.appendChild(radio2);
    radioContainer.appendChild(label2);
    buttonContainer.appendChild(radioContainer);

    // Create language list (dropdown)
    const languageList = document.createElement('select');
    languageList.style.padding = '10px';
    languageList.style.fontSize = '16px';

    // Language options: (Example with short codes like 'EN', 'FR', etc.)
    // https://support.musixmatch.com/en/articles/224883-localization-currently-supported-languages
    const languages = [
        { code: 'af', name: 'Afrikaans' },
        { code: 'ar', name: 'Arabic' },
        { code: 'ca', name: 'Catalan' },
        { code: 'zh-CN', name: 'Chinese Simplified' },
        { code: 'zh-TW', name: 'Chinese Traditional' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'nl', name: 'Dutch' },
        { code: 'en', name: 'English' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'id', name: 'Indonesian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'no', name: 'Norwegian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'pt-BR', name: 'Portuguese (Brazilian)' },
        { code: 'ro', name: 'Romanian' },
        { code: 'ru', name: 'Russian' },
        { code: 'sr', name: 'Serbian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'vi', name: 'Vietnamese' }
    ];

    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.textContent = `${language.name} (${language.code})`;
        languageList.appendChild(option);
    });
    languageList.value = settings.trLang;

    // Event listener for language list change
    languageList.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        settings.trLang = selectedLanguage;
        GM_setValue("mx-tr-settings", settings);
        //console.log('Selected language code:', selectedLanguage);
    });

    buttonContainer.appendChild(languageList);

    // Add a button to clear apiKey
    const apiButton = document.createElement('button');
    apiButton.textContent = 'Clear Api Key';
    apiButton.style.marginTop = '20px';
    apiButton.style.padding = '10px 20px';
    apiButton.style.fontSize = '16px';
    apiButton.style.cursor = 'pointer';
    apiButton.style.border = 'none';
    apiButton.style.borderRadius = '5px';
    apiButton.style.backgroundColor = '#f2a63a';
    apiButton.style.color = 'white';
    apiButton.addEventListener('click', () => { settings.apiKey = undefined; GM_setValue("mx-tr-settings", settings); });
    buttonContainer.appendChild(apiButton);

    // Add a close button to hide the overlay
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Overlay';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.addEventListener('click', hideOverlay);
    buttonContainer.appendChild(closeButton);

    function hideOverlay(){
        overlay.style.display = 'none';
    }

    function showOverlay() {
        overlay.style.display = 'block';
        requestApiKey();
    }

    function requestApiKey(){
        if (!settings.apiKey) {
            const enteredKey = prompt("Please enter your API key for Google Translate:");
            if (enteredKey) {
                settings.apiKey = enteredKey;
                GM_setValue("mx-tr-settings", settings);
                return true;
            }
            console.error("MISSING GOOGLE TRANSLATE API KEY");
            return false;
        }
        return true;
    }

    console.log('Translate and copy script loaded');

    /*Old
// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Function to handle text selection
async function handleSelection() {
  console.log('Mouseup!');
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText && selection.anchorNode) {
    const span = selection.anchorNode.parentElement.closest('span.css-1qaijid.r-fdjqy7.r-1inkyih.r-135wba7.r-13awgt0');

    if (span) {
      console.log('Selected text:', selectedText);
      try {
        const translatedText = await translateText(selectedText);
        copyToClipboard(translatedText);
        console.log('Translated and copied to clipboard:', translatedText);
      } catch (error) {
        console.error('Error translating or copying text:', error);
      }
    } else {
      console.log('Selected text is not within the target span');
    }
  }
}
document.addEventListener('mouseup', handleSelection);
*/
})();