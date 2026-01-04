// ==UserScript==
// @name         Hide WhatsApp Archive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  It hides the Archive button in WhatsApp
// @author       You
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456769/Hide%20WhatsApp%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/456769/Hide%20WhatsApp%20Archive.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        const archivedButton = document.querySelectorAll(`[aria-label="Archived "]`)
        if (archivedButton.length > 0) {
            archivedButton[0].remove()
            console.log(`The "Archived Chats" button was found and removed.`)
            mutationInstance.disconnect()
        }
    });

    observer.observe(document, {
        childList: true,
        subtree:   true
    });

})();