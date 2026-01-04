// ==UserScript==
// @name        Habitica Single-Player | Hides Party/Group
// @namespace   Violentmonkey Scripts
// @match       https://habitica.com/*
// @grant       none
// @version     1.0
// @author      Scriptking
// @license     MIT
// @description 05/11/2024, 16:21:14
// @downloadURL https://update.greasyfork.org/scripts/515956/Habitica%20Single-Player%20%7C%20Hides%20PartyGroup.user.js
// @updateURL https://update.greasyfork.org/scripts/515956/Habitica%20Single-Player%20%7C%20Hides%20PartyGroup.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    [class^="no-party"] { display: none !important; }
    ul.navbar-nav.menu-list li:nth-child(4),ul.navbar-nav.menu-list li:nth-child(5) { display: none !important; }
    `
    document.head.appendChild(style);
})();
