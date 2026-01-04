// ==UserScript==
// @name         FilterBlade Refresher
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  description should not be invalid
// @author       You
// @match        https://*.filterblade.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=filterblade.xyz
// @grant        none
// @license      wedontdothathere
// @downloadURL https://update.greasyfork.org/scripts/493483/FilterBlade%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/493483/FilterBlade%20Refresher.meta.js
// ==/UserScript==

function delayFor(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

function isElementVisible(el) {
    return !!el.offsetParent;
}

(async function() {
    'use strict';

    while(true) {
        for (let i = 0; i < 25; i++) {
            await delayFor(10000);
            let saveState = document.getElementById("LoadProfileSaveState" + i);
            if (!isElementVisible(saveState)) {
                break;
            }

            saveState.click();
            await delayFor(10000);
            document.getElementById("SelectionButton6").click();
            await delayFor(10000);
            document.getElementById("dlScreen_SyncContent").click();
            await delayFor(10000);
            document.getElementById("SelectionButton5").click();
        }

        await delayFor(3600000);
    }
})();
