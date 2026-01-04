// ==UserScript==
// @name         Tumblr Faster Boops
// @namespace    wachi-delectrico.tumblr.com
// @version      1.2
// @description  Boop faster by not needing to confirm it
// @author       Valen
// @match        *://*.tumblr.com
// @match        *://*.tumblr.com/*
// @icon         https://icons.duckduckgo.com/ip2/tumblr.com.ico
// @require      https://code.jquery.com/jquery-3.7.1.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515049/Tumblr%20Faster%20Boops.user.js
// @updateURL https://update.greasyfork.org/scripts/515049/Tumblr%20Faster%20Boops.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

$(document).ready(function (){

// Function waitForElm is from: https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

for (const span of document.querySelectorAll("span.EvhBA")) {
  if (span.textContent.includes('Boop')) {
    span.addEventListener('click', async () => {
        const elm = await waitForElm('button[aria-label="BOOp"]');
        document.querySelector('button[aria-label="BOOp"]').click();
        console.log("Successfully booped");
    });
  }
};

const boopsInActivity = async () => {
    const actEle = await waitForElm('[aria-label="Notification"]');
    for (const span of document.querySelectorAll("span.EvhBA")) {
        if ((span.textContent.includes('Boop')) || (span.textContent.includes('Boop back')) || (span.textContent.includes('Boop yourself')) || (span.textContent.includes('Revenge')) || (span.textContent.includes('Super boop'))) {
            span.addEventListener('click', async () => {
                const elm = await waitForElm('button[aria-label="BOOp"]');
                document.querySelector('button[aria-label="BOOp"]').click();
                console.log("Successfully booped");
            });
        }
    };
};

boopsInActivity();

});