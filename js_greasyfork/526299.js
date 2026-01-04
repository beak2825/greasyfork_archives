// ==UserScript==
// @name         TeamOS Signature Hider
// @namespace    https://thealmahmud.blogspot.com/
// @version      1.0
// @description  Hide user signatures in TeamOS forums.
// @author       almahmud
// @license      GPL-3.0-or-later
// @match        https://*.teamos.xyz/*
// @run-at       document-body
// @grant        none
// @icon       https://www.google.com/s2/favicons?sz=64&domain=teamos.xyz
// @downloadURL https://update.greasyfork.org/scripts/526299/TeamOS%20Signature%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/526299/TeamOS%20Signature%20Hider.meta.js
// ==/UserScript==

// Function to append custom CSS
function addStyle(css) {
    let head = document.getElementsByTagName('head')[0];
    if (!head) return;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Hide signatures
addStyle(`aside.message-signature { display: none !important; }`);
