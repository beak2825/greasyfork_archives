// ==UserScript==
// @name         Auto Click "Load More Files" Button
// @namespace    http://tampermonkey.net/
// @version      1.0.0.2
// @description  Automatically clicks "Load XX More Files" buttons on page load.
// @author       Alexey Nikitin
// @homepage     https://github.com/M-r-A
// @license      MIT
// @match        https://imgchest.com/p/*
// @match        https://www.imgchest.com/p/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527704/Auto%20Click%20%22Load%20More%20Files%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527704/Auto%20Click%20%22Load%20More%20Files%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickLoadMoreButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (/load \d+ more files/i.test(button.innerText)) {
                console.log('Clicking:', button.innerText);
                button.click();
            }
        });
    }

    // Run immediately and also observe changes in the DOM
    clickLoadMoreButtons();

    const observer = new MutationObserver(() => clickLoadMoreButtons());
    observer.observe(document.body, { childList: true, subtree: true });
})();
