// ==UserScript==
// @name         StackOverflow: Highlight Your Text
// @namespace    DanKaplanSES
// @version      0.2
// @description  This userscript highlights the questions, answers, and comments you've made on StackOverflow and StackExchange to distinguish you from other users.
// @author       DanKaplanSES
// @match        https://*.stackoverflow.com/questions/*
// @match        https://*.superuser.com/questions/*
// @match        https://*.stackexchange.com/questions/*
// @match        https://*.serverfault.com/questions/*
// @match        https://*.askubuntu.com/questions/*
// @match        https://*.stackapps.com/questions/*
// @match        https://*.mathoverflow.net/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license      MIT
// @supportURL   https://github.com/DanKaplanSES
// @downloadURL https://update.greasyfork.org/scripts/480973/StackOverflow%3A%20Highlight%20Your%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/480973/StackOverflow%3A%20Highlight%20Your%20Text.meta.js
// ==/UserScript==

// Not used, but helpful information for https://webaim.org/resources/contrastchecker/
const darkBackgroundColor = `#252627`;
const lightBackgroundColor = `#FFFFFF`;

jQuery.noConflict(true)(function($) {
    setTimeout(() => {
        const isDarkTheme = $(`.theme-dark`).length > 0;
        const highlightColor = isDarkTheme ? `#FFA953` : `#A8681A`; // Change this line for custom colors

        const userCardSelector = `a.s-user-card`;
        const userHref = $(userCardSelector)?.attr("href");
        if (userHref === undefined || userHref === null) {
            console.info(`The "Color Code Your Text" userscript could not find an href attribute with this CSS selector: '${userCardSelector}'. Exiting early.`);
            console.info(`Possible cause: you are not logged in.`);
            return;
        }
        const linkSelector = `*[href="${userHref}"]`;

        $(`#content`).find(linkSelector).each(function () {
            $(this).parents(`.postcell, .answercell`).find($(`.s-prose`)).each(function () {
                $(this).css({ "color": highlightColor });
                $(this).find(`blockquote`).css({ "color": highlightColor });
                $(this).find(`code`).css({ "color": highlightColor });
            });

            $(this).parents(`.comment-body`).find(`.comment-copy`).each(function () {
                $(this).css({ "color": highlightColor });
                $(this).find(`blockquote`).css({ "color": highlightColor });
                $(this).find(`code`).css({ "color": highlightColor });
            });
        });

    }, 500);
});
