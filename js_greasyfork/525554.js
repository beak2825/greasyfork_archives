// ==UserScript==
// @name         INSTANT TEXT SNATCH-O-MATIC
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Liberates text with the subtlety of a niffler in a gold vault
// @author       Your Mischievous Coding Elf
// @match        *://*/*
// @grant        GM_setClipboard
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/525554/INSTANT%20TEXT%20SNATCH-O-MATIC.user.js
// @updateURL https://update.greasyfork.org/scripts/525554/INSTANT%20TEXT%20SNATCH-O-MATIC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();

            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(document.body);

            selection.removeAllRanges();
            selection.addRange(range);

            const stolenGoods = selection.toString();
            GM_setClipboard(stolenGoods, 'text');

            selection.removeAllRanges();

            // Add cheeky confirmation
            const wink = document.createElement('div');
            wink.innerHTML = '📋✨ *poof* Your text has been "borrowed"!';
            wink.style = 'position:fixed;top:20px;right:20px;padding:15px;background:#ffeb3b;z-index:9999;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.3);font-family:Comic Sans MS;';
            document.body.appendChild(wink);

            setTimeout(() => document.body.removeChild(wink), 2000);
        }
    });
    // Mobile-friendly "STEAL TEXT" button
const banditButton = document.createElement('button');
banditButton.textContent = '📋 SNATCH';
banditButton.style = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:15px;background:#FF6B6B;color:white;border-radius:25px;font-family:Comic Sans MS;';
banditButton.onclick = function() {
  const stolenGoods = document.body.innerText;
  navigator.clipboard.writeText(stolenGoods);
  this.textContent = '📦✨ TEXT HEIST COMPLETE!';
  setTimeout(() => this.textContent = '📋 SNATCH', 2000);
};
document.body.appendChild(banditButton);
})();