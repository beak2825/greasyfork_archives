// ==UserScript==
// @name         Hide Google AI Overview
// @namespace    https://greasyfork.org/users/lucasliorle
// @version      0.1
// @description  Hides the AI Overview box in Google Search by removing the container. This only hdies the top because I'm too lazy and I only did this so this stupid thing won't load incorrect info when I'm doing my research project
// @author       LucasLiorLE
// @match        https://www.google.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542153/Hide%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/542153/Hide%20Google%20AI%20Overview.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAIOverview() {
        const headings = document.querySelectorAll('h1');
        for (const h1 of headings) {
            if (h1.textContent.trim() === 'AI Overview') {
                let container = h1;
                for (let i = 0; i < 5; i++) {
                    if (container?.parentElement) {
                        container = container.parentElement;
                    } else {
                        container = null;
                        break;
                    }
                }
                if (container) {
                    container.style.display = 'none';
                    console.log('[AI Overview Hidden]', container);
                }
            }
        }
    }

    removeAIOverview();

    const observer = new MutationObserver(removeAIOverview);
    observer.observe(document.body, { childList: true, subtree: true });
})();
