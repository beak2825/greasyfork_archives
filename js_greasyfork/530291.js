// ==UserScript==
// @name         Ruutu.fi Volume Scroll
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Säädä Ruutu.fi-videon äänenvoimakkuutta hiiren rullalla 1% portain
// @author       Juspe
// @match        *://www.ruutu.fi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530291/Ruutufi%20Volume%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/530291/Ruutufi%20Volume%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setInitialVolume(video) {
        if (!video.dataset.volumeSet) { // Tarkistetaan, onko oletusvolyymi jo asetettu
            video.volume = 0.06; // Asetetaan volyymi 6%
            video.dataset.volumeSet = "true"; // Merkitään, ettei aseteta uudelleen
        }
    }

    function showVolumeIndicator(video) {
        let indicator = video.parentElement.querySelector(".volume-indicator");
        if (!indicator) {
            indicator = document.createElement("div");
            indicator.className = "volume-indicator";
            Object.assign(indicator.style, {
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "10px 20px",
                fontSize: "20px",
                borderRadius: "10px",
                zIndex: "9999",
                pointerEvents: "none",
                fontFamily: "Arial, sans-serif",
                display: "none"
            });
            video.parentElement.appendChild(indicator);
        }

        indicator.textContent = Math.round(video.volume * 100) + "%";
        indicator.style.display = "block";

        clearTimeout(video.dataset.volumeTimeout);
        video.dataset.volumeTimeout = setTimeout(() => {
            indicator.style.display = "none";
        }, 2000);
    }

    function handleVolumeChange(event) {
        let videos = document.querySelectorAll("video");
        let found = false;

        videos.forEach(video => {
            let rect = video.getBoundingClientRect();
            let x = event.clientX;
            let y = event.clientY;

            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                event.preventDefault(); // Estetään sivun vieritys
                found = true;

                let step = 0.01; // Äänenvoimakkuuden säätöaskel (1%)

                if (event.deltaY < 0) {
                    if (video.muted) {
                        video.muted = false; // Poistetaan mykistys, jos äänenvoimakkuutta yritetään nostaa
                    }
                    video.volume = Math.min(1, video.volume + step);
                } else {
                    video.volume = Math.max(0, video.volume - step);
                }

                showVolumeIndicator(video);
            }
        });

        if (found) event.preventDefault(); // Estetään sivun vieritys vain jos oltiin videon päällä
    }

    function checkForNewVideos() {
        let videos = document.querySelectorAll("video");
        videos.forEach(setInitialVolume);
    }

    // Tarkkaillaan uusia videoita ja asetetaan volyymi vain kerran
    const observer = new MutationObserver(checkForNewVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Asetetaan volyymi sivun latautuessa
    checkForNewVideos();

    // Lisätään tapahtumankäsittelijä äänen säätämiseen
    document.addEventListener("wheel", handleVolumeChange, { passive: false });

})();
