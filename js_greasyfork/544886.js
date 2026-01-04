// ==UserScript==
// @name         Prolific Study Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add direct links to study pages on Prolific listings
// @author       Lintilla
// @match        https://app.prolific.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544886/Prolific%20Study%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/544886/Prolific%20Study%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addStudyLinks() {
        const studyItems = document.querySelectorAll('li[data-testid^="study-"]');
        studyItems.forEach(item => {
            const testid = item.getAttribute('data-testid');
            const studyId = testid.replace('study-', '');
            const titleEl = item.querySelector('[data-testid="title"]');
            if (titleEl && !titleEl.querySelector('.prolific-link')) {
                const link = document.createElement('a');
                link.href = `https://app.prolific.com/studies/${studyId}`;
                link.textContent = '🔗 Open study page';
                link.target = '_blank';
                link.className = 'prolific-link';
                link.style.marginLeft = '8px';
                link.style.fontSize = '0.9em';
                titleEl.appendChild(link);
            }
        });
    }
    addStudyLinks();
    const observer = new MutationObserver(addStudyLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();