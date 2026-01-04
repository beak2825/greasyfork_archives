// ==UserScript==
// @name         Turn kemono.party fluid player into video link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes it real easy to download or open the raw video, as it turns the video name into a clickable link.
// @author       PowfuArras // Discord: @xskt
// @match        *://kemono.party/*
// @match        *://kemono.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/471207/Turn%20kemonoparty%20fluid%20player%20into%20video%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/471207/Turn%20kemonoparty%20fluid%20player%20into%20video%20link.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.addEventListener("load", function () {
        const videos = document.querySelectorAll(".post__video");
        for (let i = 0; i < videos.length; i++) {
            const element = videos[i];
            const summery = element.parentElement.parentElement.children[0];
            const hyperlink = document.createElement("a");
            hyperlink.textContent = summery.textContent;
            hyperlink.target = "_blank";
            hyperlink.href = element.children[0].src;
            hyperlink.appendChild(document.createElement("br"))
            summery.parentElement.prepend(hyperlink);
            summery.remove();
        }
    });
})();