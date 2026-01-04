// ==UserScript==
// @name         CHZZK - Recorder (HLS)
// @name:en      CHZZK - Recorder (HLS)
// @name:ko      치지직 - 레코더 (HLS)
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-12-09
// @description  Records live Chzzk streams directly from the browser
// @description:en Records live Chzzk streams directly from the browser
// @description:ko 브라우저에서 직접 Chzzk 라이브 스트림을 녹화합니다.
// @author       ぐらんぴ
// @match        https://*.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544417/CHZZK%20-%20Recorder%20%28HLS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544417/CHZZK%20-%20Recorder%20%28HLS%29.meta.js
// ==/UserScript==

let S = {
    bitsPerSecond: 20000000, // default 20 Mbps
    format: 'mp4'           // 'webm' or 'mp4'
};

let $S = el => document.querySelector(el), $SA = el => document.querySelectorAll(el), $C = el => document.createElement(el)
let recorder, chunks, isRecording = false, seconds = 0, timerInterval;

function observeUrlChanges(){
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
        if(location.href !== lastUrl){
            lastUrl = location.href;
            checkPageChange();
        }
    });

    observer.observe(document.body, { subtree: true, childList: true, });

    window.addEventListener('hashchange', () => {
        if(location.href !== lastUrl){
            lastUrl = location.href;
            checkPageChange();
        }
    });
}
// ページ変更チェック
function checkPageChange(){
    record()
}
// 初期実行 & 監視開始
function record(){
    let awaitAddon = setInterval(() => {
        if(!$S(".video_information_control__UTm8Z")) return;
        clearInterval(awaitAddon);
        let addon = $S(".video_information_control__UTm8Z")

        let btn = $C('button');
        btn.textContent = ` [RECORD]`;
        btn.className = "GRMP";
        btn.style.color = "white";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            const video = $S("video");
            if(!video){
                alert("Video element not found.");
                return;
            }

            if(video.paused || video.readyState < 3){
                video.play().catch(err => console.warn("Video play failed:", err));
            }

            if(!isRecording){
                try{
                    let stream;
                    let recorderStream;

                    if(navigator.userAgent.indexOf('Firefox') > -1){ // Firefox
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
                    }else{ // Chrome/Edge
                        recorderStream = video.captureStream();
                    }

                    if(!recorderStream){
                        alert("Failed to capture stream");
                        return;
                    }

                    // MIME 候補を format に応じて選択
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

                    let mime = null;
                    const preferred = String(S.format || 'webm').toLowerCase();

                    try {
                        if (preferred === 'mp4') {
                            // mp4 を試し、なければ webm にフォールバック
                            for (const m of mp4Candidates) {
                                try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {}
                            }
                            if (!mime) {
                                for (const m of webmCandidates) {
                                    try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {}
                                }
                            }
                        } else {
                            // webm を優先、なければ mp4 を試す
                            for (const m of webmCandidates) {
                                try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {}
                            }
                            if (!mime) {
                                for (const m of mp4Candidates) {
                                    try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {}
                                }
                            }
                        }
                    } catch (e) {
                        mime = null;
                    }

                    // MP4 を要求したがブラウザが未対応ならユーザーに通知（続行は可能）
                    if (preferred === 'mp4') {
                        const mp4Supported = (function () {
                            try {
                                for (const m of mp4Candidates) {
                                    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return true;
                                }
                            } catch (e) {}
                            return false;
                        })();
                        if (!mp4Supported) {
                            console.warn('Requested MP4 but MediaRecorder MP4 is not supported.');
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

                        // 実際のチャンクの MIME を優先して Blob を作成
                        const actualType = (chunks[0] && chunks[0].type) ? chunks[0].type : (mime || 'video/webm');
                        const blob = new Blob(chunks, { type: actualType });

                        // 拡張子決定: 実際の blob.type を優先、なければ S.format を使う
                        let ext = 'webm';
                        if (blob.type && blob.type.includes('mp4')) ext = 'mp4';
                        else if (blob.type && blob.type.includes('webm')) ext = 'webm';
                        else {
                            ext = (String(S.format || 'webm').toLowerCase() === 'mp4') ? 'mp4' : 'webm';
                        }

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;

                        // filename
                        const now = new Date();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        try{
                            let name = $S('.name_text__yQG50').textContent
                            let title = $S('.video_information_title__jrLfG').textContent

                            if(location.pathname.startsWith('/video/')){// archive
                                a.download = name + "_" + title + "_" + location.pathname.slice(7) + "." + ext;
                            }else{// live
                                a.download = name + "_" + title + "_" + month + "-" + day + "." + ext;
                            }
                        }catch(e){ //alert('Could not get filename', e)
                            a.download = location.pathname.replace(/\//g,'_') + "_" + month + "-" + day + "." + ext;
                        };
                        a.click();

                        // 警告: ユーザーが MP4 を期待していて実際は WebM が保存された場合の案内
                        if (String(S.format || 'webm').toLowerCase() === 'mp4' && ext !== 'mp4') {
                            console.warn('Requested MP4 but recorded file is not MP4.');
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
                }catch(e){ alert("Recording failed: " + e);
                         }
            }else{
                recorder.stop();
                isRecording = false;
                clearInterval(timerInterval);
                btn.textContent = ` [RECORD]`;
            }
        });
        if(!$S('.GRMP')) addon.appendChild(btn);

        function formatTime(sec){
            const m = String(Math.floor(sec / 60)).padStart(2, '0');
            const s = String(sec % 60).padStart(2, '0');
            return ` [${m}:${s}]`;
        }
    }, 500);
}record()
observeUrlChanges();