// ==UserScript==
// @name         Remove icons LolzTeam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove icons
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532230/Remove%20icons%20LolzTeam.user.js
// @updateURL https://update.greasyfork.org/scripts/532230/Remove%20icons%20LolzTeam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeUniqUsernameIcon() {
        document.querySelectorAll('.uniqUsernameIcon, .uniqUsernameIcon--custom').forEach(el => el.remove());
    }

    removeUniqUsernameIcon();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('uniqUsernameIcon') || node.classList.contains('uniqUsernameIcon--custom'))) {
                node.remove();
            }
        }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(removeUniqUsernameIcon, 100);
})();


