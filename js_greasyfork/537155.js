// ==UserScript==
// @name         Hide annoying floating hentai button
// @license MIT
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Hides the annoying floating red button that shows straight hentai
// @author       Anonymous
// @match        https://play.games.dmm.co.jp/game/cravesagax
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537155/Hide%20annoying%20floating%20hentai%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/537155/Hide%20annoying%20floating%20hentai%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(mutations => {
        let btn = document.querySelector('button[aria-label="menu"]');
        if (btn) {
            btn.style.display = "none";
            observer.disconnect();
        }
    });

    // Observe
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();