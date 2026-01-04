// ==UserScript==
// @author          Newonroad
// @name            XVideos Download Link Extractor
// @namespace       newonroad
// @description     Add high resolution download link on the right of the screen. Use save as... to download the video you need.
// @include         http*://www.xvideos.com/video*
// @version         0.0.3
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/373899/XVideos%20Download%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/373899/XVideos%20Download%20Link%20Extractor.meta.js
// ==/UserScript==

(function extractXVideos() {
    window.addEventListener("DOMContentLoaded", function () {
        function createVideoDownloadElement(href, hintText) {
            var videoList = document.createElement("li");
            var videoDownloadElement = document.createElement("a");
            videoDownloadElement.setAttribute("href", href);
            videoDownloadElement.setAttribute("target", "_blank");
            videoDownloadElement.setAttribute("class", "btn btn-default");
            videoDownloadElement.setAttribute("download", window.xv.conf.dyn.id + ".mp4");
            videoDownloadElement.innerHTML = '<span class="icon download"></span><span class="visible-lg-inline"> '+hintText+'</span></a>';
            videoList.appendChild(videoDownloadElement);
            document.querySelector("#video-actions > ul").appendChild(videoList);
        }
        createVideoDownloadElement(window.html5player.url_high, "High");
        createVideoDownloadElement(window.html5player.url_low, "Low");
        createVideoDownloadElement(window.html5player.url_hls, "HLS");
    });
}());