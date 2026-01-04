// ==UserScript==
// @name         Twitch Element Relocator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  FIX
// @author       brvsk
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520446/Twitch%20Element%20Relocator.user.js
// @updateURL https://update.greasyfork.org/scripts/520446/Twitch%20Element%20Relocator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const elementToMove = document.querySelector('.ScTransitionBase-sc-hx4quq-0.dOwqqa.channel-root__upper-watch.channel-root__upper-watch--with-chat.tw-transition');
        const targetContainer = document.querySelector('.channel-info-content');

        if (elementToMove && targetContainer) {
            targetContainer.insertBefore(elementToMove, targetContainer.firstChild);
            elementToMove.style.width = "100%";
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
