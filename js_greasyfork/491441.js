// ==UserScript==
// @name         Reddit Age Bypass
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Bypass the "open in app prompt" for nsfw posts
// @author       Bababoiiiii
// @license      MIT
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/491441/Reddit%20Age%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/491441/Reddit%20Age%20Bypass.meta.js
// ==/UserScript==

// Use in Combination with this ublock filter (block this url: www.redditstatic.com/shreddit/*xpromo-nsfw-blocking-modal-*.js)
// www.redditstatic.com/shreddit*xpromo-nsfw-blocking-modal-*.js$script,domain=www.reddit.com
// This Ublock filter can be used as a replacement for this script, i dont know if it has any other impact though
// www.reddit.com##div.prompt

function log(text) {
    console.log("[Reddit Age Bypass] " + text);
}

(function() {
    "use strict";

    function wait_and_remove() {
        clearInterval(wait_for_post);
        wait_for_post = setInterval(() => {
            log("Waiting for post");

            const icon = document.querySelector("span.flex.gap-xs.items-center.pr-xs.truncate > span > faceplate-tracker > a > div");
            if (icon !== null) {
                clearInterval(wait_for_post);
                log("Post found");

                // check if the icon is nsfw -> post is nsfw
                if (icon.querySelector("icon-nsfw") !== null) {
                    const blurs = document.querySelectorAll("xpromo-nsfw-blocking-container");
                    log(`Post is NSFW, removing ${blurs.length} blurs`);
                    blurs.forEach(blur_elem => blur_elem.shadowRoot.querySelector("div.prompt").remove());
                    log("Bypass successfull");
                }
            }
        }, 500);
    }

    let wait_for_post;
    wait_and_remove();

    const wait_for_polyfill = setInterval( () => {
      if (window.navigation) {
        clearInterval(wait_for_polyfill);
        window.navigation.addEventListener("navigate", () => wait_and_remove());
      }
    }, 10)

})();