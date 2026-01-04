// ==UserScript==
// @name         PixelCat
// @namespace    https://github.com/pixelcattt/core
// @version      0.0.1
// @description  Making the pixels speak
// @author       Timothy Lau
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/watch?v=*
// @license      MIT
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491585/PixelCat.user.js
// @updateURL https://update.greasyfork.org/scripts/491585/PixelCat.meta.js
// ==/UserScript==

// canvas width & height
const width = 640;
const height = 360;

// ==! DO NOT CHANGE !==
const sigma = 10;
const rho = 28;
const beta = 8 / 3;
// ==! DO NOT CHANGE !==

/**
 * Equivalent to the key
 * !! You should ensure that the variable of x,y,z is in the range of 0-1.
 */
let x = 0.1;
let y = 0;
let z = 0;

const chaoticSequence = [];

// Generate chaoticSequence
const simulateLorenzAttractor = () => {
  const dt = 0.01;
  const dx = sigma * (y - x) * dt;
  const dy = (x * (rho - z) - y) * dt;
  const dz = (x * y - beta * z) * dt;

  x = x + dx;
  y = y + dy;
  z = z + dz;

  chaoticSequence.push(Math.abs(x));
};

for (let i = 0; i < width * height * 4; i++) {
  simulateLorenzAttractor();
}

function decrypt(imageData, seq) {
  let index = imageData.data.length / 4;
  let pixel_count = imageData.data.length;
  for (let i = imageData.data.length; i > 0; i -= 4) {
    const newIndex = Math.floor((Math.floor(seq[index] * pixel_count) % pixel_count) / 4) * 4;

    [imageData.data[i], imageData.data[newIndex]] = [imageData.data[newIndex], imageData.data[i]];
    [imageData.data[i + 1], imageData.data[newIndex + 1]] = [imageData.data[newIndex + 1], imageData.data[i + 1]];
    [imageData.data[i + 2], imageData.data[newIndex + 2]] = [imageData.data[newIndex + 2], imageData.data[i + 2]];

    index--;
  }
}

function injectBilibili() {
  var observer = new MutationObserver(mutations => {
    const video = document.querySelector('video');
    const canvas = document.querySelector('#canvas');
    if (video != null && canvas == null) {
      let _c = document.createElement('canvas');
      _c.id = 'canvas';
      _c.style = 'display: block;z-index: 0;position: absolute;right: 0px;bottom: 0px; width: 100%; height: 100%';
      video.parentElement.appendChild(_c);
      video.style = 'display: none';
      video.addEventListener('play', () => {
        const _ctx = _c.getContext('2d');
        _c.width = width;
        _c.height = height;
        const loop = function () {
          if (!video.paused && !video.ended) {
            _ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, _c.width, _c.height);
            const imageData = _ctx.getImageData(0, 0, _c.width, _c.height);
            decrypt(imageData, chaoticSequence);
            _ctx.putImageData(imageData, 0, 0);
            requestAnimationFrame(loop);
          }
        };
        loop();
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function injectYoutube() {
  // Todo
}

(function () {
  'use strict';
  var strategy = {
    0: injectBilibili,
    1: injectYoutube
  }[
    GM_info.script.matches
      .map(rule => rule.replace(/\.|\*|\/|\?/g, match => ({ '.': '\\.', '*': '.*', '/': '\\/', '?': '\\?' }[match])))
      .map(rule => new RegExp(rule))
      .map((regExp, index) => (regExp.test(window.location.href) ? index : null))
      .filter(index => index != null)
      .join()
  ];
  strategy();
})();
