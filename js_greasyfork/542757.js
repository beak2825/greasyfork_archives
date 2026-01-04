// ==UserScript==
// @name         Restore Unavailable Vbox7 Videos
// @namespace    https://github.com/Vankata453
// @version      2025.08.18
// @description  Enables playback of unavailable Vbox7 (vbox7.com) videos if they're archived on the Wayback Machine.
// @license      MIT
// @author       provigz (Vankata453)
// @match        https://www.vbox7.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vbox7.com
// @grant        GM_xmlhttpRequest
// @connect      web.archive.org
// @downloadURL https://update.greasyfork.org/scripts/542757/Restore%20Unavailable%20Vbox7%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/542757/Restore%20Unavailable%20Vbox7%20Videos.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    /* REDIRECT TO PLAY PAGE FOR AGE-RESTRICTED VIDEOS */
    if (location.pathname.startsWith("/login") && document.referrer.includes("vbox7.com/play:")) {
        const targetVideoID = document.referrer.split("/play:")[1];
        // Use a video taken down for copyright issues as a placeholder, since the page only contains the player for such videos.
        location.replace(`https://www.vbox7.com/play:a8d6999f0e?ageGatedVideoOverride=${targetVideoID}`);
        return;
    }

    /* UTILITIES */
    function replaceLastPartOfURL(url, newEnding) {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split("/");
        parts[parts.length - 1] = newEnding;
        urlObj.pathname = parts.join("/");
        return urlObj.toString();
    }
    async function getEarliestWaybackSnapshotURL(targetUrl) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(targetUrl)}&limit=1&closest=20060101000000&output=json`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.length > 1) {
                            const timestamp = data[1][1];
                            resolve({
                                timestamp,
                                url: `https://web.archive.org/web/${timestamp}id_/${targetUrl}`
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }
    function convertWaybackTimestampToDate(timestamp) {
        const year = parseInt(timestamp.slice(0, 4), 10);
        const month = parseInt(timestamp.slice(4, 6), 10) - 1;
        const day = parseInt(timestamp.slice(6, 8), 10);
        const hour = parseInt(timestamp.slice(8, 10), 10);
        const minute = parseInt(timestamp.slice(10, 12), 10);
        const second = parseInt(timestamp.slice(12, 14), 10);

        return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    function dateToVboxString(date) {
        const dd = String(date.getUTCDate()).padStart(2, '0');
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = date.getUTCFullYear();

        return `${dd}.${mm}.${yyyy}`;
    }
    async function getBestMPDFormats(videoSrc) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://web.archive.org/20060101000000/${videoSrc}`,
                onload: async function(response) {
                    try {
                        const mpdTree = new DOMParser().parseFromString(response.responseText, "application/xml");

                        const mpd = mpdTree.getElementsByTagName("MPD")[0];
                        if (!mpd) throw new Error('No element with name "MPD" in MPD tree!');

                        const period = mpd.getElementsByTagName("Period")[0];
                        if (!period) throw new Error('No element with name "Period" in MPD tree!');

                        let bestVideoRep, bestAudioRep;
                        const adaptationSets = period.getElementsByTagName("AdaptationSet");
                        for (let adaptation of adaptationSets) {
                            const representations = adaptation.getElementsByTagName("Representation");
                            for (const rep of representations) {
                                const mimeType = rep.getAttribute("mimeType");
                                const bandwidth = parseInt(rep.getAttribute("bandwidth") || "0", 10);

                                const type = mimeType?.startsWith("video") ? "video" : (mimeType?.startsWith("audio") ? "audio" : null);
                                if (!type) continue;

                                const repInfo = {
                                    bandwidth,
                                    file: rep.querySelector("BaseURL")?.textContent || null
                                };
                                if (!repInfo.file) continue;

                                if (type === "video" && (!bestVideoRep || bandwidth > bestVideoRep.bandwidth)) {
                                    const repSnapshot = await getEarliestWaybackSnapshotURL(replaceLastPartOfURL(videoSrc, repInfo.file));
                                    if (repSnapshot) {
                                        repInfo.url = repSnapshot.url;
                                        bestVideoRep = repInfo;
                                    }
                                } else if (type === "audio" && (!bestAudioRep || bandwidth > bestAudioRep.bandwidth)) {
                                    const repSnapshot = await getEarliestWaybackSnapshotURL(replaceLastPartOfURL(videoSrc, repInfo.file));
                                    if (repSnapshot) {
                                        repInfo.url = repSnapshot.url;
                                        bestAudioRep = repInfo;
                                    }
                                }
                            }
                        }
                        if (!bestVideoRep && !bestAudioRep) {
                            throw new Error("Not archived: No valid video or audio representations found in MPD!");
                        }

                        resolve({
                            videoURL: bestVideoRep?.url || null,
                            audioURL: bestAudioRep?.url || null
                        });
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: error => reject(error)
            });
        });
    }

    /* VIDEO FETCHING/STREAMING */
    // Manual code for video fetching/streaming is required, since we need to use
    // GM_xmlhttpRequest to fetch data from the Wayback Machine, due to CORS restrictions.
    // Fetching is used for legacy video+audio videos, since they do not support streaming
    // and their file size is usually tiny due to low resolutions (max. 720p, most often 480p).
    async function getVideoFetchBlob(videoURL) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: videoURL,
                responseType: "blob",
                onload: (response) => resolve(URL.createObjectURL(response.response)),
                onerror: (err) => reject(err)
            });
        });
    }
    function getVideoStreamBlob(videoURL) {
        const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'; // Codec for most .mp4 videos on Wayback Machine
        if (!MediaSource.isTypeSupported(mimeCodec)) {
            throw new Error("UNSUPPORTED MIME TYPE OR CODEC:", mimeCodec);
        }

        const chunkSize = 6 * 1024 * 1024; // Stream video in 6MB chunks
        const mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", () => {
            const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

            let start = 0;
            let isFetching = false;
            let isEnded = false;

            function fetchChunk() {
                if (isFetching || isEnded) return;
                isFetching = true;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: videoURL,
                    headers: {
                        Range: `bytes=${start}-${start + chunkSize - 1}`
                    },
                    responseType: "arraybuffer",
                    onload: (res) => {
                        const contentRange = res.responseHeaders.match(/Content-Range: bytes (\d+)-(\d+)\/(\d+)/i);
                        const totalSize = contentRange ? parseInt(contentRange[3]) : null;

                        const chunk = new Uint8Array(res.response);
                        sourceBuffer.appendBuffer(chunk);

                        sourceBuffer.addEventListener("updateend", function handler() {
                            sourceBuffer.removeEventListener("updateend", handler);
                            start += chunk.length;
                            isFetching = false;

                            if (totalSize && start >= totalSize) {
                                isEnded = true;
                                mediaSource.endOfStream();
                            } else {
                                fetchChunk();
                            }
                        });
                    },
                    onerror: (err) => {
                        console.err("VIDEO CHUNK FETCH FAILED:", err);
                        isEnded = true;
                        mediaSource.endOfStream();
                    }
                });
            }

            fetchChunk();
        });
        return URL.createObjectURL(mediaSource);
    }

    /* AUDIO PLAYER */
    function getAudioPlayer() {
        return document.querySelector("audio#customhtml5audio");
    }
    function setAudioPlayerSource(audioURL, visible = false) {
        getAudioPlayer()?.remove();
        if (!audioURL) return;

        let audioPlayer = document.createElement("audio");
        audioPlayer.id = "customhtml5audio";
        audioPlayer.style.display = visible ? "block" : "none";
        if (visible) {
            audioPlayer.style.position = "absolute";
            audioPlayer.style.left = "38%";
            audioPlayer.style.top = "55.5%";
            audioPlayer.style.zIndex = 101;
            audioPlayer.setAttribute("controls", "");
        }
        document.querySelector("div.vbox-player").appendChild(audioPlayer);

        let audioSource = document.createElement("source");
        audioSource.setAttribute("type", "audio/mp4");
        audioSource.setAttribute("src", audioURL);
        audioPlayer.appendChild(audioSource);
    }

    /* VIDEO PLAYER <-> AUDIO PLAYER */
    function linkVideoAudioPlayer() {
        let videoPlayer = getVideoPlayer();
        if (videoPlayer._audioHandlersActive) return;

        if (!videoPlayer._audioHandlers) {
            videoPlayer._audioHandlers = {
                playing: () => {
                    let audioPlayer = getAudioPlayer();
                    if (audioPlayer.readyState >= 1) {
                        audioPlayer.currentTime = videoPlayer.currentTime;
                        if (!videoPlayer.paused) {
                            audioPlayer.play();
                        }
                    } else {
                        audioPlayer.addEventListener('canplay', () => {
                            audioPlayer.currentTime = videoPlayer.currentTime;
                            if (!videoPlayer.paused) {
                                audioPlayer.play();
                            }
                        }, { once: true });
                    }
                },
                pause: () => { getAudioPlayer()?.pause(); },
                waiting: () => { getAudioPlayer()?.pause(); },
                ratechange: () => {
                    let audioPlayer = getAudioPlayer();
                    if (audioPlayer) {
                        audioPlayer.playbackRate = videoPlayer.playbackRate;
                    }
                },
                volumechange: () => {
                    let audioPlayer = getAudioPlayer();
                    if (audioPlayer) {
                        audioPlayer.volume = videoPlayer.volume;
                        audioPlayer.muted = videoPlayer.muted;
                    }
                },
                seeked: () => {
                    let audioPlayer = getAudioPlayer();
                    if (audioPlayer) {
                        audioPlayer.currentTime = videoPlayer.currentTime;
                    }
                }
            };
        }

        // Sync video player with an audio player, if one exists
        videoPlayer.addEventListener('playing', videoPlayer._audioHandlers.playing, false);
        videoPlayer.addEventListener('pause', videoPlayer._audioHandlers.pause, false);
        videoPlayer.addEventListener('waiting', videoPlayer._audioHandlers.waiting, false);
        videoPlayer.addEventListener('ratechange', videoPlayer._audioHandlers.ratechange, false);
        videoPlayer.addEventListener('volumechange', videoPlayer._audioHandlers.volumechange, false);
        videoPlayer.addEventListener('seeked', videoPlayer._audioHandlers.seeked, false);

        videoPlayer._audioHandlersActive = true;
    }
    function unlinkVideoAudioPlayer() {
        let videoPlayer = getVideoPlayer();
        if (!videoPlayer._audioHandlersActive) return;

        // Desync video player from audio player
        videoPlayer.removeEventListener('playing', videoPlayer._audioHandlers.playing);
        videoPlayer.removeEventListener('pause', videoPlayer._audioHandlers.pause);
        videoPlayer.removeEventListener('waiting', videoPlayer._audioHandlers.waiting);
        videoPlayer.removeEventListener('ratechange', videoPlayer._audioHandlers.ratechange);
        videoPlayer.removeEventListener('volumechange', videoPlayer._audioHandlers.volumechange);
        videoPlayer.removeEventListener('seeked', videoPlayer._audioHandlers.seeked);

        videoPlayer._audioHandlersActive = false;
    }

    /* VIDEO PLAYER */
    function getVideoPlayer() {
        return document.querySelector("video#html5player");
    }
    function setPlayerLoading(visible) {
        let loadingMediaBox = document.querySelector("div.loading-media");
        loadingMediaBox.style.visibility = visible ? "visible" : "hidden";
        if (visible) {
            loadingMediaBox.style.width = "160px";
            loadingMediaBox.style.height = "94px";
            loadingMediaBox.style.marginLeft = "-80px";
            loadingMediaBox.style.marginTop = "-46px";

            let loadingText = loadingMediaBox.querySelector("p");
            if (!loadingText) {
                loadingText = document.createElement("p");
                loadingText.textContent = "Loading archive...";
                loadingMediaBox.appendChild(loadingText);
            }
            loadingText.style.marginLeft = "3.8px";
            loadingText.style.marginTop = "65%";
            loadingText.style.color = "#FFF";
            loadingText.style.background = "rgba(0,0,0,.7)";
        }
    }
    async function setPlayerVideo(videoID, videoSrc) {
        let videoPlayer = getVideoPlayer();
        videoPlayer.setAttribute("poster", `https://i49.vbox7.com/i/${videoID.substr(0, 3)}/${videoID}6.jpg`);
        videoPlayer.style.objectFit = "cover";

        if (videoSrc.endsWith(".mp4")) { // MP4 (legacy video+audio): Fetch the full video directly
            const videoSnapshot = await getEarliestWaybackSnapshotURL(videoSrc);
            if (videoSnapshot) {
                videoPlayer.setAttribute("src", await getVideoFetchBlob(videoSnapshot.url));
                videoPlayer.setAttribute("data-src", videoSnapshot.url);

                addPlayerOpenRawButtons(videoSnapshot.url);
            } else {
                setPlayerError("The video file has not been archived!");
                console.warn('THE VIDEO FILE HAS NOT BEEN ARCHIVED!');
            }
            getAudioPlayer()?.remove();
        } else if (videoSrc.endsWith(".mpd")) { // MPD: Stream the best available video/audio formats
            try {
                const bestFormats = await getBestMPDFormats(videoSrc);
                if (bestFormats.videoURL) {
                    videoPlayer.setAttribute("src", getVideoStreamBlob(bestFormats.videoURL));
                    videoPlayer.setAttribute("data-src", `https://web.archive.org/20060101000000/${videoSrc}`);
                    linkVideoAudioPlayer();

                    addPlayerOpenRawButtons(bestFormats.videoURL, bestFormats.audioURL);
                } else {
                    setPlayerError(`No available video formats! Audio only.`);
                    console.warn('FAILED TO GET VIDEO FORMATS FROM MPD!');
                    unlinkVideoAudioPlayer();
                }
                setAudioPlayerSource(bestFormats.audioURL, !bestFormats.videoURL);
            } catch (error) {
                setPlayerError(`Failed to get/set archived video/audio formats: ${error}`);
                console.warn('FAILED TO GET/SET VIDEO/AUDIO FORMATS FROM MPD:', error);
                return;
            }
        } else {
            setPlayerError(`Unknown video file type!`);
            console.warn(`UNKNOWN VIDEO FILE TYPE! FULL "videoSrc" URL: ${videoSrc}`);
            return;
        }

        setPlayerLoading(false);
        document.querySelector("div.vbox-msgcontainer").style.visibility = "hidden";

        const styleNoStatic = document.createElement('style');
        styleNoStatic.textContent = `
          .static-on {
            display: none !important;
          }`;
        document.head.appendChild(styleNoStatic);

        videoPlayer.play(); // Autoplay
    }
    function setPlayerError(error) {
        setPlayerLoading(false);

        let errorMsgEl = document.createElement("div");
        errorMsgEl.classList.add("vbox-msgcontainer");
        errorMsgEl.id = "#playerErrorMsg";
        errorMsgEl.style.display = "block";
        errorMsgEl.style.marginTop = "20%";
        errorMsgEl.style.fontSize = "150%";

        errorMsgEl.textContent = error;

        document.querySelector("div.vbox-msgcontainer").insertAdjacentElement("afterend", errorMsgEl);
    }
    function addPlayerOpenRawButtons(videoURL, audioURL = null) {
        const controlsDiv = document.querySelector("div.vbox-controls");

        controlsDiv.querySelector("button.vbox-biggen-button").style.marginLeft = "10px";

        if (audioURL) {
            const audioRawButton = document.createElement("button");
            audioRawButton.classList.add("vbox-biggen-button");
            audioRawButton.setAttribute("title", "Open raw audio");
            const audioRawIcon = document.createElement("img");
            audioRawIcon.setAttribute("src", "https://static.thenounproject.com/png/headset-icon-6996835-512.png");
            audioRawIcon.setAttribute("width", "24px");
            audioRawIcon.setAttribute("height", "24px");
            audioRawIcon.style.filter = "invert(1)";
            audioRawButton.appendChild(audioRawIcon);
            controlsDiv.appendChild(audioRawButton);

            audioRawButton.addEventListener("click", function() {
                window.open(audioURL);
            });
        }

        const videoRawButton = document.createElement("button");
        videoRawButton.classList.add("vbox-biggen-button");
        videoRawButton.setAttribute("title", `Open raw video${audioURL ? " (no audio)" : ""}`);
        const videoRawIcon = document.createElement("img");
        videoRawIcon.setAttribute("src", "https://static.thenounproject.com/png/video-icon-1863915-512.png");
        videoRawIcon.setAttribute("width", "24px");
        videoRawIcon.setAttribute("height", "24px");
        videoRawIcon.style.filter = "invert(1)";
        videoRawButton.appendChild(videoRawIcon);
        controlsDiv.appendChild(videoRawButton);

        videoRawButton.addEventListener("click", function() {
            window.open(videoURL);
        });
    }

    /* MAIN */
    async function restoreVideo(videoID, infoFillNeeded = false) {
        setPlayerLoading(true);

        let videoDataSnapshot;
        try {
            videoDataSnapshot = await getEarliestWaybackSnapshotURL(`https://www.vbox7.com/aj/player/item/options?vid=${videoID}`);
        } catch (error) {
            setPlayerError("Not archived: HTTP error fetching archived video info!");
            console.error('HTTP ERROR FETCHING VIDEO OPTIONS:', error);
            return;
        }
        if (!videoDataSnapshot) {
            setPlayerError("Not archived: No available archives of this video!");
            console.warn('NO AVAILABLE ARCHIVES OF THIS VIDEO!');
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: videoDataSnapshot.url,
            responseType: 'json',
            onload: function(response) {
                const data = response.response;
                if (!data || !data.success) {
                    setPlayerError("Not archived: Invalid archive data!");
                    console.warn('INVALID ARCHIVE DATA: "SUCCESS" IS FALSE!');
                    return;
                }

                const opt = data.options;
                if (!opt || !opt.src || opt.src == "blank") {
                    setPlayerError("Not archived: Archive is empty!");
                    console.warn('ARCHIVE IS EMPTY!');
                    return;
                }

                setPlayerVideo(videoID, opt.src);
                if (infoFillNeeded) {
                    document.title = `${opt.title} - Vbox7`;

                    const channelOpt = document.createElement("div");
                    channelOpt.className = "channel-opt";

                    const channelLink = document.createElement("a");
                    channelLink.className = "channel-name";
                    channelLink.href = `/user:${opt.uploader}`;

                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = opt.uploader;

                    channelLink.appendChild(nameSpan);
                    channelOpt.appendChild(channelLink);

                    const title = document.createElement("h1");
                    title.textContent = opt.title;

                    const defCont = document.createElement("div");
                    defCont.id = "def-cont";
                    defCont.className = "det-info collapsed-toggle mb-tgl-only";

                    const videoStat = document.createElement("div");
                    videoStat.className = "video-stat";

                    let uploadDate = convertWaybackTimestampToDate(videoDataSnapshot.timestamp);
                    uploadDate.setUTCSeconds(uploadDate.getUTCSeconds() - opt.ago);

                    const dateSpan = document.createElement("span");
                    dateSpan.textContent = dateToVboxString(uploadDate);

                    videoStat.appendChild(dateSpan);

                    const videoOptions = document.createElement("div");
                    videoOptions.className = "drop-wrap video-options";

                    defCont.append(videoStat, videoOptions);
                    document.querySelector("div.video-info").append(channelOpt, title, defCont);
                }
            },
            onerror: function(error) {
                setPlayerError("Not archived: HTTP error fetching archived video info!");
                console.error('HTTP ERROR FETCHING VIDEO OPTIONS:', error);
            }
        });
    }

    /* INACCESSIBLE VIDEO DETECTION */
    const ageGatedVideoOverrideID = (new URLSearchParams(location.search)).get("ageGatedVideoOverride");
    if (ageGatedVideoOverrideID) {
        const contentWrapDiv = document.querySelector("section.play-grid div.item-content-wrap");

        // Remove traces of placeholder video info
        document.title = "Vbox7";
        document.querySelector("div.vbox-msgcontainer").style.visibility = "hidden";
        contentWrapDiv.querySelector("div.player.area").innerHTML = "";

        // Add video info <div>
        let videoInfoDiv = document.createElement("div");
        videoInfoDiv.classList.add("video-info");
        contentWrapDiv.appendChild(videoInfoDiv);

        // Include a warning under age-restricted videos
        let ageGateWarning = document.createElement("h3");
        ageGateWarning.textContent = "This video may be inappropriate for some users!";
        ageGateWarning.style.textAlign = "center";
        ageGateWarning.style.color = "red";
        videoInfoDiv.appendChild(ageGateWarning);

        restoreVideo(ageGatedVideoOverrideID, true);
    } else {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._isPlayerOptions = url.startsWith("/aj/player/item/options?vid=");
            if (this._isPlayerOptions) {
                this._videoID = url.split('=')[1];
            }
            return originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
            if (this._isPlayerOptions) {
                this.addEventListener('readystatechange', function() {
                    if (this.readyState !== 4) return;

                    if (this.status < 200 || this.status >= 300) {
                        console.error("UNSUCCESSFUL PLAYER OPTIONS REQUEST! WILL TRY RESTORING FROM ARCHIVE!");
                        restoreVideo(this._videoID);
                        return;
                    }
                    try {
                        const data = JSON.parse(this.responseText);
                        if (!data.success) {
                            console.error("UNSUCCESSFUL PLAYER OPTIONS REQUEST RESPONSE! WILL TRY RESTORING FROM ARCHIVE!");
                            restoreVideo(this._videoID);
                            return;
                        }
                        if (!data.options || !data.options.src || data.options.src == "blank") {
                            console.warn("VIDEO NOT AVAILABLE! HAVE TO RESTORE FROM ARCHIVE!");
                            restoreVideo(this._videoID);
                        }
                    } catch (error) {
                        console.error('FAILED TO PARSE PLAYER OPTIONS REQUEST JSON RESPONSE! WILL TRY RESTORING FROM ARCHIVE!', error);
                        restoreVideo(this._videoID);
                    }
                });
            }
            return originalSend.apply(this, arguments);
        };
    }

    /* HANDLE PLAY PAGE REFRESH */
    // The page should refresh going from one play page to another,
    // as the video player doesn't properly refresh going from inaccessible to accessible video.
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(onRouteChange, 0);
    };
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(onRouteChange, 0);
    };
    window.addEventListener('popstate', onRouteChange); // Navigation back/forward

    let lastPath = location.pathname;
    function onRouteChange() {
        if (location.pathname !== lastPath && lastPath.startsWith('/play:') && location.pathname.startsWith('/play:')) {
            location.reload();
        }
        lastPath = location.pathname;
    }
})();