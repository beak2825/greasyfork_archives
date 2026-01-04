// ==UserScript==
// @name         CHZZK - TimeMachine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  testing
// @author       ぐらんぴ
// @match        https://chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545122/CHZZK%20-%20TimeMachine.user.js
// @updateURL https://update.greasyfork.org/scripts/545122/CHZZK%20-%20TimeMachine.meta.js
// ==/UserScript==

const log = console.log;
let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el);
let recordedBlobs = [], mediaRecorder = null, m3u8Url = null, m3u8;

const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    if(args[0].className == "webplayer-internal-video"){
        try{
            GM_setValue("latest_m3u8", null);
            getM3u8()
            setTimeout(()=>{ setVideo() },1000)
        }catch{}
    }
    return origAppendChild.apply(this, args);
}
function getM3u8(){
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            try {
                const url = this.responseURL;
                if (url && url.includes(".m3u8")) {
                    m3u8 = url;
                    GM_setValue("latest_m3u8", m3u8);
                    log("Detected m3u8:", m3u8);
                }
            } catch (e) {
                console.error("Error detecting m3u8:", e);
            }
        });
        return origSend.apply(this, arguments);
    };
}

function setVideo(){
    setTimeout(() => {
        const m3u8Url = GM_getValue("latest_m3u8");
        if (!m3u8Url) return;

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.onload = () => {
            const video = document.createElement("video");
            video.controls = true;
            video.style.width = "100%";
            video.style.height = "100%";
            $s('.webplayer-internal-source-wrapper > video').remove();
            $s('.webplayer-internal-source-wrapper').appendChild(video);

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(m3u8Url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.play();

                    // 🎥 MediaRecorderで録画開始
                    const stream = video.captureStream();
                    recordedBlobs = [];
                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            recordedBlobs.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
                        const recordedUrl = URL.createObjectURL(superBuffer);

                        // 🎬 録画済み動画を再生可能にする
                        const playbackVideo = document.createElement("video");
                        playbackVideo.controls = true;
                        playbackVideo.src = recordedUrl;
                        playbackVideo.style.width = "100%";
                        playbackVideo.style.height = "100%";

                        // 既存プレイヤーを置き換え
                        video.replaceWith(playbackVideo);
                        playbackVideo.play();
                    };

                    mediaRecorder.start();

                    // ⏹️ 任意のタイミングで録画停止（例: 30秒後）
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 30000); // 30秒録画
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = m3u8Url;
                video.addEventListener('loadedmetadata', function() {
                    video.play();
                });
            } else {
                console.error("HLS not supported");
            }
        };
        document.body.appendChild(script);
    }, 3000);
}

GM_addStyle(`
.pzp-pc__bottom { display: none }
.webplayer-internal-source-wrapper {
    z-index: 999;
}
`);