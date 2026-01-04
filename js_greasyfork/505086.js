// ==UserScript==
// @name         Lute: Word Count
// @version      20240825
// @description  Add word count functionality to Lute's New Book page
// @match        http://localhost:500*/book/new
// @grant        none
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/505086/Lute%3A%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/505086/Lute%3A%20Word%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.textContent = 'Count Words';
    button.style.marginTop = '5px';
    button.style.padding = "0.1em 0.2em";
    button.style.fontSize = '0.8em';
    button.type = 'button';

    const countDisplay = document.createElement('span');
    countDisplay.style.marginLeft = '5px';
    countDisplay.style.fontSize = '0.9em';

    function countWords(e) {
        e.preventDefault();
        const text = document.getElementById('text').value;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        countDisplay.textContent = `${wordCount}`;
    }

    button.addEventListener('click', countWords);

    const textarea = document.getElementById('text');
    textarea.parentNode.insertBefore(button, textarea.nextSibling);
    button.parentNode.insertBefore(countDisplay, button.nextSibling);
})();