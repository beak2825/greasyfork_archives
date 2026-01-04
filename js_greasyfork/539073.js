// ==UserScript==
// @name         Torn - BAD NETHY
// @namespace    duck.wowow
// @version      0.1
// @description  Removes RR from the casino menu and removes the game from the RR page
// @author       Baccy
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @match        https://www.torn.com/casino.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539073/Torn%20-%20BAD%20NETHY.user.js
// @updateURL https://update.greasyfork.org/scripts/539073/Torn%20-%20BAD%20NETHY.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideElement(selector, getParent = false) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                const target = getParent ? el.parentElement : el;
                if (target) {
                    target.style.display = 'none';
                    observer.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (window.location.href.startsWith('https://www.torn.com/casino.php')) {
        hideElement('.r-roulete', true);
    }

    if (window.location.href.startsWith('https://www.torn.com/page.php?sid=russianRoulette')) {
        hideElement('#react-root');
    }
})();
