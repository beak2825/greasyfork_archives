// ==UserScript==
// @name         Clean Out Of Stock (Trikart.com)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes all of out of stock items from trikart.com, you're welcome!
// @author       You
// @match        https://www.trikart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trikart.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466394/Clean%20Out%20Of%20Stock%20%28Trikartcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466394/Clean%20Out%20Of%20Stock%20%28Trikartcom%29.meta.js
// ==/UserScript==

(function() {
    var b = document.querySelector("svg[viewBox='0 0 964 1024']").parentElement;
    b.click();
})();

document.addEventListener('DOMNodeInserted', cleanUp, false);
function cleanUp() {
    var p = document.querySelectorAll('p'), i;

    for (i = 0; i < p.length; ++i) {
        if (p[i].textContent.includes('Out Of Stock')){
            p[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        }
    }
}