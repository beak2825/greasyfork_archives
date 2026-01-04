// ==UserScript==
// @name         Pixel Joint - Move zoom up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves the zoom button above the art
// @author       erc2nd
// @match        https://pixeljoint.com/pixelart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeljoint.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457542/Pixel%20Joint%20-%20Move%20zoom%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/457542/Pixel%20Joint%20-%20Move%20zoom%20up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const br = document.createElement("br");
    br.classList.add("custom-br");

    const imgHolder = document.querySelector(".img-holder");
    const zoomBig = imgHolder.nextElementSibling;
    const smallimg = document.getElementById("smallimg");
    const zoomSmall = document.querySelector("#smallimg ~ div:first-of-type");

    zoomSmall.insertBefore(br, null);
    zoomBig.insertBefore(imgHolder, null);
    zoomSmall.insertBefore(smallimg, null);

    imgHolder.style.marginTop = "10px";
    smallimg.style.marginTop = "10px";

})();