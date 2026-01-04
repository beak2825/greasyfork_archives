// ==UserScript==
// @name        YouTube screenshot
// @namespace   https://github.com/qiwichupa/userscripts/blob/master/youtube_screenshot__userscript
// @homepage    https://greasyfork.org/ru/scripts/455155-youtube-screenshot
// @author      qiwichupa
// @version     20221120.2147
// @description Adds a screenshot button to YouTube video page
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*
// @run-at      document-end
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        none
// @license           GNU General Public License v2.0 or later
// @downloadURL https://update.greasyfork.org/scripts/455155/YouTube%20screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/455155/YouTube%20screenshot.meta.js
// ==/UserScript==
 
this.$ = this.jQuery = jQuery.noConflict(true);
$(function () {
 
    "use strict";
    addScreenshotSupport();
    document.body.addEventListener("yt-navigate-finish", function (event) {
        addScreenshotSupport();
    });
 
 
    function addScreenshotSupport(firstLoad) {
        if (isVideoPage()) {
            waitForElement("upload-info", function () {
                addScreenshotButton();
            }, 330);
        }
    }
 
 
    function waitForElement(elementId, callbackFunction, intervalLength = 330) {
        var waitCount = 15000 / intervalLength; // wait 15 seconds maximum
        var wait = setInterval(function () {
            waitCount--;
            if ($("#" + elementId).length > 0) {
                callbackFunction();
                clearInterval(wait);
            } else if (waitCount <= 0) {
                console.log("YouTube RSS Feed UserScript - wait for element \"#" + elementId +
                        "\" failed! Time limit (15 seconds) exceeded.");
                clearInterval(wait);
            }
        }, intervalLength);
    }
 
    function isVideoPage() {
        return document.URL.indexOf("/watch") !== -1 && document.URL.indexOf("v=") !== -1;
    }
 
 
    function addScreenshotButton() {
        if ($("#ScreenshotButton").length > 0) {
            $("#ScreenshotButton").remove();
        }
        $("#subscribe-button")
                .css({
                    "display": "flex",
                    "flex-flow": "nowrap",
                    "height": "37px"
                })
                .prepend(styleOfScreenshotButton());
      $("#ScreenshotButton").click (makeScreenshot);
    }
 
 
    function styleOfScreenshotButton() {
        return $('<button id="ScreenshotButton" onclick="makeScreenshot()">SHOT</button>')
                .css({
                    "background-color": "#fd9b12",
                    "border-radius": "3px",
                    "padding": "10px 16px",
                    "color": "#ffffff",
                    "font-size": "14px",
                    "text-decoration": "none",
                    "text-transform": "uppercase",
                    "margin-right": "5px"
                });
    }
 
 
    function makeScreenshot () {
        // original code: https://github.com/ReeganExE/youtube-screenshot
        // and https://github.com/ParticleCore/Iridium
        var screen_shot_container;
        var canvas;
        var video;
        var aspect_ratio;
        var canvas_context;
        var aspect_ratio;
        var canvas_width;
        var canvas_height;
        var base64ImageData;
        var filename;
        var a;
        var img;
 
        if (!(screen_shot_container = document.getElementById("us-screen-shot-container"))) {
 
                              screen_shot_container           = document.createElement("template");
                              screen_shot_container.innerHTML =
                                  "<div id='us-screen-shot-container'>" +
                                  "    <a target='_blank' download data-locale='title|screen_shot_title'>" +
                                  "        <canvas></canvas>" +
                                  "    </a>" +
                                  "</div>";
                              screen_shot_container           = screen_shot_container.content;
 
                          }
 
        canvas = screen_shot_container.querySelector("canvas");
        video = document.querySelector('video');
        aspect_ratio   = video.videoWidth / video.videoHeight;
 
        // Change the size here
        canvas_context = canvas.getContext("2d");
        aspect_ratio   = video.videoWidth / video.videoHeight;
        canvas_width   = video.videoWidth;
        canvas_height  = parseInt(canvas_width / aspect_ratio, 10);
        canvas.width   = canvas_width;
        canvas.height  = canvas_height;
        canvas_context.drawImage(video, 0, 0, canvas_width, canvas_height);
 
        // Won't work on file:/// URLs. SecurityError: Tainted canvases may not be exported.
        base64ImageData = canvas.toDataURL('image/jpeg');
        filename = 'snap-' + canvas.width + 'x' + canvas.height + '-' + video.currentTime + '.jpg';
 
        // Wrap <img> in link to download image because
        // the context menu Save Image as... is blocked for security reasons
        a = document.createElement('a');
        a.download = filename;
        a.href = base64ImageData;
 
        img = document.createElement('img');
        img.src = base64ImageData;
        img.alt = filename;
        img.title = 'Click to save ' + filename;
 
        window.open().document.body.appendChild(a).appendChild(img);
 
    }
 
});
