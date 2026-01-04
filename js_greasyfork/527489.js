// ==UserScript==
// @license MIT
// @name         Lurl Video & Image Downloader (Top Button)
// @namespace    http://tampermonkey.net/
// @version      1.51
// @description  Enables video and image downloads on Lurl.cc, with the download button placed at the top of the page.
// @author       You
// @match        https://lurl.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527489/Lurl%20Video%20%20Image%20Downloader%20%28Top%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527489/Lurl%20Video%20%20Image%20Downloader%20%28Top%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and position the download button at the top
    function CreateDownloadButton(videoUrl, fileName) {
        // Check if button already exists
        if (document.getElementById("lurl-download-button")) return;

        // Create a fixed top bar container
        let topBar = document.createElement("div");
        topBar.setAttribute("id", "lurl-top-bar");
        topBar.setAttribute("style", `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #28a745;
            padding: 10px;
            text-align: center;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
        `);

        // Create the download button
        let downloadButton = document.createElement("a");
        downloadButton.innerText = "📥 下載影片";
        downloadButton.setAttribute("id", "lurl-download-button");
        downloadButton.setAttribute("href", videoUrl);
        downloadButton.setAttribute("download", fileName);
        downloadButton.setAttribute("style", `
            display: inline-block;
            padding: 10px 15px;
            background: #fff;
            color: #28a745;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
        `);

        // Append button to top bar
        topBar.appendChild(downloadButton);
        document.body.insertBefore(topBar, document.body.firstChild);
    }

    // Function to handle video download button placement
    function DownloadVideo() {
        let videoElement = document.querySelector('video');
        if (!videoElement) {
            console.warn("No video element found.");
            return;
        }

        let sourceElement = videoElement.querySelector('source');
        if (!sourceElement || !sourceElement.src) {
            console.error("No video source found.");
            return;
        }

        let videoUrl = sourceElement.src;
        let pageTitle = document.title || "video";  // Fallback title

        // Place the download button at the top of the page
        CreateDownloadButton(videoUrl, pageTitle + ".mp4");

        console.log("✅ Download button added at the top of the page.");
    }

    // Function to solve and download protected images
    function PictureSolve() {
        const parentElement = document.querySelector("#canvas_div_lurl")?.parentElement;
        if (!parentElement) {
            console.warn("Parent element not found.");
            return;
        }

        const scriptElements = parentElement.querySelectorAll("script");
        if (scriptElements.length < 2) {
            console.error("Not enough script elements found.");
            return;
        }

        const secondScriptElement = scriptElements[1];
        const scriptText = secondScriptElement.innerHTML;
        const regex = /canvas_img\(['"](https:\/\/[^'"]+)['"]/;
        const match = scriptText.match(regex);

        if (match) {
            const imageURL = match[1];

            // Create a download button for the image
            CreateDownloadButton(imageURL, "image.png");

            console.log("✅ Image download button added at the top.");
        } else {
            console.error("Image URL not found in script text.");
        }
    }

    // Function to auto-click adult verification on Dcard
    function SexBoard() {
        var buttons = document.querySelectorAll('button');

        if (buttons.length == 13) {
            ClickOK();
        }

        function ClickOK() {
            var pElements = document.getElementsByTagName('p');
            var nextSiblingElement = pElements[1]?.nextSibling;

            if (nextSiblingElement?.nodeType === 1) {
                var buttons = nextSiblingElement.querySelectorAll('button');

                if (buttons.length >= 2) {
                    buttons[1].click();
                }
            }
        }

        document.querySelectorAll('.__portal').forEach(div => div.remove());
        document.body.style.overflow = 'auto';
    }

    // Function to enhance video player experience
    function EnhanceVideoPlayer() {
        let TureUrl = document.querySelector('source')?.src;
        if (!TureUrl) return;

        let existingVideo = document.querySelector('video');
        if (!existingVideo) return;

        let newVideo = document.createElement('video');
        newVideo.src = TureUrl;
        newVideo.controls = true;
        newVideo.autoplay = true;
        newVideo.width = 640;
        newVideo.height = 360;
        newVideo.preload = 'metadata';
        newVideo.classList.add('vjs-tech');
        newVideo.setAttribute('data-setup', '{"aspectRatio":"16:9"}');
        newVideo.id = 'vjs_video_3_html5_api';
        newVideo.tabIndex = -1;
        newVideo.setAttribute('role', 'application');

        existingVideo.parentNode.replaceChild(newVideo, existingVideo);

        let videoContainer = document.getElementById('vjs_video_3');
        videoContainer?.removeAttribute('oncontextmenu');
        videoContainer?.removeAttribute('controlslist');

        document.querySelectorAll('.vjs-control-bar').forEach(controlBar => {
            controlBar.parentNode.removeChild(controlBar);
        });
    }

    // CSS Loader
    function LoadStyles() {
        let linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.setAttribute('src', 'https://cdn.jsdelivr.net/npm/toastify-js');

        let headElement = document.head || document.getElementsByTagName('head')[0];
        headElement.appendChild(linkElement);
        headElement.appendChild(scriptElement);
    }

    // Main execution
    function Init() {
        let currentUrl = window.location.href;

        if (currentUrl.startsWith('https://www.dcard.tw/f/sex')) {
            SexBoard();
            setTimeout(SexBoard, 3500);
        } else {
            LoadStyles();

            window.addEventListener("load", function() {
                setTimeout(() => {
                    let videoElement = document.querySelector('video');
                    if (videoElement) {
                        DownloadVideo();
                        EnhanceVideoPlayer();
                    } else {
                        PictureSolve();
                    }
                }, 2000);
            });
        }
    }

    Init();
})();
