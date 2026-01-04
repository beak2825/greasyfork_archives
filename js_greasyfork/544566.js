// ==UserScript==
// @name         Add to playlist shortcut for youtube music
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Use the P button to add the current song to a playlist
// @author       MagnusRE
// @match        *://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544566/Add%20to%20playlist%20shortcut%20for%20youtube%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/544566/Add%20to%20playlist%20shortcut%20for%20youtube%20music.meta.js
// ==/UserScript==

// waitForElm from https://stackoverflow.com/a/61511955/
function waitForElm(selector) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
                observer.disconnect();
                reject(new Error("Timeout waiting for element: " + selector));
            }, 5000);
    });
}

async function waitForAddToPlaylist(timeout = 2000) {
    const startTime = Date.now();
    let el = null;

    while (Date.now() - startTime < timeout) {
        // Search for elements containing the text "Add to playlist"
        const elements = Array.from(document.querySelectorAll("a yt-formatted-string"))
            .filter(e => e.textContent.trim() === "Save to playlist");

        if (elements.length > 0) {
            el = elements[0];
            break;
        }

        // Wait a short time before checking again
        await new Promise(r => setTimeout(r, 50));
    }

    if (!el) {
        console.warn("Timeout: 'Add to playlist' element not found");
    }

    return el;
}

(function() {
    'use strict';
    window.addEventListener("keydown",function(event) {

        var ae = document.activeElement.tagName;
        if(event.keyCode === 80 && ae != "INPUT") {
            console.log("opening playlist menu...");
            var popupMenu = document.querySelector(".middle-controls #button-shape .yt-spec-touch-feedback-shape");

            // document.querySelectorAll("a yt-formatted-string")

            // unreliable?
            //waitForElm("tp-yt-paper-listbox :nth-child(7) > #navigation-endpoint")
            //    .then((playlistLink) => {
            //    console.log("got ", playlistLink);
            //    playlistLink.click();
            // });

            popupMenu.click();

            let playlistlink_p = waitForAddToPlaylist();

            playlistlink_p.then((playlistLink) => {
                // document.debug = playlistLink;
                playlistLink.click();
            });

        }
    }, false)
})();

// changelog:
// 0.2 move popupMenu.click() after the event listener has been installed.
// 0.3 change waitForElm to waitForAddToPlaylist with an actual loop...