// ==UserScript==
// @name         Nicovideo Fast Downloader
// @namespace    https://greasyfork.org/en/users/86284-benjababe
// @version      1.0
// @description  Download your nicovideos with one simple click
// @author       Benjababe
// @license      MIT

// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?domain=nicovideo.jp

// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/435460/Nicovideo%20Fast%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435460/Nicovideo%20Fast%20Downloader.meta.js
// ==/UserScript==

// jshint esversion: 6

(function () {
    'use strict';

    const HOTKEY = "Pause";
    const DOC_TITLE = document.title;
    const TITLE = document.querySelector(".VideoTitle");
    const DL_IMG = "https://i.imgur.com/CqerSAu.png";

    // appends download icon to menu on page load
    window.onload = () => {
        let menuContainer = document.querySelector(".VideoMenuContainer-areaLeft");

        let btn = document.createElement("button");
        btn.type = "Button";
        btn.onclick = downloadVideo;
        btn.classList.add("ActionButton");
        btn.classList.add("UadButton");
        btn.classList.add("VideoMenuContainer-button");

        let img = document.createElement("img");
        img.src = DL_IMG;
        img.height = 24;
        img.width = 24;
        btn.appendChild(img);

        menuContainer.appendChild(btn);
    }

    // use hotkey to download video instead of icon
    document.onkeydown = (e) => {
        if (e.code === HOTKEY) {
            downloadVideo();
        }
    }

    let downloadVideo = () => {
        let mainVideoPlayer = document.querySelector("#MainVideoPlayer");

        // cycle through child of player until a <video> is reached
        for (let i = 0; i < mainVideoPlayer.childElementCount; i++) {
            let child = mainVideoPlayer.childNodes[i];
            if (child.tagName.toLowerCase() == "video") {
                let progressTxt = document.querySelector("#progressTxt");

                // in case it was created already
                if (progressTxt == undefined) {
                    // update download text next to video title and tab title
                    progressTxt = document.createElement("h2");
                    progressTxt.id = "progressTxt";
                    progressTxt.innerText = "Downloading: 0%";
                    TITLE.parentNode.appendChild(progressTxt);
                }

                let titleTxt = TITLE.innerText;

                // get video id (sm[0-9]{1,})
                let id = location.pathname.split("/");
                id = id[id.length - 1].split("?")[0];

                // initiate download with proper start, progress and end callback functions
                GM_download({
                    "url": child.src,
                    "name": `${titleTxt}-${id}.mp4`,
                    "saveAs": true,
                    "onerror": errorCB,
                    "ontimeout": errorCB,
                    "onprogress": progress,
                    "onload": completeCB
                });
                console.log(`Downloading: ${child.src} as ${titleTxt}-${id}.mp4`);
            }
        }
    }

    // callback function for progress update
    let progress = (progress) => {
        let downloaded = parseInt(progress.done / progress.total * 100);
        // updates progress text
        document.querySelector("#progressTxt").innerText = `Downloading: ${downloaded}%`;
        // updates tab title
        document.title = `Downloading: ${downloaded}%`;
    }

    // callback function on download complete
    let completeCB = () => {
        // changes tab title back to original
        document.title = DOC_TITLE;
    }

    // callback function on error
    let errorCB = (error) => {
        console.error(error);
    }
})();