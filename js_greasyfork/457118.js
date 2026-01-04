// ==UserScript==
// @name         Auto Load More
// @namespace    https://skara.glitch.me/
// @version      1.0
// @description  Automatically clicks the "Load More" button, so you don't to.
// @author       Jekyllean
// @run-at       document-end
// @match        https://discotools.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discotools.xyz
// @grant        none
// @license        GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/457118/Auto%20Load%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/457118/Auto%20Load%20More.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const TIMES_TO_CLICK = 25;
    const CLICK_TIMEOUT = 200;
    const SEARCH_TEXT = "load more";

    await new Promise(r => setTimeout(r, 1000));
    const button = document.evaluate(`//button[text()='${SEARCH_TEXT}']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button !== null) {
        for (let i = 0; i < TIMES_TO_CLICK; i++) {
            button.click();
            await new Promise(r => setTimeout(r, CLICK_TIMEOUT));
        }
        console.info("Load proccess complete");
    } else {
        console.error("Failed to target the button element");
    }
})();