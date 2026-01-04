// ==UserScript==
// @name         alice
// @namespace    oba
// @version      2.0
// @description  sessizlik iyidir
// @author       alyy
// @match        https://www.oba.gov.tr/egitim/oynatma/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448459/alice.user.js
// @updateURL https://update.greasyfork.org/scripts/448459/alice.meta.js
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