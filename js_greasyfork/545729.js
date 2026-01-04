// ==UserScript==
// @name         Kcpinator
// @namespace    Gepardzik
// @version      1.0
// @description  Transliterates text between Cyrillic and Polish Latin on .ru domains
// @author       Gepardzik
// @license      Apache-2.0
// @match        *://*.ru/*
// @match        *://2ch.hk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545729/Kcpinator.user.js
// @updateURL https://update.greasyfork.org/scripts/545729/Kcpinator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    * Transcribes Russian Cyrillic text to Polish Latin alphabet according to
    * the rules specified on pl.wikipedia.org/wiki/J%C4%99zyk_rosyjski
    *
    * @param {string} text The input string in Russian Cyrillic.
    * @returns {string} The transcribed string in Polish Latin alphabet.
    */
    function transcribeCyrillicToPolishLatin(text) {
        // Preserve initial casing for the first letter
        const firstCharUpper = text && text[0] && text[0].toUpperCase() === text[0];
        const normalizedText = text.toLowerCase();
        const result = [];
        let i = 0;
        const n = normalizedText.length;

        // Define simple direct mappings for most characters.
        // Context-dependent rules will be handled in the loop.
        const mapping = {
            'а': 'a', 'б': 'b', 'в': 'w', 'д': 'd',
            'ж': 'ż', 'з': 'z', 'й': 'j', 'к': 'k',
            'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'ch',
            'ц': 'c', 'ч': 'cz', 'ш': 'sz', 'щ': 'szcz',
            'ъ': '',  // Hard sign is omitted
            'ы': 'y',
            'э': 'e',
            'г': 'g', // Based on examples "ничего" -> "niczego", "его" -> "jego", "гитара" -> "gitara".
            // The contradictory rule about "-ого/-его" endings becoming "w" is ignored due to explicit examples.
            // The "сдвиг" -> "sdwig" example is an outlier and will not be handled as a general rule for 'г'.
        };

        // Helper function to check if a character is a Polish Latin vowel
        function isLatinVowel(char) {
            return 'aąeęioóuy'.includes(char);
        }

        // Helper function to check if a character is a Cyrillic consonant (for context checks)
        function isCyrillicConsonant(char) {
            // Includes all Cyrillic consonants relevant for transcription rules
            return 'бвгджзклмнпрстфхцчшщ'.includes(char);
        }

        while (i < n) {
            const char = normalizedText[i];
            let transcribedChar = '';

            // Handle 'е' (ye/e/ie)
            if (char === 'е') {
                const prevCharInResult = result.length > 0 ? result[result.length - 1] : '';
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';

                // At the beginning of a word, after vowels (transcribed Latin), and after ъ, ь: "je"
                if (i === 0 ||
                    isLatinVowel(prevCharInResult) ||
                    ['ъ', 'ь'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'je';
                    // After й, ж, л, ш, ч, щ, ц: "e"
                } else if (['й', 'ж', 'л', 'ш', 'ч', 'щ', 'ц'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'e';
                    // After all other consonants: "ie"
                } else if (isCyrillicConsonant(prevCharInCyrillicText)) {
                    transcribedChar = 'ie';
                } else {
                    transcribedChar = 'je'; // Fallback for unexpected cases, usually initial 'e'
                }
            }

            // Handle 'ё' (yo/o/io)
            else if (char === 'ё') {
                const prevCharInResult = result.length > 0 ? result[result.length - 1] : '';
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';

                // At the beginning of a word, after vowels, and after ъ, ь: "jo"
                if (i === 0 ||
                    isLatinVowel(prevCharInResult) ||
                    ['ъ', 'ь'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'jo';
                    // After л, ж, ш, ч, щ: "o"
                } else if (['л', 'ж', 'ш', 'ч', 'щ'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'o';
                    // After all other consonants: "io"
                } else if (isCyrillicConsonant(prevCharInCyrillicText)) {
                    transcribedChar = 'io';
                } else {
                    transcribedChar = 'jo'; // Fallback
                }
            }

            // Handle 'и' (i/ji/y)
            else if (char === 'и') {
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';

                // At the beginning of a word, after consonants (except ж, ш, ц): "i"
                if (i === 0 ||
                    (isCyrillicConsonant(prevCharInCyrillicText) &&
                     !['ж', 'ш', 'ц'].includes(prevCharInCyrillicText))) {
                    transcribedChar = 'i';
                    // After ь: "ji"
                } else if (prevCharInCyrillicText === 'ь') {
                    // If the 'ь' was transcribed as '´', remove it before adding 'ji'
                    if (result.length > 0 && result[result.length - 1] === '´') {
                        result.pop();
                    }
                    transcribedChar = 'ji';
                    // After ж, ш, ц: "y"
                } else if (['ж', 'ш', 'ц'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'y';
                } else {
                    transcribedChar = 'i'; // Fallback
                }
            }

            // Handle 'л' (l/ł)
            else if (char === 'л') {
                // Look ahead for the next character in Cyrillic
                const nextCharInCyrillicText = i + 1 < n ? normalizedText[i + 1] : '';

                // Before е, ё, я, ю, и, ь: "l" (soft l)
                if (['е', 'ё', 'я', 'ю', 'и', 'ь'].includes(nextCharInCyrillicText)) {
                    transcribedChar = 'l';
                    // Before consonants, before vowels а, о, у, ы, and at the end of a word: "ł" (hard l)
                } else {
                    transcribedChar = 'ł';
                }
            }

            // Handle 'ь' (soft sign)
            else if (char === 'ь') {
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';
                const nextCharInCyrillicText = i + 1 < n ? normalizedText[i + 1] : '';

                // Omitted when it appears after л, ж, ш, ч, щ and before a vowel
                // Also, specifically omitted after 'д' when followed by 'я' (as per 'ладья' example on site)
                // The examples 'боль', 'мышь' also show omission at end of word.
                if ((['л', 'ж', 'ш', 'ч', 'щ'].includes(prevCharInCyrillicText) &&
                     (i + 1 === n || ['а', 'о', 'у', 'э', 'ы', 'е', 'ё', 'ю', 'я', 'и'].includes(nextCharInCyrillicText))) ||
                    (prevCharInCyrillicText === 'д' && nextCharInCyrillicText === 'я')) {
                    transcribedChar = ''; // Omitted
                } else {
                    transcribedChar = ''; // '´' # Softening mark (removed apostrophe based on latest Python code for consistent output)
                }
            }

            // Handle 'ю' (ju/u/iu)
            else if (char === 'ю') {
                const prevCharInResult = result.length > 0 ? result[result.length - 1] : '';
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';

                // At the beginning of a word, after vowels, and after ъ, ь: "ju"
                if (i === 0 ||
                    isLatinVowel(prevCharInResult) ||
                    ['ъ', 'ь'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'ju';
                    // After л: "u"
                } else if (prevCharInCyrillicText === 'л') {
                    transcribedChar = 'u';
                    // After other consonants: "iu"
                } else if (isCyrillicConsonant(prevCharInCyrillicText)) {
                    transcribedChar = 'iu';
                } else {
                    transcribedChar = 'ju'; // Fallback
                }
            }

            // Handle 'я' (ja/a/ia)
            else if (char === 'я') {
                const prevCharInResult = result.length > 0 ? result[result.length - 1] : '';
                const prevCharInCyrillicText = i > 0 ? normalizedText[i - 1] : '';

                // At the beginning of a word, after vowels, and after ь, ъ: "ja"
                if (i === 0 ||
                    isLatinVowel(prevCharInResult) ||
                    ['ь', 'ъ'].includes(prevCharInCyrillicText)) {
                    transcribedChar = 'ja';
                    // After л: "a"
                } else if (prevCharInCyrillicText === 'л') {
                    transcribedChar = 'a';
                    // After other consonants: "ia"
                } else if (isCyrillicConsonant(prevCharInCyrillicText)) {
                    transcribedChar = 'ia';
                } else {
                    transcribedChar = 'ja'; // Fallback
                }
            }

            // Direct mapping for other characters (including 'г' which is always 'g' based on examples)
            else {
                transcribedChar = mapping[char] || char; // Use direct mapping or keep original if not found
            }

            result.push(transcribedChar);
            i++;
        }

        let finalResult = result.join('');
        // Restore original casing of the first letter if applicable
        if (firstCharUpper && finalResult.length > 0) {
            return finalResult[0].toUpperCase() + finalResult.slice(1);
        }
        return finalResult;
    }

    /**
    * Transcribes Polish Latin text to Russian Cyrillic alphabet,
    * reversing the rules from the Wikipedia page as much as possible.
    *
    * @param {string} text The input string in Polish Latin alphabet.
    * @returns {string} The transcribed string in Russian Cyrillic.
    */
    function transcribePolishLatinToCyrillic(text) {
        // Preserve initial casing for the first letter
        const firstCharUpper = text && text[0] && text[0].toUpperCase() === text[0];
        const normalizedText = text.toLowerCase();
        const result = [];
        let i = 0;
        const n = normalizedText.length;

        // Multi-character Polish digraphs must be checked first
        // Ordered from longest to shortest to avoid partial matches
        const digraphMap = {
            'szcz': 'щ',
            'cz': 'ч',
            'sz': 'ш',
            'ch': 'х',
            'ż': 'ж',
            'ń': 'нь', // Added mapping for Polish ń to Cyrillic нь
        };

        // Direct one-to-one mappings for simple cases (mostly consonants)
        // Vowels 'e', 'i', 'o', 'y' are handled contextually.
        const directMap = {
            'a': 'а', 'b': 'б', 'w': 'в', 'd': 'д', 'g': 'г',
            'j': 'й', 'k': 'к', 'm': 'м', 'n': 'н',
            'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
            'c': 'ц',
        };

        // Helper function to check if a character is a Latin consonant (for context checks)
        function isLatinConsonantForReverse(char) {
            // Includes common Latin consonants that can precede softening vowels in Polish transcription
            return 'bcdfghjklmnprstvwxyz'.includes(char);
        }

        while (i < n) {
            let charFound = false;
            const char = normalizedText[i]; // Current character

            // 1. Check for multi-character digraphs (longest match first)
            const sortedDigraphs = Object.keys(digraphMap).sort((a, b) => b.length - a.length);
            for (const digraph of sortedDigraphs) {
                if (normalizedText.startsWith(digraph, i)) {
                    result.push(digraphMap[digraph]);
                    i += digraph.length;
                    charFound = true;
                    break;
                }
            }
            if (charFound) {
                continue;
            }

            // 2. Handle specific contextual sequences and ambiguities (vowels and 'l'/'ł')

            // Handle 'l' vs 'ł' and 'l' followed by softening vowels (e.g., 'la' -> 'ля')
            // This needs to be checked early as 'l' can be part of many vowel combinations.
            const nextLatinChar = normalizedText[i + 1] || '';
            if (char === 'l') {
                if (nextLatinChar === 'a') {
                    result.push('ля');
                    i += 2;
                    charFound = true;
                } else if (nextLatinChar === 'o') {
                    result.push('лё');
                    i += 2;
                    charFound = true;
                } else if (nextLatinChar === 'u') {
                    result.push('лю');
                    i += 2;
                    charFound = true;
                } else if (nextLatinChar === 'e') {
                    result.push('ле');
                    i += 2;
                    charFound = true;
                } else if (nextLatinChar === 'i') {
                    result.push('ли');
                    i += 2;
                    charFound = true;
                } else if (nextLatinChar === '´') { // 'l´' -> 'ль'
                    result.push('ль');
                    i += 2;
                    charFound = true;
                } else { // If 'l' not followed by these, it's a simple 'л'
                    result.push('л');
                    i += 1;
                    charFound = true;
                }
            } else if (char === 'ł') { // ł always maps to hard л
                result.push('л');
                i += 1;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'je', 'jo', 'ju', 'ja' (initial or after vowels/ъ/ь)
            if (normalizedText.startsWith('je', i)) {
                result.push('е');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('jo', i)) {
                result.push('ё');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('ju', i)) {
                result.push('ю');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('ja', i)) {
                result.push('я');
                i += 2;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'ie', 'io', 'iu', 'ia' (after consonants)
            const prevLatinChar = normalizedText[i - 1] || '';
            if (normalizedText.startsWith('ie', i) && isLatinConsonantForReverse(prevLatinChar)) {
                result.push('е');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('io', i) && isLatinConsonantForReverse(prevLatinChar)) {
                result.push('ё');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('iu', i) && isLatinConsonantForReverse(prevLatinChar)) {
                result.push('ю');
                i += 2;
                charFound = true;
            } else if (normalizedText.startsWith('ia', i) && isLatinConsonantForReverse(prevLatinChar)) {
                result.push('я');
                i += 2;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'ji' -> 'ьи' (when 'ь' + 'и' resulted in 'ji')
            if (normalizedText.startsWith('ji', i)) {
                result.push('ьи'); // Represents 'ь' followed by 'и'
                i += 2;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'i' and 'y' for 'и' or 'ы'
            if (char === 'i') {
                // 'i' in Latin transcription always comes from Cyrillic 'и'
                result.push('и');
                i += 1;
                charFound = true;
            } else if (char === 'y') {
                // 'y' in Latin transcription comes from Cyrillic 'и' (after ж,ш,ц) OR from Cyrillic 'ы'
                const prevLatinCharForY = normalizedText[i - 1] || '';
                if (['ż', 'sz', 'c'].includes(prevLatinCharForY)) { // Latin equivalents of ж, ш, ц
                    result.push('и'); // 'y' came from 'и' after these
                } else {
                    result.push('ы'); // 'y' came from 'ы'
                }
                i += 1;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'e' (could be 'е' or 'э')
            if ((char === 'e') || (char === 'ę')) {
                const prevLatinCharForE = normalizedText[i - 1] || '';
                // If the previous character was a Latin consonant (corresponding to a Cyrillic consonant), map to 'е'
                if (isLatinConsonantForReverse(prevLatinCharForE)) {
                    result.push('е');
                } else {
                    result.push('э'); // Default to 'э' for standalone 'e' not covered by softening rules (like initial 'e' from 'э')
                }
                i += 1;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle 'o' (could be 'о' or 'ё')
            if (char === 'o') {
                const prevLatinCharForO = normalizedText[i - 1] || '';
                // Check if `o` is preceded by consonants that would make Cyrillic 'ё'
                if (['l', 'ż', 'sz', 'cz', 'szcz'].includes(prevLatinCharForO)) {
                    result.push('ё');
                } else {
                    result.push('о'); // Default to 'о'
                }
                i += 1;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // Handle '´' (soft sign)
            if (char === '´') {
                result.push('ь');
                i += 1;
                charFound = true;
            }
            if (charFound) {
                continue;
            }

            // 3. Direct maps for single characters (must be last to avoid conflicts)
            if (directMap[char]) {
                result.push(directMap[char]);
                i += 1;
                charFound = true;
            }

            // If no specific rule or direct map applied, keep the character (e.g., punctuation, spaces)
            if (!charFound) {
                result.push(char);
                i += 1;
            }
        }

        let finalResult = result.join('');
        // Restore original casing of the first letter if applicable
        if (firstCharUpper && finalResult.length > 0) {
            return finalResult[0].toUpperCase() + finalResult.slice(1);
        }
        return finalResult;
    }


    // Create the transcription UI
    function createTranscriptionUI() {
        const container = document.createElement('div');
        container.id = 'transcriptionTool';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            width: 250px;
        `;

        const title = document.createElement('div');
        title.textContent = 'Transcription Tool';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        `;

        const latinLabel = document.createElement('label');
        latinLabel.textContent = 'Latin:';
        latinLabel.htmlFor = 'latinInput';
        latinLabel.style.display = 'block';

        const latinInput = document.createElement('textarea');
        latinInput.id = 'latinInput';
        latinInput.style.cssText = `
            width: 100%;
            height: 60px;
            margin-bottom: 10px;
            box-sizing: border-box;
            resize: vertical;
        `;

        const cyrillicLabel = document.createElement('label');
        cyrillicLabel.textContent = 'Cyrillic:';
        cyrillicLabel.htmlFor = 'cyrillicOutput';
        cyrillicLabel.style.display = 'block';

        const cyrillicOutput = document.createElement('textarea');
        cyrillicOutput.id = 'cyrillicOutput';
        cyrillicOutput.readOnly = true;
        cyrillicOutput.style.cssText = `
            width: 100%;
            height: 60px;
            box-sizing: border-box;
            resize: vertical;
        `;

        // Add event listener for real-time transcription
        latinInput.addEventListener('input', () => {
            cyrillicOutput.value = transcribePolishLatinToCyrillic(latinInput.value);
        });

        container.appendChild(title);
        container.appendChild(latinLabel);
        container.appendChild(latinInput);
        container.appendChild(cyrillicLabel);
        container.appendChild(cyrillicOutput);
        document.body.appendChild(container);
    }

    // Check if node should be processed
    function shouldProcess(node) {
        const tagName = node.parentNode.tagName;
        return (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim() !== '' &&
            !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION'].includes(tagName) &&
            !node.parentNode.isContentEditable
        );
    }

    // Transcribe text nodes
    function transcribeTextNodes() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            { acceptNode: node => shouldProcess(node) ?
             NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
        );

        let node;
        const textNodes = [];
        while ((node = walker.nextNode())) textNodes.push(node);

        textNodes.forEach(node => {
            node.textContent = transcribeCyrillicToPolishLatin(node.textContent);
        });
    }

    // Handle dynamic content
    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    transcribeTextNodes();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function init() {
        createTranscriptionUI();
        transcribeTextNodes();
        observeDOM();
    }

    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();