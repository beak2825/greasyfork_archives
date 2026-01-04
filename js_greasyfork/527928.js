// ==UserScript==
// @name         backToBluev4c
// @namespace    http://v4c.fun/
// @version      0.4
// @description  makes mods bluenames again
// @author       udnidgnik
// @match        https://cytu.be/r/v4c
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527928/backToBluev4c.user.js
// @updateURL https://update.greasyfork.org/scripts/527928/backToBluev4c.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeColor() {
        document.querySelectorAll('.userlist_op .username, .userlist_op').forEach(el => {
            el.style.setProperty("color", "#1c96ff", "important");
            el.style.setProperty("font-style", "normal", "important");
            el.style.setProperty("font-weight", "bold", "important");
        });
    }

    // Run once on load
    changeColor();

    // Handle dynamically loaded elements
    const observer = new MutationObserver(changeColor);
    observer.observe(document.body, { childList: true, subtree: true });

})();