// ==UserScript==
// @name         Raenox Ad-Blocker
// @namespace    Violentmonkey Scripts
// @version      0.1
// @license      MIT
// @description  Since uBlock is disabled on Raenox...
// @author       Kayleigh
// @match        https://pks.raenonx.cc/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raenonx.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504556/Raenox%20Ad-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/504556/Raenox%20Ad-Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

function removeAdBlockerWarning() {
        const divs = document.querySelectorAll('div');

        for (const div of divs) {
            const innerDivs = div.querySelectorAll('div');

            for (const innerDiv of innerDivs) {
                const paragraphs = innerDiv.querySelectorAll('p');

                if (paragraphs.length > 0) {
                    let containsText = true;

                    for (const paragraph of paragraphs) {
                        if (!paragraph.textContent.includes('Using Ad-blocker on this website')) {
                            containsText = false;
                            break;
                        }
                    }

                    if (containsText) {
                        div.remove();
                        return;
                    }
                }
            }
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', removeAdBlockerWarning);

    // Run the function when the DOM is modified
    const observer = new MutationObserver(removeAdBlockerWarning);
    observer.observe(document.body, { childList: true, subtree: true });

})();