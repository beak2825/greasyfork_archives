// ==UserScript==
// @name         Twitch - Recorder
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-11-14
// @description  Records live Twitch streams directly from the browser
// @author       ぐらんぴ
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544542/Twitch%20-%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/544542/Twitch%20-%20Recorder.meta.js
// ==/UserScript==

// Settigns
let S = {
    bitsPerSecond: 20000000,
}

let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el)
let recorder, chunks = [], isRecording = false, seconds = 0, timerInterval, log = console.log;

function supportsFileSystemAccess() {
    return ('showSaveFilePicker' in window) || ('chooseFileSystemEntries' in window);
}

const origAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if(type === "loadstart"){
        const recordWrapper = function(e){
            if(location.href == "https://www.twitch.tv/") return;
            record();
        };
        origAddEventListener.call(this, type, recordWrapper, options);
    }
    return origAddEventListener.call(this, type, listener, options);
};

function record(){
    let awaitAddon = setInterval(() => {
        let addon = $s(".player-controls__right-control-group")
        clearInterval(awaitAddon);

        let btn = $c('button');
        btn.textContent = ` [RECORD]`;
        btn.className = "GRMP";
        btn.style.color = "red";
        btn.style.cursor = "pointer";

        let fileWritable = null;
        let fileHandle = null;
        let writerLock = null;
        let usingFileSystem = false;

        async function prepareFileSystem() {
            try {
                if ('showSaveFilePicker' in window) {
                    fileHandle = await window.showSaveFilePicker({
                        suggestedName: getSuggestedFilename(),
                        types: [{ description: 'WebM', accept: { 'video/webm': ['.webm'] } }]
                    });
                    fileWritable = await fileHandle.createWritable();
                    usingFileSystem = true;
                } else if ('chooseFileSystemEntries' in window) {
                    // older spec fallback (Chrome M89以前の実装)
                    fileHandle = await window.chooseFileSystemEntries({ type: 'save-file', accepts: [{ description: 'WebM', extensions: ['webm'], mimeTypes: ['video/webm'] }] });
                    fileWritable = await fileHandle.createWriter();
                    usingFileSystem = true;
                } else {
                    usingFileSystem = false;
                }
            } catch (err) {
                console.warn("File picker cancelled or failed:", err);
                usingFileSystem = false;
            }
        }

        function getSuggestedFilename() {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            let name = location.pathname.slice(1) || 'record';
            try {
                let title = $s('[data-a-target="stream-title"]').textContent || 'stream';
                if (location.pathname.startsWith('/videos/')) {
                    let videoId = location.pathname.replace('/videos/', '');
                    return ($s('h1.tw-title')?.textContent || name) + "_" + title + "_" + videoId + ".webm";
                } else {
                    return name + "_" + title + "_" + month + "-" + day + ".webm";
                }
            } catch (e) {
                return name + "_" + month + "-" + day + ".webm";
            }
        }

        btn.addEventListener("click", async () => {
            const video = $s("video");
            if(!video){
                alert("Video element not found.");
                return;
            }

            if(video.paused || video.readyState < 3){
                video.play().catch(err => console.warn("Video play failed:", err));
            }

            if (!isRecording) {
                try {
                    let stream;
                    let recorderStream;

                    const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
                    const isChromium = !isFirefox && /Chrome|Chromium|Edg|OPR/.test(navigator.userAgent);

                    if (isChromium && supportsFileSystemAccess()) {
                        await prepareFileSystem();
                    }

                    if (isFirefox) {
                        const audioCtx = new AudioContext();
                        const sourceNode = audioCtx.createMediaElementSource(video);
                        const destinationNode = audioCtx.createMediaStreamDestination();

                        sourceNode.connect(audioCtx.destination);
                        sourceNode.connect(destinationNode);

                        stream = video.mozCaptureStream();

                        recorderStream = new MediaStream([
                            ...stream.getVideoTracks(),
                            ...destinationNode.stream.getAudioTracks()
                        ]);
                    } else {
                        recorderStream = video.captureStream();
                    }

                    if (!recorderStream) {
                        alert("Failed to capture stream");
                        return;
                    }

                    const mime = 'video/webm;codecs=vp9,opus';
                    const options = MediaRecorder.isTypeSupported(mime) ? { mimeType: mime, bitsPerSecond: S.bitsPerSecond } : undefined;
                    recorder = new MediaRecorder(recorderStream, options);

                    const timeslice = 1000;

                    if (usingFileSystem && fileWritable) {
                        recorder.ondataavailable = async (e) => {
                            if (!e.data || e.data.size === 0) return;
                            try {
                                const ab = await e.data.arrayBuffer();
                                await fileWritable.write(new Uint8Array(ab));
                            } catch (err) {
                                console.error('Write chunk failed:', err);
                            }
                        };
                        recorder.onstop = async () => {
                            clearInterval(timerInterval);
                            btn.textContent = ` [RECORD]`;
                            try {
                                await fileWritable.close();
                            } catch (err) {
                                try { if (fileWritable && fileWritable.close) await fileWritable.close(); } catch (e) {}
                            }
                            isRecording = false;
                        };
                    } else {
                        chunks = [];
                        recorder.ondataavailable = e => {
                            if (e.data && e.data.size > 0) chunks.push(e.data);
                        };
                        recorder.onstop = () => {
                            clearInterval(timerInterval);
                            btn.textContent = ` [RECORD]`;

                            const blob = new Blob(chunks, { type: 'video/webm' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = getSuggestedFilename();
                            a.click();

                            chunks = [];
                            setTimeout(() => URL.revokeObjectURL(url), 10000);
                            isRecording = false;
                        };
                    }

                    recorder.start(timeslice);
                    isRecording = true;
                    seconds = 0;
                    btn.textContent = formatTime(seconds);

                    timerInterval = setInterval(() => {
                        seconds++;
                        btn.textContent = formatTime(seconds);
                    }, 1000);

                } catch (e) {
                    alert("Recording failed: " + e);
                    console.error(e);
                }
            } else {
                try {
                    recorder.stop();
                } catch (e) {
                    console.warn("recorder.stop() failed:", e);
                }
                clearInterval(timerInterval);
                btn.textContent = ` [RECORD]`;
            }
        });

        if(!$s('.GRMP') && addon) addon.appendChild(btn);

        function formatTime(sec){
            const m = String(Math.floor(sec / 60)).padStart(2, '0');
            const s = String(sec % 60).padStart(2, '0');
            return ` [${m}:${s}]`;
        }
    }, 500);
}