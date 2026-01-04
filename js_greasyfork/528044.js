// ==UserScript==
// @name         New Mindtickle video speed
// @namespace    http://tampermonkey.net/
// @version      2025-02-01
// @description  add more speed options to new Mindtickle videos
// @author       me
// @license MIT
// @match        https://*.mindtickle.com/new/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mindtickle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528044/New%20Mindtickle%20video%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/528044/New%20Mindtickle%20video%20speed.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const speeds = [1, 1.8, 3, 4, 5, 6, 7, 8];

    const mo = new MutationObserver((mutationsList, observer) => {
        const videos = document.getElementsByTagName("video");
        if (videos.length === 0) return;
        for (let v of videos) {
            if (v.classList.contains('customized')) {
                continue;
            }
            if (v.classList.contains('jw-video')) {
                console.log("customizing");
                const selected_speedDiv = v.parentElement.parentElement.querySelector(".jw-settings-submenu-playbackRates .jw-settings-item-active");
                if (selected_speedDiv) {
                    const speedDiv = selected_speedDiv.parentElement;
                    const template = speedDiv.children[0].cloneNode();
                    v.classList.add("customized");
                    const current_speed = selected_speedDiv.innerText;
                    speedDiv.innerHTML = "";
                    for (let s of speeds) {
                        console.log("======= Adding speed " + s);
                        const div = template.cloneNode();
                        div.innerText = s + "x";
                        div.ariaLabel = s + "x";
                        div.onclick = () => {
                            console.log("setting the speed to "+ s )
                            v.playbackRate = s;
                        };
                        speedDiv.appendChild(div);
                    };
                }
            }
        };
    });
    mo.observe(document.body, { childList: true, subtree: true });
})();