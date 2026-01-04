// ==UserScript==
// @name        截取视频帧
// @namespace   Gizeta.Debris.ExtractNextVideoFrame
// @match       *://*/*
// @grant       none
// @version     0.3.0
// @author      Gizeta
// @description 2022/2/10 03:56:42
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/439792/%E6%88%AA%E5%8F%96%E8%A7%86%E9%A2%91%E5%B8%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/439792/%E6%88%AA%E5%8F%96%E8%A7%86%E9%A2%91%E5%B8%A7.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const LAYER_ID = '--video-frame-preview-layer';
const LAYER_CANVAS_ID = `${LAYER_ID}-canvas`;
const LAYER_TIME_ID = `${LAYER_ID}-time`;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 720;
const MAX_FRAME_COUNT = 30;

const isInIframe = self != top;

let videoFrames;
let videoElem;
let currentTime;
let frameIndex = 0;
let processWithPause = true;
let findVideo = function() {
  return document.querySelector('video');
}

function hideLayer() {
  if (isInIframe) {
    videoElem.currentTime = currentTime;
    window.parent.postMessage({
      event: 'hideLayer',
    }, '*');
    return;
  }
  const layer = document.getElementById(LAYER_ID);
  layer.style.display = 'none';
  videoElem.currentTime = currentTime;
}

function createLayer() {
  if (isInIframe) {
    window.parent.postMessage({
      event: 'createLayer',
    }, '*');
    return;
  }
  if (!document.getElementById(LAYER_ID)) {
    const layer = document.createElement('div');
    document.body.appendChild(layer);
    layer.outerHTML = `<div id="${LAYER_ID}" style="${[
        "position: fixed",
        "width: 100vw",
        "height: 100vh",
        "top: 0",
        "left: 0",
        "z-index: 99999",
        "background: rgba(0, 0, 0, .8)",
      ].join(';')}">
      <canvas width="960" height="720" id="${LAYER_CANVAS_ID}" style="${[
        "position: fixed",
        `width: ${CANVAS_WIDTH}px`,
        `height: ${CANVAS_HEIGHT}px`,
        `top: calc(50vh - ${CANVAS_HEIGHT / 2}px)`,
        `left: calc(50vw - ${CANVAS_WIDTH / 2}px - 50px)`,
        "background: black",
      ].join(';')}"></canvas>
      <div id="${LAYER_TIME_ID}" style="${[
        "position: fixed",
        "width: 100px",
        `height: ${CANVAS_HEIGHT}px`,
        `top: calc(50vh - ${CANVAS_HEIGHT / 2}px)`,
        `left: calc(50vw + ${CANVAS_WIDTH / 2}px - 50px)`,
        "background: #222",
        "color: white",
        "overflow-x: hidden",
        "overflow-y: auto",
      ].join(';')}">
      </div>
    </div>`;
    document.getElementById(LAYER_ID).addEventListener('click', hideLayer);
    document.getElementById(LAYER_CANVAS_ID).addEventListener('click', function (ev) {
      ev.stopPropagation();
    });
    document.getElementById(LAYER_CANVAS_ID).addEventListener('contextmenu', async function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      if (videoFrames[frameIndex].bitmap) {
        window.open(await bitmap2BlobURL(videoFrames[frameIndex].bitmap), '_blank').focus();
      }
    });
    document.getElementById(LAYER_TIME_ID).addEventListener('click', function (ev) {
      ev.stopPropagation();
      for (const elem of document.getElementById(LAYER_TIME_ID).children) {
        elem.style.background = "#222";
      }
      ev.target.style.background = "#555";
      const id = +ev.target.dataset.index;
      frameIndex = id;
      currentTime = videoFrames[id].time;
      renderFrame();
    });
  }
  document.getElementById(LAYER_ID).style.display = 'block';
}

function renderFrame() {
  const bitmap = videoFrames[frameIndex].bitmap;
  const ratio = Math.max(bitmap.width / CANVAS_WIDTH, bitmap.height / CANVAS_HEIGHT, 1);
  const width = bitmap.width / ratio;
  const height = bitmap.height / ratio;
  const x = (CANVAS_WIDTH - width) / 2;
  const y = (CANVAS_HEIGHT - height) / 2;

  const canvas = document.getElementById(LAYER_CANVAS_ID);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, x, y, width, height);
}

function timeStr(num) {
  let s = num | 0;
  const ms = num - s;
  let m = Math.floor(s / 60);
  s = s - m * 60;
  let h = Math.floor(m / 60);
  m = m - h * 60;
  return `${h ? `${h}:` : ''}${m}:${s.toString().padStart(2, '0')}${ms ? ms.toFixed(3).toString().substring(1) : ''}`;
}

function renderTimeline() {
  if (isInIframe) {
    window.parent.postMessage({
      event: 'renderTimeline',
      data: {
        videoFrames: videoFrames.map(x => ({
          time: x.time,
          bitmap: bitmap2DataURL(x.bitmap),
        })),
        frameIndex,
      }
    }, '*');
    return;
  }
  const timeline = document.getElementById(LAYER_TIME_ID);
  timeline.innerHTML = videoFrames.map((x, i) => `<div data-index="${i}" style="${[
    "font-size: 14px",
    "padding: 5px 10px",
    "cursor: pointer",
  ].join(';')}">${timeStr(x.time)}</div>`).join('');

  renderFrame();
}

window.addEventListener('keydown', function (ev) {
  if (ev.ctrlKey && ev.altKey && ev.key === 'e') {
    let video = findVideo();
    if (video)
      capture(video);
    else
      console.error('video not found');
  }
});

function capture(video) {
  console.log('capture', video);
  if (processWithPause)
    video.pause();

  videoElem = video;
  currentTime = video.currentTime;
  videoFrames = [];
  createLayer();

  if (window.MediaStreamTrackProcessor) {
    try {
      // webcodec
      const track = videoElem.captureStream().getVideoTracks()[0];
      const processor = new MediaStreamTrackProcessor(track);
      const reader = processor.readable.getReader();
  
      async function readChunk() {
        const { done, value } = await reader.read();
        if (value) {
          const bitmap = await createImageBitmap(value);
          videoFrames.push({
            time: currentTime + value.timestamp / 1000000,
            bitmap,
          });
          value.close();
        }
        if (done || videoFrames.length >= MAX_FRAME_COUNT) {
          if (processWithPause)
            videoElem.pause();
          renderTimeline();
          return;
        }
        readChunk();
      }
  
      readChunk();
      if (processWithPause)
        videoElem.play();
    } catch (e) {
      async function readFrame(_timestamp, frame) {
        const bitmap = await createImageBitmap(videoElem);
        videoFrames.push({
          time: frame.mediaTime,
          bitmap,
        });
        if (videoFrames.length >= MAX_FRAME_COUNT) {
          if (processWithPause)
            videoElem.pause();
          renderTimeline();
          return;
        }
        videoElem.requestVideoFrameCallback(readFrame);
      }
      videoElem.requestVideoFrameCallback(readFrame);
      if (processWithPause)
        videoElem.play();
    }
  } else if (HTMLVideoElement.prototype.seekToNextFrame) {
    // firefox only
    async function seekFrames() {
      if (videoElem.ended || videoFrames.length >= MAX_FRAME_COUNT) {
        renderTimeline();
        return;
      }

      const bitmap = await createImageBitmap(videoElem);
      videoFrames.push({
        time: video.currentTime,
        bitmap,
      });

      videoElem.addEventListener('seeked', function () {
        seekFrames();
      }, {
        once: true
      });
      videoElem.seekToNextFrame();
    }

    seekFrames();
  }
}

function bitmap2BlobURL(bitmap) {
  if (bitmap.tagName && bitmap.tagName === 'IMG') {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
  }
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('bitmaprenderer');
    ctx.transferFromImageBitmap(bitmap);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}

function bitmap2DataURL(bitmap) {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('bitmaprenderer');
  ctx.transferFromImageBitmap(bitmap);
  return canvas.toDataURL();
}

function dataURL2Image(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
}

window.addEventListener('message', function(e) {
  if (isInIframe) {
    window.parent.postMessage(e.data, '*');
  }
  if (!e.data.event)
    return;
  switch (e.data.event) {
    case 'hideLayer':
      hideLayer();
      break;
    case 'createLayer':
      createLayer();
      break;
    case 'renderTimeline':
      Promise.all(e.data.data.videoFrames.map(x => new Promise(resolve => {
        dataURL2Image(x.bitmap).then(img => {
          resolve({
            time: x.time,
            bitmap: img,
          });
        });
      }))).then(x => {
        videoFrames = x.sort((a, b) => a.time < b.time);
        frameIndex = e.data.data.frameIndex;
        renderTimeline();
      });
      break;
  }
});

let bilibiliHack = location.host.includes('.bilibili.');
let kanjuba6Hack = ['kanjuba6.com', '.gqyy8.com', '.quelingfei.com'].some(x => location.host.includes(x));

if (bilibiliHack) {
  /* hack closed ShadowDOM */
  Element.prototype._attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    init['mode'] = 'open';
    return Element.prototype._attachShadow.call(this, init);
  }
  
  /* force not to use WASM player */
  Object.defineProperty(window, '__ENABLE_WASM_PLAYER__', {
    get() {
      return false;
    },
    set(_) {},
  });
  sessionStorage.setItem('bwphevc_disable', '1');
}
if (kanjuba6Hack) {
  processWithPause = false;
  function traverse(node) {
    if (node.tagName === 'VIDEO') {
      node.crossOrigin = 'anonymous';
      if (node.src)
        node.src = node.src;
      console.log('hack', node);
    } else {
      node.childNodes.forEach(x => {
        traverse(x);
      });
    }
  }
  function callback(mutationsList, _observer) {
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          traverse(node)
        });
      }
    });
  }
  const observer = new MutationObserver(callback);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
