// ==UserScript==
// @name            Qwant Endless Scrolling
// @namespace       ferkv
// @description     Infinite scroll for Qwant.
// @version         1.0
// @license         GNU GPLv3
//
// @match           https://www.qwant.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/447626/Qwant%20Endless%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/447626/Qwant%20Endless%20Scrolling.meta.js
// ==/UserScript==


// Upon scrolling to the bottom of the page, press the show more button
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.querySelector("button[data-testid='buttonShowMore']").click();
    }
};
