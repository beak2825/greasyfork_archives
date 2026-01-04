// ==UserScript==
// @name           hornex third eye range script
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    display m+eyes range
// @author         AstRatJP
// @match          https://hornex.pro/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/475897/hornex%20third%20eye%20range%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/475897/hornex%20third%20eye%20range%20script.meta.js
// ==/UserScript==

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let range = 0;

function vh(vh) {
    return (vh * canvas.height) / 200;
}

function drawRange() {
    const petals = Array.from(document.querySelectorAll(".petals:not(.small) .petal.empty .petal"))

    const currentBuild = [];
    for (let i = 0; i < petals.length; i++) {
        if (petals[i].classList.item(2) === "no-icon" || petals[i].classList.item(3) === "no-icon") {
            petalPosition = petals[i].querySelector(".petal-icon").style.backgroundPosition;
        } else {
            petalPosition = petals[i].style.backgroundPosition;
        }
        if (petals[i].classList.item(1) === "spin") {
            tier = petals[i].classList.item(2);
        } else {
            tier = petals[i].classList.item(1);
        }
        currentBuild.push(petalPosition, tier);
    }





    const eyeIndex = currentBuild.indexOf("-600% 0%");
    const anteIndex = currentBuild.indexOf("-700% 0%");
    const eyeAndAnte = (eyeIndex !== -1 ? currentBuild[eyeIndex + 1] : "none") + (anteIndex !== -1 ? currentBuild[anteIndex + 1] : "none");
    switch (eyeAndAnte) {

        case ("tier-7tier-7"):
            range = vh(34);
            break;
        case ("tier-7tier-6"):
            range = vh(45.5);
            break;
        case ("tier-7tier-5"):
            range = vh(65.5);
            break;
        case ("tier-7none"):
            range = vh(130);
            break;

        case ("tier-6tier-7"):
            range = vh(24.7);
            break;
        case ("tier-5tier-7"):
            range = vh(15.8);
            break;


        case ("tier-6tier-6"):
            range = vh(34);
            break;
        case ("tier-5tier-6"):
            range = vh(22.5);
            break;

        case ("tier-6tier-5"):
            range = vh(48.2);
            break;
        case ("tier-6none"):
            range = vh(96);
            break;

        case ("tier-5tier-5"):
            range = vh(32);
            break;
        case ("tier-5none"):
            range = vh(64);
            break;

        default:
            range = 0;
    }

    ctx.beginPath();
    ctx.strokeStyle = "#ff6347";
　　ctx.lineWidth = 3;
    ctx.arc(canvas.width / 2, canvas.height / 2, range, 0, 2 * Math.PI);
    ctx.stroke();

    requestAnimationFrame(drawRange);
}

drawRange();