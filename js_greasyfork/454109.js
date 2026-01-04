// ==UserScript==
// @name         No Stupid Shadow Box
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Gets rid of the stupid shadow box on Youtube video player.
// @author       You
// @match        https://www.youtube.com/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454109/No%20Stupid%20Shadow%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/454109/No%20Stupid%20Shadow%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('uwu?');
    const observer = new MutationObserver(mutations => {
        const Cinematics = document.getElementById('cinematics');
        if(Cinematics) {
            observer.disconnect();
            Cinematics.style.display = 'none';
        };
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();