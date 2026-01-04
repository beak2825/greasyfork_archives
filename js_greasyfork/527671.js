// ==UserScript==
// @name         Swordz.io clean up 
// @namespace    intuxs
// @version      1.1
// @description  Hides other boxes on top left
// @author       YourName
// @match        *.swordz.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527671/Swordzio%20clean%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/527671/Swordzio%20clean%20up.meta.js
// ==/UserScript==
setTimeout(() => {
    // Hide the <img> element with id "buttonFullscreenImage" visually
    const imgFullscreen = document.getElementById("buttonFullscreenImage");
    if (imgFullscreen) {
        imgFullscreen.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <div> element with id "buttonFullscreen" visually
    const divFullscreen = document.getElementById("buttonFullscreen");
    if (divFullscreen) {
        divFullscreen.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <img> element with id "buttonMusicImage" visually
    const imgMusic = document.getElementById("buttonMusicImage");
    if (imgMusic) {
        imgMusic.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <div> element with id "buttonMusic" visually
    const divMusic = document.getElementById("buttonMusic");
    if (divMusic) {
        divMusic.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <img> element with id "buttonPauseImage" visually
    const imgPause = document.getElementById("buttonPauseImage");
    if (imgPause) {
        imgPause.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <div> element with id "buttonPause" visually
    const divPause = document.getElementById("buttonPause");
    if (divPause) {
        divPause.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <img> element with id "buttonSoundImage" visually
    const imgSound = document.getElementById("buttonSoundImage");
    if (imgSound) {
        imgSound.style.visibility = 'hidden'; // You can also use opacity: 0
    }

    // Hide the <div> element with id "buttonSound" visually
    const divSound = document.getElementById("buttonSound");
    if (divSound) {
        divSound.style.visibility = 'hidden'; // You can also use opacity: 0
    }

}, 100); // Delay before hiding the elements
