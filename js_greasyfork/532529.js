// ==UserScript==
// @name         Audible Repeat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to repeat Audible chapters
// @author       Someone
// @match        https://www.amazon.co.jp/arya/webplayer*
// @grant        none
// @license Public Domain
// @downloadURL https://update.greasyfork.org/scripts/532529/Audible%20Repeat.user.js
// @updateURL https://update.greasyfork.org/scripts/532529/Audible%20Repeat.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let savedChapter = null;
    let observer = null;
    let isActive = false;

    function toggleChapterRepeat() {
        const chapterDisplay = document.getElementById('cp-Top-chapter-display');
        const button = document.getElementById('monitorChapterButton');

        if (!chapterDisplay || !button) return;

        if (!isActive) {
            // Activate repeat
            savedChapter = chapterDisplay.textContent.trim();
            button.textContent = 'Chapter Repeat: ON';
            isActive = true;

            observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const currentChapter = chapterDisplay.textContent.trim();
                        if (currentChapter !== savedChapter) {
                            console.log(`Chapter changed from "${savedChapter}" to "${currentChapter}". Triggering previous chapter button.`);
                            const prevBtn = document.querySelector('.adblPreviousChapter');
                            if (prevBtn) prevBtn.click();
                        }
                    }
                }
            });

            observer.observe(chapterDisplay, { childList: true, subtree: true });

        } else {
            // Deactivate repeat
            if (observer) observer.disconnect();
            button.textContent = 'Chapter Repeat: OFF';
            isActive = false;
            savedChapter = null;
        }
    }

    function addButton() {
        const controlsDiv = document.getElementById('adbl-cloud-player-controls');
        if (!controlsDiv) return;

        if (document.getElementById('monitorChapterButton')) return;

        const btn = document.createElement('button');
        btn.id = 'monitorChapterButton';
        btn.textContent = 'Chapter Repeat: OFF';
        btn.style.marginLeft = '10px';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #ccc';
        btn.style.background = '#f0f0f0';
        btn.style.borderRadius = '4px';

        btn.onclick = toggleChapterRepeat;

        controlsDiv.appendChild(btn);
    }

    // Wait for the player controls to be available
    const interval = setInterval(() => {
        const controlsDiv = document.getElementById('adbl-cloud-player-controls');
        if (controlsDiv) {
            clearInterval(interval);
            addButton();
        }
    }, 500);
})();