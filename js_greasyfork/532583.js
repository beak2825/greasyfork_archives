// ==UserScript==
// @name         Remove AI Chat Popup
// @namespace    http://tampermonkey.net/
// @version      2025-04-11
// @description  Automatically removes an AI popup element from the page
// @author       Beginner[2023]
// @match        https://chan.sankakucomplex.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532583/Remove%20AI%20Chat%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/532583/Remove%20AI%20Chat%20Popup.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load', function() {
        let target = document.getElementById('draggableElement');
        if (target) {
            target.remove();
            console.log('[✔] Removed popup with ID draggableElement');
        } else {
            console.log('[ℹ] ไม่เจอ element ที่มี id = draggableElement');
        }
    });

})();