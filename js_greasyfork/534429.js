// ==UserScript==
// @name         Twitter mobile file browser unlocked
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @author       mesmere
// @description  Open the full file browser instead of just the recent media panel when attaching an image/video.
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.onurlchange
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534429/Twitter%20mobile%20file%20browser%20unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/534429/Twitter%20mobile%20file%20browser%20unlocked.meta.js
// ==/UserScript==

function attempt(remainingElems = 2) {
    if (window.location.href.match(/^https:\/\/(twitter|x)\.com\/compose\/post$/) === null) {
        return;
    }
    const fileInputElems = document.querySelectorAll("input[type=file]");

    for (const fileInputElem of fileInputElems) {
        // Mobile browser file-picker behavior is determined by the HTMLInputElement.accept property.
        fileInputElem.accept = "";
    }

    // There are two separate file inputs on the page and one can load a long time before the other.
    if (fileInputElems.length < remainingElems) {
        window.setTimeout(attempt, 200, remainingElems - fileInputElems.length);
    }
}
attempt();
window.addEventListener("urlchange", attempt);