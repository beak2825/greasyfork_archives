// ==UserScript==
// @name         Opera GX Music
// @description  Plays Opera GX music forever when opening a page, with a link and ability to stop the music by pressing Alt+5. After stopping the music you can't play it again, but the music gives you some Opera GX vibes.
// @version      1
// @license      MIT
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/950187
// @downloadURL https://update.greasyfork.org/scripts/460124/Opera%20GX%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/460124/Opera%20GX%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the audio file URL and link text
    var audioUrl = "https://res.cloudinary.com/dqzmyiphj/video/upload/v1676545572/operagxmusic_m5p90k.mp3";
    var linkText = "Stop the music (Alt+5)";

    // Create the audio element
    var audio = new Audio(audioUrl);
    audio.loop = true;

    // Add event listener to play the audio when the user interacts with the document
    document.addEventListener("click", function(event) {
        audio.play();
    }, { once: true });

    // Create the link element
    var link = document.createElement("a");
    link.href = "#";
    link.style.position = "fixed";
    link.style.bottom = "0";
    link.style.right = "0";
    link.style.background = "white";
    link.style.color = "black";
    link.style.padding = "10px";
    link.style.border = "1px solid black";
    link.textContent = linkText;
    document.body.appendChild(link);

    // Add event listener to the link to stop the music
    link.addEventListener("click", function(event) {
        event.preventDefault();
        audio.pause();
    });

    // Add event listener to the document to stop the music when Alt+5 is pressed
    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "5") {
            audio.pause();
        }
    });
})();