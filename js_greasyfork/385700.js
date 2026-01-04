// ==UserScript==
// @name         Desuckify Medium!
// @namespace    https://example.com
// @version      0.2
// @description  Make Medium easier to read (on smaller screens only maybe)
// @author       KS
// @match        *://medium.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.medium.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/385700/Desuckify%20Medium%21.user.js
// @updateURL https://update.greasyfork.org/scripts/385700/Desuckify%20Medium%21.meta.js
// ==/UserScript==

// Function courtesy of PaarCrafter on StackOverflow
// https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(".js-stickyFooter { display: none !important; }");
addGlobalStyle(".metabar { display: none !important; }");
addGlobalStyle(".js-postShareWidget { display: none !important; }");