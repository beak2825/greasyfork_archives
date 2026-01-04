// ==UserScript==
// @name         VidAmplifier
// @namespace    https://github.com/DemianAdam/VidAmplifier
// @version      0.3
// @description  VidAmplifier is a user script designed to enhance the audio of videos on YouTube beyond their default maximum volume.
// @author       Dnam
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/465890/VidAmplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/465890/VidAmplifier.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let audioCtx;
    let source;
    let gainNode;

    let elementsReady = setInterval(()=>{
        if (!source) {
            let video = document.querySelector('video');
            audioCtx = new AudioContext();
            source = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            clearInterval(elementsReady);
            elementsReady = true;
            console.log("elements");

        }
    },1000)
    /*document.addEventListener('yt-navigate-start', () => mainVolumeGain(gainNode));
    mainVolumeGain(gainNode);*/
    let ready = setInterval(()=> {
        if(elementsReady){
            mainVolumeGain(gainNode,ready);
            console.log("source");
        }
    },1000);
})();

function mainVolumeGain(gainNode,ready) {
    if(document.querySelector("#videoVolumeSpan") || location.url == "https://www.youtube.com")
    {
        return;
    }
    let gain = gainNode.gain.value;
    addVolumeSpan();
    addVolumeShorcutEvents();
    initializeGainChangedEvent();
    function volumeUp() {
        gainNode.gain.value += 0.25;
    }
    function volumeDown() {
        gainNode.gain.value -= 0.25;
    }
    function resetVolume() {
        gainNode.gain.value = 1;
    }
    function volumeChange(e) {
        let changed = false;
        if (e.altKey && e.code === "NumpadAdd") {
            volumeUp();
            changed = true;
        }
        else if (e.altKey && e.code === "NumpadSubtract") {
            if (gainNode.gain.value > 1) {
                volumeDown();
            }
            changed = true;
        }
        else if (e.altKey && e.code === "NumpadDivide") {
            resetVolume();
            changed = true;
        }
        if (changed) {
            document.getElementById('movie_player').wakeUpControls();
        }
    }
    function addVolumeShorcutEvents() {
        document.addEventListener('keyup', volumeChange);
    }

    function createSpan() {
        let control = document.createElement("span");
        control.setAttribute("id", "videoVolumeSpan");
        control.innerHTML = "Volume: x" + gainNode.gain.value;
        control.style.border = "0.5px solid"
        control.style.padding = "0.5em";
        return control;
    }

    function createContainer(control) {
        let container = document.createElement("div");
        container.style.marginLeft = "2px";
        container.append(control);
        return container;
    }
    function addVolumeSpan() {
        if (!document.querySelector("#videoVolumeSpan")) {
            let volumeArea = document.querySelector(".ytp-volume-area");
            let control = createSpan();
            let container = createContainer(control);
            volumeArea.parentNode.insertBefore(container, volumeArea.nextSibling);
        }
    }
    function updateGainSpan() {
        let control = document.querySelector("#videoVolumeSpan");
        control.innerHTML = "Volume: x" + gainNode.gain.value;
    }
    function gainChangedEvent(functsOnGainChanges) {
        if (gain != gainNode.gain.value) {
            functsOnGainChanges.forEach(element => {
                element();
            });
            gain = gainNode.gain.value;
        }
    }
    function initializeGainChangedEvent() {
        const OnGainChanged = [];
        OnGainChanged.push(updateGainSpan);
        setInterval(() => gainChangedEvent(OnGainChanged), 250);
    }
    clearInterval(ready);
}