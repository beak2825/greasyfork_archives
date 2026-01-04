// ==UserScript==
// @name         Pornhub BlackList
// @namespace    http://tampermonkey.net/
// @version      2025-8-3
// @description pornhub blacklist
// @author       You
// @match        https://www.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543246/Pornhub%20BlackList.user.js
// @updateURL https://update.greasyfork.org/scripts/543246/Pornhub%20BlackList.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const titleBlackList = [
    "example"
];

    const creatorBlackList = [
    "example"
    ];

    const hideWatched = false;

    const arr = document.querySelectorAll(".thumbnailTitle");

    arr.forEach((div) => {
        let title = div.title.toLowerCase();
        if(title) {
            if (titleBlackList.some(word => title.includes(word.toLowerCase() ))) {
                div.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                return;
            }
        }

        let title2 = div.textContent.toLowerCase();
        if(title2) {
            if (titleBlackList.some(word => title2.includes(word.toLowerCase() ))) {
                div.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                }
        }
    })

    const arr2 = document.querySelectorAll(".usernameWrapper .usernameWrap a");

    arr2.forEach((div2) => {
        let creator = div2.text.toLowerCase();

        if (creator) {
            if(creatorBlackList.some(word => creator.includes(word.toLowerCase()))){
                div2.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
            }
        }
    })

    const arr3 = document.querySelectorAll(".uploaderLink");

    arr3.forEach((div3) => {
        let creator = div3.text.toLowerCase();

        if (creator) {
            if(creatorBlackList.some(word => creator.includes(word.toLowerCase()))){
                div3.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
            }
        }
    })

    if (hideWatched) {
        const arr4 = document.querySelectorAll(".js-watchedVideoOverlay");
        arr4.forEach((div4) => {
            div4.parentNode.parentNode.parentNode.parentNode.remove();
        })

        const arr5 = document.querySelectorAll(".watchedVideo");
        arr5.forEach((div4) => {
            div4.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        })
    }

})();