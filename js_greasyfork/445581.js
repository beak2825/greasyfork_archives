// ==UserScript==
// @name         mark nft user tweets
// @namespace    http://tampermonkey.net/
// @version      0.0001
// @description  makes idiots look du,
// @author       @tigerstyping, H3
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445581/mark%20nft%20user%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/445581/mark%20nft%20user%20tweets.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(() => {
    let allNFTPics = [...document.querySelectorAll("*")].filter(element => element.style.clipPath.includes("hex-hw-shapeclip-clipconfig"));
    allNFTPics.forEach((element) => {
        try {
            let parentTweet = element.closest("article");
            if (parentTweet.getAttribute("NFTMuted") !== true) {
                parentTweet.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAARAgMAAADmnMeHAAAACVBMVEUAALkAAAD///82MMWhAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAACLSURBVAjXZY8xDsMwDAOFjPpJ/J9m0AOKQq8wOmZ3Bk1CAQs2X1mlSKdwoY4LKaK7yuUYGIz6uxmpEju8OJUmTed2RoPWDSZh86H9RSVgBpmQbRDHO0EzejpR2rFrRlEvkMARTkuYyW4dR3firg3cVGwmZMUoHU2zlOGoq3xyU6UF505U+H80j/sjX7yFS0p/+cjPAAAAAElFTkSuQmCC)";
                parentTweet.style.backgroundColor = "#233";
                parentTweet.style.backgroundBlendMode = "multiply";
                parentTweet.setAttribute("NFTMuted", true);
            }
        } catch(error) {
            if(error.instanceOf(TypeError)) {
                void(0);
            } else {
                throw error;
            }
        }
    });}, 2500);
})();