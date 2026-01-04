// ==UserScript==
// @name         Books download
// @namespace    http://tampermonkey.net/
// @version      2024-05-28
// @description  Added download button for audio book
// @author       Dead4W
// @match        https://knigavuhe.info/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496480/Books%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/496480/Books%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadButton = document.createElement("a");
    downloadButton.innerText = "Download mp3"
    downloadButton.style = "color: black;cursor: pointer; margin: 3px; display: block";

    function init() {
        const videoElem = document.querySelector("#player video");

        if (!videoElem) {
            setTimeout(init, 100);
            return;
        }

        downloadButton.onclick = () => {downloadUrl(videoElem.src)};
        document.querySelector("#oframeplayer").appendChild(downloadButton);
    }

    function downloadUrl(url) {
        const options = {
            headers: {
                Referer: location.origin,
            }
        };

        downloadButton.style = "color: black;cursor: progress; margin: 3px; display: block";

        fetch(url, options)
            .then( res => res.blob() )
            .then( blob => {
                var file = window.URL.createObjectURL(blob);
                window.open(file, '_blank');
                downloadButton.style = "color: black;cursor: pointer; margin: 3px; display: block";
            });
    }

    $(document).ready(function() {
        init();
    });
})();