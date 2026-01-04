// ==UserScript==
// @name        PostNL add ETA
// @namespace   Violentmonkey Scripts
// @match       https://jouw.postnl.nl/track-and-trace/*
// @grant       none
// @version     1.0
// @author      -
// @description Add estimated time of arrival on Track And Trace page
// @locale en_US
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486373/PostNL%20add%20ETA.user.js
// @updateURL https://update.greasyfork.org/scripts/486373/PostNL%20add%20ETA.meta.js
// ==/UserScript==

const mo = new MutationObserver((_, observer) => {
    let hiddenSpan = document.querySelector('.ptt-route-information__slot .visually-hidden');
    if (hiddenSpan) {
        let eta = hiddenSpan.textContent;

        let span = document.querySelector('.ptt-route-information').lastElementChild;
        span.innerHTML += `<br>${eta}`;
        observer.disconnect();
    }
});

mo.observe(document, {
    childList: true,
    subtree: true
});