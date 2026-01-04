// ==UserScript==
// @name         SlidesHide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide navigation bar in Google Slides presentation mode
// @author       Bruce Sharpe
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/420529/SlidesHide.user.js
// @updateURL https://update.greasyfork.org/scripts/420529/SlidesHide.meta.js
// ==/UserScript==

const css = `
.punch-viewer-nav-rounded-container { visibility: hidden; }
`;

new MutationObserver((_, observer) => {
    const iframe = document.querySelector('iframe.punch-present-iframe');
    if (iframe) {
        iframe.addEventListener('load', () => addStyle(css, iframe), {once: true});
    }
}).observe(document, {subtree: true, childList: true});

function addStyle(css, frame = window) {
    const doc = frame.contentDocument || frame.document;
    const el = document.createElement('style');
    el.textContent = css;
    doc.documentElement.appendChild(el);
}
