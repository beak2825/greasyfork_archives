// ==UserScript==
// @name         Twitter Tab Keeper
// @namespace    http://ejew.in/
// @version      0.2
// @description  no more 'For You'
// @author       EntranceJew
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462812/Twitter%20Tab%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/462812/Twitter%20Tab%20Keeper.meta.js
// ==/UserScript==

window.addEventListener("load", (event) => {
    console.log('orange tree');
    if ( document.querySelector('div.r-16y2uox.r-cpa5s6.r-6b64d0.css-175oi2r:nth-of-type(1) > a[aria-selected="true"]') ){ document.querySelector('div.r-16y2uox.r-cpa5s6.r-6b64d0.css-175oi2r:nth-of-type(2) > a[aria-selected="false"]').click(); }
});