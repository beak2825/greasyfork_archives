// ==UserScript==
// @name         Geoguessr Singleplayer Interface Cleaner
// @namespace    https://greasyfork.org/en/users/1501889
// @version      2.1
// @description  disables reactions, removes live player count
// @author       Clemens
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544742/Geoguessr%20Singleplayer%20Interface%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/544742/Geoguessr%20Singleplayer%20Interface%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function nukeEmoteSystem() {
        Object.defineProperty(unsafeWindow, 'initializeReactions', {
            value: function() { console.log('Reactions disabled') },
            writable: false
        });

        if (unsafeWindow.__GAME_INSTANCE__?.reactions) {
            unsafeWindow.__GAME_INSTANCE__.reactions = {
                show: function() {},
                hide: function() {},
                handleKeyDown: function() { return false; }
            };
        }
    }

    function removeReactionButton() {
        const btn = document.querySelector('button[aria-label="Reaction wheel"], button img[alt="Reaction wheel"]');
        if (btn?.parentElement) btn.parentElement.remove();
    }

    function removePlayerCount() {
        const counter = document.querySelector('.live-players-count_container__RFvCF');
        if (counter) counter.remove();
    }

    function blockEmoteKeys() {
        document.addEventListener('keydown', function(e) {
            if ((e.key >= '1' && e.key <= '6') &&
                document.querySelector('.game-container') &&
                !e.target.isContentEditable &&
                !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    }

    function cleanStrayEmotes() {
        document.querySelectorAll('[class*="reaction"], [class*="emoji"]').forEach(el => {
            if (/reaction|emoji/i.test(el.className)) el.remove();
        });
    }


    function init() {
        nukeEmoteSystem();
        blockEmoteKeys();

        const cleanAll = () => {
            removeReactionButton();
            removePlayerCount();
            cleanStrayEmotes();
        };

        cleanAll();
        setInterval(cleanAll, 2000);
        new MutationObserver(cleanAll).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();