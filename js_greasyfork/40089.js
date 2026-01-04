// ==UserScript==
// @name         YT Embed Control Message Receiver
// @namespace    salembeats
// @version      1.2
// @description  Control Embedded YT iFrames with postMessage
// @author       Cuyler Stuwe (salembeats)
// @include      https://www.youtube.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40089/YT%20Embed%20Control%20Message%20Receiver.user.js
// @updateURL https://update.greasyfork.org/scripts/40089/YT%20Embed%20Control%20Message%20Receiver.meta.js
// ==/UserScript==

function showOverlay() {
    let overlayDiv = document.createElement("DIV");
    overlayDiv.style.position = "fixed";
    overlayDiv.style.left = "50%";
    overlayDiv.style.transform = "translateX(-50%)";
    overlayDiv.style.top = "0px";
    overlayDiv.style.zIndex = Number.MAX_SAFE_INTEGER;
    overlayDiv.style.backgroundColor = "black";
    overlayDiv.style.color = "white";
    overlayDiv.style.pointerEvents = "none";
    overlayDiv.innerText = "Cuyler's YT Embed Control Message Receiver";
    document.body.insertAdjacentElement('afterend', overlayDiv);
}

function playAtDoubleSpeed() {
    let settingsButton = document.querySelector(".ytp-settings-button");
    settingsButton.click();

    document.querySelectorAll(".ytp-menuitem-content").forEach( function(el) {
        if( el.textContent.includes("Normal") ) {
            el.click();
            return;
        }
    });

    document.querySelectorAll(".ytp-menuitem-label").forEach( function(el) {
        if( el.textContent.includes("2") ) {
            el.click();
            return;
        }
    });
}

(function main() {
    showOverlay();
    playAtDoubleSpeed();

    e = window;
    while (e.frameElement !== null) {e = e.parent;}
    e.parent.focus();
})();