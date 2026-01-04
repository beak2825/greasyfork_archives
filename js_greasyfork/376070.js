// ==UserScript==
// @name         YouTube M4A Handler
// @version      1.0
// @description  Uses a protocol to make youtube-dl download M4A's.
// @include      http*://*.youtube.com/watch*
// @include      http*://youtube.com/watch*
// @run-at       document-end
// @namespace https://greasyfork.org/users/235874
// @downloadURL https://update.greasyfork.org/scripts/376070/YouTube%20M4A%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/376070/YouTube%20M4A%20Handler.meta.js
// ==/UserScript==

/* Attempt to add to DOM every 100ms */
let id = -1;
id = setInterval(function(){
    let div = document.querySelector("div[id='subscribe-button'].ytd-video-secondary-info-renderer");

    if (div) {
        /* Create button */
        let txt = document.createTextNode("Download M4A");
        let btn = document.createElement("button");

        btn.id = "ytm4a-button";
        btn.appendChild(txt);

        btn.style.color = "rgb(255,255,255)";
        btn.style.backgroundColor = "rgb(45,45,45)";
        btn.style.padding = "3px 0px";
        btn.style.margin = "5px 4px 0px 4px";
        btn.style.border = "0";
        btn.style.borderRadius = "2px";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = "Roboto, Arial";

        /* Trigger protocol handler */
        btn.onclick = function () {
            window.location.href = "ytdl:-x --audio-format m4a --audio-quality 0 --no-color " + window.location.href;
        };

        /* Append to DOM */
        div.appendChild(btn);
        clearInterval(id);
    }
}, 100);
