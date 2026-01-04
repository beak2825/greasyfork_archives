// ==UserScript==
// @name         Auto-collapse AutoModerator comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically collapses AutoModerator comments on Reddit
// @author       Jade Powell
// @match        *://*.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483371/Auto-collapse%20AutoModerator%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/483371/Auto-collapse%20AutoModerator%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to collapse AutoModerator comments
    const collapseAutoModerator = () => {
        const commentsByAutoModerator = document.querySelectorAll('div.comment > div.entry > p.tagline > a.author[href="/user/AutoModerator"]');
        commentsByAutoModerator.forEach(comment => {
            comment.closest('div.comment').classList.add('collapsed');
        });
    };

    // Run the collapse function on page load and after comments are loaded
    window.addEventListener('load', collapseAutoModerator);
    document.addEventListener('DOMNodeInserted', event => {
        if (event.target.matches('div.comment > div.entry > p.tagline > a.author[href="/user/AutoModerator"]')) {
            collapseAutoModerator();
        }
    });
})();
