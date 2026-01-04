// ==UserScript==
// @name        Youtube Audio Mode
// @description Listen to only the audio on YouTube without loading the video.
// @version     1.2.2
// @include     https://www.youtube.com/*
// @license     GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @noframes
// @namespace https://greasyfork.org/users/195276
// @downloadURL https://update.greasyfork.org/scripts/372074/Youtube%20Audio%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/372074/Youtube%20Audio%20Mode.meta.js
// ==/UserScript==

(function(open) {
    window.addEventListener("yt-navigate-finish", audioMode);
    window.onYouTubeIframeAPIReady = audioMode();

    async function audioMode() {
        if (location.pathname == "/watch") {
            let video = document.getElementsByTagName("video")[0];
            let audioMode = await GM.getValue("ytAudioMode");
            addToMenu(audioMode);
            if (audioMode) {
                setPoster(video, ["maxres", "hq", "sd"]);
                watchStream(video);
            }
        }
    }

    // Watch the media streams so we can select the audio
    function watchStream(video) {
        XMLHttpRequest.prototype.open = function(method, url) {
            let validStream = /^(?!.*live=1).+audio.+$/;
            if (validStream.test(url) && ! video.src.includes("audio")) {
                video.pause();
                video.src = url.split("&range")[0];
                video.play();
            }
            open.apply(this, arguments);
        }
    }

    // Add audio mode to the settings menu
    async function addToMenu(audioMode) {
        let panel = document.getElementsByClassName("ytp-panel-menu")[0];
        if (!panel.innerHTML.includes("Audio Mode")) {
            panel.innerHTML += `
            <div class="ytp-menuitem"
                aria-checked="${audioMode}"
                id="audio-mode">
                <div class="ytp-menuitem-icon"></div>
                <div class="ytp-menuitem-label">Audio Mode</div>
                <div class="ytp-menuitem-content">
                    <div class="ytp-menuitem-toggle-checkbox">
                </div>
            </div>`;

            // Toggle audio mode on or off
            let audioToggle = document.getElementById("audio-mode");
            audioToggle.onclick = async function() {
                let audioMode = ! await GM.getValue("ytAudioMode");
                this.setAttribute("aria-checked", audioMode);
                GM.setValue("ytAudioMode", audioMode);
                location.reload();
            }
        }
    }

    // Set the video poster from thumbnails with the best avaliable format
    // https://developers.google.com/youtube/v3/docs/thumbnails
    async function setPoster(video, fmts) {
        let img = new Image();
        let videoId = location.search.match(/v=(.+?)(&|$)/)[1];
        img.src = `//i.ytimg.com/vi/${videoId}/${fmts.shift()}default.jpg`
        img.onload = function() {
            // A height 90 is YouTube"s not found image.
            if (img.height <= 90) {
                setPoster(video, fmts);
            } else {
                video.style.background = `url(${img.src}) no-repeat center`;
                video.style.backgroundSize = "contain";
            }
        };
    }
})(XMLHttpRequest.prototype.open);
