// ==UserScript==
// @name         Remove Google AI Overview
// @version      1.5
// @description  Removes Google's AI Overview and AI Mode link from search results.
// @author       Laucs
// @match        https://www.google.com/
// @grant         remove ai slop
// @run-at       document-idle
// @deny         ai slop from google
// @namespace https://greasyfork.org/users/1483782
// @downloadURL https://update.greasyfork.org/scripts/540328/Remove%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/540328/Remove%20Google%20AI%20Overview.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAIOverviewElements() {
        // Remove AI Overview by jsname
        const jsnameBox = document.querySelector('div[jsname="txosbe"]');
        if (jsnameBox) {
            jsnameBox.remove();
            console.log('Removed AI Overview: jsname="txosbe"');
        }

        // Remove AI Overview by class
        const classBox = document.querySelector('div.YNk70c.EjQTId');
        if (classBox) {
            classBox.remove();
            console.log('Removed AI Overview: class="YNk70c EjQTId"');
        }

        // Remove AI Mode <a> link
        const aiModeLink = document.querySelector('a.XVMlrc.nPDzT.T3FoJb[href*="udm=50"]');
        if (aiModeLink) {
            aiModeLink.remove();
            console.log('Removed AI Mode link');
        }

        // Remove AI Mode <div> container
        const aiModeDivs = document.querySelectorAll('div.YmvwI[jsname="bVqjv"]');
        aiModeDivs.forEach(div => {
            const span = div.querySelector('span.Beswgc');
            if (span && span.textContent.trim() === 'AI Mode') {
                div.remove();
                console.log('Removed AI Mode <div>');
            }
        });

        // Remove AI Mode <button>
        const aiModeButton = document.querySelector('button.plR5qb[jscontroller="jNZDL"][role="link"][type="button"]');
        if (aiModeButton) {
            aiModeButton.remove();
            console.log('Removed AI Mode <button>');
        }
    }

    // Run once and observe changes
    removeAIOverviewElements();
    const observer = new MutationObserver(removeAIOverviewElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();