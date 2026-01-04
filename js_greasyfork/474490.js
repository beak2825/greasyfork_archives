// ==UserScript==
// @name         Unshort YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Watch a YouTube Shorts video in the normal YouTube player
// @author       dietrich.wambach@protonmail.ch
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474490/Unshort%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/474490/Unshort%20YouTube.meta.js
// ==/UserScript==
'use strict';

var containerObserver = new MutationObserver(function() {
    var container_contents = document.querySelector("#center");
    if (container_contents !== null) {
        var unshort_button = document.querySelector("#unshort-button");
        if (unshort_button === null) {
            var new_button = document.createElement("button");
            new_button.setAttribute("id", "unshort-button");
            new_button.setAttribute("style", "color: var(--yt-spec-text-primary); background-color: var(--yt-spec-white-3); border-radius: 18em; padding-top: 10px; padding-bottom: 10px; padding-left: 12px; padding-right: 12px; margin: 5px; border-width: 0px; cursor: pointer; ");
            new_button.setAttribute("aria-label", "Unshort the video");
            new_button.setAttribute("title", "Unshort the video");
            new_button.setAttribute("onclick", "(function() {var new_url = document.URL.replace('/shorts/', '/watch?v='); window.location.href = new_url;})();");
            new_button.innerText = "Unshort";
            container_contents.appendChild(new_button);
        }
    }
});
containerObserver.observe(document, { subtree: true, childList: true });