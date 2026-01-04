// ==UserScript==
// @name         Hoopr Direct MP3 Downloader (Mini-Player Title Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @license      shivafx55
// @description  Floating MP3 download button for Hoopr with correct title from mini-player
// @match        *://*.hoopr.ai/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/545681/Hoopr%20Direct%20MP3%20Downloader%20%28Mini-Player%20Title%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545681/Hoopr%20Direct%20MP3%20Downloader%20%28Mini-Player%20Title%20Fixed%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let button;

    function getMiniPlayerTitle() {
        let titleElem = document.querySelector('#nameOfSong');
        if (titleElem) {
            let text = titleElem.innerText.trim();
            return text.replace(/[<>:\"/\\|?*]+/g, '') || "Hoopr_Track";
        }
        return "Hoopr_Track";
    }

    function createDownloadButton() {
        if (button) return;

        button = document.createElement("button");
        button.innerText = "⬇ Direct MP3";
        Object.assign(button.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#ff3366",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            zIndex: 999999,
            fontSize: "14px"
        });

        button.onclick = async () => {
            let audio = document.querySelector("audio");
            if (!audio) {
                alert("No audio playing!");
                return;
            }
            let src = audio.src || audio.currentSrc;
            if (!src) {
                alert("No audio source found!");
                return;
            }

            let trackName = getMiniPlayerTitle();

            if (src.startsWith("blob:")) {
                try {
                    let response = await fetch(src);
                    let blob = await response.blob();
                    let url = URL.createObjectURL(blob);
                    GM_download(url, trackName + ".mp3");
                } catch (err) {
                    alert("Failed to fetch blob audio: " + err);
                }
            } else {
                GM_download(src, trackName + ".mp3");
            }
        };

        document.body.appendChild(button);
    }

    // Watch for audio elements being added
    const observer = new MutationObserver(() => {
        if (document.querySelector("audio")) {
            createDownloadButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
