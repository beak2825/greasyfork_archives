// ==UserScript==
// @name         YouTube Home Button Override
// @namespace    http://tampermonkey.net/
// @description  Replaces the YouTube home button with a Pinterest link of your choosing
// @author       You
// @license      MIT
// @match        *://www.youtube.com/*
// @run-at       document-end
// @version 0.0.1.20230725074000
// @downloadURL https://update.greasyfork.org/scripts/471679/YouTube%20Home%20Button%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/471679/YouTube%20Home%20Button%20Override.meta.js
// ==/UserScript==

(function() {
    // Replace the YouTube home button with a Pinterest link
    function overrideHomeButton() {
        const pinterestLink = "https://i.pinimg.com/originals/62/28/5a/62285a5f6ce177bb4fb752bb294bc649.gif"; // Replace this with your Pinterest link
        const homeButton = document.querySelector("#logo-icon");

        if (homeButton) {
            const newLink = document.createElement("a");
            newLink.href = pinterestLink;
            newLink.target = "_blank";
            newLink.innerHTML = `<img src="${pinterestLink}" style="width: 100%; height: 100%; opacity: 0;" alt="Pinterest">`; // Set opacity to 0 (fully transparent)

            homeButton.parentNode.replaceChild(newLink, homeButton);
        }
    }

    // Wait for the YouTube page to load and then override the home button
    const observer = new MutationObserver(() => {
        const homeButton = document.querySelector("#logo-icon");
        if (homeButton) {
            overrideHomeButton();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
