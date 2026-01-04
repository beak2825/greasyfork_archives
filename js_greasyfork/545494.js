// ==UserScript==
// @name         YouTube - Enable DVR for Live Stream
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-15
// @description  enable DVR, and avoid ads.
// @author       ぐらんぴ
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://greasyfork.org/scripts/433051-trusted-types-helper/code/Trusted-Types%20Helper.js
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.4.12
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545494/YouTube%20-%20Enable%20DVR%20for%20Live%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/545494/YouTube%20-%20Enable%20DVR%20for%20Live%20Stream.meta.js
// ==/UserScript==

const originalPlay = HTMLVideoElement.prototype.play;

let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el);
let m3u8, video, c;

unsafeWindow.addEventListener("yt-navigate-finish", e => {
    console.log(e.detail.pageType)
    if(e.detail.pageType == "watch"){
        if($s('#GRMP')) location.reload();
        if(e.detail.response?.playerResponse?.videoDetails?.isLive){
            if(!m3u8) location.reload();

            HTMLVideoElement.prototype.play = function () {
                if(this.id !== "GRMP"){
                    this.pause()
                    this.remove()
                }
                console.log("Video play hooked!", this);
                return originalPlay.apply(this, arguments);
            };
            try{
                const intervalId = setInterval(() => {
                    c = $s('ytd-player > #container')
                    if(!c) return;
                    clearInterval(intervalId);

                    video = $s('.video-stream.html5-main-video')
                    mirrorVideo.pause(); mirrorVideo.src = ""; mirrorVideo.load();
                    
                    $s('#ytd-player').appendChild(mirrorVideo);
                },500)
                }catch{}

            setTimeout(()=>{ loadHlsJs(() => playM3u8Stream(mirrorVideo, m3u8))}, 1000)
        }
    }else if($s('#GRMP')) location.reload();
});

Object.defineProperty(unsafeWindow, 'ytInitialPlayerResponse', {
    set(v) {
        this._V = v;
        try{
            if(v.videoDetails.isLive){
                m3u8 = v.streamingData.hlsManifestUrl
            }
        }catch{}
    },
    get() {
        return this._V;
    },
    configurable: true,
    enumerable: false
});

let mirrorVideo = $c('video');
mirrorVideo.id = "GRMP";
mirrorVideo.controls = true;
mirrorVideo.style.width = "100%";
mirrorVideo.style.height = "100%";
mirrorVideo.style.zIndex = '9999';

function loadHlsJs(callback) {
    if (unsafeWindow.Hls) {
        callback();
        return;
    }
    const script = $c('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    document.head.appendChild(script);
}

function playM3u8Stream(videoElement, m3u8Url) {
    if(typeof Hls !== 'undefined' && Hls.isSupported()){
        const hls = new Hls();
        /*
        const hls = new Hls({
            debug: true,
        });
        */

        hls.on(Hls.Events.ERROR, (event, data) => {
            if(data.fatal) { hls.destroy() }
        });

        hls.loadSource(m3u8Url);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed successfully');
            videoElement.play().catch(err => {
                console.error('Playback failed:', err.message);
                setTimeout(()=>{
                    playM3u8Stream(videoElement, m3u8Url)
                },2000)
            });
        });

    }else if (videoElement.canPlayType('application/vnd.apple.mpegurl')){
        videoElement.src = m3u8Url;
        videoElement.play().catch(err => console.error('Playback failed:', err));
    }else{
        alert('HLS is not supported in this browser');
    }
}

window.onload = () => {
    if(!m3u8) return;
    const observer = new MutationObserver((ms, obs) => {
        try{
            const targetEl = $s('.html5-video-player');

            if(targetEl){
                console.log(targetEl)
                setTimeout(()=>{
                    targetEl.parentElement.remove()
                }, 3000)
                obs.disconnect();
            }
        }catch{}
    });

    observer.observe(document.body, {//document.body
        childList: true,
        subtree: true,
    });
}
