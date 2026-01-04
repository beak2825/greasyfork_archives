// ==UserScript==
// @name         SoundgasmDL
// @namespace    https://github.com/anonfoxer
// @version      0.1
// @description  Allows downloads of Soundgasm posts with a single button click. Dubious morality.
// @author       anonfoxer
// @match        https://soundgasm.net/*
// @icon         https://www.google.com/s2/favicons?domain=soundgasm.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431617/SoundgasmDL.user.js
// @updateURL https://update.greasyfork.org/scripts/431617/SoundgasmDL.meta.js
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
    var thisAudio = document.getElementsByTagName('audio')[0].getAttribute("src");
    window.location=thisAudio;
}