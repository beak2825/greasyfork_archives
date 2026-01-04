// ==UserScript==
// @name         Leaf
// @namespace    https://soundgasm.net
// @version      0.1
// @description  allows for downloading of audios from soundgasm
// @author       anonfoxer
// @match        https://soundgasm.net/*
// @icon         https://www.google.com/s2/favicons?domain=soundgasm.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459285/Leaf.user.js
// @updateURL https://update.greasyfork.org/scripts/459285/Leaf.meta.js
// ==/UserScript==

var dl = document.createElement ('div');
dl.innerHTML = '<button id="dlButton" type="button">'
                + 'Download Audio</button>'
                ;
dl.setAttribute ('id', 'myContainer');
document.body.appendChild (dl);

document.getElementById ("dlButton").addEventListener (
    "click", getAudio, false
);

function getAudio (zEvent) {
    var audio = document.getElementsByTagName('audio')[0].getAttribute('src');
    window.open(audio);
}