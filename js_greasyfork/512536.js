// ==UserScript==
// @name         Subscript and Superscript Converter
// @namespace    https://tampermonkey.net/
// @license      MIT
// @version      1.0
// @author       Rekt
// @description  Convert text to subscript or superscript using keyboard shortcuts
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512536/Subscript%20and%20Superscript%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/512536/Subscript%20and%20Superscript%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const superscriptMap = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶',
        '7': '⁷', '8': '⁸', '9': '⁹', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ',
        'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ',
        'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': '𐞥', 'r': 'ʳ', 's': 'ˢ',
        't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
    };

    const subscriptMap = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆',
        '7': '₇', '8': '₈', '9': '₉', 'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
        'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ',
        's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ', 'y': 'ᵧ', '+': '₊',
        '-': '₋', '=': '₌', '(': '₍', ')': '₎'
    };

    function convertText(input, map) {
        return input.split('').map(char => map[char] || char).join('');
    }

    window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.altKey) {
            event.preventDefault();
            let convertedText = '';

            if (event.key === ']') {
                const input = prompt('Enter text to convert to subscript:');
                convertedText = convertText(input, subscriptMap);
            } else if (event.key === ']' && event.shiftKey) {
                const input = prompt('Enter text to convert to superscript:');
                convertedText = convertText(input, superscriptMap);
            }

            if (convertedText) {
                navigator.clipboard.writeText(convertedText).then(() => {
                    document.execCommand('insertText', false, convertedText);
                });
            }
        }
    });
})();