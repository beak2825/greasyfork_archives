// ==UserScript==
// @name Auto ad skipper
// @version 0.2
// @author Nesilar
// @description Automatically skip ad on screen
// @match https://www.youtube.com/*
// @match https://youtube.com/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/597232
// @downloadURL https://update.greasyfork.org/scripts/405549/Auto%20ad%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/405549/Auto%20ad%20skipper.meta.js
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let skipping = false;
let observer = new MutationObserver(e => {
    let ad = document.querySelector('button.ytp-ad-skip-button.ytp-button');
    if (ad && !skipping) {
        ad.click();
    }
});
observer.observe(document.body, {childList: true, subtree: true});