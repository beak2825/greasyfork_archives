// ==UserScript==
// @name         video-snapshot
// @namespace    https://ciffelia.com/
// @version      1.0.1
// @description  Capture video snapshot
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @license      MIT
// @homepage     https://github.com/ciffelia/video-snapshot#readme
// @supportURL   https://github.com/ciffelia/video-snapshot/issues
// @include      *
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/384171/video-snapshot.user.js
// @updateURL https://update.greasyfork.org/scripts/384171/video-snapshot.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const createCanvasFromVideo = videoElm => {
    const canvasElm = document.createElement('canvas');
    canvasElm.width = videoElm.videoWidth;
    canvasElm.height = videoElm.videoHeight;

    const ctx = canvasElm.getContext('2d');
    ctx.drawImage(videoElm, 0, 0, videoElm.videoWidth, videoElm.videoHeight);

    return canvasElm
  };

  const downloadBlob = (blob, filename) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const capture = () => {
    const video = document.querySelector('video');

    const canvas = createCanvasFromVideo(video);

    canvas.toBlob(blob => {
      downloadBlob(blob, 'snapshot.png');
    });
  };

  GM_registerMenuCommand('Capture video snapshot', capture, 'c');

}());
