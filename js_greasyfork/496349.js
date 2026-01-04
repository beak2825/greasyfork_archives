// ==UserScript==
// @name         eksisozluk Show Favorite Count
// @namespace    http://tampermonkey.net/
// @version      2023-12-19
// @description  Shows eksisozluk favorite counts
// @author       You
// @match        https://eksisozluk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496349/eksisozluk%20Show%20Favorite%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/496349/eksisozluk%20Show%20Favorite%20Count.meta.js
// ==/UserScript==
const $$ = x => Array.from(document.querySelectorAll(x));

$$("li[data-id]").map(x => {
    x.querySelector(".feedback-container").outerHTML += `
        <span>
            <svg class="eksico"><use xlink:href="#eksico-drop"></use></svg> ${x.getAttribute("data-favorite-count")}
        </span>`;
});