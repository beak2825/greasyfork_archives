// ==UserScript==
// @name         YouTube - Recorder
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-12-09
// @description  Records YouTube live streams and videos directly from the browser
// @author       ぐらんぴ
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/433051-trusted-types-helper/code/Trusted-Types%20Helper.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544565/YouTube%20-%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/544565/YouTube%20-%20Recorder.meta.js
// ==/UserScript==

let S = {
    bitsPerSecond: 20000000, // default 20 Mbps
    format: 'mp4' // 'webm' or 'mp4'
};

let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el)
let recorder, chunks, isRecording = false, seconds = 0, timerInterval;

window.addEventListener("yt-navigate-finish", e => {
    if (e.detail.pageType == "watch") {
        let btn = $c('button');
        btn.textContent = ` [RECORD]`;
        btn.className = "GRMP";
        btn.style.cursor = "pointer";
        btn.style.color = "white";
        btn.style.background = "none";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            const video = $s("video");
            if (!video) {
                alert("Video element not found.");
                return;
            }

            if (video.paused || video.readyState < 3) {
                video.play().catch(err => console.warn("Video play failed:", err));
            }

            if (!isRecording) {
                try {
                    let stream;
                    let recorderStream;

                    if (navigator.userAgent.indexOf('Firefox') > -1) { // Firefox
                        const audioCtx = new AudioContext();
                        const sourceNode = audioCtx.createMediaElementSource(video);
                        const destinationNode = audioCtx.createMediaStreamDestination();

                        sourceNode.connect(audioCtx.destination); // keep audio playback
                        sourceNode.connect(destinationNode);      // send to recorder

                        stream = video.mozCaptureStream ? video.mozCaptureStream() : video.captureStream();

                        recorderStream = new MediaStream([
                            ...stream.getVideoTracks(),
                            ...destinationNode.stream.getAudioTracks()
                        ]);
                    } else { // Chromium
                        recorderStream = video.captureStream();
                    }

                    if (!recorderStream) {
                        alert("Failed to capture stream");
                        return;
                    }

                    // MIME 候補（MP4 を優先する場合と WEBM のみ）
                    const mp4Candidates = [
                        'video/mp4;codecs="avc1.42E01E, mp4a.40.2"',
                        'video/mp4;codecs="avc1.42E01E"',
                        'video/mp4'
                    ];
                    const webmCandidates = [
                        'video/webm;codecs=vp9,opus',
                        'video/webm;codecs=vp8,opus',
                        'video/webm'
                    ];

                    // format 設定に基づいて MIME を選択
                    let mime = null;
                    function chooseMimeByFormat(format) {
                        try {
                            if (format === 'mp4') {
                                for (const m of mp4Candidates) {
                                    try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m; } catch (e) {}
                                }
                                // mp4 がサポートされない場合は webm を試す（フォールバック）
                                for (const m of webmCandidates) {
                                    try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m; } catch (e) {}
                                }
                                return null;
                            } else { // 'webm' 指定
                                for (const m of webmCandidates) {
                                    try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m; } catch (e) {}
                                }
                                return null;
                            }
                        } catch (e) {
                            return null;
                        }
                    }

                    mime = chooseMimeByFormat(String(S.format || 'webm').toLowerCase());

                    // ユーザーに通知: MP4 を要求したがサポートされない場合
                    if (String(S.format || 'webm').toLowerCase() === 'mp4') {
                        // mp4 を要求したが mime が webm になった場合は通知
                        const mp4Supported = (function () {
                            try {
                                for (const m of mp4Candidates) {
                                    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return true;
                                }
                            } catch (e) {}
                            return false;
                        })();
                        if (!mp4Supported) {
                            // mp4 未サポート。ユーザーに知らせる（だが録画は続行）
                            console.warn('Browser does not support MediaRecorder MP4 output. Falling back to WebM.');
                        }
                    }

                    const options = mime
                    ? { mimeType: mime, bitsPerSecond: Number(S.bitsPerSecond) || undefined }
                    : (Number(S.bitsPerSecond) ? { bitsPerSecond: Number(S.bitsPerSecond) } : undefined);

                    recorder = options ? new MediaRecorder(recorderStream, options) : new MediaRecorder(recorderStream);
                    chunks = [];

                    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
                    recorder.onstop = () => {
                        clearInterval(timerInterval);
                        btn.textContent = ` [RECORD]`;

                        // 実際のチャンクから Blob を作成（MIME は最初のチャンクの type を参照）
                        const blobType = (chunks[0] && chunks[0].type) ? chunks[0].type : (mime || 'video/webm');
                        const blob = new Blob(chunks, { type: blobType });

                        // 拡張子決定: 実際の blob.type を優先、なければ S.format を参照
                        let ext = 'webm';
                        if (blob.type.includes('mp4') || blob.type.includes('x-m4v') || blob.type.includes('quicktime')) ext = 'mp4';
                        else if (blob.type.includes('webm')) ext = 'webm';
                        else {
                            // blob.type が空や不明な場合は S.format を参照
                            ext = (String(S.format || 'webm').toLowerCase() === 'mp4') ? 'mp4' : 'webm';
                        }

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;

                        const now = new Date();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');

                        try {
                            a.download = location.search.slice(3) + "_" + month + "-" + day + "." + ext;
                        } catch (e) {
                            a.download = location.hostname + "_" + month + "-" + day + "." + ext;
                        }
                        a.click();

                        setTimeout(() => URL.revokeObjectURL(url), 10000);

                        // もしユーザーが MP4 を期待していて実際は WEBM だった場合、簡単な案内を表示
                        if (String(S.format || 'webm').toLowerCase() === 'mp4' && ext !== 'mp4') {
                            // 一度だけ表示（console と alert）
                            console.warn('Requested MP4 but recorded format is not MP4.');
                        }
                    };

                    recorder.start();
                    isRecording = true;
                    seconds = 0;
                    btn.textContent = formatTime(seconds);

                    timerInterval = setInterval(() => {
                        seconds++;
                        btn.textContent = formatTime(seconds);
                    }, 1000);
                } catch (e) { alert("Recording failed: " + e); }
            } else {
                recorder.stop();
                isRecording = false;
                clearInterval(timerInterval);
                btn.textContent = ` [RECORD]`;
            }
        });
        if (!$s('.GRMP')) {
            if ($s('.ytp-right-controls') == null) {
                const intervalId = setInterval(() => {
                    console.log('a')
                    if (!$s('.ytp-right-controls')) return;
                    clearInterval(intervalId);
                    $s('.ytp-right-controls').appendChild(btn);
                }, 500);
            } else $s('.ytp-right-controls').appendChild(btn);
        }
        function formatTime(sec) {
            const m = String(Math.floor(sec / 60)).padStart(2, '0');
            const s = String(sec % 60).padStart(2, '0');
            return ` [${m}:${s}]`;
        }
    }
});