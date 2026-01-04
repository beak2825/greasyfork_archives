// ==UserScript==
// @name         hide nft user tweets
// @namespace    http://tampermonkey.net/
// @version      0.0001
// @description  hides tweets by nft pfps
// @author       @tigerstyping
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438888/hide%20nft%20user%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/438888/hide%20nft%20user%20tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
    let allNFTPics = [...document.querySelectorAll("*")].filter(element => element.style.clipPath.includes("hex-hw-shapeclip-clipconfig"));
    allNFTPics.forEach((element) => {
        try {
            let parentTweet = element.closest("article");
            if (parentTweet.getAttribute("NFTMuted") !== true) {
                parentTweet.style.display = "none";
                parentTweet.setAttribute("NFTMuted", true);
            }
        } catch(error) {
            if(error.instanceOf(TypeError)) {
                void(0);
            } else {
                throw error;
            }
        }
    });}, 1000);
})();