// ==UserScript==
// @name         Sidelock
// @namespace    https://github.com/anonfoxer
// @version      0.1
// @description  Allows for downloading of any audio from psstaudio, even on audios that don't allow downloads. Grey area, yeah, I know.
// @author       anonfoxer
// @match        https://psstaudio.com/*
// @icon         https://www.google.com/s2/favicons?domain=psstaudio.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431616/Sidelock.user.js
// @updateURL https://update.greasyfork.org/scripts/431616/Sidelock.meta.js
// ==/UserScript==

var dlButton       = document.createElement ('div');
dlButton.innerHTML = '<button id="downloadButton" type="button">'
                + 'Download Audio</button>'
                ;
dlButton.setAttribute ('id', 'myDownload');
document.body.appendChild(dlButton);


document.getElementById ("downloadButton").addEventListener (
    "click", nabAudio, false
);

function nabAudio (zEvent) {
    var thisAudio = document.getElementsByTagName('source')[0].getAttribute("src");
    window.location=thisAudio;
}