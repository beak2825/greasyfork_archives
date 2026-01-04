// ==UserScript==
// @name         Arch-A
// @namespace    https://github.com/DevilGlitch/ArchA
// @version      A.2.5.3
// @description  A simplistic tampermonkey script that sends a highlighted piece of text to a helper site
// @license      MIT
// @match        https://ctccs.blackboard.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465992/Arch-A.user.js
// @updateURL https://update.greasyfork.org/scripts/465992/Arch-A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let highlightedText = '';
    let container = null;

    window.addEventListener('mouseup', event => {
        console.log('Mouse up event detected');
        runArchA();
    });

    // function to send the request to ChatGPT and display the response
    function runArchA() {
        const highlightedText = window.getSelection().toString();
        if (!highlightedText) return;

        // Replace <TRANSLATOR_URL> with the URL of the translator API that you want to use
        const translatorUrl = 'https://www.answers.com/search?q=';

        // Replace spaces with plus signs and encode question marks
        const translatedText = encodeURIComponent(highlightedText);

        const url = `${translatorUrl}?text=${translatedText}`;

        // Open the translated text in a new window
        window.open(url);
    }
})();