// ==UserScript==
// @name         MyAnonamouse Book Title Capitalizer
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @license      MIT
// @description  Extracts book title, applies custom capitalization rules, and displays it.
// @author       markie
// @match        https://www.myanonamouse.net/t/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      api.dictionaryapi.dev
// @downloadURL https://update.greasyfork.org/scripts/536066/MyAnonamouse%20Book%20Title%20Capitalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536066/MyAnonamouse%20Book%20Title%20Capitalizer.meta.js
// ==/UserScript==
(function() {
    'use_strict';

    const lowercaseWords = [ /* ... same ... */
        'a', 'an', 'the', 'for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'about', 'above', 'across', 'against', 'along', 'amid', 'among', 'around', 'at', 'atop', 'barring', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'following', 'from', 'in', 'inside', 'into', 'minus', 'near', 'next', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 'past', 'pending', 'per', 'plus', 'regarding', 'respecting', 'round', 'through', 'throughout', 'till', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'unto', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without'
    ].map(w => w.toLowerCase());
    const dictionaryCache = new Map();
    const alwaysPreserveAcronyms = new Set([
 "USA", "UK", "EU", "UN", "IQ", "EQ", "AI", "IT", "HR",
        "BBC", "CNN", "FBI", "CIA", "KGB", "MI6", "IRS", "FAQ", "DIY",
        "HIV", "PTSD", "ADHD",
        "NASA", "NATO", "OPEC", "NAFTA", "ASEAN",
        "ISBN", "ISSN", "HTML", "HTTP", "HTTPS", "CSS", "JS", "PHP", "SQL", "XML", "JSON", "API", "URL", "URI", "UUID", "GUID",
        "DVD", "CD", "TV", "PC", "CPU", "GPU", "RAM", "ROM", "OS", "USB", "PDF", "JPEG", "PNG", "GIF", "MP3", "MP4", "AIFF", "WAV",
        "UFO", "ESP", "IQ", "CSI", "NCIS", "ER", "ICU", "ENT", "MD", "PhD", "MBA", "CEO", "CFO", "COO", "CTO", "CIO",
        "AKA", "ASAP", "AWOL", "RSVP", "TGIF", "FYI", "ETA", "TBA", "TBD", "DNA", "RNA",
        "AM", "PM", "AD", "BC", // BCE, CE will be title cased to Bce, Ce if not listed
        // Two-letter country codes often appear in caps: US, UK, CA, AU, DE, FR, JP, CN, IN, RU, BR, ZA
        "US", "CA", "AU", "DE", "FR", "JP", "CN", "IN", "RU", "BR", "ZA",
        // Roman numerals if they appear as whole words (though typically handled differently if part of a name)
        // This list might be better handled by a specific Roman numeral check if needed.
        // For now, only very common ones if they stand alone.
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "L", "C", "D", "M"
    ]);

    async function isWordInDictionary(wordToCheck, isForAcronymCheck = false) {
        const lowerWord = wordToCheck.toLowerCase();
        const cacheKey = isForAcronymCheck ? `acro_${lowerWord}` : `hyphen_${lowerWord}`;
        if (dictionaryCache.has(cacheKey)) { return dictionaryCache.get(cacheKey); }
        return new Promise((resolve) => {
            let requester;
            if (typeof GM_xmlhttpRequest !== "undefined") { requester = GM_xmlhttpRequest;
            } else if (typeof GM !== "undefined" && typeof GM.xmlHttpRequest !== "undefined") { requester = GM.xmlHttpRequest;
            } else { console.error("MAM Title Script: GM_xmlhttpRequest or GM.xmlHttpRequest is not available."); resolve(false); return; }
            requester({
                method: "GET",
                url: `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lowerWord)}`,
                timeout: 5000,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const found = Array.isArray(data) && data.length > 0;
                            dictionaryCache.set(cacheKey, found); resolve(found);
                        } catch (e) { console.warn(`MAM TS: Parse err "${lowerWord}"`, e); dictionaryCache.set(cacheKey, false); resolve(false); }
                    } else { dictionaryCache.set(cacheKey, false); resolve(false); }
                },
                onerror: function(response) { console.warn(`MAM TS: API err "${lowerWord}"`, response); dictionaryCache.set(cacheKey, false); resolve(false); },
                ontimeout: function() { console.warn(`MAM TS: API timeout "${lowerWord}"`); dictionaryCache.set(cacheKey, false); resolve(false); }
            });
        });
    }

    async function isPreservableAcronym(word) {
        if (!word || word.length < 1) return false;
        let isAllCaps = true;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!(char >= 'A' && char <= 'Z')) { isAllCaps = false; break; }
        }
        if (!isAllCaps) return false;
        if (alwaysPreserveAcronyms.has(word)) return true;
        if (word.length <= 3) { return !(await isWordInDictionary(word, true)); }
        return !(await isWordInDictionary(word, true));
    }

    async function capitalizeWordSmart(str, shouldCapitalizeTheFirstLetter) {
        if (!str) return str;
        if (await isPreservableAcronym(str)) { return str; }
        let resultChars = []; let firstLetterEncountered = false;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[a-zA-Z]/.test(char)) {
                if (shouldCapitalizeTheFirstLetter && !firstLetterEncountered) {
                    resultChars.push(char.toUpperCase()); firstLetterEncountered = true;
                } else { resultChars.push(char.toLowerCase()); }
            } else { resultChars.push(char); }
        }
        return resultChars.join("");
    }

    async function processSimpleWord(word, isFirstWordOfSegment, isLastWordOfSegment, forceLowercase = false) {
        if (!word) return word;
        if (await isPreservableAcronym(word)) { return word; }
        let coreWordForCheck = word;
        const trailingPunctMatch = word.match(/([^\w'-])$/);
        if (trailingPunctMatch) { coreWordForCheck = word.substring(0, word.length - 1); }
        const lcCoreWord = coreWordForCheck.toLowerCase();
        let attemptToCapitalizeFirstLetter = false;
        if (isFirstWordOfSegment || isLastWordOfSegment) { attemptToCapitalizeFirstLetter = true;
        } else if (forceLowercase || lowercaseWords.includes(lcCoreWord)) { attemptToCapitalizeFirstLetter = false;
        } else { attemptToCapitalizeFirstLetter = true; }
        if (word.length > 0 && /[0-9]/.test(word[0])) { return await capitalizeWordSmart(word, false); }
        return await capitalizeWordSmart(word, attemptToCapitalizeFirstLetter);
    }

    // CORRECTED processSegment
    async function processSegment(segment) {
        if (!segment) return "";
        const spaceSplitParts = segment.split(/(\s+)/);
        let currentWordIndex = -1;
        const actualWordsInSegment = segment.split(/\s+/).filter(w => w.length > 0 && /[a-zA-Z0-9]/.test(w));

        const processedPromises = spaceSplitParts.map(async (part) => {
            if (part.match(/^\s+$/)) return part; // Keep whitespace
            if (!part || !/[a-zA-Z0-9]/.test(part)) return part; // Skip empty or pure punctuation

            currentWordIndex++;
            const isFirstWordOfOverallSegment = currentWordIndex === 0;
            const isLastWordOfOverallSegment = currentWordIndex === actualWordsInSegment.length - 1;

            let prefixPunct = "";
            let suffixPunct = "";
            let corePart = part;

            const prefixMatch = corePart.match(/^([^\w'-]+)/);
            if (prefixMatch) { prefixPunct = prefixMatch[1]; corePart = corePart.substring(prefixPunct.length); }
            const suffixMatch = corePart.match(/([^\w'-]+)$/);
            if (suffixMatch) { suffixPunct = suffixMatch[1]; corePart = corePart.substring(0, corePart.length - suffixPunct.length); }

            if (!corePart) return prefixPunct + suffixPunct; // Only punctuation was in the part

            if (corePart.includes('-') && corePart.length > 1 && corePart.indexOf('-') > 0 && corePart.indexOf('-') < corePart.length - 1) {
                const hyphenSubParts = corePart.split('-');
                const processedHyphenSubPartsPromises = hyphenSubParts.map(async (hSubPart, hIndex) => {
                    if (!hSubPart) return ""; // Handle potential empty strings from "word--word"

                    // Determine if THIS subPart acts as a first/last word for capitalization rules
                    const isFirstSubPartForCasing = hIndex === 0 && isFirstWordOfOverallSegment;
                    const isLastSubPartForCasing = hIndex === hyphenSubParts.length - 1 && isLastWordOfOverallSegment;

                    let forceSubPartLowercase = false;
                    if (hIndex > 0) { // Only check for words after the first hyphenated part
                        const prefixCandidate = hyphenSubParts[0].toLowerCase();
                        const combinedWordForDictCheck = prefixCandidate + hSubPart.toLowerCase();
                        if (prefixCandidate.length > 0 && hSubPart.length > 0 && /^[a-z]+$/.test(combinedWordForDictCheck)) {
                           if (await isWordInDictionary(combinedWordForDictCheck, false)) { // false for hyphen check
                                forceSubPartLowercase = true;
                           }
                        }
                    }
                    return await processSimpleWord(hSubPart, isFirstSubPartForCasing, isLastSubPartForCasing, forceSubPartLowercase);
                });
                const resolvedHyphenSubParts = await Promise.all(processedHyphenSubPartsPromises);
                return prefixPunct + resolvedHyphenSubParts.join('-') + suffixPunct;
            } else {
                // Not hyphenated, or hyphen is at start/end (treat as normal word)
                return prefixPunct + (await processSimpleWord(corePart, isFirstWordOfOverallSegment, isLastWordOfOverallSegment)) + suffixPunct;
            }
        });
        const resolvedParts = await Promise.all(processedPromises);
        return resolvedParts.join("");
    }


    async function getCorrectedTitle(titleStr) {
        if (!titleStr) return "";
        const titleParts = titleStr.split(/(:)/);
        let newTitleAccumulator = []; let currentSegment = "";
        for (let k = 0; k < titleParts.length; k++) {
            const part = titleParts[k];
            if (part === ':') {
                if (currentSegment.trim()) newTitleAccumulator.push(await processSegment(currentSegment.trim()));
                newTitleAccumulator.push(':'); currentSegment = "";
            } else { currentSegment += part; }
        }
        if (currentSegment.trim()) newTitleAccumulator.push(await processSegment(currentSegment.trim()));
        let finalTitle = "";
        for (let i = 0; i < newTitleAccumulator.length; i++) {
            finalTitle += newTitleAccumulator[i];
            if (newTitleAccumulator[i] === ':' && i < newTitleAccumulator.length - 1 && newTitleAccumulator[i+1] && !newTitleAccumulator[i+1].startsWith(' ')) {
                finalTitle += " ";
            }
        }
        return finalTitle.trim();
    }

    function cleanExtractedTitle(title) {
        if (!title) return title;
        return title.trim().replace(/[\s\[\(]+$/, '');
    }
    function extractTitleFromPage() {
        const goodreadsMarkers = ["⭐", "📖"];
        function getCleanTitleFromElement_internal(valueElement) {
            if (!valueElement) return null;
            let rawTitle = null;
            const fullTextContent = valueElement.textContent.trim();
            if (!fullTextContent) return null;
            let cutOffIndex = -1;
            for (const marker of goodreadsMarkers) {
                const markerIndex = fullTextContent.indexOf(marker);
                if (markerIndex > 0) {
                    if (cutOffIndex === -1 || markerIndex < cutOffIndex) {
                        cutOffIndex = markerIndex;
                    }
                }
            }
            if (cutOffIndex !== -1) {
                rawTitle = fullTextContent.substring(0, cutOffIndex).trim();
            } else {
                if (valueElement.childNodes.length > 0 && valueElement.childNodes[0].nodeType === Node.TEXT_NODE) {
                    const firstTextNodeContent = valueElement.childNodes[0].textContent.trim();
                    if (firstTextNodeContent.length > 0 && !goodreadsMarkers.some(m => firstTextNodeContent.startsWith(m))) {
                        if (fullTextContent.startsWith(firstTextNodeContent) && fullTextContent.length > firstTextNodeContent.length + 3) {
                            rawTitle = firstTextNodeContent;
                        } else {
                            rawTitle = fullTextContent;
                        }
                    } else {
                        rawTitle = fullTextContent;
                    }
                } else {
                    rawTitle = fullTextContent;
                }
            }
            if (rawTitle && (rawTitle.length > 1 || /\w/.test(rawTitle))) {
                return cleanExtractedTitle(rawTitle);
            }
            return null;
        }
        const allTds = document.querySelectorAll('td');
        for (let i = 0; i < allTds.length; i++) {
            const labelTd = allTds[i];
            if (labelTd.textContent.trim().toLowerCase() === "title") {
                const valueTd = labelTd.nextElementSibling;
                if (valueTd && valueTd.tagName === 'TD') {
                    const title = getCleanTitleFromElement_internal(valueTd);
                    if (title) return title;
                }
            }
        }
        const allDivs = document.querySelectorAll('div');
        for (let i = 0; i < allDivs.length; i++) {
            const labelDiv = allDivs[i];
            if (labelDiv.textContent.trim().toLowerCase() === "title") {
                const valueDiv = labelDiv.nextElementSibling;
                if (valueDiv) {
                    const title = getCleanTitleFromElement_internal(valueDiv);
                    if (title) return title;
                }
            }
        }
        let h1 = document.querySelector('h1');
        if (h1 && h1.textContent.trim().length > 1 && h1.offsetParent !== null) return cleanExtractedTitle(h1.textContent.trim());
        let h2 = document.querySelector('h2');
        if (h2 && h2.textContent.trim().length > 1 && h2.offsetParent !== null) return cleanExtractedTitle(h2.textContent.trim());
        const docTitle = document.title;
        if (docTitle) {
            const docTitleParts = docTitle.split(/ [-–—|:]+ /);
            if (docTitleParts.length > 0 && docTitleParts[0].trim().length > 1) return cleanExtractedTitle(docTitleParts[0].trim());
        }
        return null;
    }
    function showTemporaryMessage(message, isError = false) { /* ... same, with msgDiv.style fix ... */
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        Object.assign(msgDiv.style, {
            position: 'fixed', bottom: '70px', right: '20px',
            padding: '12px 18px', backgroundColor: isError ? '#ffdddd' : 'lightgreen',
            border: `1px solid ${isError ? 'red' : 'green'}`, borderRadius: '5px',
            zIndex: '10001', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontSize: '14px'
        });
        document.body.appendChild(msgDiv);
        setTimeout(() => { if (document.body.contains(msgDiv)) document.body.removeChild(msgDiv); }, 3000);
    }
    function displayResultsDialog(originalTitle, correctedTitle) {
        const dialogOverlay = document.createElement('div');
        dialogOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex;
            align-items: center; justify-content: center;
        `;
        const dialogBox = document.createElement('div');
        dialogBox.style.cssText = `
            background: white; padding: 25px; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); min-width: 300px; max-width: 80%;
            text-align: left; font-size: 15px; line-height: 1.6;
        `;
        const titleHeader = document.createElement('h3');
        titleHeader.textContent = 'Title Capitalization';
        titleHeader.style.cssText = `margin-top: 0; margin-bottom: 15px; color: #333;`;
        const originalP = document.createElement('p');
        originalP.innerHTML = `<strong>Original:</strong><br><span style="color: #555;"></span>`;
        originalP.lastChild.textContent = originalTitle;
        const correctedP = document.createElement('p');
        correctedP.innerHTML = `<strong>Corrected:</strong><br><span style="color: #007bff; font-weight: bold;"></span>`;
        correctedP.lastChild.textContent = correctedTitle;
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Corrected Title';
        copyButton.style.cssText = `
            display: block; width: 100%; padding: 10px; margin-top: 20px;
            background-color: #28a745; color: white; border: none;
            border-radius: 5px; cursor: pointer; font-size: 15px;
        `;
        copyButton.onclick = () => {
            GM_setClipboard(correctedTitle);
            copyButton.textContent = 'Copied & Closed!';
            copyButton.disabled = true;
            setTimeout(() => {
                if (document.body.contains(dialogOverlay)) document.body.removeChild(dialogOverlay);
            }, 1000);
        };
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            display: block; width: 100%; padding: 10px; margin-top: 10px;
            background-color: #6c757d; color: white; border: none;
            border-radius: 5px; cursor: pointer; font-size: 15px;
        `;
        closeButton.onclick = () => { if (document.body.contains(dialogOverlay)) document.body.removeChild(dialogOverlay); };
        dialogBox.append(titleHeader, originalP, correctedP, copyButton, closeButton);
        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);
        dialogOverlay.onclick = (e) => { if (e.target === dialogOverlay && document.body.contains(dialogOverlay)) document.body.removeChild(dialogOverlay); };
    }
    async function runTitleCheck() { 
        const actionButton = document.getElementById('mamTitleCheckerButton');
        if (actionButton) actionButton.disabled = true;
        const originalTitle = extractTitleFromPage();
        if (!originalTitle) {
            showTemporaryMessage("Could not extract book title from the page.", true);
            if (actionButton) actionButton.disabled = false;
            return;
        }
        try {
            const correctedTitle = await getCorrectedTitle(originalTitle);
            if (originalTitle === correctedTitle) {
                showTemporaryMessage("No title modification required. It's already perfect!");
            } else {
                displayResultsDialog(originalTitle, correctedTitle);
            }
        } catch (error) {
            console.error("MAM Title Script: Error during title processing:", error);
            showTemporaryMessage("Error processing title. See console for details.", true);
        } finally {
            if (actionButton) actionButton.disabled = false;
        }
    }
    const actionButton = document.createElement('button'); 
    actionButton.textContent = 'Check Title Case';
    actionButton.id = 'mamTitleCheckerButton';
    actionButton.addEventListener('click', runTitleCheck);
    document.body.appendChild(actionButton);
    GM_addStyle(`
        #mamTitleCheckerButton {
            position: fixed; bottom: 20px; right: 20px; z-index: 10000;
            padding: 12px 18px; background-color: #007bff; color: white;
            border: none; border-radius: 5px; cursor: pointer; font-size: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: background-color 0.2s ease;
        }
        #mamTitleCheckerButton:hover { background-color: #0056b3; }
        #mamTitleCheckerButton:disabled { background-color: #cccccc; cursor: not-allowed; }
    `);

})();