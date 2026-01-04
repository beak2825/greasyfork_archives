// ==UserScript==
// @name         ÖBA Vidoe Auto Watcher
// @namespace    none
// @version      1.2
// @description  ÖBA videoları bittikten sonra otomatik sonraki videoya geçer..
// @author       Osman TÜRKMEN
// @match        https://www.oba.gov.tr/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448579/%C3%96BA%20Vidoe%20Auto%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/448579/%C3%96BA%20Vidoe%20Auto%20Watcher.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onblur = () => {};
    function videoLink(){
       return document.getElementsByClassName("progress-icon")[0].parentElement;
    };
    function videoPlayer(){
       return document.getElementById("video_html5_api");
    };
    videoPlayer().muted = true;

    setTimeout(function() {
        videoPlayer().play();
    }, 5000);

    videoPlayer().onended = function() {
        console.log("Sonraki videoya geçiliyor");
        videoLink().click();
        videoPlayer().play();
    };
    setTimeout(function() {
        location.reload();
    }, 25*60*1000);
})();