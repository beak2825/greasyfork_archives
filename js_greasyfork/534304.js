// ==UserScript==
// @name         Bandcamp Volume Bar
// @version      1.1.8
// @author       Redcrafter
// @description  Adds a volume bar to Bandcamp
// @license      Apache-2.0; http://www.apache.org/licenses/LICENSE-2.0.txt
// @match        *://*.bandcamp.com/*
// @namespace    https://github.com/Redcrafter
// @downloadURL https://update.greasyfork.org/scripts/534304/Bandcamp%20Volume%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/534304/Bandcamp%20Volume%20Bar.meta.js
// ==/UserScript==

var gen = document.querySelector("meta[name=generator]");
if(!gen || gen.content != "Bandcamp") {
    return;
}

var style = document.createElement("style");
style.textContent = ".volumeControl{align-items:center;display:flex;height:52px;margin-top:-20}.volumeControl .thumb{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.volumeControl>.speaker{background:#fff;border:1px solid #d9d9d9;border-radius:2px;color:#000;cursor:pointer;font-size:32px;height:24px;line-height:24px;position:relative;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:54px}.volumeControl>.speaker>svg{margin:5px}";
document.head.appendChild(style);


var dragWidth = 82;
var dragging = false;
var dragPos = 0;
var percentage = parseFloat(localStorage.getItem("volume")) || 0.5;
var speaker, volumeInner, audio, volume;

function onLoad() {
    audio = document.getElementsByTagName("audio")[0];
    updateVolume();

    var container = document.createElement("div");
    container.classList.add("volumeControl");

    speaker = document.createElement("i");
    speaker.classList.add("speaker");
    speaker.addEventListener("click", function () {
        audio.muted = !audio.muted;
        updateHtml();
    });
    container.appendChild(speaker);
speaker.style.width = "34px";
speaker.style.height = "34px";

    var volume = document.createElement("div");
    volume.classList.add("progbar");
    container.appendChild(volume);


    var fill = document.createElement("div");
    fill.classList.add("progbar_empty");
    fill.style.width = "104px";
    volume.appendChild(fill);

    volumeInner = document.createElement("div");
    volumeInner.classList.add("thumb");

    volumeInner.addEventListener("mousedown", function (e) {
        dragging = true;
        dragPos = e.offsetX;
    });
    fill.appendChild(volumeInner);

    document.querySelector(".inline_player").appendChild(container);

    updateHtml();

    document.addEventListener("mouseup", function () {
        if (dragging) {
            localStorage.setItem("volume", percentage);
            dragging = false;
        }
    });
    document.addEventListener("mousemove", function (e) {
        if (dragging) {
            var pos = volume.getBoundingClientRect();

            audio.muted = false;
            percentage = clamp(((e.pageX - pos.left) - dragPos) / dragWidth, 0, 1);
            updateVolume();
            updateHtml();
        }
    });
}

if (document.readyState == 'complete') {
    onLoad();
} else {
    window.addEventListener("load", onLoad);
}

function updateVolume() {
    audio.volume = (Math.exp(percentage) - 1) / (Math.E - 1);
}

function updateHtml() {
    // svgs from https://www.material.io/resources/icons
    if (audio.muted) {
        speaker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        volumeInner.style.left = "0%";
    } else {
        if (percentage <= 0) {
            speaker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M7 9v6h4l5 5V4l-5 5H7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        } else if (percentage < 0.5) {
            speaker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        } else {
            speaker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        }
        volumeInner.style.left = dragWidth * percentage + 'px';
    }
}


function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
