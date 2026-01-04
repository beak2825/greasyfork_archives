// ==UserScript==
// @name         UnscrambleRequiemtls
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  网站内容反混淆
// @author       otokoneko
// @match        https://requiemtls.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=requiemtls.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528356/UnscrambleRequiemtls.user.js
// @updateURL https://update.greasyfork.org/scripts/528356/UnscrambleRequiemtls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const font_maps = {"k1": {"\u30a0": "P", "\u30a1": "Q", "\u30a2": "R", "\u30a3": "S", "\u30a4": "T", "\u30a5": "U", "\u30a6": "V", "\u30a7": "W", "\u30a8": "X", "\u30a9": "Y", "\u30aa": "Z", "\u30ab": "[", "\u30ac": "\\", "\u30ad": "]", "\u30ae": "^", "\u30af": "_", "\u30b0": "`", "\u30b1": "a", "\u30b2": "b", "\u30b3": "c", "\u30b4": "d", "\u30b5": "e", "\u30b6": "f", "\u30b7": "g", "\u30b8": "h", "\u30b9": "i", "\u30ba": "j", "\u30bb": "k", "\u30bc": "l", "\u30bd": "m", "\u30be": "n", "\u30bf": "o", "\u30c0": "p", "\u30c1": "q", "\u30c2": "r", "\u30c3": "s", "\u30c4": "t", "\u30c5": "u", "\u30c6": "v", "\u30c7": "w", "\u30c8": "x", "\u30c9": "y", "\u30ca": "z", "\u30cb": "{", "\u30cc": "|", "\u30cd": "}", "\u30ce": "~", "\u30cf": "!", "\u30d0": "\"", "\u30d1": "#", "\u30d2": "$", "\u30d3": "%", "\u30d4": "&", "\u30d5": "'", "\u30d6": "(", "\u30d7": ")", "\u30d8": "*", "\u30d9": "+", "\u30da": ",", "\u30db": "-", "\u30dc": ".", "\u30dd": "/", "\u30de": "0", "\u30df": "1", "\u30e0": "2", "\u30e1": "3", "\u30e2": "4", "\u30e3": "5", "\u30e4": "6", "\u30e5": "7", "\u30e6": "8", "\u30e7": "9", "\u30e8": ":", "\u30ea": "<", "\u30eb": "=", "\u30ec": ">", "\u30ed": "?", "\u30ee": "@", "\u30ef": "A", "\u30f0": "B", "\u30f1": "C", "\u30f2": "D", "\u30f3": "E", "\u30f4": "F", "\u30f5": "G", "\u30f6": "H", "\u30f7": "I", "\u30f8": "J", "\u30f9": "K", "\u30fa": "L", "\u30fb": "M", "\u30fc": "N", "\u30fd": "O", "\u30e9": ";"}, "g1": {"\u10a0": "P", "\u10a1": "Q", "\u10a2": "R", "\u10a3": "S", "\u10a4": "T", "\u10a5": "U", "\u10a6": "V", "\u10a7": "W", "\u10a8": "X", "\u10a9": "Y", "\u10aa": "Z", "\u10ab": "[", "\u10ac": "\\", "\u10ad": "]", "\u10ae": "^", "\u10af": "_", "\u10b0": "`", "\u10b1": "a", "\u10b2": "b", "\u10b3": "c", "\u10b4": "d", "\u10b5": "e", "\u10b6": "f", "\u10b7": "g", "\u10b8": "h", "\u10b9": "i", "\u10ba": "j", "\u10bb": "k", "\u10bc": "l", "\u10bd": "m", "\u10be": "n", "\u10bf": "o", "\u10c0": "p", "\u10c1": "q", "\u10c2": "r", "\u10c3": "s", "\u10c4": "t", "\u10c5": "u", "\u10c6": "v", "\u10c7": "w", "\u10c8": "x", "\u10c9": "y", "\u10ca": "z", "\u10cb": "{", "\u10cc": "|", "\u10cd": "}", "\u10ce": "~", "\u10cf": "!", "\u10d0": "\"", "\u10d1": "#", "\u10d2": "$", "\u10d3": "%", "\u10d4": "&", "\u10d5": "'", "\u10d6": "(", "\u10d7": ")", "\u10d8": "*", "\u10d9": "+", "\u10da": ",", "\u10db": "-", "\u10dc": ".", "\u10dd": "/", "\u10de": "0", "\u10df": "1", "\u10e0": "2", "\u10e1": "3", "\u10e2": "4", "\u10e3": "5", "\u10e4": "6", "\u10e5": "7", "\u10e6": "8", "\u10e7": "9", "\u10e8": ":", "\u10ea": "<", "\u10eb": "=", "\u10ec": ">", "\u10ed": "?", "\u10ee": "@", "\u10ef": "A", "\u10f0": "B", "\u10f1": "C", "\u10f2": "D", "\u10f3": "E", "\u10f4": "F", "\u10f5": "G", "\u10f6": "H", "\u10f7": "I", "\u10f8": "J", "\u10f9": "K", "\u10fa": "L", "\u10fb": "M", "\u10fc": "N", "\u10fd": "O", "\u10e9": ";"}, "s1": {"\u1b80": "P", "\u1b81": "Q", "\u1b82": "R", "\u1b83": "S", "\u1b84": "T", "\u1b85": "U", "\u1b86": "V", "\u1b87": "W", "\u1b88": "X", "\u1b89": "Y", "\u1b8a": "Z", "\u1b8b": "[", "\u1b8c": "\\", "\u1b8d": "]", "\u1b8e": "^", "\u1b8f": "_", "\u1b90": "`", "\u1b91": "a", "\u1b92": "b", "\u1b93": "c", "\u1b94": "d", "\u1b95": "e", "\u1b96": "f", "\u1b97": "g", "\u1b98": "h", "\u1b99": "i", "\u1b9a": "j", "\u1b9b": "k", "\u1b9c": "l", "\u1b9d": "m", "\u1b9e": "n", "\u1b9f": "o", "\u1ba0": "p", "\u1ba1": "q", "\u1ba2": "r", "\u1ba3": "s", "\u1ba4": "t", "\u1ba5": "u", "\u1ba6": "v", "\u1ba7": "w", "\u1ba8": "x", "\u1ba9": "y", "\u1baa": "z", "\u1bab": "{", "\u1bac": "|", "\u1bad": "}", "\u1bae": "~", "\u1baf": "!", "\u1bb0": "\"", "\u1bb1": "#", "\u1bb2": "$", "\u1bb3": "%", "\u1bb4": "&", "\u1bb5": "'", "\u1bb6": "(", "\u1bb7": ")", "\u1bb8": "*", "\u1bb9": "+", "\u1bba": ",", "\u1bbb": "-", "\u1bbc": ".", "\u1bbd": "/", "\u1bbe": "0", "\u1bbf": "1", "\u1bc0": "2", "\u1bc1": "3", "\u1bc2": "4", "\u1bc3": "5", "\u1bc4": "6", "\u1bc5": "7", "\u1bc6": "8", "\u1bc7": "9", "\u1bc8": ":", "\u1bca": "<", "\u1bcb": "=", "\u1bcc": ">", "\u1bcd": "?", "\u1bce": "@", "\u1bcf": "A", "\u1bd0": "B", "\u1bd1": "C", "\u1bd2": "D", "\u1bd3": "E", "\u1bd4": "F", "\u1bd5": "G", "\u1bd6": "H", "\u1bd7": "I", "\u1bd8": "J", "\u1bd9": "K", "\u1bda": "L", "\u1bdb": "M", "\u1bdc": "N", "\u1bdd": "O", "\u1bc9": ";"}};
    function unscramble(encodedStr, font) {
        return encodedStr.split('').map(char => {
            if (char === ' ') return ' ';
            const key = font.split('_')[2];
            const font_map = font_maps[key];
            return font_map[char] ?? char;
        }).join('');
    }

    function replaceText(node, font) {
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.textContent;
            const decoded = unscramble(original, font);

            if (decoded !== original) {
                node.textContent = decoded;
            }
        } else {
            node.childNodes.forEach(c => replaceText(c, font));
        }
    }

    function addFontOverride() {
        const style = document.createElement('style');
        style.textContent = `
        .epcontent.entry-content,
        .epcontent.entry-content * {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    `;
        document.head.appendChild(style);
    }

    function processDocument() {
        addFontOverride();

        const targetElements = document.querySelectorAll('div.epcontent.entry-content');

        targetElements.forEach(element => {
            console.log(element.style['font-family'].split(',')[0]);
            replaceText(element, element.style['font-family'].split(',')[0]);
        });
    }

    processDocument();
})();