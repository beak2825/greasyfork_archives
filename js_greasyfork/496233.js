// ==UserScript==
// @name         LyD Likebot
// @namespace    dape.wtf
// @license      MIT
// @version      1.2
// @description  hund wer nicht liked
// @author       dape.
// @match        https://lyd-roleplay.de/forum/index.php?thread/512-hitman-agency-chat/*
// @match        https://lyd-roleplay.de/forum/thread/512-hitman-agency-chat/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496236/LyD%20Likebot.user.js
// @updateURL https://update.greasyfork.org/scripts/496236/LyD%20Likebot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElm('nav.contentHeaderNavigation > ul').then((headerNav) => {
        var likeButton = document.createElement("li");

        likeButton.innerHTML = '<a class="button">Alles liken</a>';

        likeButton.addEventListener('click', allesLiken);

        headerNav.appendChild(likeButton);
    });

    async function allesLiken() {
        for(var button of document.getElementsByClassName('reactButton')) {
            if(!button.classList.contains('active')) {
                button.click();
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }

    // https://stackoverflow.com/a/61511955
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

})();