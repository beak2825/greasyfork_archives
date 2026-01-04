// ==UserScript==
// @name         Video&Audio buttons allower
// @description  Allow all buttons in video and audio
// @match        *://*/*
// @version 1.1
// @namespace Video buttons allower
// @downloadURL https://update.greasyfork.org/scripts/529110/VideoAudio%20buttons%20allower.user.js
// @updateURL https://update.greasyfork.org/scripts/529110/VideoAudio%20buttons%20allower.meta.js
// ==/UserScript==

function cleanControlsList() {
    document.querySelectorAll("video, audio").forEach(media => {
        if (media.controlsList) {
            media.controlsList.value = media.controlsList.value
                .split(" ")
                .filter(attr => !attr.startsWith("no"))
                .join(" ");
        }
    });
}

setInterval(cleanControlsList, 1000);