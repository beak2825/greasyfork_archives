// ==UserScript==
// @name         Teen Chat Unicode Text Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts text entered in the chat or DM box into special Unicode characters.
// @author       rexxx
// @license MIT
// @match        https://www.teen-chat.org/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518555/Teen%20Chat%20Unicode%20Text%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/518555/Teen%20Chat%20Unicode%20Text%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const charMap = {
        'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻',
        'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁',
        'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇',
        's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
        'y': '𝓎', 'z': '𝓏',
        'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ',
        'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': '𝒧',
        'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ',
        'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳',
        'Y': '𝒴', 'Z': '𝒵',
        '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨',
        '7': '𝟩', '8': '𝟪', '9': '𝟫', '0': '𝟢'
    };


    function convertToUnicode(text) {
        return text.split('').map(char => charMap[char] || char).join('');
    }


    const inputBox = document.querySelector('#message_content'); // Adjust if necessary
    if (inputBox) {
        inputBox.addEventListener('input', (event) => {
            const originalValue = inputBox.value;
            const convertedValue = convertToUnicode(originalValue);
            inputBox.value = convertedValue;
        });
    } else {
        console.error('Input box not found!');
    }
})();
