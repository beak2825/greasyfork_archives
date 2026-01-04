// ==UserScript==
// @name         Transliterate to Inuktitut (with Bug Fixes)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Converts website text into Inuktitut syllabics, avoiding UI issues
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530849/Transliterate%20to%20Inuktitut%20%28with%20Bug%20Fixes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530849/Transliterate%20to%20Inuktitut%20%28with%20Bug%20Fixes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Elements to ignore (search bars, buttons, UI elements)
    const ignoredTags = ["INPUT", "TEXTAREA", "BUTTON", "SELECT", "SCRIPT", "STYLE", "META"];

    // English to Inuktitut syllabics substitutions
    const letterSubstitutions = {
        "ch": "ᑕᔭ", "sh": "ᓴ", "th": "ᓴ", "ng": "ᖕ", "wh": "Ꮩ", "w": "ᐍ",
        "y": "ᔨ", "j": "ᔭ", "k": "ᒃ", "d": "ᑕ", "b": "ᐱ", "c": "ᑐ",
        "f": "ᓴ", "p": "ᑉ", "g": "ᑕ", "q": "ᖯ", "z": "ᓯ"
    };

    // Latin to Inuktitut syllabic mapping (lowercase)
    const translitMapLower = {
        "a": "ᐊ", "b": "ᐱ", "c": "ᑐ", "d": "ᑕ", "e": "ᐁ", "f": "ᓴ",
        "g": "ᑕ", "h": "ᐦ", "i": "ᐃ", "j": "ᔭ", "k": "ᒃ", "l": "ᓪ",
        "m": "ᒻ", "n": "ᓐ", "o": "ᐅ", "p": "ᑉ", "q": "ᖯ", "r": "ᕆ",
        "s": "ᓴ", "t": "ᑎ", "u": "ᐅ", "v": "ᐅ", "w": "ᐍ", "x": "ᕿ",
        "y": "ᔨ", "z": "ᓯ"
    };

    // Latin to Inuktitut syllabic mapping (uppercase)
    const translitMapUpper = {
        "A": "ᐊ", "B": "ᐱ", "C": "ᑐ", "D": "ᑕ", "E": "ᐁ", "F": "ᓴ",
        "G": "ᑕ", "H": "ᐦ", "I": "ᐃ", "J": "ᔭ", "K": "ᒃ", "L": "ᓪ",
        "M": "ᒻ", "N": "ᓐ", "O": "ᐅ", "P": "ᑉ", "Q": "ᖯ", "R": "ᕆ",
        "S": "ᓴ", "T": "ᑎ", "U": "ᐅ", "V": "ᐅ", "W": "ᐍ", "X": "ᕿ",
        "Y": "ᔨ", "Z": "ᓯ"
    };

    function adjustEnglishLetters(word) {
        for (const [key, value] of Object.entries(letterSubstitutions)) {
            word = word.replace(new RegExp(key, "gi"), value);
        }
        return word;
    }

    function transliterateText(text) {
        return text.replace(/\b[a-zA-Z]+\b/g, word => {
            word = adjustEnglishLetters(word.toLowerCase()); // Adjust before mapping

            let result = '';
            for (let char of word) {
                // Check for uppercase and apply the corresponding map
                if (char === char.toUpperCase()) {
                    result += translitMapUpper[char] || translitMapLower[char.toLowerCase()] || char;
                } else {
                    result += translitMapLower[char] || char;
                }
            }
            return result;
        });
    }

    function transliterateNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.parentNode && !ignoredTags.includes(node.parentNode.tagName)) {
            node.nodeValue = transliterateText(node.nodeValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                transliterateNode(child);
            }
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => transliterateNode(node));
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    transliterateNode(document.body);
    observeDOMChanges();

})();
