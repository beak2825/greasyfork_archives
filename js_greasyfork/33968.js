// ==UserScript==
// @name         Steam Gifting Scripts.
// @namespace    https://coding.net/u/sffxzzp
// @version      0.03
// @description  A script that makes gifting to one that already have the game possible.
// @author       sffxzzp
// @match        *://store.steampowered.com/checkout/sendgift/*
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/33968/Steam%20Gifting%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/33968/Steam%20Gifting%20Scripts.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('.friend_block').forEach(node => {
        if (node.classList.contains('disabled')) {
            node.classList.remove('disabled');
            node.querySelector('input').removeAttribute('disabled');
        }
    });
})();