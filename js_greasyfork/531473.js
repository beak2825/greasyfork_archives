// ==UserScript==
// @name         Remove Chat kirka.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove chat
// @author       Vicky_arut
// @match        https://kirka.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531473/Remove%20Chat%20kirkaio.user.js
// @updateURL https://update.greasyfork.org/scripts/531473/Remove%20Chat%20kirkaio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        const chatElement = document.getElementById('chat');
        if (chatElement) {
            chatElement.remove();
        }
    }

    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });

    removeElements();
})();