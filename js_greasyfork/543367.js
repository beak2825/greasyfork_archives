// ==UserScript==
// @name         cane is happy
// @description  replaces the SOY emote with widepeepoHappy for cane's messages only
// @version      0.10100110100111101011001
// @match        https://www.destiny.gg/*
// @grant        none
// @namespace https://greasyfork.org/users/1494673
// @downloadURL https://update.greasyfork.org/scripts/543367/cane%20is%20happy.user.js
// @updateURL https://update.greasyfork.org/scripts/543367/cane%20is%20happy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetEmote = 'SOY';
    const replacementEmote = 'widepeepoHappy';

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                if (node.matches(`div.msg-chat[data-username="cane"]`)) {
                    const emotes = node.querySelectorAll(`.emote.${targetEmote}`);
                    emotes.forEach(emote => {
                        emote.classList.remove(targetEmote);
                        emote.classList.add(replacementEmote);
                        emote.textContent = replacementEmote;
                        emote.setAttribute('title', replacementEmote);
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();