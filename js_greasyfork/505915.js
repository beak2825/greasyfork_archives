// ==UserScript==
// @name         BotB: Show full dates when hovering over countdowns
// @namespace    https://battleofthebits.com/barracks/Profile/uart/
// @version      2024-08-30
// @description  Show full dates when hovering over countdowns
// @author       uart @ botb
// @license      CC0
// @match        *://battleofthebits.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=battleofthebits.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/505915/BotB%3A%20Show%20full%20dates%20when%20hovering%20over%20countdowns.user.js
// @updateURL https://update.greasyfork.org/scripts/505915/BotB%3A%20Show%20full%20dates%20when%20hovering%20over%20countdowns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* LOCALE: override locale to use for date formatting. Leave empty for system locale. */
    const LOCALE = "pl-PL";

    function handleCountdownDates(root) {
        const now = new Date();

        const countdowns = root.getElementsByClassName("countdown");
        var countdownHTML, countdownSeconds, countdownDate;

        for (var i = 0; i < countdowns.length; i++) {
            countdownHTML = countdowns[i];
            countdownSeconds = countdownHTML.getAttribute("data-countdown");
            countdownDate = new Date(now.getTime() + (countdownSeconds * 1000));
            if (LOCALE) {
                countdownHTML.setAttribute("title", countdownDate.toLocaleString(LOCALE));
            } else {
                countdownHTML.setAttribute("title", countdownDate.toLocaleString());
            }
        }
    }

    handleCountdownDates(document);

    /* Set up a MutationObserver on ajaxContent in case it gets updated with new countdowns
     * (see e.g. user buttons on homepage). */
    const observer = new MutationObserver(function(mutationList, observer) {
        var done = new Array();
        for (const mutation of mutationList) {
            if (!done.includes(mutation.target)) {
                handleCountdownDates(mutation.target);
                done.push(mutation.target);
            }
        };
    });

    const ajaxContents = document.getElementsByClassName("ajaxContent");

    for (var i = 0; i < ajaxContents.length; i++) {
        observer.observe(ajaxContents[i], { childList: true, subtree: true });
    }
})();