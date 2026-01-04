// ==UserScript==
// @name         Youtube Anti-Adblock Killer
// @namespace    https://anda.ninja/
// @version      1.0.2
// @description  Remove the anti-adblocker popup on Youtube
// @author       Axel Andaroth
// @match        https://www.youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAC1JREFUWEft0EERAAAAAUH6lxbDZxU4s815PffjAAECBAgQIECAAAECBAgQIDAaPwAh6O5R/QAAAABJRU5ErkJggg==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Youtube Anti-Adblock Killer by Axel Andaroth')
    let video = document.querySelector('video') // find the video player in page
    let overlay, closeBtn, noRenderer, playerContainerOuter = null // DOM
    const interval = setInterval(() => { // lazy repeat (^:
        const dialogs = document.querySelectorAll('tp-yt-paper-dialog') || [] // find all dialogs
        if (Array.from(dialogs).length) console.log('dialogs opened:',dialogs)
        // find the anti-adblock one, use the expression you like:
        if (!playerContainerOuter) playerContainerOuter = document.querySelector('div.player-container-outer') // find outer player
        playerContainerOuter.style.visibility = "initial" // force visible player
        if (!noRenderer) noRenderer = document.querySelector('yt-playability-error-supported-renderers') // find player warning
        noRenderer.style.display = "none" // hide player warning
        const antiAdBlockDialog = Array.from(dialogs).find((d) => (
            !!d.innerHTML.toLowerCase().includes("bloqueur de publicité")
            || !!d.innerHTML.toLowerCase().includes("autoriser youtube ads")
            || !!d.innerHTML.toLowerCase().includes("blockers are not allowed")
            || !!d.innerHTML.toLowerCase().includes("blockers violate")
            || !!d.innerHTML.toLowerCase().includes("allow youtube ads")
        )) // endof find
        if (!!antiAdBlockDialog) { // there is an anti-adblock dialog
            antiAdBlockDialog.style.display = "none" // hide the popup
            if (!overlay) overlay = document.querySelector('tp-yt-iron-overlay-backdrop') // get overlay
            else overlay.style.display = "none" // hide overlay
            if (!video) video = document.querySelector('video') // find the video player in page
            video.play() // force play
            if (!closeBtn) closeBtn = antiAdBlockDialog.querySelector('div.yt-spec-touch-feedback-shape__fill') // find close button
            else {
                closeBtn.click() // press the close button to prevent popup come back
                antiAdBlockDialog.remove()
            }
        } // endof adblock dialog
    },1000) // endof interval
})();

/* COMMUNICATION
We don't want to pay a Premium because
we will still see sponsored contents because
YT doesn't compensate their creators sufficiently
THANK YOU */