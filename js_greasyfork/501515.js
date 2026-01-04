// ==UserScript==
// @name Twitch Auto Claimer Points
// @version 0.1
// @author Nick67
// @description Automatically claim channel points.
// @match https://www.twitch.tv/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/1337834
// @downloadURL https://update.greasyfork.org/scripts/501515/Twitch%20Auto%20Claimer%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/501515/Twitch%20Auto%20Claimer%20Points.meta.js
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let claiming = false;
if (MutationObserver) console.log('Auto claimer is enabled.');
let observer = new MutationObserver(e => {
    let bonus = document.querySelector('.claimable-bonus__icon');
    if (bonus && !claiming) {
        bonus.click();
        let date = new Date();
        claiming = true;
        setTimeout(() => {
            console.log('Claimed at '+date);
            claiming = false;
        }, Math.random() * 1000 + 2000);
    }
});
observer.observe(document.body, {childList: true, subtree: true});