// ==UserScript==
// @name         DMMオンクレ 画面反転
// @namespace    http://tampermonkey.net/
// @version      2024-03-16
// @description  DMMオンクレのプレイ画面を反転させます
// @author       fitudao3788
// @match        https://onkure.dmm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/488815/DMM%E3%82%AA%E3%83%B3%E3%82%AF%E3%83%AC%20%E7%94%BB%E9%9D%A2%E5%8F%8D%E8%BB%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488815/DMM%E3%82%AA%E3%83%B3%E3%82%AF%E3%83%AC%20%E7%94%BB%E9%9D%A2%E5%8F%8D%E8%BB%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInvert = false;

    let floatBtn = document.createElement("button");
    floatBtn.innerHTML = "&#x1f504;";
    floatBtn.style.position = "fixed";
    floatBtn.style.right = "1rem";
    floatBtn.style.bottom = "1rem";
    floatBtn.style.fontSize = "2rem";
    floatBtn.style.borderColor = "inherit";
    floatBtn.style.borderRadius = "2rem";

    floatBtn.addEventListener("click", () => {
        let videoFront = document.getElementById("video-front"),
            videoSide = document.getElementById("video-side"),
            iframeFront = document.getElementById("iframe-front"),
            iframeSide = document.getElementById("iframe-side");

        if(videoFront == null || videoSide == null || iframeFront == null || iframeSide == null) return;

        let transformRotate = isInvert ? 0 : 180;
        videoFront.style.transform = `rotate(${transformRotate}deg)`;
        videoSide.style.transform = `rotate(${transformRotate}deg)`;
        iframeFront.style.transform = `rotate(${transformRotate}deg)`;
        iframeSide.style.transform = `rotate(${transformRotate}deg)`;

        isInvert = !isInvert;
    });

    const checkUrl = () => {
        console.log("hit");
        if(location.pathname.indexOf("/play/") !== -1) {
            document.body.append(floatBtn);
        } else {
            try {
                document.body.removeChild(floatBtn);
            } catch(e) {}
        }
    };

    new MutationObserver(checkUrl).observe(document.querySelector("title"), {childList: true});
})();