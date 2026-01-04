// ==UserScript==
// @name         Soundgasm Downloader
// @namespace    https://github.com/RobertSagit/soundgasm-downloader
// @version      1.1
// @description  Add a download link to Soundgasm.net links
// @author       RobertSagit
// @match        http*://soundgasm.net/u/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369640/Soundgasm%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/369640/Soundgasm%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function gendownload() {
        var audioplayer = document.getElementById("jp_audio_0");
        var description = document.getElementsByClassName("jp-description")[0];
        var title = document.getElementsByClassName("jp-title")[0].innerHTML.replace(/[^a-z0-9]/gi, '');

        // Debug code
        //console.log(`Audio source: ${audioplayer.src}`);

        description.innerHTML += `<br /><a href="${audioplayer.src}" download="${title}">Download File</a>`;
    }

    setTimeout(gendownload, 100);
})();
