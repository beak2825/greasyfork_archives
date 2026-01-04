// ==UserScript==
// @name         lipu Wikipesija kepeken sitelen pona
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  o lukin e lipu Wiipesija kepeken sitelen pona!
// @match        https://wikipesija.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502375/lipu%20Wikipesija%20kepeken%20sitelen%20pona.user.js
// @updateURL https://update.greasyfork.org/scripts/502375/lipu%20Wikipesija%20kepeken%20sitelen%20pona.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var FONT_URL = 'https://github.com/janSame/linja-pona/raw/8436d31ba84bb9c7198f7df2ec07d5b8b56ffdf7/linja-pona-4.9.otf';

    var tokiPonaWords = {
        'a': ['a', 'akesi', 'ala', 'alasa', 'ale', 'ali', 'anpa', 'ante', 'anu', 'awen'],
        'e': ['e', 'en'],
        'i': ['ijo', 'ike', 'ilo', 'insa'],
        'j': ['jan', 'jaki', 'jo'],
        'k': ['kala', 'kalama', 'kama', 'kasi', 'ken', 'kepeken', 'kili', 'kiwen', 'ko', 'kon', 'kule', 'kulupu', 'kute'],
        'l': ['la', 'lape', 'laso', 'lawa', 'len', 'lete', 'li', 'lili', 'linja', 'lipu', 'loje', 'lon', 'luka', 'lukin', 'lupa'],
        'm': ['ma', 'mama', 'mani', 'meli', 'mi', 'mije', 'moku', 'moli', 'monsi', 'mu', 'mun', 'musi', 'mute'],
        'n': ['namako', 'nanpa', 'nasa', 'nasin', 'nena', 'ni', 'nimi', 'noka'],
        'o': ['o', 'olin', 'ona', 'open'],
        'p': ['pakala', 'pali', 'palisa', 'pan', 'pana', 'pi', 'pilin', 'pimeja', 'pini', 'pipi', 'poka', 'poki', 'pona', 'pu'],
        's': ['sama', 'seli', 'selo', 'seme', 'sewi', 'sijelo', 'sike', 'sin', 'sina', 'sinpin', 'sitelen', 'sona', 'soweli', 'suli', 'suno', 'supa', 'suwi'],
        't': ['tan', 'taso', 'tawa', 'telo', 'tenpo', 'toki', 'tomo', 'tu'],
        'u': ['unpa', 'uta', 'utala'],
        'w': ['walo', 'wan', 'waso', 'wawa', 'weka', 'wile']
    };

    var tokiPonaLetters = 'aeijklmnopstuw';

    function getRandomTokiPonaWord(letter) {
        letter = letter.toLowerCase();
        if (tokiPonaWords[letter]) {
            return tokiPonaWords[letter][Math.floor(Math.random() * tokiPonaWords[letter].length)];
        }
        return letter;
    }

    function isTokiPonaWord(word) {
        return word.split('').every(function(char) {
            return tokiPonaLetters.includes(char.toLowerCase());
        });
    }

    function formatCapitalizedWord(word) {
        if (isTokiPonaWord(word)) {
            var lowercaseWord = word.toLowerCase();
            var formattedWord = lowercaseWord.split('').map(function(c) {
                return getRandomTokiPonaWord(c);
            }).join('_');
            return '[_' + formattedWord + ']';
        }
        return word;
    }

    function processText(text) {
        return text.replace(/\b[A-Z]\w+/g, function(match) { return formatCapitalizedWord(match); });
    }

    function modifyPage() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;
        while (node = walker.nextNode()) {
            if (node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                node.textContent = processText(node.textContent);
            }
        }
    }

    // Add custom font
    var style = document.createElement('style');
    style.textContent =
        "@font-face {" +
        "    font-family: 'Linja Pona';" +
        "    src: url('" + FONT_URL + "') format('opentype');" +
        "    font-weight: normal;" +
        "    font-style: normal;" +
        "}" +
        "body {" +
        "    font-family: 'Linja Pona', sans-serif !important;" +
        "}" +
        "body :not(:is(script, style)) {" +
        "    font-family: 'Linja Pona', sans-serif !important;" +
        "}" +
        ":not(:lang(tok)) {" +
        "    font-family: Arial, sans-serif !important;" +
        "}";
    document.head.appendChild(style);

    // Run modification immediately
    modifyPage();

    // Optionally, you can re-run the modification periodically or on specific events
    // if the website dynamically updates its content
    // setInterval(modifyPage, 5000); // Re-run every 5 seconds, for example
})();