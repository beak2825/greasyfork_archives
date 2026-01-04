// ==UserScript==
// @name         BookFusion: Inherit Fonts
// @namespace    https://reader.bookfusion.com/
// @version      1.0
// @description  Add a style that overrides font with "inherit" for certain books
// @author       JamesCodesThings
// @match        *://reader.bookfusion.com/books/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookfusion.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465367/BookFusion%3A%20Inherit%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/465367/BookFusion%3A%20Inherit%20Fonts.meta.js
// ==/UserScript==

const styleToInject = `
#sbo-rt-content {
  font-family: inherit !important;
}
`;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

(async function() {
    'use strict';

    const delay = 50;
    const retries = 100;
    let bookFrame, ctr = 0;
    while (!bookFrame && ctr < retries) {
        bookFrame = document.querySelectorAll('iframe')[0];
        ctr++;
        await sleep(delay);
    }
    if (!bookFrame) {
        console.error('Could not find the book frame after %ss', delay * retries / 1000);
        return;
    }

    const bookDocument = bookFrame.contentDocument;
    const injectedStyle = bookDocument.createElement('style');
    injectedStyle.innerHTML = styleToInject;
    bookDocument.head.appendChild(injectedStyle);

})();
