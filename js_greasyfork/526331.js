// ==UserScript==
// @name         GBT HTML5 native player, full preload, download (GBTPP)
// @version      4.8
// @namespace    _pc
// @description  Replaces fluid player with browsers HTML5 native player, initialises native preload and proceeds full preload in background.
// @author       verydelight
// @license      MIT
// @icon         https://www.gayporntube.com/favicon.ico
// @connect      gayporntube.com
// @compatible   Firefox Tampermonkey
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_xmlHttpRequest
// @grant        GM.download
// @match        *://*.gayporntube.com/video/*
// @webRequest   {"selector":"*fluidplayer*","action":"cancel"}
// @downloadURL https://update.greasyfork.org/scripts/526331/GBT%20HTML5%20native%20player%2C%20full%20preload%2C%20download%20%28GBTPP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526331/GBT%20HTML5%20native%20player%2C%20full%20preload%2C%20download%20%28GBTPP%29.meta.js
// ==/UserScript==
(async function() {
    const max_retries = 3;
    const timeOut = 2000;
    console.log("GBTPP: Script started.");

    const videoplayer = document.getElementById('play-video');
    if (!videoplayer) {
        console.error("GBTPP: No #play-video element found");
        return;
    }
    console.log("GBTPP: Found #play-video element.");

    const videoplayerSource = videoplayer.querySelector('source');
    if (!videoplayerSource) {
        console.error("GBTPP: No <source> inside #play-video");
        return;
    }
    console.log("GBTPP: Found video source element.");

    const pattern = /\/\?br=\d*$/;
    const src = videoplayerSource.src.replace(pattern, '');
    if (src !== videoplayerSource.src) {
        videoplayerSource.src = src;
        console.log("GBTPP: Cleaned video source URL.");
    }

    videoplayer.removeAttribute("height");
    videoplayer.removeAttribute("width");
    videoplayer.setAttribute("preload", "auto");
    videoplayer.focus();
    console.log("GBTPP: Configured native video player.");

    let retries = 0;
    await downloadVideo(videoplayerSource.src);

    async function downloadVideo(url) {
        try {
            // UI feedback area
            const statusBox = document.createElement("div");
            statusBox.classList.add("blue");
            statusBox.style.fontWeight = "bold";
            statusBox.textContent = "Starting preload…";
            videoplayer.parentNode.insertBefore(statusBox, videoplayer.nextSibling);
            console.log("GBTPP: UI status box created.");

            console.log("GBTPP: Initiating full preload.");
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    responseType: 'blob',
                    url: url,
                    headers: {
                        "Content-Type": "video/mp4",
                        "Accept": "video/mp4"
                    },
                    onprogress: (event) => {
                        if (event.lengthComputable) {
                            const loadedMB = (event.loaded / 1048576).toFixed(2);
                            const totalMB = (event.total / 1048576).toFixed(2);
                            const percent = (event.loaded / event.total * 100).toFixed(1);
                            statusBox.textContent = `Preloaded ${loadedMB} / ${totalMB} MB (${percent}%)`;
                            console.log(`GBTPP: Download progress: ${loadedMB}/${totalMB} MB (${percent}%)`);
                        } else {
                            statusBox.textContent = `Preloaded ${(event.loaded / 1048576).toFixed(2)} MB…`;
                            console.log(`GBTPP: Download progress: ${(event.loaded / 1048576).toFixed(2)} MB loaded.`);
                        }
                    },
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
            console.log("GBTPP: Full preload completed.");

            console.log("GBTPP: Creating blob from response.");
            const blob = new Blob([response.response], { type: 'video/mp4' });
            const objectUrl = URL.createObjectURL(blob);
            console.log("GBTPP: Blob created and Object URL obtained.");

            // keep playback position/state
            console.log("GBTPP: Updating video player source with new blob URL.");
            const { currentTime, paused, ended } = videoplayer;
            videoplayerSource.src = objectUrl;
            videoplayer.load();
            videoplayer.currentTime = currentTime;
            if (!paused && !ended && currentTime > 0) {
                videoplayer.play();
            }
            console.log("GBTPP: Video player source updated and playback state restored.");

            // notify user final
            statusBox.textContent = "Video fully preloaded (Click Download button to save video)";
            console.log("GBTPP: Final user notification displayed.");

            const container = document.querySelector("#tab_video_info");
            if (container) {
                const dlBttn = container.querySelector(".bttn");
                if (dlBttn) {
                    console.log("GBTPP: Updating Download button.");
                    try {
                        const href = dlBttn.getAttribute('href');
                        const urlObj = new URL(href, location.href);
                        const filename = urlObj.searchParams.get('download_filename') || "video.mp4";
                        dlBttn.href = objectUrl;
                        dlBttn.download = filename;
                        console.log(`GBTPP: Download button updated with filename: ${filename}`);
                    } catch (e) {
                        console.warn("GBTPP: Could not parse filename, but download button should still work.", e);
                    }
                }
            }
        } catch (err) {
            console.error("GBTPP: An error occurred during preload.", err);
            if (retries++ < max_retries) {
                console.warn(`GBTPP: Retry ${retries}/${max_retries} after error`, err);
                setTimeout(() => downloadVideo(url), timeOut);
            } else {
                console.error(`GBTPP: Failed after ${max_retries} retries. Giving up.`, err);
                alert("GBTPP: Video preload failed after multiple attempts.");
            }
        }
    }
})();