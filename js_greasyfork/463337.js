// ==UserScript==
// @name         Unlimited_downloader
// @name:zh-CN   无限制下载器
// @namespace    ooooooooo.io
// @version      0.1.8
// @description  Get video and audio binary streams directly, breaking all download limitations. (As long as you can play, then you can download!)
// @description:zh-Cn  直接获取视频和音频二进制流，打破所有下载限制。（只要你可以播放，你就可以下载！）
// @author       dabaisuv
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463337/Unlimited_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/463337/Unlimited_downloader.meta.js
// ==/UserScript==

(function () {
   'use strict';
   console.log(`Unlimited_downloader: begin......${location.href}`);


   //Setting it to 1 will automatically download the video after it finishes playing.
   window.autoDownload = 1;
   
   
   window.isComplete = 0;
   window.audio = [];
   window.video = [];
   window.downloadAll = 0;
   window.quickPlay = 1.0;

   const _endOfStream = window.MediaSource.prototype.endOfStream
   window.MediaSource.prototype.endOfStream = function () {
      window.isComplete = 1;
      return _endOfStream.apply(this, arguments)
   }
   window.MediaSource.prototype.endOfStream.toString = function() {
       onsole.log('endOfStream hook is detecting!');
      return _endOfStream.toString();
   }

   const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
   window.MediaSource.prototype.addSourceBuffer = function (mime) {
      console.log("MediaSource.addSourceBuffer ", mime)
      if (mime.toString().indexOf('audio') !== -1) {
         window.audio = [];
         console.log('audio array cleared.');
      } else if (mime.toString().indexOf('video') !== -1) {
         window.video = [];
         console.log('video array cleared.');
      }
      let sourceBuffer = _addSourceBuffer.call(this, mime)
      const _append = sourceBuffer.appendBuffer
      sourceBuffer.appendBuffer = function (buffer) {
         console.log(mime, buffer);
         if (mime.toString().indexOf('audio') !== -1) {
            window.audio.push(buffer);
         } else if (mime.toString().indexOf('video') !== -1) {
            window.video.push(buffer)
         }
         _append.call(this, buffer)
      }

      sourceBuffer.appendBuffer.toString = function () {
         console.log('appendSourceBuffer hook is detecting!');
         return _append.toString();
      }
      return sourceBuffer
   }

   window.MediaSource.prototype.addSourceBuffer.toString = function () {
      console.log('addSourceBuffer hook is detecting!');
      return _addSourceBuffer.toString();
   }

   function download() {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob(window.audio));
      a.download = 'audio_' + document.title + '.mp4';
      a.click();
      a.href = window.URL.createObjectURL(new Blob(window.video));
      a.download = 'video_' + document.title + '.mp4';
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
      //     console.log(blobUrl);
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

   (function (that) {
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




   // Your code here...
})();
