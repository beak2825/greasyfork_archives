// ==UserScript==
// @name Twitch Auto Channel Points Claimer
// @version 0.1
// @author Deedoosh
// @description Automatically claim channel points.
// @match https://www.twitch.tv/*
// @match https://dashboard.twitch.tv/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/368724
// @downloadURL https://update.greasyfork.org/scripts/444359/Twitch%20Auto%20Channel%20Points%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/444359/Twitch%20Auto%20Channel%20Points%20Claimer.meta.js
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let claiming = false;
if (MutationObserver) console.log('Auto claimer is enabled. Created by Deedoosh');
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