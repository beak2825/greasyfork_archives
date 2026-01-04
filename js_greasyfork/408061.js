// ==UserScript==
// @name        Reddit - remove awards
// @description Removes awards from posts
// @version     0.1
// @namespace   minirock
// @include     https://*.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/408061/Reddit%20-%20remove%20awards.user.js
// @updateURL https://update.greasyfork.org/scripts/408061/Reddit%20-%20remove%20awards.meta.js
// ==/UserScript==


function filter() {
    var awards = document.querySelectorAll("span[id*='PostAwardBadges']")

    for (let i = 0; i < awards.length; ++i) {
        awards[i].closest("div").remove()
    }

    //////////////////////////////////

    var give_award = Array.from(document.querySelectorAll('span')).filter(el => el.textContent === 'Give Award');

    for (let i = 0; i < give_award.length; ++i) {
        give_award[i].closest("button").remove()
    }

    ////////////////////////////////////

    var share = document.querySelectorAll("button[data-click-id='share']")

    for (let i = 0; i < share.length; ++i) {
        share[i].closest("div").remove()
    }
}

var mutationObserver = new MutationObserver(function(mutations) {
    filter();
});

mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

filter();



// document.addEventListener("keydown", catch_code, false);

// function catch_code(evt) {
//     if (evt.keyCode === 192) {
//         filter();
//     }
// }