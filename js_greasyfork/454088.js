// ==UserScript==
// @name         SampleFocus Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download unlimited samples from SampleFocus
// @author       Romadillo
// @match        https://samplefocus.com/samples/*
// @icon         https://i.imgur.com/WedmtXe.png
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/454088/SampleFocus%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/454088/SampleFocus%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const element = document.getElementsByClassName("sample-hero-waveform-container");
    const sampleUrl = JSON.parse(element[0].attributes[1].value)["sample"]["sample_mp3_url"];

    const link = document.querySelector(".sample-hero .download-link");
    link.onclick = function(e) {
        const fileName = new URL(sampleUrl).pathname.split("/").pop();
        console.log("Downloading ", sampleUrl, " as ", fileName);
        GM_download({url: sampleUrl, name: fileName, saveAs: true, onerror: function(e) { console.log(e); }});
        e.stopPropagation();
        return false;
    }
})();
