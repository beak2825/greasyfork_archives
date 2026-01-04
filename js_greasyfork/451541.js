// ==UserScript==
// @name         Instagram Video Controls
// @namespace    https://fxzfun.com/
// @version      1.0.3
// @description  Adds video player controls to Instagram videos
// @author       FXZFun
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_addStyle
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/451541/Instagram%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/451541/Instagram%20Video%20Controls.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let isMuted = JSON.parse(localStorage.getItem("ivc-mute")) ?? true;
    let controlsShowing = false;
 
    function runMainPage() {
        setInterval(addControls, 500);
    }
 
    function addControls() {
        document.querySelectorAll("video").forEach(vid => {
                vid.controls = "controls";
                vid.volume = parseFloat(localStorage.getItem("ivc-volume")) || 0.8;
                vid.addEventListener('volumechange', () => localStorage.setItem("ivc-volume", JSON.stringify(vid.muted ? 0 : vid.volume)));
                vid.addEventListener('play', () => setTimeout(() => vid.muted = false, 10));
 
                let vidSibling = vid.nextElementSibling.firstChild;
                vidSibling.style = "transition: 0.5s; pointer-events: none";
                vidSibling.addEventListener('mouseover', () => {
                    vidSibling.classList.add("ivcControls");
                    if (controlsShowing) {
                        vidSibling.classList.remove("ivcControls");
                        controlsShowing = false;
                    }
                });
                vidSibling.addEventListener('mouseout', () => {
                    vidSibling.classList.remove("ivcControls");
                    controlsShowing = false;
                });
                vid.addEventListener('mouseover', () => {
                    vidSibling.classList.add("ivcControls");
                    controlsShowing = true;
                });
                vid.addEventListener('mouseout', () => {
                    vidSibling.classList.remove("ivcControls");
                    controlsShowing = false;
                });
            });
    }
 
    let currentURL = "";
    setInterval(() => {
        if (location.href !== currentURL) {
            if (!document.head.innerHTML.includes("::-webkit-media-controls")) GM_addStyle('::-webkit-media-controls-panel { z-index: 999998; position: relative; } .ivcControls { margin-top: -80px; } button[aria-label="Toggle audio"] { display: none; }');
 
            if (location.host === "www.instagram.com" && location.pathname === "/") runMainPage();
 
            console.log("IVC: new video available");
            addControls();
 
            currentURL = location.href;
        }
    }, 500);
 
    console.log("IVC: loading...");
})();
