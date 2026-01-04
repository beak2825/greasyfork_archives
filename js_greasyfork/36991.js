// ==UserScript==
// @name         YouTube to MP3 Downloader Button
// @description  Adds a download button to YouTube videos which allows you to download the MP3 of the video with MediaHuman YouTube to MP3
// @author       FaySmash
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @version      2.1
// @namespace    youtube.to.mp3.downloader.button
// @downloadURL https://update.greasyfork.org/scripts/36991/YouTube%20to%20MP3%20Downloader%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/36991/YouTube%20to%20MP3%20Downloader%20Button.meta.js
// ==/UserScript==

function AddButton() {

    var subscribeButton = document.querySelectorAll("ytd-subscribe-button-renderer.ytd-watch-metadata");

    var downloadButton = document.createElement("button");
    if (typeof downloadButton !== "undefined"){
        downloadButton.id = "downloadButton"
        downloadButton.appendChild(document.createTextNode("⤓"));
        downloadButton.style.width = "36px";
        downloadButton.style.height = "36px";
        downloadButton.style.border = "0";
        downloadButton.style.borderRadius = "18px";
        downloadButton.style.cursor = "pointer";
        downloadButton.style.fontFamily = "inherit";
        downloadButton.style.fontWeight = "bold";
        downloadButton.style.marginLeft = "8px";
        downloadButton.style.fontSize = "x-large";
        downloadButton.onclick = function() {
            document.location.href = 'yt2mp3://' + (location.href);
        }
    }

    if (typeof subscribeButton[0] !== "undefined"){
        subscribeButton[0].appendChild(downloadButton);
    }
}

setInterval(function() {
    if (document.getElementById("info") && document.getElementById("downloadButton") === null)
        AddButton();
}, 100);