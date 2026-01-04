// ==UserScript==
// @name        Youtube Audio Mode
// @description Listen to only the audio on YouTube without loading the video.
// @version     0.2.8
// @author      Burn
// @namespace   https://openuserjs.org/users/burn
// @copyright   2022, burn (https://openuserjs.org/users/burn)
// @include     https://www.youtube.com/*
// @match       https://www.youtube.com/*
// @license     MIT
// @run-at      document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/447447/Youtube%20Audio%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/447447/Youtube%20Audio%20Mode.meta.js
// ==/UserScript==

/*

PLEASE NOTE

The original version of this userscript is written by Teaqu
and it's published here: https://github.com/teaqu/youtube-audio-mode

*/

(async function(open, originalFetch) {
    const DBG = false;
    let myLog = (msg) => {
        DBG && console.log(GM_info.script.name + " | " + msg);
    };

    window.addEventListener("yt-navigate-finish", audioMode);
    window.onYouTubeIframeAPIReady = await audioMode();

    async function audioMode() {
        if (location.pathname == "/watch") {
            let video = document.getElementsByTagName("video")[0];
            let audioMode = await GM.getValue("ytAudioMode");
            await addToMenu(audioMode);
            if (audioMode) {
                setPoster(video, ["maxres", "hq", "sd"]);
                watchFetchStream(video);
            } else { myLog("audiomode is disabled"); }
        }
    }

    function watchFetchStream(video) {
        const constantMock = originalFetch;
        unsafeWindow.fetch = function() {
            return new Promise((resolve, reject) => {
                constantMock.apply(this, arguments)
                .then((response) => {
                    if (response.url.indexOf("mime=audio") > -1) { // && response.type != "cors"){
                        !video.paused && video.pause();
                        myLog("current time after pausing video: " + video.currentTime);
                        let currentTimeStamp = video.currentTime;
                        video.src = response.url.split("&range")[0];
                        video.currentTime = currentTimeStamp;
                        myLog("current time before resuming video playback: " + video.currentTime);
                        video.paused && video.play();
                    }
                    resolve(response);
                })
                .catch((error) => {
                    reject(response);
                })
            });
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
            let videoElm = document.getElementsByTagName("video")[0];
            audioToggle.onclick = async function() {
                let audioMode = ! await GM.getValue("ytAudioMode");
                this.setAttribute("aria-checked", audioMode);
                GM.setValue("ytAudioMode", audioMode);
                location.href = location.protocol
                    + "//" + location.hostname
                    + location.pathname
                    + setGetVar("t", parseInt(videoElm.currentTime) + "s");
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
            myLog("thumbnail loaded");
            // A height 90 is YouTube "not found" image.
            if (img.height <= 90) {
                myLog("thumbnail should be youtube not found image");
                setPoster(video, fmts);
            } else {
                myLog("thumbnail found, now applying css rule to display it");
                video.style.background = `url(${img.src}) no-repeat center`;
                video.style.backgroundSize = "contain";
            }
        };
    }

    function setGetVar(name, value) {
        let vars = getVars();
        vars[name] = value;
        let strSearch = "?";
        for (let n in vars)
            strSearch += n + "=" + vars[n] + "&";
        return strSearch.substring(0, strSearch.length - 1);
    }
    function getVars() {
        // https://stackoverflow.com/questions/12049620/how-to-get-get-variables-value-in-javascript#12049703
        let GET = [];
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(a,name,value) {GET[name] = value;});
        return GET;
    }
})(XMLHttpRequest.prototype.open, window.fetch || unsafeWindow.fetch);
