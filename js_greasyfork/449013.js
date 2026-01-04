// ==UserScript==
// @name         Twitter Word Ultrablock
// @name:et      Twitter Sõnade Ultrablokk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the "View" button on tweets that contain muted words.
// @description:et Ei lase sul vaadata blokeeritud sõnadega säutse.
// @author       Zomg
// @match        https://*.twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449013/Twitter%20Word%20Ultrablock.user.js
// @updateURL https://update.greasyfork.org/scripts/449013/Twitter%20Word%20Ultrablock.meta.js
// ==/UserScript==

function check() {
    //console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiii");
    let buttons = document.getElementsByTagName("span");
    //console.log(buttons);
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        if (button.textContent === "View") {
            //console.log("FOUND ONE!");
            var counter = 2
            while (counter > 0) {
                button = button.parentElement;
                counter--;
            }
            button.style.display = "none";
        }
    }
}

const observer = new MutationObserver(check)
observer.observe(document, { childList: true, subtree: true })