// ==UserScript==
// @name         ÖBA Binge Watch
// @namespace    https://www.bugracanata.com.tr
// @version      0.2
// @description  ÖBA Videolarını, Bilgisayara Dokunmadan Arka Arkaya İzlemenizi Sağlar
// @author       Buğra CANATA
// @match        https://www.oba.gov.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448232/%C3%96BA%20Binge%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/448232/%C3%96BA%20Binge%20Watch.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onblur = () => {};
    var video = document.getElementById("video_html5_api");
    video.muted = true;

    setTimeout(function() {
        video.play();
    }, 5000);

    video.onended = function() {
        console.log("Video bitti, bir sonrakine geçiliyor");
        document.getElementsByClassName("progress-icon")[0].parentElement.click();
        document.getElementById("video_html5_api").play();
    };

    setTimeout(function() {
        location.reload();
    }, 25*60*1000);
})();