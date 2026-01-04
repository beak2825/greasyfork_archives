// ==UserScript==
// @name         TikTok blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A TikTok blacklist
// @author       You
// @match        https://www.tiktok.com/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448339/TikTok%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/448339/TikTok%20blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blacklist = [
        "sneako",
        "valorant"
    ]

    const playNextTikTok = () => document.getElementsByClassName('tiktok-2xqv0y-ButtonBasicButtonContainer-StyledVideoSwitchV2')[0].click()

    setInterval(() => {
        const videoDesc = document.getElementsByClassName("tiktok-j2a19r-SpanText efbd9f0")[0].innerHTML
        const descElement = document.querySelector(".tiktok-5dmltr-DivContainer")
        const hashtags = [...descElement.querySelectorAll("a > strong")].reduce((tags, element) => tags + element.innerHTML, "")

        for (let word of blacklist) {
            if ((videoDesc + hashtags).includes(word) ) {
                playNextTikTok()
            }
        }
    }, 500)


})();
