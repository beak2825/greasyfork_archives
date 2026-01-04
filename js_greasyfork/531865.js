// ==UserScript==
// @name         Hakka Romanization Converter (HPF ⇄ PFS)
// @namespace    hakka-romanization
// @version      1.1.1
// @description  Display Si-yen Hakka Dictionary entries in Pha̍k-fa-sṳ!
// @author       TongcyDai
// @match        http*://hakkadict.moe.edu.tw/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531865/Hakka%20Romanization%20Converter%20%28HPF%20%E2%87%84%20PFS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531865/Hakka%20Romanization%20Converter%20%28HPF%20%E2%87%84%20PFS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default to using Pha̍k-fa-sṳ
    let usePFS = localStorage.getItem('hakkaDictUsePFS') !== 'false';

    // Store original text in a mapping table
    const originalTextMap = new WeakMap();

    // Create toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'pfs-toggle-btn';
        button.textContent = usePFS ? '用拼音 (HPF)' : '用白話字 (PFS)';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#3498db';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.fontFamily = "'Microsoft JhengHei', 'Heiti TC', 'Heiti SC', 'STHeiti', 'WenQuanYi Zen Hei', sans-serif";

        // Mouse hover effect
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2980b9';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#3498db';
        });

        // Click event: Switch romanization
        button.addEventListener('click', toggleRomanization);

        document.body.appendChild(button);
    }

    // Toggle between romanization systems
    function toggleRomanization() {
        usePFS = !usePFS;
        localStorage.setItem('hakkaDictUsePFS', usePFS);

        const button = document.getElementById('pfs-toggle-btn');
        if (button) {
            button.textContent = usePFS ? '用拼音 (HPF)' : '用白話字 (PFS)';
        }

        if (usePFS) {
            applyPFSTransformation(document.body);
        } else {
            restoreOriginalText(document.body);
        }
    }

    // Convert Hakka Pinyin initials to PFS
    function convertInitial(initial) {
        const initialMap = {
            'b': 'p',
            'p': 'ph',
            'd': 't',
            't': 'th',
            'g': 'k',
            'k': 'kh',
            'z': 'ch',
            'c': 'chh',
            'j': 'ch',
            'q': 'chh',
            'x': 's'
        };

        return initialMap[initial] || initial;
    }

    // Convert Hakka Pinyin finals to PFS
    function convertEnding(ending) {
        const endingMap = {
            'b': 'p',
            'd': 't',
            'g': 'k'
        };

        return endingMap[ending] || ending;
    }

    // Convert main part of Hakka Pinyin vowels to PFS
    function convertNucleusMain(nucleus) {
        if (nucleus === 'ii') return 'ṳ';
        if (nucleus === 'ua') return 'oa';
        if (nucleus === 'ue') return 'oe';
        return nucleus;
    }

    // Determine which vowel should receive the tone mark
    function findToneTarget(nucleusMain) {
        // Vowel priority order: a > o > e > u > ṳ > i
        const vowels = ['a', 'o', 'e', 'u', 'ṳ', 'i'];

        // Special case: oa-starting vowels (like oa, oai, oat etc.)
        if (nucleusMain.startsWith('oa')) {
            return {
                index: 0,
                char: 'o'
            };
        }

        // Normal case: find first vowel according to priority order
        for (const vowel of vowels) {
            const index = nucleusMain.indexOf(vowel);
            if (index !== -1) {
                return {
                    index: index,
                    char: vowel
                };
            }
        }

        // Case for syllabic consonants (m, n, ng as nucleus)
        if (nucleusMain === 'm') {
            return { index: 0, char: 'm' };
        } else if (nucleusMain === 'n') {
            return { index: 0, char: 'n' };
        } else if (nucleusMain === 'ng') {
            return { index: 0, char: 'n' };
        }

        // No suitable vowel found
        return { index: -1, char: '' };
    }

    // Apply tone marks
    function applyToneMark(syllable, toneTarget, toneType, initialLength) {
        if (toneTarget.index === -1) return syllable;

        const toneMarks = {
            '1': '\u0302', // 1st tone uses circumflex (◌̂, U+0302)
            '2': '\u0301', // 2nd tone uses acute (◌́, U+0301)
            '5': '\u0300', // 5th tone uses grave (◌̀, U+0300)
            '8': '\u030D'  // 8th tone uses vertical line (◌̍, U+030D)
        };

        const mark = toneMarks[toneType];
        if (!mark) return syllable; // 3rd and 4th tones have no tone marks

        // Calculate position in the full string (considering initial length)
        const actualIndex = initialLength + toneTarget.index;

        // Find the actual character to mark
        const targetChar = syllable.charAt(actualIndex);

        // Special handling for ng nucleus
        if (targetChar === 'n' && syllable.substring(actualIndex, actualIndex + 2) === 'ng') {
            return syllable.substring(0, actualIndex) +
                   targetChar + mark +
                   syllable.substring(actualIndex + 1);
        }

        // General case
        return syllable.substring(0, actualIndex) +
               targetChar + mark +
               syllable.substring(actualIndex + 1);
    }

    // Handle syllables beginning with 'i'
    function handleInitialI(nucleusMain) {
        // If main part is only the letter 'i'
        if (nucleusMain === 'i') {
            return 'yi';
        }

        // Other cases: starts with 'i' but not only 'i' (like iu, ia, iai etc.)
        if (nucleusMain.charAt(0) === 'i') {
            return 'y' + nucleusMain.substring(1);
        }

        return nucleusMain;
    }

    // Convert Hakka Pinyin syllable to PFS
    function convertSyllable(hpf) {
        // Handle special tone symbols (+ and ^)
        let specialTone = '';
        if (hpf.includes('+')) {
            specialTone = '+';
            hpf = hpf.replace(/\+/g, '');
        } else if (hpf.includes('^')) {
            specialTone = '^';
            hpf = hpf.replace(/\^/g, '');
        }

        // If special tone symbol exists, keep original form
        if (specialTone) {
            return hpf + specialTone;
        }

        // Check if it's a special syllable (without vowels: m/n/ng)
        const hasVowel = /[aeiou]/.test(hpf);
        if (!hasVowel) {
            // Handle special syllables without vowels (m, n, ng)
            const specialRegex = /^([bpmfdtnlgkhvzcsjqx]{1,2})?(m|n|ng)([ˊˋˇ])?$/;
            const match = hpf.match(specialRegex);

            if (match) {
                const [, initial, nucleus, tone] = match;

                // Convert initial
                let pfs = '';
                if (initial) {
                    pfs += convertInitial(initial);
                }

                // Add nucleus (m, n, ng)
                pfs += nucleus;

                // Handle tone
                let toneType = '';
                if (tone === 'ˊ') toneType = '1';       // 1st tone uses ◌̂
                else if (tone === 'ˋ') toneType = '2';  // 2nd tone uses ◌́
                else if (tone === 'ˇ') toneType = '5';  // 5th tone uses ◌̀

                // Determine tone mark position
                if (toneType) {
                    const toneMarks = {
                        '1': '\u0302', // 1st tone uses circumflex (◌̂, U+0302)
                        '2': '\u0301', // 2nd tone uses acute (◌́, U+0301)
                        '5': '\u0300', // 5th tone uses grave (◌̀, U+0300)
                        '8': '\u030D'  // 8th tone uses vertical line (◌̍, U+030D)
                    };

                    const mark = toneMarks[toneType];
                    const initialLen = initial ? convertInitial(initial).length : 0;

                    // If nucleus is ng, add tone mark to n
                    if (nucleus === 'ng') {
                        pfs = pfs.substring(0, initialLen) + 'n' + mark + 'g';
                    } else {
                        pfs = pfs.substring(0, initialLen) + nucleus + mark;
                    }
                }

                return pfs;
            }
        }

        // Regular expression to match Hakka Pinyin syllable
        // Format: (initial)?(nucleus main)(ending)?(tone)?
        const syllableRegex = /^([bpmfdtnlgkhvzcsjqx]{1,2})?([aeiou]+)([bdgmn]|ng)?([ˊˋˇ])?$/;

        const match = hpf.match(syllableRegex);
        if (!match) return hpf; // If no match found, return unchanged

        let [, initial, nucleusMain, ending, tone] = match;

        // 1. Process initial
        let pfs = '';
        const initialLength = initial ? convertInitial(initial).length : 0;
        if (initial) {
            pfs += convertInitial(initial);
        }

        // 2. Process nucleus main part
        let convertedNucleusMain = convertNucleusMain(nucleusMain);

        // 3. If no initial and starts with i, special handling
        if (!initial && convertedNucleusMain.charAt(0) === 'i') {
            convertedNucleusMain = handleInitialI(convertedNucleusMain);
        }

        pfs += convertedNucleusMain;

        // 4. Process ending
        if (ending) {
            pfs += convertEnding(ending);
        }

        // 5. Process tone
        // Determine if it's 3rd tone (no mark), 4th tone (-d/b/gˋ ending) or 8th tone (-d/b/g ending with no tone mark)
        let toneType = '';

        if (tone === 'ˊ') {
            toneType = '1'; // 1st tone
        } else if (tone === 'ˋ') {
            if (ending === 'd' || ending === 'b' || ending === 'g') {
                toneType = '4'; // 4th tone (ending is b/d/g with ˋ symbol)
                // Convert ending but don't add tone mark
                pfs = pfs.slice(0, -1) + convertEnding(ending);
            } else {
                toneType = '2'; // 2nd tone (ending is not b/d/g)
            }
        } else if (tone === 'ˇ') {
            toneType = '5'; // 5th tone
        } else if (!tone) {
            if (ending === 'd' || ending === 'b' || ending === 'g') {
                toneType = '8'; // 8th tone (ending is b/d/g without tone symbol)
                // Convert ending part (e.g. d -> t)
                pfs = pfs.slice(0, -1) + convertEnding(ending);
            } else {
                toneType = '3'; // 3rd tone (ending is not b/d/g without tone symbol)
            }
        }

        // Find which vowel to apply tone mark to (relative to nucleus main part)
        const toneTarget = findToneTarget(convertedNucleusMain);

        // Apply tone mark, passing initial length to calculate actual position
        pfs = applyToneMark(pfs, toneTarget, toneType, initialLength);

        return pfs;
    }

    // Convert entire Hakka Pinyin sentence to PFS
    function convertHPFToPFS(text) {
        // Check for and preserve leading spaces
        const hasLeadingSpace = text.startsWith(' ');
        const leadingSpace = hasLeadingSpace ? ' ' : '';

        // Remove <sup> tags
        text = text.replace(/<sup>([^<]*)<\/sup>/g, '$1');

        // Convert full-width punctuation to half-width
        const fullWidthPuncs = {'，': ', ', '。': '. ', '、': ', ', '；': '; ', '：': ': '};
        for (const [full, half] of Object.entries(fullWidthPuncs)) {
            text = text.replace(new RegExp(full + '\\s*', 'g'), half);
        }

        // Trim text but preserve internal spaces
        const trimmedText = text.trim();

        // Find positions of all punctuation marks
        const puncRegex = /[,.:;?!]/g;
        const puncs = [];
        let match;
        while ((match = puncRegex.exec(trimmedText)) !== null) {
            puncs.push({
                pos: match.index,
                punc: match[0]
            });
        }

        // If no punctuation marks, process in standard way
        if (puncs.length === 0) {
            // Separate each syllable, convert and join with hyphens
            const syllables = trimmedText.split(/\s+/);
            const convertedSyllables = syllables.map(syllable => convertSyllable(syllable));

            // Use NFC to normalize combined Unicode characters and add back leading space
            return leadingSpace + convertedSyllables.join('-').normalize('NFC');
        }

        // If there are punctuation marks, process in segments
        let result = '';
        let lastEnd = 0;

        for (const punc of puncs) {
            // Extract this segment of text (without punctuation)
            const segment = trimmedText.substring(lastEnd, punc.pos).trim();

            // Convert this segment
            if (segment) {
                const syllables = segment.split(/\s+/);
                const convertedSyllables = syllables.map(syllable => convertSyllable(syllable));
                result += (result ? ' ' : '') + convertedSyllables.join('-');
            }

            // Add punctuation and space
            result += punc.punc + ' ';

            // Update start position for next segment
            lastEnd = punc.pos + punc.punc.length;
            while (lastEnd < trimmedText.length && /\s/.test(trimmedText[lastEnd])) {
                lastEnd++;
            }
        }

        // Process last segment (part after the last punctuation)
        if (lastEnd < trimmedText.length) {
            const segment = trimmedText.substring(lastEnd).trim();
            if (segment) {
                const syllables = segment.split(/\s+/);
                const convertedSyllables = syllables.map(syllable => convertSyllable(syllable));
                result += (result ? ' ' : '') + convertedSyllables.join('-');
            }
        }

        // Use NFC to normalize combined Unicode characters and add back leading space
        return leadingSpace + result.normalize('NFC');
    }

    // Convert text from Hakka Pinyin to PFS
    function applyPFSTransformation(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;

            // Store original text
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, text);
            }

            // Don't directly convert normal text, only process specific Hakka romanization blocks
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Determine if this is a Hakka romanization block
            if (node.classList && node.classList.contains('accent-data')) {
                const accentId = node.getAttribute('data-accent-id');
                const dataType = node.getAttribute('data-type');

                // Check if parent is a Si-yen or Nam-si-yen dialect tab
                const isTargetDialect = isInSiyenOrNamSiyenTab(node);

                // Handle special symbols for Hailu dialect (2)
                if (dataType === 'contour' && (accentId === '2' || isInHailuTab(node))) {
                    // Store original HTML
                    if (!originalTextMap.has(node)) {
                        originalTextMap.set(node, node.innerHTML);
                    }

                    // Process all sup elements
                    const supElements = node.querySelectorAll('sup');
                    for (let i = 0; i < supElements.length; i++) {
                        const sup = supElements[i];

                        // Store original content
                        if (!originalTextMap.has(sup)) {
                            originalTextMap.set(sup, sup.innerHTML);
                        }

                        // Replace + with ˖
                        if (sup.textContent === '+') {
                            sup.textContent = '˖';
                        }
                    }
                }
                // Only convert 'contour' type for Si-yen(1) and Nam-si-yen(6)
                else if (dataType === 'contour' && 
                    (accentId === '1' || accentId === '6' || (isTargetDialect && !accentId))) {

                    node.classList.add('pfs-converted');

                    // Store original HTML
                    if (!originalTextMap.has(node)) {
                        originalTextMap.set(node, node.innerHTML);
                    }

                    // First process all pinyin in inner span elements
                    const spanElements = node.querySelectorAll('span');
                    for (let i = 0; i < spanElements.length; i++) {
                        const span = spanElements[i];
                        const spanText = span.textContent;

                        // Store original HTML
                        if (!originalTextMap.has(span)) {
                            originalTextMap.set(span, span.innerHTML);
                        }

                        // Check if it contains pinyin
                        if (/[a-z]/i.test(spanText)) {
                            // Check if it's the first span (usually dialect name)
                            const isFirst = span === node.querySelector('span:first-child');
                            if (!isFirst) {
                                // Process pinyin in span
                                span.innerHTML = ''; // Clear content

                                // Build pinyin text
                                let pinyinText = '';
                                let hasCollectedText = false;

                                // Collect all pinyin and tones from child nodes
                                Array.from(spanElements[i].childNodes).forEach(child => {
                                    if (child.nodeType === Node.TEXT_NODE) {
                                        const text = child.nodeValue.trim();
                                        if (text && /[a-z]/i.test(text)) {
                                            pinyinText += text;
                                            hasCollectedText = true;
                                        }
                                    } else if (child.nodeName.toLowerCase() === 'sup') {
                                        if (hasCollectedText) {
                                            pinyinText += child.textContent;
                                            child.style.display = 'none';
                                        }
                                    }
                                });

                                // Convert and update span content
                                if (pinyinText) {
                                    span.textContent = convertHPFToPFS(pinyinText);
                                } else {
                                    // If no pinyin found, convert the entire content
                                    span.textContent = convertHPFToPFS(spanText);
                                }
                            }
                        }
                    }

                    // Then process text and sup elements that are direct children
                    const textContents = [];
                    let currentText = '';
                    let waitingForTone = false;

                    const childNodes = Array.from(node.childNodes);
                    for (let i = 0; i < childNodes.length; i++) {
                        const child = childNodes[i];

                        // Skip already processed span elements
                        if (child.nodeName.toLowerCase() === 'span') {
                            continue;
                        }

                        // Process text nodes
                        if (child.nodeType === Node.TEXT_NODE) {
                            const text = child.nodeValue;

                            // Store original text
                            if (!originalTextMap.has(child)) {
                                originalTextMap.set(child, text);
                            }

                            // Check if text contains pinyin parts
                            if (text.trim() && /[a-z]/i.test(text)) {
                                // Add to previously collected text
                                currentText += text;
                                waitingForTone = true;
                            } else if (text.trim()) {
                                // Non-pinyin text, keep as is
                                if (waitingForTone && currentText) {
                                    textContents.push({
                                        text: currentText,
                                        node: child.previousSibling,
                                        hasTone: false
                                    });
                                    currentText = '';
                                    waitingForTone = false;
                                }
                            }
                        }
                        // Process tone sup elements
                        else if (child.nodeName.toLowerCase() === 'sup') {
                            if (waitingForTone) {
                                const tone = child.textContent;

                                // Store original text
                                if (!originalTextMap.has(child)) {
                                    originalTextMap.set(child, child.innerHTML);
                                }

                                // Add tone to current text
                                textContents.push({
                                    text: currentText + tone,
                                    node: child.previousSibling,
                                    supNode: child,
                                    hasTone: true
                                });

                                currentText = '';
                                waitingForTone = false;
                            }
                        }
                        // Process other elements like links, line breaks, etc.
                        else {
                            // If there's still unprocessed text, add to list
                            if (waitingForTone && currentText) {
                                textContents.push({
                                    text: currentText,
                                    node: child.previousSibling,
                                    hasTone: false
                                });
                                currentText = '';
                                waitingForTone = false;
                            }
                        }
                    }

                    // Process the last possibly incomplete text
                    if (waitingForTone && currentText) {
                        textContents.push({
                            text: currentText,
                            node: childNodes[childNodes.length - 1],
                            hasTone: false
                        });
                    }

                    // Process all collected texts
                    if (textContents.length > 0) {
                        // Find all complete pinyin texts
                        const fullPinyinText = textContents.map(item => item.text).join(' ');

                        // Convert the entire text
                        if (/[a-z]/i.test(fullPinyinText)) {
                            const convertedText = convertHPFToPFS(fullPinyinText);

                            // Find the first text node
                            const firstTextNode = textContents[0].node;

                            // Update the first node's text
                            if (firstTextNode && firstTextNode.nodeType === Node.TEXT_NODE) {
                                firstTextNode.nodeValue = convertedText;

                                // Hide all other nodes
                                for (let i = 0; i < textContents.length; i++) {
                                    if (textContents[i].supNode) {
                                        textContents[i].supNode.style.display = 'none';
                                    }

                                    // Hide other text nodes (except the first)
                                    if (i > 0 && textContents[i].node && textContents[i].node.nodeType === Node.TEXT_NODE) {
                                        textContents[i].node.nodeValue = '';
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                // Exclude toggle button
                if (node.id !== 'pfs-toggle-btn') {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        applyPFSTransformation(node.childNodes[i]);
                    }
                }
            }
        }
    }

    // Determine if element is in Si-yen or Nam-si-yen tab
    function isInSiyenOrNamSiyenTab(node) {
        let current = node;

        // Look upward for tab-pane element
        while (current && current !== document.body) {
            if (current.classList && current.classList.contains('tab-pane')) {
                // Check ID, item1 is Si-yen, item6 is Nam-si-yen
                const id = current.id;
                return id === 'item1' || id === 'item6';
            }
            current = current.parentNode;
        }

        return false;
    }

    // Determine if element is in Hailu tab
    function isInHailuTab(node) {
        let current = node;

        // Look upward for tab-pane element
        while (current && current !== document.body) {
            if (current.classList && current.classList.contains('tab-pane')) {
                // Check ID, item2 is Hailu
                const id = current.id;
                return id === 'item2';
            }
            current = current.parentNode;
        }

        return false;
    }

    // Restore original text
    function restoreOriginalText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (originalTextMap.has(node)) {
                node.nodeValue = originalTextMap.get(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('accent-data')) {
                node.classList.remove('pfs-converted');

                // If entire element HTML is stored, use it first
                if (originalTextMap.has(node)) {
                    node.innerHTML = originalTextMap.get(node);
                    return; // Element already restored, no need to process child nodes
                }

                // Find all child nodes
                const childNodes = Array.from(node.childNodes);

                for (let i = 0; i < childNodes.length; i++) {
                    const child = childNodes[i];
                    if (originalTextMap.has(child)) {
                        if (child.nodeType === Node.TEXT_NODE) {
                            child.nodeValue = originalTextMap.get(child);
                        } else if (child.nodeName.toLowerCase() === 'span') {
                            child.innerHTML = originalTextMap.get(child);
                        } else if (child.nodeName.toLowerCase() === 'sup') {
                            child.innerHTML = originalTextMap.get(child);
                            child.style.display = ''; // Restore display
                        }
                    }
                }

                // Also check all span and sup elements
                const elements = node.querySelectorAll('span, sup');
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    if (originalTextMap.has(element)) {
                        element.innerHTML = originalTextMap.get(element);
                        element.style.display = ''; // Restore display
                    }
                }
            } else {
                // Skip toggle button
                if (node.id !== 'pfs-toggle-btn') {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        restoreOriginalText(node.childNodes[i]);
                    }
                }
            }
        }
    }

    // Handle dynamically loaded content
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        // Skip toggle button
                        if (node.id === 'pfs-toggle-btn') continue;

                        // If currently using PFS, apply conversion
                        if (usePFS) {
                            applyPFSTransformation(node);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupDiacriticFontSupport() {
        const style = document.createElement('style');
        style.id = 'pfs-font-style';
        style.textContent = `
        /* Target only the romanization text, not the hanzi */
        .accent-data.pfs-converted > span:not(:first-child),
        .accent-data.pfs-converted > :not(span):not(.han-char) {
            font-family: 'Gentium Plus', 'Doulos SIL', 'Charis SIL', 'Noto Sans', 'DejaVu Sans', 'Lucida Sans Unicode', sans-serif !important;
            letter-spacing: 0.5px;
        }

        /* Make sure hanzi characters keep their original font */
        .accent-data.pfs-converted .han-char,
        .accent-data.pfs-converted > span:first-child {
            font-family: inherit;
        }
    `;
        document.head.appendChild(style);
    }

    // Initialize on page load
    window.addEventListener('load', function() {
        createToggleButton();
        setupDiacriticFontSupport();
        setupMutationObserver();

        // Decide initial display based on user's choice
        if (usePFS) {
            applyPFSTransformation(document.body);
        }
    });
})();