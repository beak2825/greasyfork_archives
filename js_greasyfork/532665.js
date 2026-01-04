// ==UserScript==
// @name         osu! ranking pfp remover
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Removes pfps in ranking page
// @author       nekiak
// @match        https://osu.ppy.sh/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532665/osu%21%20ranking%20pfp%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/532665/osu%21%20ranking%20pfp%20remover.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removeAvatars() {
        const avatars = document.querySelectorAll('span.avatar.avatar--dynamic-size');
        avatars.forEach(el => {
            el.remove();
        });
    }

    removeAvatars();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                removeAvatars();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // in case it misses some
    setInterval(removeAvatars, 1500);
})();
