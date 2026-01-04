// ==UserScript==
// @name         Open In Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  A script for opening iframes in fullscreen in canvas
// @author       FBastiaan04
// @match        https://canvas.vu.nl/courses/*/assignments/*/submissions/*
// @match        https://canvas.vu.nl/courses/*/assignments/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/477160/Open%20In%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/477160/Open%20In%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("running now");

    const iframe = document.getElementById("not_right_side").querySelector("iframe")
    const oldStyle = iframe.getAttribute("style");
    const openButton = document.createElement("button");
    openButton.innerText = "Open";
    openButton.addEventListener("click", () => {
        iframe.style.position = "fixed";
        iframe.style.left = "84px";
        iframe.style.top = "0px";
        iframe.style.zIndex = "100";
        iframe.style.width = "calc(100vw - 84px";
        iframe.style.height = "100vh";
        document.body.style.overflow = "hidden";
    });
    iframe.parentElement.insertBefore(openButton, iframe);
    const li = document.createElement("li");
    li.innerHTML = "<button>close</button>";
    li.firstElementChild.addEventListener("click", () => {
        iframe.setAttribute("style", oldStyle);
    });
    document.getElementById("menu").appendChild(li);
})();