// ==UserScript==
// @name         Emerald Chat Auto-Focus
// @namespace    https://greasyfork.org/en/users/1159227
// @version      1.0
// @description  Simple auto-focus for the chat bar.
// @author       Ritsu
// @license      MIT
// @match        *://emeraldchat.com/app
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emeraldchat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473885/Emerald%20Chat%20Auto-Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/473885/Emerald%20Chat%20Auto-Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        const container = document.getElementById("container");
        const mutationObserver = new MutationObserver(function() {
            var chatInput = document.getElementById("room-input");
            if (chatInput !== null) {
                document.body.addEventListener("keydown", function() {
                    var UIs1 = document.querySelector("#ui-hatch > *");
                    var UIs2 = document.querySelector("#ui-hatch-2 > *");
                    var interestsField = document.getElementById("interests");
                    if (!UIs1 && !UIs2 && !interestsField) {
                        chatInput.focus();
                    };
                });
            };
        });
        mutationObserver.observe(container, {childList: true, subtree: true, attributes: false});
};
})();