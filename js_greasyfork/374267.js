// ==UserScript==
// @name         Download youtube videos as MP3
// @version      0.1
// @description  Adds a button to download the Youtube video you are watching
// @author       Vingyard
// @include      /youtube.com/watch/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/374267/Download%20youtube%20videos%20as%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/374267/Download%20youtube%20videos%20as%20MP3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        const container = document.getElementById("info-text");
        if (container === null)
            return;
        clearInterval(interval);

        const btn = document.createElement("button");
        const API_URI = "https://youtube7.download/mini.php?id=";
        const videoId = (new URL(document.location.href)).searchParams.get("v");
        btn.innerHTML = "Download";
        btn.addEventListener("click", () => {
            window.open(API_URI + videoId);
        });
        container.appendChild(btn);
    }, 100);
})();