// ==UserScript==
// @name         Mindtickle video speed
// @namespace    http://tampermonkey.net/
// @version      2024-05-01
// @description  add more speed options to Mindtickle videos
// @author       TheremineDwarf
// @match        https://*.mindtickle.com/legacy
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mindtickle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517926/Mindtickle%20video%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/517926/Mindtickle%20video%20speed.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.8, 2, 3, 4, 5, 6, 7, 8, 10];

    const mo = new MutationObserver((mutationsList, observer) => {
        const videos = document.getElementsByTagName("video");
        if (videos.length === 0) return;
        for (let v of videos) {
            if (v.classList.contains('customized')) {
                continue;
            }
            if (v.classList.contains('jw-video')) {
                const selected_speedDiv = v.parentElement.parentElement.querySelector("div.jw-speedDiv .current");
                if (selected_speedDiv) {
                    const speedDiv = selected_speedDiv.parentElement;
                    v.classList.add("customized");
                    const current_speed = selected_speedDiv.innerText;
                    speedDiv.innerHTML = "";
                    for (let s of speeds)  {
                        const div = document.createElement("div");
                        div.innerText = s + "x";
                        if (div.innerText === current_speed) {
                            div.classList.add("current");
                        }
                        speedDiv.appendChild(div);
                    };
                }
            }
        };
    });
    mo.observe(document.body, { childList: true, subtree: true });
})();