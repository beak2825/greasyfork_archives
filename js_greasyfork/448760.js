// ==UserScript==
// @name         alyy_v2
// @namespace    https://www.oba.gov.tr/
// @license MIT
// @version      0.3
// @description  OBA derslerini durmadan izler
// @author       You
// @match        https://www.oba.gov.tr/*
// @icon         https://avatars.githubusercontent.com/u/2937359?v=4
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/448760/alyy_v2.user.js
// @updateURL https://update.greasyfork.org/scripts/448760/alyy_v2.meta.js
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