// ==UserScript==
// @name         Sankaku Complex: Unblock video context menu
// @namespace    https://github.com/nikolay-borzov
// @author       nikolay-borzov
// @license      MIT
// @version      2025-02-27
// @description  Unblocks context menu on video element
// @author       You
// @match        https://www.sankakucomplex.com/posts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528508/Sankaku%20Complex%3A%20Unblock%20video%20context%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528508/Sankaku%20Complex%3A%20Unblock%20video%20context%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.addEventListener("contextmenu", (event) => {
        if(event.target.tagName === "VIDEO") {
            // Prevent other handlers to fire
            event.stopPropagation();
        }


    }, { capture: true })
})();