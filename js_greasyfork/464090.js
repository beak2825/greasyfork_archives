// ==UserScript==
// @name         Copy code xda
// @match        https://forum.xda-developers.com/t/*
// @grant        GM_setClipboard
// @namespace    xda
// @version      0.1
// @description  copy code from code block with one click/tap
// @author       drakulaboy
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464090/Copy%20code%20xda.user.js
// @updateURL https://update.greasyfork.org/scripts/464090/Copy%20code%20xda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const codeBlocks = document.querySelectorAll('div.bbCodeBlock-content');
    codeBlocks.forEach(block => {
        // Create a button element and add it before the code block
        const button = document.createElement('button');
        button.textContent = 'Copy';
        block.parentNode.insertBefore(button, block);

        // When the button is clicked, copy the code to the clipboard
        button.addEventListener('click', () => {
            const code = block.innerText;
            GM_setClipboard(code);
            alert('Code is copied in the clipboard!');
        });
    });
})();
