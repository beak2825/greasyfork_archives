// ==UserScript==
// @name         Fantia image slideshow keyboard shortcuts
// @namespace    http://rjhsiao.me/gmscripts
// @version      1.0.0
// @description  Extending the keyboard shortcuts for the Fantia image slideshow interface
// @author       RJ Hsiao
// @supportURL   https://github.com/RJHsiao/fantia-image-slideshow-keyboard-shortcuts
// @license      gpl
// @match        https://fantia.jp/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantia.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518131/Fantia%20image%20slideshow%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/518131/Fantia%20image%20slideshow%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Workaround: do not scroll up to page top when esc-key pressed on image slideshow showing
    document.addEventListener('keydown', ev => {
        if (document.getElementById('image-slideshow') && ev.key === 'Escape') {
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }
    });

    document.addEventListener('keyup', ev => {
        if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
            return;
        }
        let imgSS = document.getElementById('image-slideshow');
        if (!imgSS) {
            return;
        }
        switch (ev.key) {
            case 'ArrowLeft':
                imgSS.querySelector('a.move-button.prev.clickable')?.click()
                return;
            case 'ArrowRight':
                imgSS.querySelector('a.move-button.next.clickable')?.click()
                return;
            case 'Escape':
                imgSS.querySelector('a.btn.btn-dark.btn-sm > i.fa-close')?.click()
                return;
        }
    });
    console.log("Fantia image slideshow key binging loaded.");
})();