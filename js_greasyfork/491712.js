// ==UserScript==
// @name         Kbin CSS Fix
// @namespace    pamasich-kbin
// @version      1.0
// @description  Fixes broken magazine CSS on /kbin.
// @author       Pamasich
// @match        https://kbin.social/*
// @match        https://kbin.earth/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491712/Kbin%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/491712/Kbin%20CSS%20Fix.meta.js
// ==/UserScript==
 
/*
    /kbin currently breaks any magazine CSS that uses the characters '>' or '&', by replacing
    them with their HTML escape codes. This userscript is meant to revert that and make the
    CSS work again.
*/

function setup () {
    var dummy = document.createElement("div");
    document.querySelectorAll("style:not([id])").forEach((style) => {
        dummy.innerHTML = style.textContent;
        if (dummy.innerHTML != dummy.textContent) {
            style.textContent = dummy.textContent;
        }
    });
    dummy.remove();
}

setup();

const observer = new MutationObserver((mutations) => {
    // ensure the observer only triggers if the user navigated via turbo mode
    if (mutations.some((mutation) => Array.from(mutation.addedNodes).some((node) => node.nodeName == "BODY"))) setup();
});
// observing the entire document because of turbo mode
observer.observe(document, { childList: true, subtree: true });