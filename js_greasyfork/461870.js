// ==UserScript==
// @name         Copy code
// @match        https://4pda.to/forum/index.php?showtopic=*
// @grant        GM_setClipboard
// @namespace    4pda
// @version      0.1
// @description  copy code from code block with one click/tap
// @author       drakulaboy
// @downloadURL https://update.greasyfork.org/scripts/461870/Copy%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/461870/Copy%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const codeBlocks = document.querySelectorAll('div.post-block.code');
    codeBlocks.forEach(block => {
        // Create a button element and add it before the code block
        const button = document.createElement('button');
        button.textContent = 'Скопировать';
        block.parentNode.insertBefore(button, block);

        // When the button is clicked, copy the code to the clipboard
        button.addEventListener('click', () => {
            const code = block.innerText;
            GM_setClipboard(code);
            alert('Код скопирован в буфер обмена!');
        });
    });
})();
