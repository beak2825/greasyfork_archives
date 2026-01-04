// ==UserScript==
// @name         Cyclist Highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight cyclists
// @author       Yankee
// @license MIT
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523322/Cyclist%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/523322/Cyclist%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndHighlight() {
        const rootDiv = document.querySelector('.pickpocketing-root');
        if (!rootDiv) {
            return;
        }
        const targetDivs = rootDiv.querySelectorAll('.titleAndProps___DdeVu');

        targetDivs.forEach((div) => {
            const firstChild = div.querySelector(':scope > div');
            if (firstChild && firstChild.textContent.trim() === 'Cyclist') {
                const parent = div.parentElement.parentElement;
                if (parent.id === 'done') {
                    return;
                }
                var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
                audio.play();
                parent.style.backgroundColor = 'green';
                parent.id = 'done';
            }
        });
    }

    function monitorChanges() {
        console.log('Running monitor');

        const observer = new MutationObserver(() => {
            checkAndHighlight();
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    monitorChanges();
})();