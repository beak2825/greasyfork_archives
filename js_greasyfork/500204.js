// ==UserScript==
// @name         Copy HTML to Anki (Refresh Before Each Copy)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Always refresh the page before copying HTML to Anki. You can choose normal or random ID via floating menu or keyboard shortcut. After reload, it auto-copies once then clears the flag so you can repeat when needed.
// @author       nabe
// @match        https://cards.ucalgary.ca/card/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500204/Copy%20HTML%20to%20Anki%20%28Refresh%20Before%20Each%20Copy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500204/Copy%20HTML%20to%20Anki%20%28Refresh%20Before%20Each%20Copy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // LOCALSTORAGE KEY used to store whether we want to run "copyHtmlToAnki"
    // after the page reloads, and whether we want random ID or not.
    const REFRESH_COPY_KEY = 'doRefreshCopyMode';
    // possible values: "normal" or "random" (or null/undefined if not set)

    /********************************************************
     * 1) Check localStorage on load. If set => do the copy.
     ********************************************************/
    const pendingMode = localStorage.getItem(REFRESH_COPY_KEY);
    if (pendingMode) {
        console.log('[RefreshAnki] Detected pendingMode =', pendingMode);

        // Clear so we only do it once
        localStorage.removeItem(REFRESH_COPY_KEY);

        // Actually do the copy with or without random ID
        if (pendingMode === 'random') {
            copyHtmlToAnki(true);
        } else {
            copyHtmlToAnki(false);
        }
    }

    /********************************************************
     * 2) MAIN FUNCTION - Copy HTML to Anki
     ********************************************************/
    function copyHtmlToAnki(generateRandomID = false) {
        console.log(`[RefreshAnki] copyHtmlToAnki() called. generateRandomID = ${generateRandomID}`);

        // Helper: convert relative URLs to absolute
        function makeAbsolute(url) {
            return new URL(url, document.baseURI).href;
        }

        // Helper: random numeric string
        function generateRandomString(length) {
            let result = '';
            const characters = '0123456789';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        // Clone the entire document
        let docClone = document.documentElement.cloneNode(true);

        // Convert all [src] and [href] to absolute
        let elements = docClone.querySelectorAll('[src], [href]');
        elements.forEach(el => {
            if (el.hasAttribute('src')) {
                el.setAttribute('src', makeAbsolute(el.getAttribute('src')));
            }
            if (el.hasAttribute('href')) {
                el.setAttribute('href', makeAbsolute(el.getAttribute('href')));
            }
        });

        // Example extractions (adjust selectors as needed):
        let frontElement = docClone.querySelector('.container.card');
        let frontField = frontElement ? frontElement.innerHTML : '';

        let frontImageUrl = docClone.querySelector('.group.img a.img-fill')?.getAttribute('href') || '';

        let photoQuestionElement = docClone.querySelector('.solution.container .photo-question');
        let photoQuestion = photoQuestionElement ? photoQuestionElement.outerHTML : '';

        let questionField = docClone.querySelector('form.question h3')?.innerText.trim() || '';

        let optionField = Array.from(docClone.querySelectorAll('.options .option'))
            .map(opt => opt.innerText.trim())
            .filter(txt => txt)
            .map(txt => `<li>${txt}</li>`)
            .join('') || '';

        let backField = Array.from(docClone.querySelectorAll('.options .option.correct'))
            .map(opt => opt.innerText.trim())
            .filter(txt => txt)
            .map(txt => `<li>${txt}</li>`)
            .join('') || '';

        let extraElement = docClone.querySelector('.results.container.collected .feedback-container .text');
        let extraField = extraElement ? extraElement.innerHTML : '';
        let extraFieldText = extraElement ? extraElement.innerText.trim() : '';

        let webpageURL = window.location.href;

        // Build unique ID
        let uniqueID = generateRandomID
            ? generateRandomString(10)
            : questionField + backField + extraField + photoQuestion;

        // Construct note fields
        let noteFields = {
            "Front": frontField + "<br>" + photoQuestion,
            "Question": questionField,
            "Options": `<div class="psol">${optionField}</div>`,
            "Back": `<div class="psol">${backField}</div>`,
            "Feedback": extraFieldText,
            "Extra": extraField,
            "Link": `<a href="${webpageURL}">Link To Card</a>`,
            "UniqueID": uniqueID,
            "Front Image": `<img src="${frontImageUrl}">`
        };

        console.log('[RefreshAnki] Sending note fields to AnkiConnect:', noteFields);

        // Send to AnkiConnect
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:8765",
            data: JSON.stringify({
                action: "addNote",
                version: 6,
                params: {
                    note: {
                        deckName: "Default",
                        modelName: "uofcCard",
                        fields: noteFields,
                        tags: [webpageURL]
                    }
                }
            }),
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                console.log("Response from AnkiConnect:", response);
                if (response.status === 200) {
                    console.log("Successfully added note to Anki!");
                } else {
                    console.error("Failed to send note fields to Anki.");
                }
            }
        });
    }

    /********************************************************
     * 3) REFRESH-THEN-COPY HELPER
     ********************************************************/
    // Instead of copying immediately, we set localStorage
    // so after reload the script calls copyHtmlToAnki().

    function refreshThenCopy(generateRandomID) {
        const mode = generateRandomID ? 'random' : 'normal';
        console.log(`[RefreshAnki] refreshThenCopy() was called, setting doRefreshCopyMode=${mode} then reloading...`);
        localStorage.setItem(REFRESH_COPY_KEY, mode);
        location.reload();
    }

    /********************************************************
     * 4) OPTIONAL KEYBOARD SHORTCUT => Refresh & Copy
     ********************************************************/
    // If you prefer a direct copy (without refresh) on the shortcut,
    // then just call copyHtmlToAnki(true). But you specifically want
    // a refresh each time, so let's do it that way:
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyY') {
            // Refresh page, then copy with random ID
            refreshThenCopy(true);
        }
    });

    /********************************************************
     * 5) FLOATING MENU => Refresh & Copy
     ********************************************************/
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '10px';
    menuContainer.style.left = '10px';
    menuContainer.style.zIndex = 9999;
    menuContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    menuContainer.style.border = '1px solid #ccc';
    menuContainer.style.padding = '5px';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.fontFamily = 'sans-serif';
    menuContainer.style.fontSize = '14px';

    const title = document.createElement('div');
    title.textContent = 'Anki Refresh Menu';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    menuContainer.appendChild(title);

    // Button 1: Refresh + Copy (No Random ID)
    const btnNormal = document.createElement('button');
    btnNormal.textContent = 'Refresh & Copy (No Random ID)';
    btnNormal.style.display = 'block';
    btnNormal.style.marginBottom = '5px';
    btnNormal.onclick = () => refreshThenCopy(false);
    menuContainer.appendChild(btnNormal);

    // Button 2: Refresh + Copy (Random ID)
    const btnRandom = document.createElement('button');
    btnRandom.textContent = 'Refresh & Copy (Random ID)';
    btnRandom.style.display = 'block';
    btnRandom.onclick = () => refreshThenCopy(true);
    menuContainer.appendChild(btnRandom);

    document.body.appendChild(menuContainer);

})();
