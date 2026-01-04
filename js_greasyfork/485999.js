// ==UserScript==
// @name         Remove Reddit Unreviewed Content
// @namespace    Reddit
// @version      1.02
// @description  Get rid of unreviewed content popup
// @author       Reddit
// @license      Unlicense
// @match        http*://*.reddit.com/*
// @icon         https://reddit.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485999/Remove%20Reddit%20Unreviewed%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/485999/Remove%20Reddit%20Unreviewed%20Content.meta.js
// ==/UserScript==

(function() {

    // Get rid of unreviewed content popup
    const unreviewedContentPopup = document.querySelector('shreddit-experience-tree.theme-beta')
    unreviewedContentPopup?.remove()

})();