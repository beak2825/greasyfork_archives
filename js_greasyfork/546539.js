// ==UserScript==
// @name         wplace Brown Audio
// @namespace    https://wplace.live/
// @version      1.0
// @description  Play "brown" sound on Brown button
// @author       ApertureUA
// @match        *://wplace.live/*
// @license      WTFPLv2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546539/wplace%20Brown%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/546539/wplace%20Brown%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // configurable audio source
    const AUDIO_SRC = "https://soundbuttonsworld.com/uploads/a3551eb5-0f9e-49e3-9718-0980b181b9db.mp3";

    // create hidden audio element
    const audio = document.createElement("audio");
    audio.src = AUDIO_SRC;
    audio.style.display = "none";
    document.body.appendChild(audio);

    // helper to attach event
    function attachEvents(el) {
        el.addEventListener("click", () => {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play blocked:", e));
        });
    }

    // find existing "Brown" elements
    document.querySelectorAll('[aria-label="Brown"]').forEach(attachEvents);

    // watch for future elements (in case site updates dynamically)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) { // element
                    if (node.getAttribute("aria-label") === "Brown") {
                        attachEvents(node);
                    }
                    node.querySelectorAll?.('[aria-label="Brown"]').forEach(attachEvents);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
