// ==UserScript==
// @name        Cancel Ctrl+X
// @namespace   CtrlXInterceptorVelloAI
// @description This userscript prevents the Ctrl+X action on the Vello AI website.
// @version     1.0.1
// @icon        https://www.google.com/s2/favicons?sz=64&domain=vello.ai
// @match       https://vello.ai/*
// @grant       none
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480785/Cancel%20Ctrl%2BX.user.js
// @updateURL https://update.greasyfork.org/scripts/480785/Cancel%20Ctrl%2BX.meta.js
// ==/UserScript==

console.log('Userscript to intercept and cancel Ctrl+X is activated.');

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'x') {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log('Ctrl+X pressed and action cancelled.');
    }
}, true);