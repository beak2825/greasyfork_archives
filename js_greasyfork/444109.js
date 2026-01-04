// ==UserScript==
// @name         Youtube Music Precise Volume Adjustement
// @name:en      Youtube Music Precise Volume Adjustement
// @name:fr      Ajustement précis du volume sur Youtube Music
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description:en  Allow you to precisely chose your volume on Youtube Music
// @description:fr  Vous permet de précisément choisir votre volume sur Youtube Music
// @author       Elgem
// @match        https://music.youtube.com/*
// @icon         https://music.youtube.com/img/favicon_144.png
// @grant        none
// @license      MIT
// @description Allow you to precisely chose your volume on Youtube Music
// @downloadURL https://update.greasyfork.org/scripts/444109/Youtube%20Music%20Precise%20Volume%20Adjustement.user.js
// @updateURL https://update.greasyfork.org/scripts/444109/Youtube%20Music%20Precise%20Volume%20Adjustement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    createStyle();

    var volumeDiv;
    var volumeBar;
    var muteButton;
    var input;

    modifyVolumeDiv();

    modifyVolumeBar();

    modifyMuteButton();

    createVolumeInput();


    function createStyle(){
        var style = document.createElement("style");

        style.innerHTML = 'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;}input[type=number] {-moz-appearance:textfield; }';

        document.head.appendChild(style);
    }

    function modifyVolumeDiv(){
        volumeDiv = document.getElementsByClassName("volume-slider style-scope ytmusic-player-bar")[0];
        volumeDiv.setAttribute("style", "width : 150px !important;")
    }

    function modifyVolumeBar(){
        volumeBar = document.getElementsByClassName("volume-slider style-scope ytmusic-player-bar")[0];

        volumeBar.setAttribute("step", "1");

        volumeBar.addEventListener("change", (e) => {modifyVolume(volumeBar.value)});
        volumeBar.addEventListener("click", (e) => {modifyVolume(volumeBar.value)});
        volumeBar.addEventListener("immediate-value-change", (e) => {modifyVolume(e.target .value)});
        volumeBar.addEventListener("DOMMouseScroll", (e) => {modifyVolume(volumeBar.value)});
        volumeBar.addEventListener("tap", (e) => {modifyVolume(volumeBar.value)});
    }

    function modifyMuteButton(){
        muteButton = document.getElementsByClassName("volume style-scope ytmusic-player-bar")[0];

        muteButton.addEventListener("click", (e) => {modifyVolume(volumeBar.value)});
        muteButton.addEventListener("down", (e) => {modifyVolume(volumeBar.value)});
        muteButton.addEventListener("up", (e) => {modifyVolume(volumeBar.value)});
        muteButton.addEventListener("keydown", (e) => {if(e.key == 'm'){modifyVolume(volumeBar.value)}});
        muteButton.addEventListener("keyup", (e) => {if(e.key == 'm'){modifyVolume(volumeBar.value)}});
        muteButton.addEventListener("tap", (e) => {modifyVolume(volumeBar.value)});
        muteButton.addEventListener("touchend", (e) => {modifyVolume(volumeBar.value)});
        muteButton.addEventListener("touchstart", (e) => {modifyVolume(volumeBar.value)});

        document.addEventListener("keydown", (e) => {if(e.key == 'm'){modifyVolume(volumeBar.value)}});
        document.addEventListener("keyup", (e) => {if(e.key == 'm'){modifyVolume(volumeBar.value)}});
    }

    function createVolumeInput(){
        input = document.createElement("INPUT");

        input.setAttribute("value", volumeBar.getAttribute("value"));

        input.innerHTML = volumeBar.getAttribute("step");
        input.setAttribute("name", "VolumeInput");
        input.setAttribute("class", "volumeinput")

        input.setAttribute("type", "number");
        input.setAttribute("min", "0");
        input.setAttribute("max", "100");

        input.setAttribute("style", "width : 25px; background: transparent; color: white; border: 2px solid #808080; border-radius: 10px; text-align: center; padding: 5px;}");


        input.addEventListener("change", (e) => {modifyVolume(e.target.value)});

        volumeDiv.insertBefore(input, volumeDiv.children[0]);
    }

    function modifyVolume(volume){
        volume = Math.max(0, Math.min(100, volume));

        volumeBar.value = volume;
        input.value = volume;
    }
})();