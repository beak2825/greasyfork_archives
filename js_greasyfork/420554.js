// ==UserScript==
// @name         Duolingo Swag
// @namespace    https://github.com/Ksouffle
// @version      0.1
// @description  Wanna be swag while chatting it up on Duolingo? Then this scripts is for YOU!
// @author       Ksouffle
// @match        https://forum.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420554/Duolingo%20Swag.user.js
// @updateURL https://update.greasyfork.org/scripts/420554/Duolingo%20Swag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let makeItRain = document.querySelectorAll("._2xNPC");
    let hollarAndSus = document.querySelectorAll(".tCqcy");
    let otherReportButton = document.querySelectorAll("._2-CuU");
    let postAndCancel = document.querySelectorAll(".QHkFc");

    setInterval(function(){
        makeItRain.forEach((item) => {
            item.textContent = "MAKE IT RAIN";
        });
        hollarAndSus.forEach((item) => {
            if (item.textContent === "Reply") {
                item.textContent = "Hollar";
            } else if (item.textContent === "Report") {
                item.textContent = "Sus";
            }
        });
        otherReportButton.forEach((item) => {
            if (item.textContent === "Report") {
                item.textContent = "Sus";
            }
        });
        postAndCancel.forEach((item) => {
            if (item.textContent === "Post") {
                item.textContent = "Full Send";
            } else if (item.textContent === "Cancel") {
                item.textContent = "Take The L";
            }
        });
    }, 1000);
})();