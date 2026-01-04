// ==UserScript==
// @name         Unlimited Downloader
// @version      1.0.0
// @description  Unlimited Downloader X
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1022733
// @downloadURL https://update.greasyfork.org/scripts/459532/Unlimited%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/459532/Unlimited%20Downloader.meta.js
// ==/UserScript==

// https://github.com/dabaisuv/Tampermonkey-Script/blob/main/Unlimited_downloader.js
(function() {
    'use strict';
    console.log(`Unlimited Downloader: ${location.href}`);

    window.autoDownload = 1;

    window.isComplete = 0;
    window.audio = [];
    window.video = [];
    window.downloadAll = 0;
    window.quickPlay = 1.0;

    const _endOfStream = window.MediaSource.prototype.endOfStream
    window.MediaSource.prototype.endOfStream = function() {
        window.isComplete = 1;
        return _endOfStream.apply(this, arguments)
    }
    window.MediaSource.prototype.endOfStream.toString = function() {
        return _endOfStream.toString();
    }

    const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
    window.MediaSource.prototype.addSourceBuffer = function(mime) {
        if (mime.toString().indexOf('audio') !== -1) {
            window.audio = [];
        } else if (mime.toString().indexOf('video') !== -1) {
            window.video = [];
        }
        let sourceBuffer = _addSourceBuffer.call(this, mime)
        const _append = sourceBuffer.appendBuffer
        sourceBuffer.appendBuffer = function(buffer) {
            if (mime.toString().indexOf('audio') !== -1) {
                window.audio.push(buffer);
            } else if (mime.toString().indexOf('video') !== -1) {
                window.video.push(buffer)
            }
            _append.call(this, buffer)
        }

        sourceBuffer.appendBuffer.toString = function() {
            return _append.toString();
        }
        return sourceBuffer
    }

    window.MediaSource.prototype.addSourceBuffer.toString = function() {
        return _addSourceBuffer.toString();
    }

    function download() {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob(window.audio));
        a.download = 'Audio_' + document.title + '.mp4';
        a.click();
        a.href = window.URL.createObjectURL(new Blob(window.video));
        a.download = 'Video_' + document.title + '.mp4';
        a.click();
        window.downloadAll = 0;
        window.isComplete = 0;


        // window.open(window.URL.createObjectURL(new Blob(window.audio)));
        // window.open(window.URL.createObjectURL(new Blob(window.video)));
        // window.downloadAll = 0

        // GM_download(window.URL.createObjectURL(new Blob(window.audio)));
        // GM_download(window.URL.createObjectURL(new Blob(window.video)));
        // window.isComplete = 0;

        // const { createFFmpeg } = FFmpeg;
        // const ffmpeg = createFFmpeg({ log: true });
        // (async () => {
        //     const { audioName } = new File([new Blob(window.audio)], 'audio');
        //     const { videoName } = new File([new Blob(window.video)], 'video')
        //     await ffmpeg.load();
        //     //ffmpeg -i audioLess.mp4 -i sampleAudio.mp3 -c copy output.mp4
        //     await ffmpeg.run('-i', audioName, '-i', videoName, '-c', 'copy', 'output.mp4');
        //     const data = ffmpeg.FS('readFile', 'output.mp4');
        //     let a = document.createElement('a');
        //     let blobUrl = new Blob([data.buffer], { type: 'video/mp4' })
        //     a.href = URL.createObjectURL(blobUrl);
        //     a.download = 'output.mp4';
        //     a.click();
        // })()
        // window.downloadAll = 0;
    }

    setInterval(() => {
        if (window.downloadAll === 1) {
            download();
        }
    }, 2000);

    //    setInterval(() => {
    //        if(window.quickPlay !==1.0){
    //              document.querySelector('video').playbackRate = window.quickPlay;
    // }
    //
    //   }, 2000);

    if (window.autoDownload === 1) {
        let autoDownInterval = setInterval(() => {
            //document.querySelector('video').playbackRate = 16.0;
            if (window.isComplete === 1) {
                download();
            }
        }, 2000);
    }

    (function(that) {
        let removeSandboxInterval = setInterval(() => {
            if (that.document.querySelectorAll('iframe')[0] !== undefined) {
                that.document.querySelectorAll('iframe').forEach((v, i, a) => {
                    let ifr = v;
                    // ifr.sandbox.add('allow-popups');
                    ifr.removeAttribute('sandbox');
                    const parentElem = that.document.querySelectorAll('iframe')[i].parentElement;
                    a[i].remove();
                    parentElem.appendChild(ifr);
                });
                clearInterval(removeSandboxInterval);
            }
        }, 1000);
    })(window);

})();