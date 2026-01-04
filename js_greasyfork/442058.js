// ==UserScript==
// @name         Education Perfect Info Card Autoclicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is not a cheat for EducationPerfect, it autoclicks the submit button
// @author       ThuWD
// @match        https://app.educationperfect.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/442058/Education%20Perfect%20Info%20Card%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/442058/Education%20Perfect%20Info%20Card%20Autoclicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.clickToggle = false;

    window.toggleBtn = document.createElement("button");
    window.toggleBtn.textContent = "Autoclick: " + window.clickToggle;

    window.toggleBtn.style.position = "absolute";
    window.toggleBtn.style.top = "10%";
    window.toggleBtn.style.left = "10%";
    window.toggleBtn.style.zIndex = "100";
    window.toggleBtn.style.border = "solid 2px #000";
    window.toggleBtn.style.outling = "none";
    window.toggleBtn.style.borderRadius = "3px";
    window.toggleBtn.style.padding = "5px";
    window.toggleBtn.style.backgroundColor = "#000";
    window.toggleBtn.style.color = "#fff";

    // Thanks for looking at my script! :)


    window.toggleBtn.addEventListener("click", () => {
        window.clickToggle = !window.clickToggle;
        window.toggleBtn.textContent = "Autoclick: " + window.clickToggle;
    })

    document.body.appendChild(window.toggleBtn);

    setInterval(() =>{window.clickToggle && document.querySelector(".information-controls > div:nth-child(1)").childNodes[1].click()}, 100)
})();