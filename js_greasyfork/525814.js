// ==UserScript==
// @name         Scratch Tactical Nuke Prank
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prank script for Scratch when clicking the green flag
// @author       You
// @match        *://scratch.mit.edu/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525814/Scratch%20Tactical%20Nuke%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/525814/Scratch%20Tactical%20Nuke%20Prank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function playSound() {
        let audio = new Audio("https://www.myinstants.com/media/sounds/tactical-nuke.mp3");
        audio.play();
    }

    function spamImage() {
        let spamInterval = setInterval(() => {
            let img = document.createElement("img");
            img.src = "https://i.ibb.co/Xf4PMVD6/IMG-1365.jpg";
            img.style.position = "fixed";
            img.style.left = Math.random() * window.innerWidth + "px";
            img.style.top = Math.random() * window.innerHeight + "px";
            img.style.width = "150px";
            img.style.height = "150px";
            img.style.zIndex = "9999";
            document.body.appendChild(img);
        }, 100);
        
        setTimeout(() => {
            clearInterval(spamInterval);
            window.close();
            window.open("https://youtu.be/V6KOyFXXGh0?si=pbB58oUpnN4xQQQp", "_blank");
        }, 5000);
    }

    function saveProject() {
        let saveButton = document.querySelector("[data-control='save']");
        if (saveButton) {
            saveButton.click();
        }
    }

    document.addEventListener("click", function(event) {
        if (event.target.closest(".green-flag_green-flag_1kiAo")) {
            saveProject();
            playSound();
            spamImage();
        }
    });

})();
